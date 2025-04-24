import { ChangeDetectorRef, Output, SimpleChanges, ViewChild, Renderer2 } from '@angular/core';
import { Component, Input } from '@angular/core';
import { AngularTreeGridComponent } from 'angular-tree-grid';
import { ServoyBaseComponent, ServoyPublicService, EventLike, JSEvent, LoggerFactory, LoggerService } from '@servoy/public';
import { ServoyExtraTreeviewCellRenderer } from './cellrenderer';

@Component({
    selector: 'servoyextra-treeview',
    templateUrl: './treeview.html',
    standalone: false
})
export class ServoyExtraTreeview extends ServoyBaseComponent<HTMLDivElement> {

    @ViewChild('angularGrid') angularGrid: AngularTreeGridComponent;

    @Input() jsDataSet: any;
    @Input() styleClass: string;

    @Input() onNodeClicked: any;
    @Input() onNodeCollapsed: any;
    @Input() onNodeDoubleClicked: any;
    @Input() onNodeExpanded: any;
    @Input() onNodeRightClicked: any;
    @Input() onNodeSelected: any;
    @Input() onReady: (e: JSEvent) => void;
    @Input() onRowDrop: any;

    isTreeReady = false;
    dblClickTimeout: any = null;
    rowID = null;

    columnWidth = 'auto';
    log: LoggerService;

    data: Array<IRowData> = [];

    configs: any = {
        id_field: 'id',
        parent_id_field: 'pid',
        parent_display_field: 'treeColumn',
        css: {
            expand_icon: '<i class="fa fa-caret-right"> </i>',
            collapse_icon: '<i class="fa fa-caret-down"> </i>',
        },
        row_class_function: rec => {
            if (rec.pid === null || rec.pid === undefined) {
                return 'svy-treenode-root';
            } else if (rec.leaf) {
                return 'svy-treenode-leaf';
            } else {
                return 'svy-treenode';
            }
        },
        columns: []
    };

    filterText = '';
    isBranchFilter = false;
    filterMatchedNodes: any[];
    filterPartNodes: any[];
    lastSelectedNode: number;

    folderImgPath = './assets/images/folder.png';
    fileImgPath = './assets/images/file.png';

