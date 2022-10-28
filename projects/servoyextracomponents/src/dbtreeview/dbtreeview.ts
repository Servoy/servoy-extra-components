import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { LoggerService, LoggerFactory, ServoyBaseComponent, BaseCustomObject, ViewPortRow, FoundsetChangeEvent, IFoundset, ServoyPublicService, SessionStorageService } from '@servoy/public';
import { IActionMapping, ITreeOptions, TreeComponent, TreeNode } from '@circlon/angular-tree-component';
import { ITreeNode } from '@circlon/angular-tree-component/lib/defs/api';
import { isEqual } from 'lodash-es';

interface FoundsetListener {
    listener: () => void;
    foundsetId: number;
}

type Selection = number | string;

@Component({
    selector: 'servoyextra-dbtreeview',
    templateUrl: './dbtreeview.html',
    styleUrls: ['./dbtreeview.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ServoyExtraDbtreeview extends ServoyBaseComponent<HTMLDivElement> implements OnDestroy {

    @ViewChild('element', { static: true }) elementRef: ElementRef;
    @ViewChild('tree', { static: true }) tree: TreeComponent;

    @Input() foundsets: Array<FoundsetInfo>;
    @Input() relatedFoundsets: Array<FoundsetInfo>;
    @Input() autoRefresh: boolean;
    @Input() bindings: Array<Binding>;
    @Input() enabled: boolean;
    @Input() levelVisibility: LevelVisibilityType;
    @Input() responsiveHeight: number;
    @Input() selection: Array<Selection>;
    @Input() visible: boolean;
    @Input() showLoadingIndicator: boolean;
    @Input() onReady: (e: Event, data?: any) => void;

    @Input() isInitialized: boolean;
    @Output() isInitializedChange = new EventEmitter();

    log: LoggerService;
    folderImgPath = '../../assets/images/folder.png';
    fileImgPath = '../../assets/images/file.png';
    useCheckboxes = false;
    expandedNodes: any = [];
    displayNodes: Array<ChildNode> = [];
    removeListenerFunctionArray: Array<FoundsetListener> = [];
    dbtreeviewNodesCounter = 0;

    actionMapping: IActionMapping = {
        mouse: {
            click: (_tree, node) => {
                this.tree.treeModel.setActiveNode(node, true);
                if (node.data && node.data.callbackinfo) {
                    const doubleClick = node.data.callbackinfo;
                    this.servoyPublicService.executeInlineScript(doubleClick.formname, doubleClick.script, [node.data.callbackinfoParamValue]);
                }
            },
            dblClick: (_tree, node) => {
                if (node.data && node.data.methodToCallOnDoubleClick) {
                    const doubleClick = node.data.methodToCallOnDoubleClick;
                    this.servoyPublicService.executeInlineScript(doubleClick.formname, doubleClick.script, [node.data.methodToCallOnDoubleClickParamValue]);
                }
            },
            contextMenu: (_tree, node) => {
                if (node.data && node.data.methodToCallOnRightClick) {
                    const doubleClick = node.data.methodToCallOnRightClick;
                    this.servoyPublicService.executeInlineScript(doubleClick.formname, doubleClick.script, [node.data.methodToCallOnRightClickParamValue]);
                }
            }
        }
    };

    options: ITreeOptions = {
        getChildren: this.getChildren.bind(this),
        actionMapping: this.actionMapping
    };

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, logFactory: LoggerFactory,
        private servoyPublicService: ServoyPublicService,
        private sessionStorage: SessionStorageService) {
        super(renderer, cdRef);
        this.log = logFactory.getLogger('ServoyExtraDbtreeview');
    }

    @HostListener('window:beforeunload', ['$event'])
    onBeforeUnloadHander() {
        this.clearSessionStorage();
        this.storeNodesState(this.displayNodes);
        this.sessionStorage.set('dbtreeviewNodesCounter', this.dbtreeviewNodesCounter);
    }

    svyOnInit() {
        super.svyOnInit();
        if (this.selection) this.expandedNodes = this.selection.slice(0, this.selection.length);

        this.loadTreeFromSessionStorage();

        if (!this.displayNodes || this.displayNodes.length === 0) {
            this.initTree();
        }

        if (this.foundsets) {
            this.foundsets.forEach(foundsetInfo => {
                this.addFoundsetListener(foundsetInfo.foundset);
            });
        }
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case 'responsiveHeight':
                        if (this.elementRef && this.servoyApi.isInAbsoluteLayout() && change.currentValue) {
                            this.renderer.setStyle(this.elementRef, 'height', change.currentValue + 'px');
                        }
                        break;
                    case 'foundsets': {
                        if (change.currentValue && !change.firstChange) {
                            this.initTree();
                            this.addOrRemoveFoundsetListeners(change);
                        }
                        break;
                    }
                    case 'relatedFoundsets': {
                        this.addOrRemoveFoundsetListeners(change);
                        break;
                    }
                    case 'selection': {
                        this.selectNode(change.currentValue);
                        break;
                    }
                    case 'levelVisibility': {
                        if (change.currentValue && this.tree && this.tree.treeModel && this.tree.treeModel.virtualRoot) {
                            this.expandChildNodes(this.tree.treeModel.virtualRoot, change.currentValue.level, change.currentValue.value);
                        }
                        break;
                    }
                    case 'enabled': {
                        if (change.previousValue !== change.currentValue && this.elementRef) {
                            if (change.currentValue) {
                                this.renderer.removeClass(this.elementRef.nativeElement, 'dbtreeview-disabled');
                            } else {
                                this.renderer.addClass(this.elementRef.nativeElement, 'dbtreeview-disabled');
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    ngOnDestroy() {
        if (this.removeListenerFunctionArray != null) {
            this.removeListenerFunctionArray.forEach(removeListenerFunction => {
                removeListenerFunction.listener();
            });
            this.removeListenerFunctionArray = null;
        }
        this.clearSessionStorage();
        super.ngOnDestroy();
    }

    async getChildren(node: TreeNode): Promise<ChildNode[]> {
        const children: Array<ChildNode> = [];
        for (let index = 0; index < this.relatedFoundsets.length; index++) {
            if (this.relatedFoundsets[index].foundsetInfoParentID === node.data.foundsetInfoID
                && this.relatedFoundsets[index].indexOfTheParentRecord === node.data.indexOfTheParentRecord) {

                // load the next round of related foundsets
                await this.servoyApi.callServerSideApi('loadRelatedFoundset', [index]);

                const rows = this.relatedFoundsets[index].foundset.viewPort.rows;
                for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    children.push(this.buildChild(rows[rowIndex], this.relatedFoundsets[index], rowIndex, node.data.level + 1, node));
                }
                break;
            }
        }
        return children;
    }

    onLoadNodeChildren(event: any) {
        event.node.children.forEach((child: ITreeNode) => {
            if (child.data.active) {
                child.setIsActive(true);
            }
            if (event.node.data.checked) {
                child.data.checked = true;
            }
            if (this.expandedNodes && !child.isExpanded && this.expandedNodes[child.level-1] && child.level < this.expandedNodes.length && this.getPKFromNodeID(child.id.toString()) === this.expandedNodes[child.level-1].toString()) {
                // expand node if is within the expandedNodes path. It allows to expand nodes async on multiple levels
                child.expand();
            }
        });
    }

    onNodeExpanded(event: any) {
        event.node.data['expanded'] = event.isExpanded;
    }

    onTreeLoad(event: any) {
        this.isInitialized = true;
        this.isInitializedChange.emit(this.isInitialized);
        this.expandNodes(this.displayNodes);
        if (this.onReady) {
            this.onReady(event);
        }
    }

    onUpdateTree(event: any) {
        this.checkNodes(event.treeModel.nodes);
    }

    checkNodes(nodes: any[]) {
        nodes.forEach(node => {
            if (node.parent && node.parent.data.checked) {
                node.checked = true;
            }
            if (node.hasChildren && node.children) this.checkNodes(node.children);
        });
    }

    expandNodes(nodes: ChildNode[]) {
        nodes.forEach(node => {
            if (node.expanded) {
                this.tree.treeModel.getNodeById(node.id).setIsExpanded(true);
            }
            if (node.hasChildren && node.children) this.expandNodes(node.children);
        });
    }

    async check(node: TreeNode, checked: boolean) {
        this.updateChildNodeCheckbox(node, checked);
        this.updateParentNodeCheckbox(node.realParent);

        if (node.data.checkboxvaluedataprovider) {
            let v: any = checked;
            if ('number' === node.data.checkboxvaluedataprovidertype) {
                v = v ? 1 : 0;
            } else if ('string' === node.data.checkboxvaluedataprovidertype) {
                v = v ? 'true' : 'false';
            }
            await this.servoyApi.callServerSideApi('updateFoundsetRow',
                [node.isRoot, node.data.id.substring(0, node.data.id.lastIndexOf('_')), node.data.index + 1, node.data.checkboxvaluedataprovider, v]);
        }

        if (node.data && node.data.methodToCallOnCheckBoxChange) {
            const checkboxChange = node.data.methodToCallOnCheckBoxChange;
            this.servoyPublicService.executeInlineScript(checkboxChange.formname, checkboxChange.script, [node.data.methodToCallOnCheckBoxChangeParamValue]);
        }
    }

    updateChildNodeCheckbox(node: TreeNode, checked: boolean) {
        node.data.checked = checked;
        if (node.children) {
            node.children.forEach((child) => this.updateChildNodeCheckbox(child, checked));
        }
    }

    updateParentNodeCheckbox(node: TreeNode) {
        if (!node) {
            return;
        }
        let allChildrenChecked = true;
        let noChildChecked = true;

        for (const child of node.children) {
            if (!child.data.checked || child.data.indeterminate) {
                allChildrenChecked = false;
            }
            if (child.data.checked) {
                noChildChecked = false;
            }
        }

        if (allChildrenChecked) {
            node.data.checked = true;
            node.data.indeterminate = false;
        } else if (noChildChecked) {
            node.data.checked = false;
            node.data.indeterminate = false;
        } else {
            node.data.checked = true;
            node.data.indeterminate = true;
        }
        this.updateParentNodeCheckbox(node.parent);
    }

    hasChildren(foundsetInfo: FoundsetInfo, index: number) {
        let hasChildren = false;
        for (const fsInfo of this.relatedFoundsets) {
            hasChildren = (foundsetInfo.foundsetInfoID === fsInfo.foundsetInfoParentID && index === fsInfo.indexOfTheParentRecord);
            if (hasChildren) break;
        }
        return hasChildren;
    }

    public refresh(): void {
        this.initTree();
    }

    public isNodeExpanded(pk: Array<number>): boolean {
        if (this.tree) {
            const node = this.findNode(this.tree.treeModel.virtualRoot, pk, 0);
            if (node) {
                return node.isExpanded;
            }
        }
        return false;
    }

    public setExpandNode(pk: Array<any>, state: boolean): void {
        if (this.tree) {
            if (pk && pk.length) {
                if (state) {
                    this.expandedNodes = pk.slice(0, pk.length);
                } else if (this.expandedNodes && pk && this.expandedNodes.length && this.expandedNodes.length === pk.length) {
                    // clear expandedNodes if state is false and pks === expandedNodes
                    if (this.expandedNodes.every( (val, idx) => val === pk[idx] )) {
                        this.expandedNodes = [];
                    }
                }
                const node = this.tree ? this.findNode(this.tree.treeModel.virtualRoot, pk, 0) : null;
                if (node) {
                    if (state) {
                       node.ensureVisible();
                    } else {
                        if (node.parent) {
                            node.parent.collapse();
                        }
                        this.tree.treeModel.setExpandedNode(node, state);
                    }
                } else if (state) {
                    // if i can't find the exact node for pk path. Find the closest ancestor and expand it
                    // subsequent child nodes will be expanded upon onLoadNodeChildren
                    const ancestor = this.findClosestAncestor(this.tree.treeModel.virtualRoot, pk, 0);
                    if (ancestor) {
                        ancestor.expand();
                    }
                }
            }
        }
    }

    public getSelectionPath(): Array<Selection> {
        return this.selection;
    }

    public updateCheckBoxValuesForTree(datasourceID: number, pks: Array<string>, state: boolean) {
        const updatedNodesPks = [];
        if (this.tree) {
            for (const node of this.tree.treeModel.nodes) {
                updatedNodesPks.push(...this.updateCheckBoxValues(node, datasourceID, pks, state));
            }
        }

        // if node state was not update, it means it was not yet created, push the check state to the binding
        for (let index = 0; index < pks.length; index++) {
            if (updatedNodesPks.indexOf(pks[index]) === -1) {
                if (state) {
                    if (!this.getBinding(datasourceID).initialCheckboxValues) {
                        this.getBinding(datasourceID).initialCheckboxValues = [];
                    }
                    if (this.getBinding(datasourceID).initialCheckboxValues.indexOf(pks[index]) === -1) {
                        this.getBinding(datasourceID).initialCheckboxValues.push(pks[index]);
                    }
                } else if (this.getBinding(datasourceID).initialCheckboxValues) {
                    const newIndex = this.getBinding(datasourceID).initialCheckboxValues.indexOf(pks[index]);
                    if (newIndex !== -1) {
                        this.getBinding(datasourceID).initialCheckboxValues.splice(index, 1);
                    }
                }
            }
        }
        this.tree.treeModel.update();
    }

    public getCheckBoxValuesFromTree(datasourceID: number) {
        const checkBoxValues = [];
        if (this.tree) {
            for (const node of this.tree.treeModel.nodes) {
                checkBoxValues.push(...this.getCheckBoxValues(node, datasourceID));
            }
        }
        return checkBoxValues;
    }

    findNode(node: TreeNode, pkarray: Array<any>, level: number) {
        if (pkarray && pkarray.length > 0) {
            const nodeChildren = node.children;
            if (nodeChildren) {
                for (const child of nodeChildren) {
                    if (this.getPKFromNodeID(child.id) === pkarray[level].toString()) {
                        if (level + 1 < pkarray.length) {
                            return this.findNode(child, pkarray, level + 1);
                        } else {
                            return child;
                        }
                    }
                }
            }
        }
        return null;
    }

    findClosestAncestor(node: TreeNode, pkarray: Array<any>, level: number) {
        if (pkarray && pkarray.length > 0) {
            const nodeChildren = node.children;
            if (nodeChildren) {
                for (const child of nodeChildren) {
                    if (this.getPKFromNodeID(child.id) === pkarray[level].toString()) {
                        if (level + 1 < pkarray.length) {
                            const leaf = this.findClosestAncestor(child, pkarray, level + 1);
                            if (leaf) {
                                return leaf;
                            } else {
                                return child;
                            }
                        } else {
                            return child;
                        }
                    }
                }
            }
        }
        return null;
    }

    expandChildNodes(node: TreeNode, level: number, state: boolean) {
        if (level >= 1) {
            const nodeChildren = node.children;
            nodeChildren.forEach(child => {
                if (state) {
                    child.setIsHidden(false);
                    child.setIsExpanded(state);
                } else if (level === 1) {
                    child.setIsExpanded(state);
                }
            });
        }
    }

    isNodeSelected(node: ChildNode, selection: Array<Selection>) {
        if (selection && selection.length) {
            const nodePKPath = [];
            nodePKPath.unshift(this.getPKFromNodeID(node.id));

            let parentNode = node.parent;
            while (parentNode) {
                if (parentNode !== this.tree.treeModel.virtualRoot) {
                    nodePKPath.unshift(this.getPKFromNodeID(parentNode.data.id));
                    parentNode = parentNode.parent;
                } else {
                    break;
                }
            }
            if (nodePKPath.length === selection.length) {
                for (let i = 0; i < nodePKPath.length; i++) {
                    if (nodePKPath[i] !== selection[i].toString()) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    selectNode(selection: Array<Selection>) {
        if (selection && selection.length) {
            this.expandedNodes = selection.slice(0, selection.length);
            const node = this.findNode(this.tree.treeModel.virtualRoot, selection, 0);
            if (node && !node.isActive) {
                node.setActiveAndVisible(true);
            } else {
                this.refresh();
            }
        }
    }

    getPKFromNodeID(nodeID: string): string {
        return nodeID.substring(nodeID.indexOf('_') + 1);
    }


    getIconURL(iconPath: string) {
        if (iconPath && iconPath.indexOf('media://') === 0) {
            return this.servoyPublicService.generateMediaDownloadUrl(iconPath);
        }
        return iconPath;
    }


    private buildChild(row: ViewPortRow, foundsetInfo: FoundsetInfo, index: number, level: number, parent: TreeNode): ChildNode {
        const child: ChildNode = {
            id: foundsetInfo.foundsetInfoID + '_' + row[foundsetInfo.foundsetpk], index,
            hasChildren: this.hasChildren(foundsetInfo, index), datasourceID: foundsetInfo.datasourceID
        };

        // save info about parent
        if (child.hasChildren) {
            child.indexOfTheParentRecord = index;
            child.foundsetInfoID = foundsetInfo.foundsetInfoID;
        }

        child.parent = parent;
        child.level = level;

        if (parent) {
            child.parentID = parent.id;
        }

        const binding = this.getBinding(foundsetInfo.datasourceID);

        if (binding.textdataprovider) {
            child.name = row[binding.textdataprovider];
        }

        if (binding.imageurldataprovider) {
            child.image = this.getIconURL(row[binding.imageurldataprovider]);
        } else if (child.hasChildren) {
            child.image = this.folderImgPath;
        } else {
            child.image = this.fileImgPath;
        }

        if (binding.tooltiptextdataprovider) {
            child.tooltip = row[binding.tooltiptextdataprovider];
        }

        if (binding.checkboxvaluedataprovider) {
            child.checkbox = Boolean(row[binding.hascheckboxdataprovider]);
        } else if (binding.hasCheckboxValue) {
            child.checkbox = binding.hasCheckboxValue.indexOf('' + row[foundsetInfo.foundsetpk]) !== -1;
        } else {
            child.checkbox = Boolean(binding.initialCheckboxValues);
        }

        if (child.checkbox) {
            if (parent && parent.data.checked) {
                child.checked = true;
            }
            if (binding.checkboxvaluedataprovider) {
                child.checked = Boolean(row[binding.checkboxvaluedataprovider]);
            } else if (binding.initialCheckboxValues) {
                child.checked = binding.initialCheckboxValues.indexOf('' + row[foundsetInfo.foundsetpk]) !== -1;
            }
        }

        const isLevelVisible = this.levelVisibility && this.levelVisibility.value && (this.levelVisibility.level === level);
        const isNodeExpanded = (level <= this.expandedNodes.length) && (this.expandedNodes[level - 1].toString() === this.getPKFromNodeID(child.id));

        if (isLevelVisible || isNodeExpanded) {
            child.expanded = true;
        }

        child.active = this.isNodeSelected(child, this.selection);

        if (binding.nRelationInfos && binding.nRelationInfos.length > 0) {
            child.image = this.folderImgPath;
            child.children = new Array();
            for (const info of binding.nRelationInfos) {
                const relationItem: ChildNode = {
                    name: info.label,
                    checkbox: true,
                    hasChildren: true,
                    image: this.folderImgPath,
                    id: row.node_id
                };

                child.children.push(relationItem);
            }

        }

        if (binding.checkboxvaluedataprovider) {
            child.checkboxvaluedataprovider = binding.checkboxvaluedataprovider;
            child.checkboxvaluedataprovidertype = typeof row[binding.checkboxvaluedataprovider];
        }

        if (binding.callbackinfo || binding.methodToCallOnCheckBoxChange || binding.methodToCallOnDoubleClick || binding.methodToCallOnRightClick) {
            if (binding.callbackinfo) {
                child.callbackinfo = binding.callbackinfo.f;
                child.callbackinfoParamValue = row[binding.callbackinfo.param];
            }
            if (binding.methodToCallOnCheckBoxChange) {
                child.methodToCallOnCheckBoxChange = binding.methodToCallOnCheckBoxChange.f;
                child.methodToCallOnCheckBoxChangeParamValue = row[binding.methodToCallOnCheckBoxChange.param];
            }
            if (binding.methodToCallOnDoubleClick) {
                child.methodToCallOnDoubleClick = binding.methodToCallOnDoubleClick.f;
                child.methodToCallOnDoubleClickParamValue = row[binding.methodToCallOnDoubleClick.param];
            }
            if (binding.methodToCallOnRightClick) {
                child.methodToCallOnRightClick = binding.methodToCallOnRightClick.f;
                child.methodToCallOnRightClickParamValue = row[binding.methodToCallOnRightClick.param];
            }
        }

        return child;
    }

    private updateCheckBoxValues(node: ChildNode, datasourceID: number, pks: Array<string>, state: boolean) {
        const updatedNodesPks = [];
        if (node.datasourceID === datasourceID) {
            const pk = this.getPKFromNodeID(node.id);
            for (const p of pks) {
                if (pk === p) {
                    node.checked = state;
                    updatedNodesPks.push(p);
                }
            }
        }
        if (node.children) {
            for (const child of node.children) {
                this.updateCheckBoxValues(child, datasourceID, pks, state);
            }
        }
        return updatedNodesPks;
    }

    private getCheckBoxValues(node: any, datasourceID: number) {
        const checkBoxValues = [];
        if (node.checked && node.datasourceID === datasourceID) {
            checkBoxValues.push(...this.getPKFromNodeID(node.id));
        }
        if (node.children) {
            for (const child of node.children) {
                checkBoxValues.push(...this.getCheckBoxValues(child, datasourceID));
            }
        }
        return checkBoxValues;
    }

    private getBinding(datasourceId: number): Binding {
        for (const binding of this.bindings) {
            if (datasourceId === parseInt(binding.datasource, 10)) {
                return binding;
            }
        }
        return null;
    }

    private initTree(): void {
        this.displayNodes = [];
        if (this.servoyApi.isInDesigner()) {
            this.displayNodes.push({ name: 'node1', image: this.fileImgPath },
                { name: 'node2', image: this.fileImgPath },
                { name: 'node3', image: this.fileImgPath });
            return;
        }

        const children = [];
        if (this.foundsets) {
            this.foundsets.forEach(async (elem) => {
                if (elem.foundset.serverSize > elem.foundset.viewPort.size) {
                    // load all records
                    await elem.foundset.loadRecordsAsync(0, 5000);
                }
                elem.foundset.viewPort.rows.forEach((row, index) => {
                    const child = this.buildChild(row, elem, index, 1, null);
                    children.push(child);
                });
            }, this);
            this.displayNodes = children;
            this.cdRef.detectChanges();
        }
    }

    private addOrRemoveFoundsetListeners(change: { currentValue: Array<FoundsetInfo>; previousValue: Array<FoundsetInfo> }) {
        if (change.currentValue) {
            change.currentValue.forEach(fsInfoCV => {
                if (change.previousValue && change.previousValue.length > 0) {
                    if (!change.previousValue.find(fsInfoPV => fsInfoCV.foundset.foundsetId === fsInfoPV.foundset.foundsetId)) {
                        this.addFoundsetListener(fsInfoCV.foundset);
                    }
                } else {
                    this.addFoundsetListener(fsInfoCV.foundset);
                }
            });
        }

        if (change.previousValue) {
            change.previousValue.forEach(fsInfoPV => {
                if (change.currentValue && change.currentValue.length > 0) {
                    if (!change.currentValue.find(fsInfoCV => fsInfoPV.foundset.foundsetId === fsInfoCV.foundset.foundsetId)) {
                        this.removeFoundsetListener(fsInfoPV.foundset);
                    }
                } else {
                    this.removeFoundsetListener(fsInfoPV.foundset);
                }
            });
        }
    }

    private addFoundsetListener(foundset: IFoundset) {
        if (this.autoRefresh) {
            if (!this.removeListenerFunctionArray.find(listener => listener.foundsetId === foundset.foundsetId)) {
                this.removeListenerFunctionArray.push({
                    listener: foundset.addChangeListener((event: FoundsetChangeEvent): void => {
                        if (event.viewportRowsCompletelyChanged) {
                            this.reinitilizeTree(event.viewportRowsCompletelyChanged);
                        }
                        if (event.fullValueChanged) {
                            this.reinitilizeTree(event.fullValueChanged);
                        }
                        if (event.serverFoundsetSizeChanged) {
                            this.reinitilizeTree(event.serverFoundsetSizeChanged);
                        }
                        if (event.viewPortSizeChanged) {
                            this.reinitilizeTree(event.viewPortSizeChanged);
                        }
                        if (event.viewportRowsUpdated) {
                            this.initTree();
                        }
                    }), foundsetId: foundset.foundsetId
                });
            }
        }
    }

    private reinitilizeTree(change: any) {
        if (!isEqual(change.oldValue, change.newValue)) {
            this.initTree();
        }
    }

    private removeFoundsetListener(foundset: IFoundset) {
        const fsListener = this.removeListenerFunctionArray.find(el => el.foundsetId === foundset.foundsetId);
        if (fsListener) fsListener.listener();
        this.removeListenerFunctionArray = this.removeListenerFunctionArray.filter(el => !(el.foundsetId === foundset.foundsetId));
    }

    private clearSessionStorage() {
        if (this.sessionStorage.has('dbtreeviewNodesCounter')) {
            const counter: number = this.sessionStorage.get('dbtreeviewNodesCounter');
            if (counter > 0) {
                for (let i = 0; i < counter; i++) {
                    this.sessionStorage.remove('dbtreeview' + i);
                }
            }
            this.sessionStorage.remove('dbtreeviewNodesCounter');
        }
    }

    private loadTreeFromSessionStorage() {
        if (this.sessionStorage.has('dbtreeviewNodesCounter')) {
            const counter: number = this.sessionStorage.get('dbtreeviewNodesCounter');
            if (counter > 0) {
                for (let i = 0; i < counter; i++) {
                    const node: ChildNode = JSON.parse(this.sessionStorage.get('dbtreeview' + i));
                    if (node.parentID) {
                        this.setNodeToParent(this.displayNodes, node);
                    } else {
                        this.displayNodes.push(node);
                    }
                }
            }
        }
    }
    private setNodeToParent(treeNodes: ChildNode[], node: ChildNode) {
        for (const treeNode of treeNodes) {
            if (treeNode.id === node.parentID) {
                if (!treeNode.children) {
                    treeNode['children'] = [];
                }
                treeNode.children.push(node);
                break;
            } else if (treeNode.children && treeNode.children.length > 0) {
                this.setNodeToParent(treeNode.children, node);
            }
        }
    }

    private addNodesFromFoundset(newFoundeset: FoundsetInfo): void {
        newFoundeset.foundset.viewPort.rows.forEach((row, index) => {
            this.displayNodes.push(this.buildChild(row, newFoundeset, index, 1, null));
        }, this);
        this.tree.treeModel.update();
        this.cdRef.detectChanges();
    }

    private storeNodesState(nodes: Array<ChildNode>) {
        for (const node of nodes) {
            this.sessionStorage.set('dbtreeview' + this.dbtreeviewNodesCounter, JSON.stringify(this.copyChildNode(node)));
            this.dbtreeviewNodesCounter++;
            if (node.children) {
                this.storeNodesState(node.children);
            }
        }
    }

    private copyChildNode(node: ChildNode) {
        const copy: ChildNode = {} as ChildNode;
        const keys = Object.keys(node);
        for (const key of keys) {
            if (key !== 'children' && key !== 'parent') {
                copy[key] = node[key];
            }
        }
        return copy;
    }
}

export class FoundsetInfo extends BaseCustomObject {
    public datasourceID: number;
    public foundsetInfoID: number;
    public foundsetInfoParentID: number;
    public indexOfTheParentRecord: number;
    public foundset: IFoundset;
    public foundsetpk: string;
}

export class Binding extends BaseCustomObject {
    public datasource: string;
    public textdataprovider: string;
    public nrelationname: string;
    public hascheckboxdataprovider: string;
    public checkboxvaluedataprovider: string;
    public tooltiptextdataprovider: string;
    public imageurldataprovider: string;
    public childsortdataprovider: string;
    public foundsetpk: string;
    public callbackinfo: Callback;
    public methodToCallOnCheckBoxChange: Callback;
    public methodToCallOnDoubleClick: Callback;
    public methodToCallOnRightClick: Callback;
    public nRelationInfos: Array<RelationInfo>;
    public hasCheckboxValue: Array<string>;
    public initialCheckboxValues: Array<string>;
}

export class Callback extends BaseCustomObject {
    public f: () => void;
    public param: string;
}

export class RelationInfo extends BaseCustomObject {
    public label: string;
    public nRelationName: string;
}

export class LevelVisibilityType extends BaseCustomObject {
    public value: boolean;
    public level: number;
}

class ChildNode {
    parent?: TreeNode;
    parentID?: string;
    id?: string;
    name?: string;
    hasChildren?: boolean;
    image?: string;
    checkbox?: boolean;
    checked?: boolean;
    expanded?: boolean;
    active?: boolean;
    children?: Array<ChildNode>;
    tooltip?: string;
    datasourceID?: number;
    index?: number;
    indexOfTheParentRecord?: number;
    foundsetInfoID?: number;
    level?: number;
    checkboxvaluedataprovider?: string;
    checkboxvaluedataprovidertype?: string;
    callbackinfo?: () => void;
    callbackinfoParamValue?: any;
    methodToCallOnCheckBoxChange?: () => void;
    methodToCallOnCheckBoxChangeParamValue?: any;
    methodToCallOnDoubleClick?: () => void;
    methodToCallOnDoubleClickParamValue?: any;
    methodToCallOnRightClick?: () => void;
    methodToCallOnRightClickParamValue?: any;
}



