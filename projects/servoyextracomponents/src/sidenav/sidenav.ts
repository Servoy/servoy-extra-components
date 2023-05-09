import { Component, SimpleChanges, Input, Output, Renderer2, ChangeDetectorRef, ContentChild, TemplateRef, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { ServoyBaseComponent, ServoyPublicService } from '@servoy/public';
import { DOCUMENT } from '@angular/common';
import { LoggerFactory, LoggerService } from '@servoy/public';

@Component({
    selector: 'servoyextra-sidenav',
    templateUrl: './sidenav.html'
})
export class ServoyExtraSidenav extends ServoyBaseComponent<HTMLDivElement> {

    @Input() enabled: boolean;
    @Input() styleClass: string;
    @Input() tabSeq: number;
    @Input() sidenavWidth: number;
    @Input() responsiveHeight: number;
    @Input() containedForm: string;
    @Input() headerForm: string;
    @Input() footerForm: string;
    @Input() relationName: string;
    @Input() iconOpenStyleClass: string;
    @Input() iconCloseStyleClass: string;
    @Input() iconExpandStyleClass: string;
    @Input() iconCollapseStyleClass: string;

    @Input() slidePosition: string;
    @Input() slideAnimation: string;
    @Input() togglePosition: string;
    @Input() scrollbarPosition: string;
    @Input() open: boolean;
    @Output() openChange = new EventEmitter();
    @Input() animate: boolean;

    @Input() selectedIndex: any;
    @Output() selectedIndexChange = new EventEmitter();
    @Input() expandedIndex: any;
    @Output() expandedIndexChange = new EventEmitter();
    @Input() menu: Array<MenuItem>;

    @Input() onMenuItemSelected: (id: string, event: MouseEvent) => Promise<boolean>;
    @Input() onMenuItemExpanded: (id: string, event: MouseEvent) => Promise<boolean>;
    @Input() onMenuItemCollapsed: (id: string, event: MouseEvent) => Promise<boolean>;
    @Input() onOpenToggled: (event: MouseEvent) => void;

    @ContentChild(TemplateRef, { static: true }) templateRef: TemplateRef<any>;

    @ViewChild('element', { static: true }) elementRef: ElementRef;

    animateSlideMenuTimeout: number;
    mouseEnterTimeout: number;
    mouseLeaveTimeout: number;

    private realContainedForm: any;
    private realHeaderForm: any;
    private realFooterForm: any;
    private log: LoggerService;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private servoyPublic: ServoyPublicService, @Inject(DOCUMENT) private doc: Document, logFactory: LoggerFactory) {
        super(renderer, cdRef);
        this.log = logFactory.getLogger('SideNav');
    }

    svyOnInit() {
        super.svyOnInit();
        if (!this.selectedIndex) this.selectedIndex = {};
        if (!this.expandedIndex) this.expandedIndex = {};
    }

    svyOnChanges(changes: SimpleChanges) {
        super.svyOnChanges(changes);
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case 'enabled':
                        const nav = this.getNativeElement().querySelector('nav');
                        if (change.currentValue) {
                            this.renderer.removeAttribute(nav, 'disabled');
                            this.renderer.removeClass(nav, 'svy-sidenav-disabled');
                        } else {
                            this.renderer.setAttribute(nav, 'disabled', 'disabled');
                            this.renderer.addClass(nav, 'svy-sidenav-disabled');
                        }
                        break;
                    case 'styleClass':
                        const sidenav = this.getNativeElement().querySelector('.svy-sidenav');
                        if (change.previousValue) {
                            const array = change.previousValue.trim().split(' ');
                            array.filter((element: string) => element !== '').forEach((element: string) => this.renderer.removeClass(sidenav, element));
                        }
                        if (change.currentValue) {
                            const array = change.currentValue.trim().split(' ');
                           array.filter((element: string) => element !== '').forEach((element: string) => this.renderer.addClass(sidenav, element));
                        }
                        break;
                    case 'containedForm':
                        if (change.currentValue) {
                            this.renderer.addClass(this.getNativeElement(), 'has-panel');
                        } else {
                            this.renderer.removeClass(this.getNativeElement(), 'has-panel');
                        }
                        if (change.previousValue) {
                            this.servoyApi.hideForm(change.previousValue, null, null, this.containedForm, this.relationName).then(() => {
                                this.realContainedForm = this.containedForm;
                            }).finally(() => this.cdRef.detectChanges());
                        } else if (change.currentValue) {
                            this.servoyApi.formWillShow(this.containedForm, this.relationName).then(() => {
                                this.realContainedForm = this.containedForm;
                            }).finally(() => this.cdRef.detectChanges());
                        }
                        break;
                    case 'realtionName':
						this.relationName = change.currentValue;
						break;
                    case 'headerForm':
                        if (change.previousValue) {
                            this.servoyApi.hideForm(change.previousValue, null, null, this.headerForm, this.relationName).then(() => {
                                this.realHeaderForm = this.headerForm;
                            }).finally(() => this.cdRef.detectChanges());
                        } else if (change.currentValue) {
                            this.servoyApi.formWillShow(this.headerForm, this.relationName).then(() => {
                                this.realHeaderForm = this.headerForm;
                            }).finally(() => this.cdRef.detectChanges());
                        }
                        break;
                    case 'footerForm':
                        if (change.previousValue) {
                            this.servoyApi.hideForm(change.previousValue, null, null, this.footerForm, this.relationName).then(() => {
                                this.realFooterForm = this.footerForm;
                            }).finally(() => this.cdRef.detectChanges());
                        } else if (change.currentValue) {
                            this.servoyApi.formWillShow(this.footerForm, this.relationName).then(() => {
                                this.realFooterForm = this.footerForm;
                            }).finally(() => this.cdRef.detectChanges());
                        }
                        break;
                    case 'sidenavWidth':
                    case 'responsiveHeight':
                        this.updateSidenavStyle();
                        break;
                    case 'open':
                        this.animateMenuHover(this.open);
                        this.animateSlideMenu(this.open);

                        if (this.open) {
                            if (this.footerForm) {
                                this.servoyApi.formWillShow(this.footerForm, this.relationName).then(() => {
                                    this.realFooterForm = this.footerForm;
                                }).finally(() => this.cdRef.detectChanges());
                            }
                            if (this.headerForm) {
                                this.servoyApi.formWillShow(this.headerForm, this.relationName).then(() => {
                                    this.realHeaderForm = this.headerForm;
                                }).finally(() => this.cdRef.detectChanges());
                            }
                        } else {
                            if (this.footerForm) {
                                this.servoyApi.hideForm(this.footerForm, null, null, null, this.relationName).then(() => {
                                    this.realFooterForm = this.footerForm;
                                }).finally(() => this.cdRef.detectChanges());
                            }
                            if (this.headerForm) {
                                this.servoyApi.hideForm(this.headerForm, null, null, null, this.relationName).then(() => {
                                    this.realHeaderForm = this.headerForm;
                                }).finally(() => this.cdRef.detectChanges());
                            }
                        }
                        break;
                    case 'expandedIndex':
                        if(!change.currentValue) {
                            this.expandedIndex = {};
                        }
                        else if (typeof this.expandedIndex == 'string') {
                            this.expandedIndex = JSON.parse(this.expandedIndex);
                        }
                        break;
                    case 'selectedIndex':
                        if(!change.currentValue) {
                            this.selectedIndex = {}
                        }
                        else if (typeof this.selectedIndex == 'string') {
                            this.selectedIndex = JSON.parse(this.selectedIndex);
                        }
                        break;
                }
            }
        }
    }

    isDesignTime() {
        return this.servoyApi.isInDesigner();
    }

    getForm() {
        return this.realContainedForm;
    }
    
    getHeaderForm() {
        return this.realHeaderForm;
        
    }

    getFooterForm() {
        return this.realFooterForm;
    }

    getResponsiveHeight() {
        let height = 0;
        if (!this.servoyApi.isInAbsoluteLayout()) {
            if (this.responsiveHeight) {
                height = this.responsiveHeight;
            } else if (this.containedForm) {
                // for absolute form default height is design height, for responsive form default height is 0
                const formCache = this.servoyPublic.getFormCacheByName(this.containedForm);
                if (formCache && formCache.absolute) {
                    height = formCache.size.height;
                }
            }
        }
        return height;
    }

    getHeaderFormStyle() {
		let style = {}
		let height = 0;
		
		// for absolute form default height is design height, for responsive form default height is 0
        const formCache = this.servoyPublic.getFormCacheByName(this.headerForm);
        if (formCache && formCache.absolute) {
            height = formCache.size.height;
        }  
	    if (height > 0)
	    {
	        style['minHeight'] = height+'px';
	    }	  
		return style;
	}
    
    getFooterFormStyle() {
		let style = {}
		let height = 0;
		
		// for absolute form default height is design height, for responsive form default height is 0
        const formCache = this.servoyPublic.getFormCacheByName(this.footerForm);
        if (formCache && formCache.absolute) {
            height = formCache.size.height;
        }  
	    if (height > 0)
	    {
	        style['minHeight'] = height+'px';
	    }	  
		return style;
	}

    getSidenavWidth() {
        if (this.sidenavWidth) {
            // if value is set and there is a responsiveForm or a containedForm. Note should react also if containeForm is set later
            if (!this.servoyApi.isInAbsoluteLayout() || this.containedForm) {
                return this.sidenavWidth;
            }
        }
        return 0;
    }

    updateSidenavStyle() {
        const sidenav = this.getNativeElement().querySelector('.svy-sidenav');
        const width = this.getSidenavWidth();
        if (width) {
            this.renderer.setStyle(sidenav, 'width', width + 'px');
        }

        // check height
        const height = this.getResponsiveHeight();
        if (height) {
            this.renderer.setStyle(sidenav, 'minHeight', height + 'px');
        }
    }

    getContainerStyle() {
        const height = this.getResponsiveHeight();
        const width = this.getSidenavWidth();
        const cssStyle = {
            position: 'relative',
            'min-height': height + 'px'
        };
        switch (this.slidePosition) {
            case 'left':
                cssStyle['marginLeft'] = width + 'px';
                break;
            case 'right':
                cssStyle['marginRight'] = width + 'px';
                break;
            default:
                break;
        }

        return cssStyle;
    }

    animateSlideMenu(open: boolean) {
        if (this.slidePosition && this.slidePosition !== 'static') {
            const iconOpen = this.getNativeElement().querySelector('.svy-sidenav-action-open');
            const sidenav = this.getNativeElement().querySelector('.svy-sidenav');
            const svyextracontainer = this.getNativeElement();
            if (open) { // open the menu when hovering

                // remove all hover animation
                this.renderer.removeClass(sidenav, 'svy-hover-animate');
                this.renderer.removeClass(sidenav, 'svy-hover-remove');
                this.renderer.removeClass(sidenav, 'svy-hover-add');
                this.renderer.removeClass(sidenav, 'svy-hover');
                if (sidenav.classList.contains('svy-slide-out')) {

                    this.renderer.removeClass(svyextracontainer, 'svy-slide-out');
                    this.renderer.removeClass(sidenav, 'svy-slide-out');

                    // used to slide in the panel if. Use only if menu slides
                    if (this.slideAnimation === 'slide-menu') {
                        this.renderer.addClass(svyextracontainer, 'svy-slide-out-remove-delay');

                        // stop remove animation clearing previous timeout
                        if (this.animateSlideMenuTimeout) {
                            window.clearTimeout(this.animateSlideMenuTimeout);
                            this.animateSlideMenuTimeout = undefined;
                        }

                        window.requestAnimationFrame(() => {
                            // complete hover animation
                            this.animateSlideMenuTimeout = window.setTimeout(() => {
                                this.renderer.removeClass(svyextracontainer, 'svy-slide-out-remove-delay');
                            }, 450);

                        });
                    }

                }
                this.iconCloseStyleClass.split(' ').forEach(element => this.renderer.removeClass(iconOpen, element));
                this.iconOpenStyleClass.split(' ').forEach(element => this.renderer.addClass(iconOpen, element));
            } else {
                if (!svyextracontainer.classList.contains('svy-slide-out')) {
                    this.renderer.addClass(sidenav, 'svy-slide-out');
                    this.renderer.addClass(svyextracontainer, 'svy-slide-out');
                }
                this.iconOpenStyleClass.split(' ').forEach(element => this.renderer.removeClass(iconOpen, element));
                this.iconCloseStyleClass.split(' ').forEach(element => this.renderer.addClass(iconOpen, element));
            }
        } else {
            this.open = true;
            this.openChange.emit(this.open);
        }
    }

    animateMenuHover(open: boolean) {
        if (open === false) { // add listener when menu closed, use a delay
            setTimeout(() => {
                this.bindOnHover();
            }, 300);
        } else { // remove listener when open
            this.unbindOnHover();
        }
    }

    bindOnHover() {
        // register on mouse hover
        if (this.slideAnimation === 'collapse-menu') {
            const sidenav = this.getNativeElement().querySelector('.svy-sidenav');
            const nav = this.getNativeElement().querySelector('nav');
            nav.addEventListener('mouseenter', this.onMouseEnter);
            sidenav.addEventListener('mouseleave', this.onMouseLeave);
        }

    }

    unbindOnHover() {
        const sidenav = this.getNativeElement().querySelector('.svy-sidenav');
        const nav = this.getNativeElement().querySelector('nav');
        nav.removeEventListener('mouseenter', this.onMouseEnter);
        sidenav.removeEventListener('mouseleave', this.onMouseLeave);
    }

    slideMenu(event: MouseEvent) {
        const wasOpen = this.open;
        this.open = this.open === false ? true : false;

        this.animateMenuHover(this.open);
        this.animateSlideMenu(this.open);
        this.openChange.emit(this.open);

        // event on menu open
        if (this.onOpenToggled && wasOpen !== this.open) {
            this.onOpenToggled(event);
        }
    }

    selectItem(level: number, index: number, item: MenuItem, event?: MouseEvent, preventSelectHandler?: boolean, preventExpandHandler?: boolean) {

        if (event) { //
            event.stopPropagation();
        } else { //
            event = this.createJSEvent();
        }

        // prevent selection if item is disabled
        if (this.isDisabled(item.id)) {
            return false;
        }

        // checking if the item was selected twice in a row, return true or false
		const isItemAlreadySelected = this.selectedIndex[level] === item.id && !this.selectedIndex[level + 1];

        const confirmSelection = () => {
            this.setSelectedIndex(level, index, item);

            // expand the item
            if (item.menuItems) { // expand the node if not leaf
                if (!isItemAlreadySelected) { // expand the node if not isItemAlreadySelected
					this.expandItem(level, index, item, event, preventExpandHandler);
				} else if (!this.isMenuItemExpanded(item.id)) { // expand the node if if the node is not expanded
					this.expandItem(level, index, item, event, preventExpandHandler);
				} else { // collapse the node
					this.collapseItem(level, index, item, event, preventExpandHandler);
				}
            } else { // expand the parent node if is a leaf
                const parentNode = this.getParentNode(item.id);
                if (parentNode) {
                    this.expandItem(level - 1, null, parentNode, event, preventExpandHandler);
                }
            }

			// change containedForm
			if (item.formName && !isItemAlreadySelected){
				const formToHide = this.containedForm;
				const formToShow = item.formName;
				const relationToShow = item.relationName ? item.relationName : null;
				this.servoyApi.callServerSideApi('showForm', [formToHide, formToShow, relationToShow]);
			}
        };

        if (preventSelectHandler !== true && this.onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
            this.onMenuItemSelected(item.id, event).then((result) => {
                if (result !== false) {
                    confirmSelection();
                }
            }, (err) => {
                // TODO use logging instead
                this.log.error(err);
            });
        } else {
            confirmSelection();
        }
        return true;
    }

    toggleExpandedItem(level: number, index: number, item: MenuItem, event: MouseEvent, preventHandler?: boolean) {
        if (!this.isNodeExpanded(item.id, level)) { // expand the item
            this.expandItem(level, index, item, event, preventHandler);
        } else { // collapse the item
            this.collapseItem(level, index, item, event, preventHandler);
        }
    }

    expandItem(level: number, index: number, item: MenuItem, event?: MouseEvent, preventHandler?: boolean) {

        if (event) { //
            event.stopPropagation();
        } else { //
            event = this.createJSEvent();
        }

        // check if node is already collapsed
        if (this.isNodeExpanded(item.id, level)) {
            return true;
        }

        // prevent selection if item is disabled
        if (this.isDisabled(item.id)) {
            return false;
        }

        // if is expanded
        if (preventHandler !== true && this.onMenuItemExpanded) { // change selection only if onMenuItemSelected allows it
            this.onMenuItemExpanded(item.id, event).then(() => {
                // if (result == true) {
                this.setExpandedIndex(level, index, item);
                // }
            }, (err) => { // Error: "Oops something went wrong"
                // TODO use logging instead
                this.log.error(err);
            });
        } else {
            this.setExpandedIndex(level, index, item);
        }

        return true;
    }

    collapseItem(level: number, _index: number, item: MenuItem, event?: MouseEvent, preventHandler?: boolean) {

        if (event) { //
            event.stopPropagation();
        } else { //
            event = this.createJSEvent();
        }

        // check if node is already collapsed
        if (!this.isNodeExpanded(item.id, level)) {
            return true;
        }

        // prevent selection if item is disabled
        if (this.isDisabled(item.id)) {
            return false;
        }

        // call handler onMenuItemCollapsed
        if (preventHandler !== true && this.onMenuItemCollapsed) {
            this.onMenuItemCollapsed(item.id, event).then(() => {
                // if (result == true) {
                this.clearExpandedIndex(level - 1);
                this.expandedIndexChange.emit(JSON.stringify(this.expandedIndex));
                // }
            }, (err) => { // Error: "Oops something went wrong"
                // TODO use logging instead
                this.log.error(err);
            });
        } else {
            this.clearExpandedIndex(level - 1);
            this.expandedIndexChange.emit(JSON.stringify(this.expandedIndex));
        }

        return true;
    }

    getNodeById(nodeId: string | number, nodes: Array<MenuItem>): MenuItem {
        if (nodes) {
            for (const i of Object.keys(nodes)) { // search in each subtree
                const subTree = nodes[i];
                // TODO use type equality or not ?
                if (subTree.id === nodeId) { // find the node
                    return subTree;
                }
                const node = this.getNodeById(nodeId, subTree.menuItems);
                if (node) {
                    return node;
                }
            }
        }
        return null;
    }

    getNodeByIndexPath(path: Array<number>, nodes: Array<MenuItem>): MenuItem {
        let node = null;
        if (nodes) {
            if (path && path.length === 1) {
                node = nodes[path[0]];
            } else if (path && path.length) {
                const subPathIndex = path[0];
                const subtree = nodes[subPathIndex].menuItems;
                node = this.getNodeByIndexPath(path.slice(1, path.length), subtree);
            } else { // is the root
                node = nodes;
            }
        }
        return node;
    }

    getPathToNode(idOrNode: any, nodes: Array<MenuItem>, key?: string): Array<number> {
        if (!key) key = 'id';
        const nodeId = idOrNode[key] ? idOrNode[key] : idOrNode;

        if (nodes) { // for each node in nodes
            for (let i = 0; i < nodes.length; i++) { // search in each subtree
                const subTree = nodes[i];
                if (subTree[key] === nodeId) { // find the node
                    return [i];
                }
                const path = this.getPathToNode(nodeId, subTree.menuItems, key);
                if (path) {
                    return [i].concat(path);
                }
            }
        }
        return null;
    }

    getAllNodesToNodeId(nodeId: string | number): Array<MenuItem> {
        let nodes = this.menu;
        const pathIndex = this.getPathToNode(nodeId, nodes);
        const anchestors = [];

        // returns all the anchestors of node
        for (let i = 0; pathIndex && i < pathIndex.length; i++) {
            const node = nodes[pathIndex[i]];
            anchestors.push(node);
            nodes = node.menuItems;
        }
        return anchestors;
    }

    getNodeAnchestors(nodeId: string | number): Array<MenuItem> {
        const anchestors = this.getAllNodesToNodeId(nodeId);
        anchestors.pop();
        return anchestors;
    }

    getParentNode(nodeId: string | number): MenuItem {
        const anchestors = this.getNodeAnchestors(nodeId);
        if (anchestors && anchestors.length) {
            return anchestors[anchestors.length - 1];
        }
        return null;
    }

    getNodeLevel(nodeId: string | number): number {
        const path = this.getPathToNode(nodeId, this.menu);
        if (path) {
            return path.length;
        } else {
            return null;
        }
    }

    getSelectedNode(level: number): MenuItem {
        const levels = this.selectedIndex;
        let maxLevel = -1;

        // get the node at deeper level
        for (const lvl in levels) {
            if (Number(lvl) > maxLevel && (!level || Number(lvl) <= level)) {
                maxLevel = Number(lvl);
            }
        }

        const nodeId = levels[maxLevel];
        return this.getNodeById(nodeId, this.menu);
    }

    getSelectedIndexPath(level: number): Array<number> {
        const selectedNode = this.getSelectedNode(level);
        const path = this.getPathToNode(selectedNode.id, this.menu);
        return path;
    }

    setSelectedIndex(level: number, _index: number, item: MenuItem) {
        if (!this.selectedIndex) this.selectedIndex = {};
        const levels = this.selectedIndex;

        // clear level below selection
        this.clearSelectedIndex(level);

        //              // update levels above selection, all anchestors
        const newSelectedIndex = {};
        const anchestors = this.getNodeAnchestors(item.id);
        for (let i = 0; i < anchestors.length; i++) {
            if (newSelectedIndex[i + 1] !== anchestors[i].id) {
                newSelectedIndex[i + 1] = anchestors[i].id;
            }
        }

        // TODO select all parents as well
        // set level index
        if (levels[level] === item.id) { // collapse the selected menu
            // TODO allow unselect !?
            newSelectedIndex[level] = item.id;
        } else {
            newSelectedIndex[level] = item.id;
        }
        this.selectedIndex = newSelectedIndex;
        this.selectedIndexChange.emit(JSON.stringify(this.selectedIndex));
    }

    clearSelectedIndex(level: number) {
        const levels = this.selectedIndex;
        // reset all sub levels
        for (const lvl in levels) {
            if (Number(lvl) > level) { // reset the next levels
                delete levels[lvl];
            }
        }
    }

    setExpandedIndex(level: number, _index: number, item: MenuItem) {
        if (!this.expandedIndex) this.expandedIndex = {};
        const levels = this.expandedIndex;

        // clear sub levels
        this.clearExpandedIndex(level);

        // expand all anchestors
        const newExpandedIndex = {};
        const anchestors = this.getNodeAnchestors(item.id);
        for (let i = 0; i < anchestors.length; i++) {
            if (newExpandedIndex[i + 1] !== anchestors[i].id) {
                newExpandedIndex[i + 1] = anchestors[i].id;
            }
        }

        // TODO select all parents as well
        // expand node index
        if (levels[level] !== item.id) { // collapse the selected menu
            newExpandedIndex[level] = item.id;
        }
        this.expandedIndex = newExpandedIndex;
        this.expandedIndexChange.emit(JSON.stringify(this.expandedIndex));
    }


    clearExpandedIndex(level: number) {
        const levels = this.expandedIndex;

        // reset all sub levels
        for (const lvl in levels) {
            if (Number(lvl) > level) { // reset the next levels
                delete levels[lvl];
            }
        }
    }

    isDisabled = (nodeId: string | number): boolean => {
        // check if menu itself is disable
        if (this.enabled === false) {
            return true;
        }

        // TODO refactor: use getNodeAnchestors
        const indexPath = this.getPathToNode(nodeId, this.menu);
        let tree = this.menu;

        if (!indexPath || !indexPath.length) {
            return null;
        }

        for (const i of Object.keys(indexPath)) {
            const node = tree[indexPath[i]];
            if (node.enabled === false) {
                return true;
            }
            tree = node.menuItems;
        }
        return false;
    };

    isNodeSelected(nodeId: string | number, level: number): boolean {
        const levels = this.selectedIndex;
        if (level) {
            return levels[level] === nodeId;
        } else {
            for (const level2 in levels) {
                if (levels[level2] === nodeId) {
                    return true;
                }
            }
        }
        return false;
    }

    isNodeExpanded(nodeId: string | number, level?: number): boolean {
        const levels = this.expandedIndex;
        if (level) {
            return levels[level] === nodeId;
        } else {
            for (const level2 in levels) {
                if (levels[level2] === nodeId) {
                    return true;
                }
            }
        }
        return false;
    }

    createJSEvent(): MouseEvent {
        const x = this.getNativeElement().offsetLeft;
        const y = this.getNativeElement().offsetHeight;

        const event = this.doc.createEvent('MouseEvents');
        event.initMouseEvent('click', false, true, window, 1, x, y, x, y, false, false, false, false, 0, null);
        return event;
    }

    getDOMElementByID(nodeId: string | number): Element {
        const indexPath = this.getPathToNode(nodeId, this.menu);
        if (indexPath) {
            let foundElement: Element = this.getNativeElement();
            for (let i = 0; i < indexPath.length; i++) {
                foundElement = foundElement.querySelector('ul.sn-level-' + (i + 1));
                foundElement = foundElement.children.item(i);
            }
            return foundElement;
        }
        return null;
    }

    /****************************************************************
    * API
    **************************************************************/


   public setSelectedByIndexPath(path: Array<number>, mustExecuteOnSelectNode: boolean) {

        // search node in tree
        const node = this.getNodeByIndexPath(path, this.menu);
        const preventSelectHandler = mustExecuteOnSelectNode === true ? false : true;
        this.selectItem(path.length, path[path.length - 1], node, null, preventSelectHandler);
        return;
    }

    public isMenuItemExpanded(menuItemId: string | number): boolean{
        return this.isNodeExpanded(menuItemId);
    }

    public isMenuItemEnabled(menuItemId: string | number): boolean {
        const disabled = this.isDisabled(menuItemId);
        if (disabled === null) {
            return false;
        } else {
            return !disabled;
        }
    };

    public getLocation(nodeId: string | number): {x: number; y: number} {
        const domElement = this.getDOMElementByID(nodeId);
        if (domElement) {
            const position = domElement.getBoundingClientRect();
            return { x: position.left, y: position.top };
        }
        return null;
    }

    public getSize(nodeId: string | number): {width: number; height: number} {
        const domElement = this.getDOMElementByID(nodeId);
        if (domElement) {
            const position = domElement.getBoundingClientRect();
            return { width: position.width, height: position.height };
        }
        return null;
    }

    private onMouseEnter = () => {
        // only if the menu is collapsed, use the mouseover
        if (this.slideAnimation === 'collapse-menu') {
            const sidenav = this.getNativeElement().querySelector('.svy-sidenav');
            // stop remove animation clearing previous timeout
            if (this.mouseLeaveTimeout) {
                this.renderer.removeClass(sidenav, 'svy-hover-remove');
                window.clearTimeout(this.mouseLeaveTimeout);
                this.mouseLeaveTimeout = undefined;
            }


            // to start animation add svy-hover-add to start animation and remove at next repaint
            this.renderer.addClass(sidenav, 'svy-hover');
            this.renderer.addClass(sidenav, 'svy-hover-add');
            this.renderer.addClass(sidenav, 'svy-hover-animate');
            window.requestAnimationFrame(() => {
                this.renderer.removeClass(sidenav, 'svy-hover-add');

                // complete hover animation
                this.mouseEnterTimeout = window.setTimeout(() => {
                    this.renderer.removeClass(sidenav, 'svy-hover-animate');
                }, 450);

            });

        }
    };

    private onMouseLeave = () => {
        // only if the menu is collapsed, use the mouseover
        if (this.slideAnimation === 'collapse-menu') {
            const sidenav = this.getNativeElement().querySelector('.svy-sidenav');
            // stop add animation
            if (this.mouseEnterTimeout) {
                this.renderer.removeClass(sidenav, 'svy-hover-add');
                window.clearTimeout(this.mouseEnterTimeout);
                this.mouseEnterTimeout = undefined;
            }

            // start hover remove animation
            this.renderer.addClass(sidenav, 'svy-hover-animate');
            this.renderer.addClass(sidenav, 'svy-hover-remove');
            this.renderer.removeClass(sidenav, 'svy-hover');

            // complete hover animation
            this.mouseLeaveTimeout = window.setTimeout(() => {
                this.renderer.removeClass(sidenav, 'svy-hover-animate');
                this.renderer.removeClass(sidenav, 'svy-hover-remove');
            }, 450);
        }
    };
}
class MenuItem {
    public text: string;
    public id: string;
    public iconStyleClass: string;
    public styleClass: string;
    public enabled: boolean;
    public data: any;
    public menuItems: Array<MenuItem>;
    public isDivider: boolean;
    public tooltip: string;
    public badgeText: string;
    public badgeStyleClass: string;
    public formName: string;
    public relationName: string;
}
