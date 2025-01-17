import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { LoggerService, LoggerFactory, ServoyBaseComponent, BaseCustomObject, IFoundsetTree, ServoyPublicService, EventLike, JSEvent } from '@servoy/public';
import { IActionMapping, ITreeOptions, TreeComponent, TreeNode } from '@ali-hm/angular-tree-component';



@Component({
    selector: 'servoyextra-dbtreeview',
    templateUrl: './dbtreeview.html',
    styleUrls: ['./dbtreeview.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class ServoyExtraDbtreeview extends ServoyBaseComponent<HTMLDivElement> implements OnDestroy {

    @ViewChild('element', { static: true }) elementRef: ElementRef;
    @ViewChild('tree', { static: true }) tree: TreeComponent;

    @Input() foundsettree: IFoundsetTree;
    @Input() autoRefresh: boolean;
    @Input() allowDrag: any;
    @Input() allowDrop: any;
    @Input() bindings: Array<Binding>;
    @Input() enabled: boolean;
    @Input() levelVisibility: LevelVisibilityType;
    @Input() responsiveHeight: number;
    @Input() selection: Array<string>;
    @Input() visible: boolean;
    @Input() showLoadingIndicator: boolean;
	@Input() styleClass: string;
    @Input() onReady: (e: JSEvent) => void;
    @Input() onDrop: (sourceNodePkPath: Array<string>, targetNodePkPath: Array<string>, indexInParent: number, e: JSEvent) => void;
	
	@Input() actions: Array<Action>;

    @Input() isInitialized: boolean;
    @Output() isInitializedChange = new EventEmitter();

    log: LoggerService;
    folderImgPath = './assets/images/folder.png';
    fileImgPath = './assets/images/file.png';
    expandedNodes: Array<string> = [];
    displayNodes: Array<ChildNode> = [];
    gettingChildren = false;

    actionMapping: IActionMapping = {
        mouse: {
            click: (_tree, node, $event) => {
                this.tree.treeModel.setActiveNode(node, true);
                this.setSelectionFromTree(node);
                if (node.data && node.data.callbackinfo) {
                    const doubleClick = node.data.callbackinfo;
                    doubleClick(node.data.callbackinfoParamValue);
                }
				if (node.data && this.actions) {
					const action = this.getAction(event.target as HTMLElement);
					if (action) {
						const callback = action.callbackfunction;
						callback(node.data.customActions[action.name]);
					}
				}
            },
            dblClick: (_tree, node, $event) => {
                if (node.data && node.data.methodToCallOnDoubleClick) {
                    const doubleClick = node.data.methodToCallOnDoubleClick;
                    doubleClick(node.data.methodToCallOnDoubleClickParamValue);
                }
            },
            contextMenu: (_tree, node, $event) => {
                $event.preventDefault();
                if (node.data && node.data.methodToCallOnRightClick) {
                    const rightClick = node.data.methodToCallOnRightClick;
                    rightClick(node.data.methodToCallOnRightClickParamValue, this.servoyPublicService.createJSEvent($event, 'rightClick'));
                }
            }
        }
    };

    options: ITreeOptions = {
        getChildren: this.getChildren.bind(this),
        actionMapping: this.actionMapping,
		scrollOnActivate: false
    };

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, logFactory: LoggerFactory,
        private servoyPublicService: ServoyPublicService) {
        super(renderer, cdRef);
        this.log = logFactory.getLogger('ServoyExtraDbtreeview');
    }

    svyOnInit() {
        super.svyOnInit();
        this.options.allowDrag = this.allowDrag;
        this.options.allowDrop = this.allowDrop;
        if (!this.displayNodes || this.displayNodes.length === 0) {
            this.initTree();
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
                    case 'foundsettree': {
                        if (change.currentValue && !change.firstChange && !this.gettingChildren) {
                            const newcheckedvalues = this.foundsettree.getAndResetUpdatedCheckboxValues();
                            const newchildren = this.foundsettree.getAndResetNewChildren();
                            if (newcheckedvalues) {
                                for (const nodeid of Object.keys(newcheckedvalues)) {
                                    const node = this.tree.treeModel.getNodeById(nodeid);
                                    if (node) {
                                        node.data.checked = newcheckedvalues[nodeid];
                                    }
                                }
                            } else if (newchildren) {
                                if (this.autoRefresh) {
                                    for (const nodeid of Object.keys(newchildren)) {
                                        const node = this.findDataNode(nodeid, this.displayNodes);
                                        if (node) {
                                            node.children = [];
                                            for (const info of newchildren[nodeid]) {
                                                const temp = this.buildChild(info);
                                                temp.level = node.level + 1;
                                                node.children.push(temp);
                                            }
                                        }
                                    }
                                    this.cdRef.detectChanges();
                                }
                            } else if (change.currentValue !== change.previousValue) {
                                this.initTree();
                            }
                        }
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
					case 'styleClass': {
						if (change.previousValue) {
							const array: Array<string> = (change.previousValue as string).trim().split(' ');
							array.filter((elementStyleClass: string) => elementStyleClass !== '').forEach(
								(elementStyleClass: string) => this.renderer.removeClass(this.getNativeElement(), elementStyleClass)
							);
						}
						if (change.currentValue) {
							const array: Array<string> = (change.currentValue as string).trim().split(' ');
							array.filter((elementStyleClass: string) => elementStyleClass !== '').forEach(
								(elementStyleClass: string) => this.renderer.addClass(this.getNativeElement(), elementStyleClass)
							);
						}
						break;
					}
                }
            }
        }
    }

    async getChildren(node: TreeNode): Promise<Array<ChildNode>> {
        const children: Array<ChildNode> = [];
        this.gettingChildren = true;
        const nodes = await this.foundsettree.getChildren(node.data.id, node.data.level);
        this.gettingChildren = false;
        if (nodes) {
            for (const treenode of nodes as Array<ChildNode>) {
                children.push(this.buildChild(treenode));
            }
        }
        return children;
    }

    onLoadNodeChildren(event: any) {
        event.node.children.forEach((child: TreeNode) => {
            if (child.data.active) {
                child.setIsActive(true);
            }
            if (this.selection) {
                const index = this.selection.indexOf(child.data.id);
                if (index >= 0) {
                    if (index === this.selection.length - 1) {
                        child.setIsActive(true);
                    } else {
                        child.expand();
                    }
                }
            }
           // if (event.node.data.checked) {
           //     child.data.checked = true;
           //}
            if (this.levelVisibility && this.levelVisibility.value && this.levelVisibility.level >= child.level) {
                child.expand();
            } else if (this.expandedNodes && !child.isExpanded && this.expandedNodes.indexOf(child.data.id) >= 0) {
                // expand node if is within the expandedNodes path. It allows to expand nodes async on multiple levels
                child.expand();
            }
        });
    }

    onNodeExpanded(event: any) {
        event.node.data.expanded = event.isExpanded;
    }

    nodeDropped(event: any){
       if (this.onDrop){
           this.onDrop(this.getNodePKPath(event.node), this.getNodePKPath(event.to.parent), event.to.index,
                this.servoyPublicService.createJSEvent({ target: this.elementRef.nativeElement } as EventLike, 'onDrop'));
       }
    }

    onTreeLoad(event: any) {
        this.isInitialized = true;
        this.isInitializedChange.emit(this.isInitialized);
        const treenode = this.tree.treeModel.getNodeBy((node) => {
            if (node.data.active) {
                return true;
            }
            return false;
        });
        if (treenode) {
            treenode.ensureVisible();
            treenode.setIsActive(true);
        }
        this.expandNodes(this.displayNodes);
        if (this.onReady) {
            this.onReady(this.servoyPublicService.createJSEvent({ target: this.elementRef.nativeElement } as EventLike, 'onReady'));
        }
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

    check(node: TreeNode, checked: boolean) {
        if (node.data.checkboxautoselectschildren){
            this.updateChildNodeCheckbox(node, checked);
            this.updateParentNodeCheckbox(node.realParent);
        } else{
             node.data.checked = checked;
        }

        this.foundsettree.updateCheckboxValue(node.data.id, checked);

        if (node.data && node.data.methodToCallOnCheckBoxChange) {
            const checkboxChange = node.data.methodToCallOnCheckBoxChange;
            checkboxChange(node.data.methodToCallOnCheckBoxChangeParamValue);
        }
    }
    
    clickRow(event: MouseEvent) {
		if (event && event.target) {
			const row: HTMLElement = (event.target as HTMLElement).querySelector('.node-content-wrapper');
			if (row) {
				row.click();
			}
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

    public refresh(): void {
        this.initTree();
    }

    public isNodeExpandedClientSide(idarray: Array<string>): boolean {
        if (this.tree && idarray && idarray.length) {
            const node = this.tree.treeModel.getNodeById(idarray[idarray.length - 1]);
            if (node) {
                return node.isExpanded ? true : false;
            }
        }
        return false;
    }

    public setExpandNodeClientSide(idarray: Array<any>, state: boolean): void {
        if (this.tree && idarray && idarray.length) {
            if (state) {
                this.expandedNodes = idarray;
            } else if (this.expandedNodes && idarray && this.expandedNodes.length && this.expandedNodes.length === idarray.length) {
                // clear expandedNodes if state is false and pks === expandedNodes
                if (this.expandedNodes.every((val, idx) => val === idarray[idx])) {
                    this.expandedNodes = [];
                }
            }
            for (let index = idarray.length - 1; index >= 0; index--) {
                const node = this.tree.treeModel.getNodeById(idarray[index]);
                if (node) {
                    if (index === idarray.length - 1) {
                        // found the actual node
                        if (state) {
                            node.ensureVisible();
                            node.setIsExpanded(true);
                        } else {
                            if (node.parent) {
                                node.parent.collapse();
                            }
                            this.tree.treeModel.setExpandedNode(node, state);
                        }
                    } else if (state) {
                        node.expand();
                    }
                }
            }
        }
    }

    public setSelectionPathClientSide(idarray: Array<string>) {
        this.selection = idarray;
        if (idarray && idarray.length){
            for (let i = idarray.length - 1; i >= 0; i--) {
                const node = this.tree.treeModel.getNodeById(idarray[i]);
                if (node) {
                    if (i === idarray.length - 1) {
                        node.setIsActive(true);
                    } else {
                        node.ensureVisible();
                        node.expand();
                        break;
                    }
                }
            }
        } else{
            const node = this.tree.treeModel.getActiveNode();
            if (node) {
                node.setIsActive(false);
                node.blur();
            }
        }
    }

    expandChildNodes(node: TreeNode, level: number, state: boolean) {
        if (level >= 1) {
            const nodeChildren = node.children;
            nodeChildren.forEach(child => {
                if (state) {
                    child.setIsHidden(false);
                    child.setIsExpanded(state);
                    if (child.level + 1 <= level && child.children && child.children.length > 0) {
                        this.expandChildNodes(child, level, state);
                    }
                } else if (level === 1) {
                    child.setIsExpanded(state);
                }
            });
        }
    }

    getIconURL(iconPath: string) {
        if (iconPath && iconPath.indexOf('media://') === 0) {
            return this.servoyPublicService.generateMediaDownloadUrl(iconPath);
        }
        return iconPath;
    }


    private buildChild(dataNode: ChildNode): ChildNode {
        const child: ChildNode = {
            id: dataNode.id,
            hasChildren: dataNode.hasChildren
        };


        child.level = dataNode.level;
        child.name = dataNode.name;
        child.tooltip = dataNode.tooltip || '';
        child.hascheckbox = dataNode.hascheckbox;
        child.checkboxautoselectschildren = dataNode.checkboxautoselectschildren;
        child.checked = dataNode.checked;

        if (dataNode.image) {
            child.image = this.getIconURL(dataNode.image);
        } else if (child.hasChildren) {
            child.image = this.folderImgPath;
        } else {
            child.image = this.fileImgPath;
        }

        const isLevelVisible = this.levelVisibility && this.levelVisibility.value && (this.levelVisibility.level >= dataNode.level);
        const isNodeExpanded = (this.expandedNodes && this.expandedNodes.indexOf(child.id) >= 0);

        if (isLevelVisible || isNodeExpanded) {
            child.expanded = true;
        }

        child.active = dataNode.active;

        if (dataNode.children && dataNode.children.length > 0) {
            child.image = this.folderImgPath;
            child.children = new Array();
            for (const info of dataNode.children) {
                child.children.push(this.buildChild(info));
            }

        }

        const binding = this.getBinding(dataNode.datasource);
        if (binding && (binding.callbackinfo || binding.methodToCallOnCheckBoxChange || binding.methodToCallOnDoubleClick || binding.methodToCallOnRightClick)) {
            if (binding.callbackinfo) {
                child.callbackinfo = binding.callbackinfo.f;
                child.callbackinfoParamValue = dataNode.callbackinfoParamValue;
            }
            if (binding.methodToCallOnCheckBoxChange) {
                child.methodToCallOnCheckBoxChange = binding.methodToCallOnCheckBoxChange.f;
                child.methodToCallOnCheckBoxChangeParamValue = dataNode.methodToCallOnCheckBoxChangeParamValue;
            }
            if (binding.methodToCallOnDoubleClick) {
                child.methodToCallOnDoubleClick = binding.methodToCallOnDoubleClick.f;
                child.methodToCallOnDoubleClickParamValue = dataNode.methodToCallOnDoubleClickParamValue;
            }
            if (binding.methodToCallOnRightClick) {
                child.methodToCallOnRightClick = binding.methodToCallOnRightClick.f;
                child.methodToCallOnRightClickParamValue = dataNode.methodToCallOnRightClickParamValue;
            }
        }
		
		const customActions = Object.keys(dataNode).filter(item=>item.includes('customAction-#-'));
		if (customActions.length) {
			child.customActions = {}
			customActions.forEach((item) => {
				const value = dataNode[item];
				child.customActions[item.split('customAction-#-')[1]] = value;
			});
		}

        return child;
    }

    private getBinding(datasource: string): Binding {
        if (this.bindings) {
            for (const binding of this.bindings) {
                if (datasource === binding.datasource) {
                    return binding;
                }
            }
        }
        return null;
    }
	
	private getAction(action: HTMLElement): Action {
		return this.actions.filter((item) => [...(this.elementRef.nativeElement as HTMLElement).querySelectorAll(item.name)].includes(action))[0];
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
        if (this.foundsettree) {
            this.foundsettree.forEach((elem) => {
                const child = this.buildChild(elem);
                children.push(child);
            }, this);
        }
        this.displayNodes = children;
        this.cdRef.detectChanges();
    }

    private setSelectionFromTree(node: TreeNode): void {
        this.selection = new Array();
        while (node && node.parent) {
            this.selection.push(node.data.id);
            node = node.parent;
        }
        this.selection = this.selection.reverse();
        this.foundsettree.updateSelection(this.selection);
    }

    private findDataNode(nodeid: string, childArray: Array<ChildNode>): ChildNode {
        if (childArray) {
            for (const node of childArray) {
                if (node.id === nodeid) {
                    return node;
                } else {
                    const foundNode = this.findDataNode(nodeid, node.children);
                    if (foundNode) {
                        return foundNode;
                    }
                }
            }
        }
        return null;
    }

    private getNodePKPath(node: ChildNode): Array<any>{
        let arr = new Array();
        let currentNode = node;
        while (currentNode){
            if (currentNode.id && currentNode.id.toString().indexOf(';') > 0 && currentNode.id.toString().indexOf('.') > 0){
                let id = currentNode.id.split('.')[1];
                id = id.split(';')[0];
                arr.push(id);
            }
            currentNode = node.parent;
        }
        arr = arr.reverse();
        return arr;
    }
}

export class Binding extends BaseCustomObject {
    public datasource: string;
    public callbackinfo: Callback;
    public methodToCallOnCheckBoxChange: Callback;
    public methodToCallOnDoubleClick: Callback;
    public methodToCallOnRightClick: Callback;
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

export class Action extends BaseCustomObject {
	public datasource: number;
    public callbackfunction: (param?: string) => void;
    public param: string;
	public name: string;
}

class ChildNode {
    parent?: TreeNode;
    parentID?: string;
    id?: string;
    name?: string;
    hasChildren?: boolean;
    image?: string;
    hascheckbox?: boolean;
    checkboxautoselectschildren?: boolean;
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
    datasource?: string;
    callbackinfo?: () => void;
    callbackinfoParamValue?: any;
    methodToCallOnCheckBoxChange?: () => void;
    methodToCallOnCheckBoxChangeParamValue?: any;
    methodToCallOnDoubleClick?: () => void;
    methodToCallOnDoubleClickParamValue?: any;
    methodToCallOnRightClick?: () => void;
    methodToCallOnRightClickParamValue?: any;
	customActions?: object;
}