    //map internal name of the column to the original name as received in the jsDataSet
    columnNameMap: { [key: string]: string } = {};
    columnNameMapIndex: { [key: number]: string } = {};

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private servoyPublicService: ServoyPublicService, logFactory: LoggerFactory) {
        super(renderer, cdRef);
        this.log = logFactory.getLogger('Treeview');
    }


    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case 'jsDataSet': {
                        if (this.jsDataSet) {
                            this.updateTreeGridData();
                            this.isTreeReady = true;
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
        super.svyOnChanges(changes);
    }

    svyOnInit(): void {
        if (this.servoyApi.isInDesigner()) {
            this.jsDataSet = [['id', 'pid', 'treeColumn', 'icon'],
            [1, null, 'Main group', this.folderImgPath],
            [2, null, 'Second group', this.folderImgPath],
            [3, 2, 'Subgroup', this.folderImgPath],
            [4, 3, 'Mark', this.fileImgPath],
            [5, 1, 'George', this.fileImgPath]
            ];
        }
        super.svyOnInit();
    }

    updateTreeGridData() {
        this.configs.columns.length = 0;
        this.data = [];
        this.columnNameMap = {};
        this.columnNameMapIndex = {};
        const ids: Array<number | string> = [];
        const pids: Array<number | string> = [];

        let isFAIcon = false;
        const idIdx = this.jsDataSet[0].indexOf('id');
        const pidIdx = this.jsDataSet[0].indexOf('pid');
        let iconIdx = this.jsDataSet[0].indexOf('icon');
        if (iconIdx === -1) {
            iconIdx = this.jsDataSet[0].indexOf('fa-icon');
            isFAIcon = iconIdx !== -1;
        }
        const treeColumnIdx = this.jsDataSet[0].indexOf('treeColumn');

        // index for extra columns
        const columnsIdx = [];
        for (let c = 0; c < this.jsDataSet[0].length; c++) {
            if (this.jsDataSet[0][c]?.indexOf instanceof Function && this.jsDataSet[0][c]?.indexOf('column') === 0) {
                columnsIdx.push(c);
            }
        }

        // set table header
        this.configs.columns.push({
            treeview: this,
            name: 'treeColumn',
            header: columnsIdx.length ? this.jsDataSet[1][treeColumnIdx] : '',
            type: 'custom',
            component: ServoyExtraTreeviewCellRenderer,
            filter_function: (record) =>
                this.filterText.length === 0 || (this.filterMatchedNodes.indexOf(record.id) !== -1 || this.filterPartNodes.indexOf(record.id) !== -1)
        });

        this.columnNameMap['treeColumn'] = this.jsDataSet[0][treeColumnIdx];
        this.columnNameMapIndex[0] = this.jsDataSet[0][treeColumnIdx];
        if (columnsIdx.length) {
            for (let c = 1; c <= columnsIdx.length; c++) {
                const internalName = 'column' + c;
                const originalName = this.jsDataSet[0][columnsIdx[c - 1]]; // Get the original name
                this.configs.columns.push({
                    treeview: this,
                    name: internalName,
                    header: this.jsDataSet[1][columnsIdx[c - 1]],
                    type: 'custom',
                    component: ServoyExtraTreeviewCellRenderer
                });
                this.columnNameMap[internalName] = originalName;
                this.columnNameMapIndex[c] = originalName;
            }
        }

        // in table view the first contains the table header names
        let i = columnsIdx.length ? 2 : 1;
        for (i; i < this.jsDataSet.length; i++) {
            const row = {
                id: this.jsDataSet[i][idIdx],
                pid: this.jsDataSet[i][pidIdx],
                treeColumn: {
                    text: this.jsDataSet[i][treeColumnIdx],
                    icon: this.jsDataSet[i][iconIdx] ? this.jsDataSet[i][iconIdx] : '',
                    isFAIcon
                }
            };

            for (let c = 1; c <= columnsIdx.length; c++) {
                row['column' + c] = this.jsDataSet[i][columnsIdx[c - 1]];
            }
            ids.push(this.jsDataSet[i][idIdx]);
            !['', null].includes(this.jsDataSet[i][pidIdx]) && pids.push(this.jsDataSet[i][pidIdx]);
            this.data.push(row);
        }

        this.checkIfAllParentsExist(this.data, ids);
        this.addDefaultIconsIfNeeded(this.data, ids, pids);

        if (this.onReady) {
            setTimeout(() => {
                // delay so that form is completely loaded, just like dbtreeview does
                this.onReady(this.servoyPublicService.createJSEvent({ target: this.elementRef.nativeElement } as EventLike, 'onReady'));
            });
        }
    }

    checkIfAllParentsExist(data: Array<IRowData>, ids: Array<number | string>) {
        const itemsToRemove: Array<IRowData> = [];
        for (let i = 0; i < data.length; i++) {
            const row: IRowData = data[i];
            if (!ids.includes(row.pid) && (row.pid !== null && row.pid !== '')) {
                itemsToRemove.push(row);
            }
        }
        if (itemsToRemove.length) {
            this.data = data.filter((row: IRowData) => !itemsToRemove.includes(row));
            itemsToRemove.forEach((row: IRowData) => {
                this.log.warn(`For "${this.name}" component you have used a parent id "${row.pid}" that doesn't exist!`);
            });
        }
    }

    addDefaultIconsIfNeeded(data: Array<IRowData>, ids: Array<number | string>, pids: Array<number | string>) {
        ids.forEach(id => {
            const row = data.filter(row => row.id === id);
            if (row.length === 1 && !row[0].treeColumn.isFAIcon && row[0].treeColumn.icon === '') {
                const index = data.indexOf(row[0]);
                if (pids.includes(id)) {
                    data[index].treeColumn.icon = this.folderImgPath;
                } else {
                    data[index].treeColumn.icon = this.fileImgPath;
                }
            }
        });
    }

    setColumnWidth(columnWidth: number) {
        this.isTreeReady = false;
        const columns = this.configs.columns;
        for (const column of columns) {
            column.width = `${columnWidth}px`;
        }
        this.columnWidth = `${columnWidth}px`;


        setTimeout(() => {
            this.isTreeReady = true;
            this.cdRef.detectChanges();
            const table: HTMLElement = this.elementRef.nativeElement.querySelector('table.db-tree-view');
            table.style.display = 'unset';
        });
    }

    onclick(event) {
        this.rowID = event.row?.id || event.data.id;
        let originalColumnName = null;
        if (event?.column?.name) {
            originalColumnName = this.columnNameMap[event.column.name];
        }
        if (originalColumnName === null) {
            originalColumnName = this.columnNameMapIndex[[...event.event.currentTarget.childNodes].filter(item => item instanceof HTMLElement).indexOf(event.event.target)];
        }
        if (this.onNodeDoubleClicked) {
            if (this.dblClickTimeout) {
                this.onNodeDoubleClicked(this.rowID, event.event);
                clearTimeout(this.dblClickTimeout);
                this.dblClickTimeout = null;
            } else {
                const id = this.rowID;
                this.dblClickTimeout = setTimeout(() => {
                    if (this.onNodeClicked) {
                        this.onNodeClicked(id, event.event, originalColumnName);
                    }
                    this.dblClickTimeout = null;
                }, 400);
            }
        } else if (this.onNodeClicked) {
            this.onNodeClicked(this.rowID, event.event, originalColumnName);
        }
    }

    onselect(event) {
        if (this.onNodeSelected) {
            if (this.lastSelectedNode !== event.data.id) {
                this.onNodeSelected(event.data.id);
                this.lastSelectedNode = event.data.id;
            }
        }
        this.rowID != event.data.id && this.onclick(event);
        this.rowID = null;
    }

    onexpand(event) {
        if (this.onNodeExpanded) {
            this.onNodeExpanded(event.data.id);
        }
    }

    oncollapse(event) {
        if (this.onNodeCollapsed) {
            this.onNodeCollapsed(event.data.id);
        }
    }

    /**
     * Refresh the tree display.
     *
     * @example
     * %%elementName%%.refresh()
     *
     */
    refresh(restoreExpandedNodes) {
        if (this.isTreeReady) {
            this.angularGrid.store.refreshDisplayData();
        }
    }

    /**
     *
     * Expand all nodes
     *
     * @example
     * %%elementName%%.expandAll
     *
     * @return success state
     *
     */
    expandAll() {
        if (this.isTreeReady) {
            this.angularGrid.expandAll();
            return true;
        }
        return false;
    }

    /**
     * Collapse all nodes
     *
     * @example
     * %%elementName%%.collapseAll()
     *
     * @return success state
     */
    collapseAll() {
        if (this.isTreeReady) {
            this.angularGrid.collapseAll();
            return true;
        }
        return false;
    }

    /**
     * Expand a node by id.
     *
     * @example
     * %%elementName%%.expandNode(22)
     *
     * @param nodeId node id
     *
     */
    expandNode(nodeId) {
        if (this.isTreeReady) {
            this.angularGrid.expandRow(isNaN(nodeId) ? nodeId.toString() : nodeId);
        }
    }

    /**
     * Returns expand state of a node.
     *
     * @example
     * var expanded = %%elementName%%.isNodeExpanded([22])
     *
     * @param pk array of each level id
     *
     * @return true if node is expanded
     */
    isNodeExpanded(nodeId) {
        let isNodeExpanded = false;
        if (this.isTreeReady) {
            const displayData = this.angularGrid.store.getDisplayData();
            displayData.forEach(data => {
                if (data.id === nodeId && this.angularGrid.expand_tracker[data.pathx] === true) {
                    isNodeExpanded = true;
                    return;
                }
            });
        }
        return isNodeExpanded;
    }

    /**
     * Collaps a node by id.
     *
     * @example
     * %%elementName%%.collapseNode(22)
     *
     * @param nodeId node id
     *
     */
    collapseNode(nodeId) {
        if (this.isTreeReady) {
            this.angularGrid.collapseRow(nodeId.toString());
        }
    }

    /**
     * Sets selected node by id.
     *
     * @example
     * %%elementName%%.setSelectedNode(22)
     *
     * @param nodeId node id
     */
    setSelectedNode(nodeId) {
        if (this.isTreeReady) {
            const displayData = this.angularGrid.store.getDisplayData();
            displayData.forEach(data => {
                data.row_selected = data.id === nodeId;
            });
        }
    }

    /**
     * Get selected node id.
     *
     * @example
     * var selection = %%elementName%%.getSeletedNode()
     *
     * @return selected node
     */
    getSeletedNode() {
        let selectedNodeId = null;
        if (this.isTreeReady) {
            const displayData = this.angularGrid.store.getDisplayData();
            displayData.forEach(data => {
                if (data.row_selected) {
                    selectedNodeId = data.id;
                    return;
                }
            });
        }
        return selectedNodeId;
    }

    /**
     * Get child nodes ids of a parent node.
     *
     * @example
     * var childNodes = %%elementName%%.getChildNodes()
     *
     * @param nodeId node id
     *
     * @return child nodes of node
     */
    getChildNodes(nodeId) {
        const childNodesId = new Array();
        if (this.isTreeReady) {
            const displayData = this.angularGrid.store.getDisplayData();
            const childNodes = this.angularGrid.store.findChildren(displayData, nodeId, this.configs);
            childNodes.forEach(element => {
                childNodesId.push(element.id);
            });
        }
        return childNodesId;
    }

    /**
     * Get child nodes ids of a parent node.
     *
     * @example
     * var childNodes = %%elementName%%.getChildNodes()
     *
     * @param nodeId node id
     *
     * @return parent node
     */
    getParentNode(nodeId) {
        let parentNodeId = null;
        if (this.isTreeReady) {
            const displayData = this.angularGrid.store.getDisplayData();
            displayData.forEach(data => {
                if (data.id === nodeId) {
                    parentNodeId = data.pid;
                    return;
                }
            });
        }
        return parentNodeId;
    }

    /**
     * Get the tree level a node is situated.
     *
     * @example
     * var nodeLevel = %%elementName%%.getNodeLevel()
     *
     * @param nodeId node id
     *
     * @return node level
     */
    getNodeLevel(nodeId) {
        let nodeLevel = -1;
        if (this.isTreeReady) {
            const displayData = this.angularGrid.store.getDisplayData();
            displayData.forEach(data => {
                if (data.id === nodeId) {
                    nodeLevel = data.levelx + 1;
                    return;
                }
            });
        }
        return nodeLevel;
    }

    /**
     * Get root nodes ids .
     *
     * @example
     * var rootNodes = %%elementName%%.getRootNodes()
     *
     * @return array of root nodes
     */
    getRootNodes() {
        const rootNodesId = new Array();
        if (this.isTreeReady) {
            const displayData = this.angularGrid.store.getDisplayData();
            displayData.forEach(data => {
                if (['', null].includes(data.pid)) {
                    rootNodesId.push(data.id);
                }
            });
        }
        return rootNodesId;
    }

    /**
     * Dimm or hide unmatched nodes.
     *
     * <br>
     * <b>NOTE</b>: This function might not work as expected if the node titles contain HTML markup.
     *
     *
     * @param text filter nodes matching the given text
     * @param [options] filter options
     *
     * <br>
     * <br>
     * List of options:
     * <br>
     *	<b>autoExpand</b>, type: {boolean}, default: false
     * 	Temporarily expand matching node parents while filter is active.
     *	<br>
     *	<b>fuzzy</b>, type: {boolean}, default: false
     *	Match single characters in order, e.g. 'fb' will match 'FooBar'.
     *	<br>
     *	<b>hideExpanders</b>, type: {boolean}, default: false
     *	Hide hideExpanders expanders if all child nodes are hidden by filter.
     *	<br>
     *	<b>highlight</b>, type: {boolean}, default: false
     *	Highlight matches by wrapping inside tags.
     *	<br>
     *	<b>leavesOnly</b>, type: {boolean}, default: false
     *	Match end nodes only.
     *	<br>
     *	<b>mode</b>, type: {string: 'dimm' | 'hide'}, default: 'hide'
     *	Defines if unmatched nodes are grayed out or hidden.
     *	<br>
     *	<b>nodata</b>, type: {boolean|string|object|function}, default: true
     *	Display the string 'No data' if the filtered tree would be empty.
     *
     * @example <pre>
     * elements.tree.filterNodes(searchFilter, {mode: 'hide', autoExpand: true, leavesOnly: true});
     * </pre>
     *
     */
    filterNodes(text, options) {
        this.isBranchFilter = false;
        this.applyFilter(text, options);
    }

    /**
     * Dimm or hide unmatched branches. Matching nodes are displayed together with all descendants.
     *
     * @param text filter nodes matching the given text
     * @param [options] filter options, same as for 'filterNodes'
     */
    filterBranches(text, options) {
        this.isBranchFilter = true;
        this.applyFilter(text, options);
    }

    applyFilter(text, options) {
        this.filterText = text;
        if (this.isTreeReady) {
            this.getFilteredNodes();
            this.angularGrid.store.filterBy([this.configs.columns[0]], this.filterText);
            if (options && options.autoExpand) {
                this.angularGrid.expandAll();
            }
        }
    }

    getFilteredNodes() {
        this.filterMatchedNodes = [];
        this.filterPartNodes = [];

        if (this.filterText.length !== 0) {
            const filterMatchedNodesPaths = [];
            const filterTextLC = this.filterText.toLowerCase();
            const processedData = this.angularGrid.store.getProcessedData();
            processedData.forEach(data => {
                if (!data.treeColumn.text) return;
                const nodeTextLC = data.treeColumn.text.toLowerCase();
                if (nodeTextLC.indexOf(filterTextLC) !== -1) {
                    if (this.filterMatchedNodes.indexOf(data.id) === -1) {
                        this.filterMatchedNodes.push(data.id);
                        filterMatchedNodesPaths.push(data.pathx);
                    }
                    const pathA = data.pathx.split('.');
                    pathA.splice(pathA.length - 1, 1);
                    pathA.forEach(element => {
                        if (this.filterPartNodes.indexOf(element) === -1) {
                            this.filterPartNodes.push(Number(element));
                        }
                    });
                } else if (this.isBranchFilter) {
                    filterMatchedNodesPaths.forEach(element => {
                        if (data.pathx.indexOf(element) === 0) {
                            if (this.filterPartNodes.indexOf(data.id) === -1) {
                                this.filterPartNodes.push(data.id);
                            }
                        }
                    });
                }
            });
        }
    }

    onRowDragOverEvent($event) {
        const dragSupported = $event.dataTransfer.types.length && $event.dataTransfer.types[0] === 'nggrids/json';
        if (dragSupported) {
            $event.dataTransfer.dropEffect = 'copy';
            $event.preventDefault();
        }
    }

    onRowDropEvent($event) {
        $event.preventDefault();
        if (this.onRowDrop) {
            const targetNodeId = this.getTargetNodeId($event.target);
            const jsonData = $event.dataTransfer.getData('nggrids/json');
            const rowDatas = JSON.parse(jsonData);
            this.onRowDrop(rowDatas, targetNodeId, $event);
        }
    }

    getTargetNodeId(element): any {
        const cell = element.closest('[cell-id]');
        return cell ? cell.getAttribute('cell-id') : null;
    }
}

interface IRowData {
    id: number | string;
    pid: number | string;
    treeColumn: IRowDataTreeColumn;
}

interface IRowDataTreeColumn {
    text: string;
    icon: string;
    isFAIcon: boolean;
}
