import { Component, SimpleChanges, Renderer2, ChangeDetectorRef, TemplateRef, ElementRef, Inject, DOCUMENT, input, output, contentChild, viewChild, effect, signal } from '@angular/core';
import { ServoyBaseComponent, ServoyPublicService, IJSMenu, IJSMenuItem } from '@servoy/public';

import { LoggerFactory, LoggerService } from '@servoy/public';

@Component({
	selector: 'servoyextra-sidenav',
	templateUrl: './sidenav.html',
	standalone: false
})
export class ServoyExtraSidenav extends ServoyBaseComponent<HTMLDivElement> {

	readonly enabled = input<boolean>(undefined);
	readonly styleClass = input<string>(undefined);
	readonly tabSeq = input<number>(undefined);
	readonly sidenavWidth = input<number>(undefined);
	readonly responsiveHeight = input<number>(undefined);
	readonly containedForm = input<string>(undefined);
	readonly headerForm = input<string>(undefined);
	readonly footerForm = input<string>(undefined);
	readonly relationName = input<string>(undefined);
	readonly iconOpenStyleClass = input<string>(undefined);
	readonly iconCloseStyleClass = input<string>(undefined);
	readonly iconExpandStyleClass = input<string>(undefined);
	readonly iconCollapseStyleClass = input<string>(undefined);
    readonly footerFormStickyBottom = input<boolean>(undefined);

	readonly slidePosition = input<string>(undefined);
	readonly slideAnimation = input<string>(undefined);
	readonly togglePosition = input<string>(undefined);
	readonly scrollbarPosition = input<string>(undefined);
	readonly open = input<boolean>(undefined);
	readonly openChange = output<boolean>();
	readonly animate = input<boolean>(undefined);

	readonly selectedIndex = input<any>(undefined);
	readonly selectedIndexChange = output<any>();
	readonly expandedIndex = input<any>(undefined);
	readonly expandedIndexChange = output<any>();
	readonly menu = input<Array<MenuItem>>(undefined);
	readonly servoyMenu = input<IJSMenu>(undefined);

	readonly onMenuItemSelected = input<(menuItem: any, event: MouseEvent) => Promise<boolean>>(undefined);
	readonly onMenuItemExpanded = input<(menuItem: any, event: MouseEvent) => Promise<boolean>>(undefined);
	readonly onMenuItemCollapsed = input<(menuItem: any, event: MouseEvent) => Promise<boolean>>(undefined);
	readonly onOpenToggled = input<(event: MouseEvent) => void>(undefined);

	readonly templateRef = contentChild(TemplateRef);

    elementRef: ElementRef<HTMLDivElement>;
    readonly elementRefSignal = viewChild<ElementRef<HTMLDivElement>>('element');
    
    _selectedIndex = signal<any>(undefined);
    _expandedIndex = signal<any>(undefined);
    _open = signal<boolean>(undefined);
    _menu = signal<Array<MenuItem>>(undefined);

	animateSlideMenuTimeout: number;
	mouseEnterTimeout: number;
	mouseLeaveTimeout: number;

	public realContainedForm: string;
	private realHeaderForm: any;
	private realFooterForm: any;
	private log: LoggerService;

	constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private servoyPublic: ServoyPublicService, @Inject(DOCUMENT) private doc: Document, logFactory: LoggerFactory) {
		super(renderer, cdRef);
		this.log = logFactory.getLogger('SideNav');
        effect(() => {
            const el = this.elementRefSignal();
            if (el) {
                this.elementRef = el;
            }
        });
	}

	svyOnInit() {
		super.svyOnInit();
        this._selectedIndex.set(this.selectedIndex()??{});
        this._expandedIndex.set(this.expandedIndex()??{});
        this._open.set(this.open());
        this._menu.set(this.menu());
		this.copyServoyMenu();
        const menu = this._menu();
        if (menu && menu.length > 0 && !this.servoyMenu()) {
            this.hasUniqueIds(menu);
        }
	}

	svyOnChanges(changes: SimpleChanges) {
		super.svyOnChanges(changes);
		if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                if (changes.selectedIndex) this._selectedIndex.set(this.selectedIndex()??{});
                if (changes.expandedIndex) this._expandedIndex.set(this.expandedIndex()??{});
                if (changes.open) this._open.set(this.open());
                const selectedIndex = this._selectedIndex();
                const expandedIndex = this._expandedIndex();
                const containedForm = this.containedForm();
                const headerForm = this.headerForm();
                const footerForm = this.footerForm();
                const open = this._open();
                switch (property) {
                    case 'footerFormStickyBottom':
                        this.addRemoveStickyStyle();
                        break;
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
						// do we still need realConttainedForm?
						this.realContainedForm = change.currentValue;
						break;
					case 'relationName':
						// if only relationName is changed while containeForm remain the same, call a formWillShow with the new relation.
						if (!changes.containedForm && containedForm) {
							this.servoyApi.formWillShow(containedForm, this.relationName()).then(() => {
								this.realContainedForm = this.containedForm();
							}).finally(() => this.cdRef.detectChanges());
						}
						if (!changes.headerForm && headerForm) {
							this.servoyApi.formWillShow(headerForm, this.relationName()).then(() => {
								this.realHeaderForm = this.headerForm();
							}).finally(() => this.cdRef.detectChanges());
						}
						if (!changes.footerForm && footerForm) {
							this.servoyApi.formWillShow(footerForm, this.relationName()).then(() => {
								this.realFooterForm = this.footerForm();
							}).finally(() => this.cdRef.detectChanges());
						}
						break; break;
					case 'headerForm':
						if (change.previousValue) {
							this.servoyApi.hideForm(change.previousValue, null, null, this.headerForm(), this.relationName()).then(() => {
								this.realHeaderForm = this.headerForm();
							}).finally(() => this.cdRef.detectChanges());
						} else if (change.currentValue) {
							this.servoyApi.formWillShow(this.headerForm(), this.relationName()).then(() => {
								this.realHeaderForm = this.headerForm();
							}).finally(() => this.cdRef.detectChanges());
						}
						break;
					case 'footerForm':
						if (change.previousValue) {
							this.servoyApi.hideForm(change.previousValue, null, null, this.footerForm(), this.relationName()).then(() => {
								this.realFooterForm = this.footerForm();
							}).finally(() => this.cdRef.detectChanges());
						} else if (change.currentValue) {
							this.servoyApi.formWillShow(this.footerForm(), this.relationName()).then(() => {
								this.realFooterForm = this.footerForm();
							}).finally(() => this.cdRef.detectChanges());
						}
                        this.addRemoveStickyStyle();
						break;
					case 'sidenavWidth':
					case 'responsiveHeight':
						this.updateSidenavStyle();
						break;
					case 'open':
						this.animateMenuHover(open);
						this.animateSlideMenu(open);

						if (open) {
							const footerFormValue = this.footerForm();
                            if (footerFormValue) {
								this.servoyApi.formWillShow(footerFormValue, this.relationName()).then(() => {
									this.realFooterForm = this.footerForm();
								}).finally(() => this.cdRef.detectChanges());
                                this.addRemoveStickyStyle();
							}
							const headerFormValue = this.headerForm();
                            if (headerFormValue) {
								this.servoyApi.formWillShow(headerFormValue, this.relationName()).then(() => {
									this.realHeaderForm = this.headerForm();
								}).finally(() => this.cdRef.detectChanges());
							}
						} else {
							const footerFormValue = this.footerForm();
                            if (footerFormValue) {
								this.servoyApi.hideForm(footerFormValue, null, null, null, this.relationName()).then(() => {
									this.realFooterForm = this.footerForm();
								}).finally(() => this.cdRef.detectChanges());
							}
							const headerFormValue = this.headerForm();
                            if (headerFormValue) {
								this.servoyApi.hideForm(headerFormValue, null, null, null, this.relationName()).then(() => {
									this.realHeaderForm = this.headerForm();
								}).finally(() => this.cdRef.detectChanges());
							}
						}
						break;
					case 'expandedIndex':
						if (!change.currentValue) {
							this._expandedIndex.set({});
						}
						else if (typeof expandedIndex == 'string') {
							this._expandedIndex.set(JSON.parse(expandedIndex));
						}
						break;
					case 'selectedIndex':
						if (!change.currentValue) {
							this._selectedIndex.set({});
						}
						else if (typeof selectedIndex == 'string') {
							this._selectedIndex.set(JSON.parse(selectedIndex));
						}
						break;
					case 'servoyMenu':
						this.copyServoyMenu();
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
			const containedForm = this.containedForm();
            const responsiveHeight = this.responsiveHeight();
            if (responsiveHeight) {
				height = responsiveHeight;
			} else if (containedForm) {
				// for absolute form default height is design height, for responsive form default height is 0
				const formCache = this.servoyPublic.getFormCacheByName(containedForm);
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
		const formCache = this.servoyPublic.getFormCacheByName(this.headerForm());
		if (formCache && formCache.absolute) {
			height = formCache.size.height;
		}
		if (height > 0) {
			style['minHeight'] = height + 'px';
		}
		return style;
	}

	getFooterFormStyle() {
		let style = {}
		let height = 0;

		// for absolute form default height is design height, for responsive form default height is 0
		const formCache = this.servoyPublic.getFormCacheByName(this.footerForm());
		if (formCache && formCache.absolute) {
			height = formCache.size.height;
		}
		if (height > 0) {
			style['minHeight'] = height + 'px';
		}
		return style;
	}

	getSidenavWidth() {
		const sidenavWidth = this.sidenavWidth();
        if (sidenavWidth) {
			// if value is set and there is a responsiveForm or a containedForm. Note should react also if containeForm is set later
			if (!this.servoyApi.isInAbsoluteLayout() || this.containedForm()) {
				return sidenavWidth;
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
		switch (this.slidePosition()) {
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
    
    stickyBottom() {
        return this.servoyApi.isInAbsoluteLayout() && this.footerFormStickyBottom();
    }

    addRemoveStickyStyle() {
        setTimeout(() => {
            const sidenavDiv: HTMLElement = this.getNativeElement().querySelector('.svy-sidenav');
            const footerFormDiv: HTMLElement = this.getNativeElement().querySelector('#footerForm');
            if (this.servoyApi.isInAbsoluteLayout() && this._open()) {
                if (this.footerFormStickyBottom() && footerFormDiv) {
                    const sidenavDivComputedStyle = window.getComputedStyle(sidenavDiv);
                    this.renderer.setStyle(sidenavDiv, 'height', `calc(100% - ${footerFormDiv.clientHeight}px)`);
                    this.renderer.setStyle(footerFormDiv, 'background-color', sidenavDivComputedStyle.getPropertyValue('background-color'));
                    this.renderer.setStyle(footerFormDiv, 'width', sidenavDivComputedStyle.getPropertyValue('width'));
                } else {
                    this.renderer.removeStyle(sidenavDiv, 'height');
                }
            }
        }, 100);
    }

	animateSlideMenu(open: boolean) {
		const slidePosition = this.slidePosition();
        if (slidePosition && slidePosition !== 'static') {
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
					if (this.slideAnimation() === 'slide-menu') {
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
				this.iconCloseStyleClass().split(' ').forEach(element => this.renderer.removeClass(iconOpen, element));
				this.iconOpenStyleClass().split(' ').forEach(element => this.renderer.addClass(iconOpen, element));
			} else {
				if (!svyextracontainer.classList.contains('svy-slide-out')) {
					this.renderer.addClass(sidenav, 'svy-slide-out');
					this.renderer.addClass(svyextracontainer, 'svy-slide-out');
				}
				this.iconOpenStyleClass().split(' ').forEach(element => this.renderer.removeClass(iconOpen, element));
				this.iconCloseStyleClass().split(' ').forEach(element => this.renderer.addClass(iconOpen, element));
			}
		} else {
			this._open.set(true);
			this.openChange.emit(this._open());
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
		if (this.slideAnimation() === 'collapse-menu') {
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
		const wasOpen = this._open();
		this._open.set(this._open() === false ? true : false);
        
        this.addRemoveStickyStyle();

		const open = this._open();
        this.animateMenuHover(open);
		this.animateSlideMenu(open);
		this.openChange.emit(open);

		// event on menu open
		const onOpenToggled = this.onOpenToggled();
        if (onOpenToggled && wasOpen !== open) {
			onOpenToggled(event);
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
		const selectedIndex = this._selectedIndex();
        const isItemAlreadySelected = selectedIndex[level] === item.id && !selectedIndex[level + 1];

		const confirmSelection = () => {
			this.setSelectedIndex(level, index, item);
			const servoyMenu = this.servoyMenu();
            if (servoyMenu) {
				servoyMenu.setSelectedItem(item.id);
			}
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
            const itm = item.menuItems?.length ? item.menuItems[0] : item;
            if (itm.formName && !isItemAlreadySelected) {
                const formToHide = this.containedForm();
                const menuIDToShow = itm.id;
                this.servoyApi.callServerSideApi('showForm', [formToHide, menuIDToShow]);
            }
		};

		const onMenuItemSelected = this.onMenuItemSelected();
        if (preventSelectHandler !== true && onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
            const servoyMenu = this.servoyMenu();
			onMenuItemSelected(servoyMenu ? { svyType: 'JSMenuItem', id: item.id, menuid: servoyMenu.name } : item.id, event).then((result) => {
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
		const onMenuItemExpanded = this.onMenuItemExpanded();
        if (preventHandler !== true && onMenuItemExpanded) { // change selection only if onMenuItemSelected allows it
            const servoyMenu = this.servoyMenu();
			onMenuItemExpanded(servoyMenu ? { svyType: 'JSMenuItem', id: item.id, menuid: servoyMenu.name } : item.id, event).then(() => {
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
		const onMenuItemCollapsed = this.onMenuItemCollapsed();
        if (preventHandler !== true && onMenuItemCollapsed) {
            const servoyMenu = this.servoyMenu();
			onMenuItemCollapsed(servoyMenu ? { svyType: 'JSMenuItem', id: item.id, menuid: servoyMenu.name } : item.id, event).then(() => {
				// if (result == true) {
				this.clearExpandedIndex(level - 1);
				this.expandedIndexChange.emit(JSON.stringify(this._expandedIndex()));
				// }
			}, (err) => { // Error: "Oops something went wrong"
				// TODO use logging instead
				this.log.error(err);
			});
		} else {
			this.clearExpandedIndex(level - 1);
			this.expandedIndexChange.emit(JSON.stringify(this._expandedIndex()));
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
		let nodes = this._menu();
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
		const path = this.getPathToNode(nodeId, this._menu());
		if (path) {
			return path.length;
		} else {
			return null;
		}
	}

	getSelectedNode(level: number): MenuItem {
		const levels = this._selectedIndex();
		let maxLevel = -1;

		// get the node at deeper level
		for (const lvl in levels) {
			if (Number(lvl) > maxLevel && (!level || Number(lvl) <= level)) {
				maxLevel = Number(lvl);
			}
		}

		const nodeId = levels[maxLevel];
		return this.getNodeById(nodeId, this._menu());
	}

	getSelectedIndexPath(level: number): Array<number> {
		const selectedNode = this.getSelectedNode(level);
		const path = this.getPathToNode(selectedNode.id, this._menu());
		return path;
	}

	setSelectedIndex(level: number, _index: number, item: MenuItem) {
		const selectedIndex = this._selectedIndex();
        if (!selectedIndex) this._selectedIndex.set({});
		const levels = selectedIndex;

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
        if (item.menuItems?.length) {
            newSelectedIndex[level + 1] = item.menuItems[0].id; // select first child
        }
		this._selectedIndex.set(newSelectedIndex);
		this.selectedIndexChange.emit(JSON.stringify(newSelectedIndex));
	}

	clearSelectedIndex(level: number) {
		const levels = this._selectedIndex();
		// reset all sub levels
		for (const lvl in levels) {
			if (Number(lvl) > level) { // reset the next levels
				delete levels[lvl];
			}
		}
	}

	setExpandedIndex(level: number, _index: number, item: MenuItem) {
		const expandedIndex = this._expandedIndex();
        if (!expandedIndex) this._expandedIndex.set({});
		const levels = expandedIndex;

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
		this._expandedIndex.set(newExpandedIndex);
		this.expandedIndexChange.emit(JSON.stringify(newExpandedIndex));
	}


	clearExpandedIndex(level: number) {
		const levels = this._expandedIndex();

		// reset all sub levels
		for (const lvl in levels) {
			if (Number(lvl) > level) { // reset the next levels
				delete levels[lvl];
			}
		}
	}

	isDisabled = (nodeId: string | number): boolean => {
		// check if menu itself is disable
		if (this.enabled() === false) {
			return true;
		}

		// TODO refactor: use getNodeAnchestors
		const indexPath = this.getPathToNode(nodeId, this._menu());
		let tree = this._menu();

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
		const levels = this._selectedIndex();
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
		const levels = this._expandedIndex();
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
		const indexPath = this.getPathToNode(nodeId, this._menu());
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
		const node = this.getNodeByIndexPath(path, this._menu());
		const preventSelectHandler = mustExecuteOnSelectNode === true ? false : true;
		this.selectItem(path.length, path[path.length - 1], node, null, preventSelectHandler);
		return;
	}

	public isMenuItemExpanded(menuItemId: string | number): boolean {
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

	public getLocation(nodeId: string | number): { x: number; y: number } {
		const domElement = this.getDOMElementByID(nodeId);
		if (domElement) {
			const position = domElement.getBoundingClientRect();
			return { x: position.left, y: position.top };
		}
		return null;
	}

	public getSize(nodeId: string | number): { width: number; height: number } {
		const domElement = this.getDOMElementByID(nodeId);
		if (domElement) {
			const position = domElement.getBoundingClientRect();
			return { width: position.width, height: position.height };
		}
		return null;
	}

	private onMouseEnter = () => {
		// only if the menu is collapsed, use the mouseover
		if (this.slideAnimation() === 'collapse-menu') {
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
		if (this.slideAnimation() === 'collapse-menu') {
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

	private copyServoyMenu() {
		const servoyMenu = this.servoyMenu();
        if (servoyMenu) {
			this._selectedIndex.set({});
            const expandedIndex = this._expandedIndex();
            if (expandedIndex && typeof expandedIndex == 'string') {
                this._expandedIndex.set(JSON.parse(expandedIndex));
            }
			const selectedNode = {};
			const oldMenu = new Array();
			if (servoyMenu.items) {
				for (let i = 0; i < servoyMenu.items.length; i++) {
					this.copyServoyMenuItem(oldMenu, servoyMenu.items[i], 1, selectedNode);
				}
			}
			this._menu.set(oldMenu);
			const selection = Object.keys(selectedNode);
			if (selection && selection.length == 1) {
				this.updateSelectedNode(selectedNode[selection[0]], this._menu(), parseInt(selection[0]));
			}
			this.selectedIndexChange.emit(JSON.stringify(this._selectedIndex()));
		}
	}

	private copyServoyMenuItem(destination: Array<MenuItem>, source: IJSMenuItem, level: number, selectedNode: any) {
		const menuItem = {} as MenuItem;
		menuItem.text = source.menuText;
		menuItem.id = source.itemID;
		menuItem.iconStyleClass = source.iconStyleClass;
		menuItem.styleClass = source.styleClass;
		menuItem.enabled = source.enabled;
		menuItem.data = source.extraProperties?.Sidenav?.data;
		menuItem.isDivider = source.extraProperties?.Sidenav?.isDivider;
		menuItem.tooltip = source.tooltipText;
		menuItem.badgeText = source.extraProperties?.Sidenav?.badgeText;
		menuItem.badgeStyleClass = source.extraProperties?.Sidenav?.badgeStyleClass;
		menuItem.formName = source.extraProperties?.Sidenav?.formName;
		menuItem.relationName = source.extraProperties?.Sidenav?.relationName;
		if (source.isSelected) {
			selectedNode[level] = source.itemID;
		}
		if (source.items && source.items.length > 0) {
			menuItem.menuItems = new Array();
			for (let i = 0; i < source.items.length; i++) {
				this.copyServoyMenuItem(menuItem.menuItems, source.items[i], level + 1, selectedNode);
			}
		}
		destination.push(menuItem);
	}

	updateSelectedNode(nodeId: string, nodes: Array<MenuItem>, level: number) {
		if (nodes) {
			for (let i = 0; i < nodes.length; i++) {
				const subTree = nodes[i];
				if (subTree.id === nodeId) {
					this.selectItem(level, i, subTree, null, true, true);
					return;
				}
				this.updateSelectedNode(nodeId, subTree.menuItems, level);
			}
		}
	}
    
    hasUniqueIds(menu: MenuItem[]): boolean {
        const duplicateIds = this.findDuplicateIds(menu);
        if (duplicateIds.length > 0) {
            const formName = this.servoyApi.getFormName();
            console.warn("In form " + String(formName) + ", the sidenav component contains duplicate IDs: " + duplicateIds.join(', ') + ". IDs must be unique for proper functioning of the component.");
            return false;
        }
        return true;
    }

    private findDuplicateIds(menuItems: MenuItem[]): string[] {
        const allIds = new Set<string>();
        const duplicates = new Set<string>();
        const checkItems = (menuItems: MenuItem[]): void => {
            for (const item of menuItems) {
                if (item.id) {
                    if (allIds.has(item.id)) {
                        duplicates.add(item.id);
                    } else {
                        allIds.add(item.id);
                    }
                }
                if (item.menuItems?.length) {
                    checkItems(item.menuItems);
                }
            }
        };
        checkItems(menuItems);
        return Array.from(duplicates);
    }
}
export class MenuItem {
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
