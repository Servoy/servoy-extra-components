import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSidenav, MenuItem } from './sidenav';

describe('ServoyExtraSidenav', () => {
    let fixture: ComponentFixture<ServoyExtraSidenav>;
    let component: ServoyExtraSidenav;
    let testMenu: MenuItem[];

    beforeEach(async () => {
        testMenu = [
            {
                id: 'dashboard',
                text: 'Dashboard',
                iconStyleClass: 'fas fa-home',
                enabled: true,
                formName: 'dashboardForm',
                tooltip: 'Go to Dashboard',
                badgeText: '99+',
                badgeStyleClass: 'badge text-bg-secondary'
            } as unknown as MenuItem,
            {
                id: 'users',
                text: 'Users',
                iconStyleClass: 'fas fa-users',
                enabled: true,
                badgeText: '5',
                badgeStyleClass: 'badge text-bg-primary',
                menuItems: [
                    {
                        id: 'user_list',
                        text: 'User List',
                        formName: 'userListForm',
                        iconStyleClass: 'fas fa-list',
                        enabled: true
                    } as unknown as MenuItem,
                    {
                        id: 'user_groups',
                        text: 'User Groups',
                        formName: 'userGroupsForm',
                        iconStyleClass: 'fas fa-user-friends',
                        enabled: true
                    } as unknown as MenuItem
                ]
            } as unknown as MenuItem,
            {
                id: 'divider1',
                isDivider: true,
                text: '',
                enabled: true
            } as unknown as MenuItem,
            {
                id: 'settings',
                text: 'Settings',
                iconStyleClass: 'fas fa-cog',
                enabled: false,
                tooltip: 'System Settings',
                menuItems: [
                    {
                        id: 'general',
                        text: 'General',
                        formName: 'generalSettingsForm',
                        enabled: true
                    } as unknown as MenuItem,
                    {
                        id: 'security',
                        text: 'Security',
                        formName: 'securitySettingsForm',
                        badgeText: 'New',
                        badgeStyleClass: 'badge text-bg-warning',
                        enabled: true
                    } as unknown as MenuItem
                ]
            } as unknown as MenuItem
        ];

        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraSidenav],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraSidenav);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('styleClass', 'sidenav-test');
        fixture.componentRef.setInput('open', true);
        fixture.componentRef.setInput('responsiveHeight', 400);
        fixture.componentRef.setInput('menu', testMenu);
        fixture.componentRef.setInput('slidePosition', 'left');
        fixture.componentRef.setInput('slideAnimation', 'slide-menu');
        fixture.componentRef.setInput('iconOpenStyleClass', 'custom-open');
        fixture.componentRef.setInput('iconCloseStyleClass', 'custom-close');
        fixture.componentRef.setInput('iconExpandStyleClass', 'custom-expand');
        fixture.componentRef.setInput('iconCollapseStyleClass', 'custom-collapse');
        fixture.componentRef.setInput('animate', false);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create the component', async () => {
        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.svy-sidenav')).toBeTruthy();
    });

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('should apply style class to svy-sidenav', async () => {
        const sidenav = fixture.nativeElement.querySelector('.svy-sidenav');
        expect(sidenav.classList.contains('sidenav-test')).toBe(true);
    });

    it('should apply multiple style classes', async () => {
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        const sidenav = fixture.nativeElement.querySelector('.svy-sidenav');
        expect(sidenav.classList.contains('classA')).toBe(true);
        expect(sidenav.classList.contains('classB')).toBe(true);
    });

    it('should remove style class when set to empty', async () => {
        fixture.componentRef.setInput('styleClass', '');
        fixture.detectChanges();
        const sidenav = fixture.nativeElement.querySelector('.svy-sidenav');
        expect(sidenav.classList.contains('sidenav-test')).toBe(false);
    });

    it('should apply slidePosition class', async () => {
        const sidenav = fixture.nativeElement.querySelector('.svy-sidenav');
        expect(sidenav.classList.contains('svy-sidenav-left')).toBe(true);

        fixture.componentRef.setInput('slidePosition', 'right');
        fixture.detectChanges();
        expect(sidenav.classList.contains('svy-sidenav-right')).toBe(true);
        expect(sidenav.classList.contains('svy-sidenav-left')).toBe(false);
    });

    it('should apply slideAnimation class', async () => {
        const sidenav = fixture.nativeElement.querySelector('.svy-sidenav');
        expect(sidenav.classList.contains('nav-slide-menu')).toBe(true);

        fixture.componentRef.setInput('slideAnimation', 'collapse-menu');
        fixture.detectChanges();
        expect(sidenav.classList.contains('nav-collapse-menu')).toBe(true);
        expect(sidenav.classList.contains('nav-slide-menu')).toBe(false);
    });

    it('should render menu items', async () => {
        const items = fixture.nativeElement.querySelectorAll('.svy-sidenav-item-text');
        expect(items.length).toBeGreaterThan(0);
        expect(items[0].textContent).toContain('Dashboard');
    });

    it('should render divider items', async () => {
        const dividers = fixture.nativeElement.querySelectorAll('.svy-sidenav-divider');
        expect(dividers.length).toBeGreaterThan(0);
    });

    it('should show badge text', async () => {
        const badge = fixture.nativeElement.querySelector('.badge.text-bg-secondary');
        expect(badge).toBeTruthy();
        expect(badge.textContent).toContain('99+');
    });

    it('should disable nav when enabled is false', async () => {
        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        const nav = fixture.nativeElement.querySelector('nav');
        expect(nav.classList.contains('svy-sidenav-disabled')).toBe(true);
        expect(nav.getAttribute('disabled')).toBe('disabled');
    });

    it('should re-enable nav when enabled is set back to true', async () => {
        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        fixture.componentRef.setInput('enabled', true);
        fixture.detectChanges();
        const nav = fixture.nativeElement.querySelector('nav');
        expect(nav.classList.contains('svy-sidenav-disabled')).toBe(false);
        expect(nav.getAttribute('disabled')).toBeNull();
    });

    it('should apply custom icon open class', async () => {
        const icon = fixture.nativeElement.querySelector('.svy-sidenav-action-open');
        expect(icon.classList.contains('custom-open')).toBe(true);
    });

    it('should show expand icon for items with sub-menu', async () => {
        const collapseIcons = fixture.nativeElement.querySelectorAll('.svy-sidenav-collapse-icon.sn-level-1');
        const usersIcon = collapseIcons[1];
        expect(usersIcon.classList.contains('custom-expand')).toBe(true);
    });

    it('should show collapse icon when item is expanded', async () => {
        fixture.componentRef.setInput('expandedIndex', JSON.stringify({ 1: 'users' }));
        fixture.detectChanges();
        const collapseIcons = fixture.nativeElement.querySelectorAll('.svy-sidenav-collapse-icon.sn-level-1');
        const usersIcon = collapseIcons[1];
        expect(usersIcon.classList.contains('custom-collapse')).toBe(true);
    });

    it('should show sub-menu items when expanded', async () => {
        expect(fixture.nativeElement.querySelector('.svy-sidenav-item.sn-level-2')).toBeNull();
        fixture.componentRef.setInput('expandedIndex', JSON.stringify({ 1: 'users' }));
        fixture.detectChanges();
        const subItems = fixture.nativeElement.querySelectorAll('.svy-sidenav-item.sn-level-2');
        expect(subItems.length).toBe(2);
    });

    it('should reflect selectedIndex in DOM', async () => {
        const firstDropdown = fixture.nativeElement.querySelector('.svy-sidenav-dropdown.sn-level-1');
        expect(firstDropdown.classList.contains('svy-navitem-selected')).toBe(false);
        fixture.componentRef.setInput('selectedIndex', JSON.stringify({ 1: 'dashboard' }));
        fixture.detectChanges();
        expect(firstDropdown.classList.contains('svy-navitem-selected')).toBe(true);
    });

    it('should update rendered items when menu input changes', async () => {
        expect(fixture.nativeElement.textContent).toContain('Dashboard');
        fixture.componentRef.setInput('menu', [{ id: 'home', text: 'Home', enabled: true } as MenuItem]);
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Home');
        expect(fixture.nativeElement.textContent).not.toContain('Dashboard');
    });

    it('should not select disabled menu items', async () => {
        const event = new MouseEvent('click');
        const result = component.selectItem(1, 3, testMenu[3], event);
        expect(result).toBe(false);
    });

    it('should call onMenuItemSelected handler on selectItem', async () => {
        const spy = vi.fn().mockResolvedValue(true);
        fixture.componentRef.setInput('onMenuItemSelected', spy);
        fixture.detectChanges();
        const event = new MouseEvent('click');
        component.selectItem(1, 0, testMenu[0], event);
        expect(spy).toHaveBeenCalled();
    });

    it('should call onOpenToggled handler on slideMenu', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('open', false);
        fixture.componentRef.setInput('onOpenToggled', spy);
        fixture.detectChanges();
        const event = new MouseEvent('click');
        component.slideMenu(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit openChange on slideMenu', async () => {
        const spy = vi.fn();
        component.openChange.subscribe(spy);
        fixture.componentRef.setInput('open', false);
        fixture.detectChanges();
        const event = new MouseEvent('click');
        component.slideMenu(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should call onMenuItemExpanded handler on expandItem', async () => {
        const spy = vi.fn().mockResolvedValue(true);
        fixture.componentRef.setInput('onMenuItemExpanded', spy);
        fixture.detectChanges();
        const event = new MouseEvent('click');
        component.expandItem(1, 1, testMenu[1], event);
        expect(spy).toHaveBeenCalled();
    });

    it('should call onMenuItemCollapsed handler on collapseItem', async () => {
        const spy = vi.fn().mockResolvedValue(true);
        fixture.componentRef.setInput('onMenuItemCollapsed', spy);
        fixture.detectChanges();
        component._expandedIndex.set({ 1: 'users' });
        const event = new MouseEvent('click');
        component.collapseItem(1, 1, testMenu[1], event);
        expect(spy).toHaveBeenCalled();
    });

    it('should mark disabled items with svy-navitem-disabled class', async () => {
        const items = fixture.nativeElement.querySelectorAll('.svy-sidenav-dropdown.sn-level-1');
        const settingsItem = items[3];
        expect(settingsItem.classList.contains('svy-navitem-disabled')).toBe(true);
    });

    it('should report isMenuItemEnabled correctly', async () => {
        expect(component.isMenuItemEnabled('dashboard')).toBe(true);
        expect(component.isMenuItemEnabled('settings')).toBe(false);
    });

    it('should report isMenuItemExpanded correctly', async () => {
        expect(component.isMenuItemExpanded('users')).toBe(false);
        component._expandedIndex.set({ 1: 'users' });
        expect(component.isMenuItemExpanded('users')).toBe(true);
    });

    it('should get node by id', async () => {
        const node = component.getNodeById('user_list', testMenu);
        expect(node).toBeTruthy();
        expect(node.text).toBe('User List');
    });

    it('should get node by index path', async () => {
        const node = component.getNodeByIndexPath([1, 0], testMenu);
        expect(node).toBeTruthy();
        expect(node.id).toBe('user_list');
    });

    it('should get path to node', async () => {
        const path = component.getPathToNode('user_groups', testMenu);
        expect(path).toEqual([1, 1]);
    });

    it('should detect duplicate ids', async () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const dupeMenu = [
            { id: 'a', text: 'A', enabled: true },
            { id: 'a', text: 'A2', enabled: true }
        ] as MenuItem[];
        expect(component.hasUniqueIds(dupeMenu)).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('duplicate IDs'));
        consoleSpy.mockRestore();
    });

    it('should pass unique id check with valid menu', async () => {
        expect(component.hasUniqueIds(testMenu)).toBe(true);
    });

    describe('autoSelectFirstChildNode (SVY-21389)', () => {
        it('should default autoSelectFirstChildNode to false when input not set', () => {
            expect(component.autoSelectFirstChildNode()).toBe(false);
        });

        it('should NOT mark the first child when autoSelectFirstChildNode is false (default)', () => {
            const event = new MouseEvent('click');
            component.selectItem(1, 1, testMenu[1], event);

            const selected = component['_selectedIndex']();
            expect(selected[1]).toBe('users');
            expect(selected[2]).toBeUndefined();
        });

        it('should mark the first child when autoSelectFirstChildNode is true', async () => {
            fixture.componentRef.setInput('autoSelectFirstChildNode', true);
            fixture.detectChanges();
            await fixture.whenStable();

            const event = new MouseEvent('click');
            component.selectItem(1, 1, testMenu[1], event);

            const selected = component['_selectedIndex']();
            expect(selected[1]).toBe('users');
            expect(selected[2]).toBe('user_list');
        });

        it('should NOT auto-show the first child form when autoSelectFirstChildNode is false (default)', () => {
            const servoyApi = component.servoyApi();
            const spy = vi.spyOn(servoyApi, 'callServerSideApi');
            const event = new MouseEvent('click');

            component.selectItem(1, 1, testMenu[1], event);

            const showFormCalls = spy.mock.calls.filter(c => c[0] === 'showForm');
            expect(showFormCalls.length).toBe(0);
            spy.mockRestore();
        });

        it('should auto-show the first child form when autoSelectFirstChildNode is true', async () => {
            fixture.componentRef.setInput('autoSelectFirstChildNode', true);
            fixture.detectChanges();
            await fixture.whenStable();

            const servoyApi = component.servoyApi();
            const spy = vi.spyOn(servoyApi, 'callServerSideApi');
            const event = new MouseEvent('click');

            component.selectItem(1, 1, testMenu[1], event);

            expect(spy).toHaveBeenCalledWith('showForm', [undefined, 'user_list']);
            spy.mockRestore();
        });

        it('should fire onMenuItemSelected only for the clicked node when autoSelectFirstChildNode is false', async () => {
            const spy = vi.fn().mockResolvedValue(true);
            fixture.componentRef.setInput('onMenuItemSelected', spy);
            fixture.detectChanges();

            const event = new MouseEvent('click');
            component.selectItem(1, 1, testMenu[1], event);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('users', event);
        });

        it('should fire onMenuItemSelected only for the clicked node when autoSelectFirstChildNode is true', async () => {
            const spy = vi.fn().mockResolvedValue(true);
            fixture.componentRef.setInput('onMenuItemSelected', spy);
            fixture.componentRef.setInput('autoSelectFirstChildNode', true);
            fixture.detectChanges();

            const event = new MouseEvent('click');
            component.selectItem(1, 1, testMenu[1], event);

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith('users', event);
        });

        it('should not apply svy-navitem-selected to the first child when autoSelectFirstChildNode is false', async () => {
            fixture.componentRef.setInput('expandedIndex', JSON.stringify({ 1: 'users' }));
            fixture.detectChanges();

            const event = new MouseEvent('click');
            component.selectItem(1, 1, testMenu[1], event);
            fixture.detectChanges();
            await fixture.whenStable();

            const subItems = fixture.nativeElement.querySelectorAll('.svy-sidenav-dropdown.sn-level-2');
            const selectedChildren = Array.from(subItems).filter((el: any) => el.classList.contains('svy-navitem-selected'));
            expect(selectedChildren.length).toBe(0);
        });

        it('should apply svy-navitem-selected to the first child when autoSelectFirstChildNode is true', async () => {
            fixture.componentRef.setInput('autoSelectFirstChildNode', true);
            fixture.componentRef.setInput('expandedIndex', JSON.stringify({ 1: 'users' }));
            fixture.detectChanges();

            const event = new MouseEvent('click');
            component.selectItem(1, 1, testMenu[1], event);
            fixture.detectChanges();
            await fixture.whenStable();

            const subItems = fixture.nativeElement.querySelectorAll('.svy-sidenav-dropdown.sn-level-2');
            const selectedChildren = Array.from(subItems).filter((el: any) => el.classList.contains('svy-navitem-selected'));
            expect(selectedChildren.length).toBe(1);
        });

        it('should leave leaf-node selection unchanged regardless of the flag', () => {
            const event = new MouseEvent('click');
            component.selectItem(1, 0, testMenu[0], event);

            const selected = component['_selectedIndex']();
            expect(selected[1]).toBe('dashboard');
            expect(selected[2]).toBeUndefined();
        });
    });

    describe('isHeading non-interactive section labels (SVY-21636)', () => {
        let headingMenu: MenuItem[];

        beforeEach(async () => {
            headingMenu = [
                {
                    id: 'sales_heading',
                    text: 'SALES',
                    isHeading: true,
                    enabled: true,
                    menuItems: [
                        {
                            id: 'leads',
                            text: 'Leads',
                            formName: 'leadsForm',
                            enabled: true
                        } as unknown as MenuItem,
                        {
                            id: 'orders',
                            text: 'Orders',
                            formName: 'ordersForm',
                            enabled: true
                        } as unknown as MenuItem
                    ]
                } as unknown as MenuItem,
                {
                    id: 'catalog_heading',
                    text: 'CATALOG',
                    isHeading: true,
                    enabled: true,
                    menuItems: [
                        {
                            id: 'products',
                            text: 'Products',
                            formName: 'productsForm',
                            enabled: true
                        } as unknown as MenuItem
                    ]
                } as unknown as MenuItem
            ];

            fixture.componentRef.setInput('menu', headingMenu);
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should render a heading item without an anchor', () => {
            const headings = fixture.nativeElement.querySelectorAll('.svy-sidenav-heading.sn-level-1');
            expect(headings.length).toBe(2);
            expect(headings[0].querySelector('a')).toBeNull();
            expect(headings[0].textContent).toContain('SALES');
        });

        it('should not render a collapse/expand caret for a heading item', () => {
            const headings = fixture.nativeElement.querySelectorAll('.svy-sidenav-heading.sn-level-1');
            expect(headings[0].querySelector('.svy-sidenav-collapse-icon')).toBeNull();
        });

        it('should show all children of a heading without requiring expandedIndex', () => {
            const subItems = fixture.nativeElement.querySelectorAll('.svy-sidenav-item.sn-level-2');
            // 2 children under SALES + 1 under CATALOG, all visible without any expandedIndex set
            expect(subItems.length).toBe(3);
        });

        it('should not select a heading item on selectItem', () => {
            const event = new MouseEvent('click');
            const result = component.selectItem(1, 0, headingMenu[0], event);
            expect(result).toBe(false);

            const selected = component['_selectedIndex']();
            expect(selected[1]).toBeUndefined();
        });

        it('isNodeExpanded/isMenuItemExpanded should always report a heading as expanded', () => {
            // a heading is always considered expanded regardless of _expandedIndex content
            // (code review follow-up: visibility must not depend only on the template @if).
            expect(component.isMenuItemExpanded('sales_heading')).toBe(true);
            expect(component.isMenuItemExpanded('catalog_heading')).toBe(true);
        });

        it('expandItem on a heading item is a no-op that reports already-expanded (true)', () => {
            const event = new MouseEvent('click');
            // isNodeExpanded short-circuits true for a heading, so expandItem's "already expanded"
            // guard returns true without touching _expandedIndex - it never falls through to the
            // isHeading-disabled branch.
            expect(component.expandItem(1, 0, headingMenu[0], event)).toBe(true);
            expect(component.isMenuItemExpanded('sales_heading')).toBe(true);
        });

        it('collapseItem cannot collapse a heading item, regardless of _expandedIndex content', () => {
            const event = new MouseEvent('click');
            expect(component.collapseItem(1, 0, headingMenu[0], event)).toBe(false);
            expect(component.isMenuItemExpanded('sales_heading')).toBe(true);

            component._expandedIndex.set({ 1: 'sales_heading' });
            expect(component.collapseItem(1, 0, headingMenu[0], event)).toBe(false);
            expect(component.isMenuItemExpanded('sales_heading')).toBe(true);
        });

        it('a heading\'s children stay visible (svy-sidenav-collapsed applied) on first render, with no expandedIndex set', () => {
            // code review: the @if gated the <ul> rendering, but [class.svy-sidenav-collapsed]
            // must ALSO apply for a heading, or .svy-sidenav-menu's display:none hides the
            // children even though the <ul> is in the DOM.
            const salesList = fixture.nativeElement.querySelector('ul.svy-sidenav-menu.sn-level-2');
            expect(salesList).toBeTruthy();
            expect(salesList.classList.contains('svy-sidenav-collapsed')).toBe(true);
        });

        it('selecting a leaf under one heading leaves the other heading\'s children visible (allowMultipleExpanded off, default)', async () => {
            expect(component.allowMultipleExpanded()).toBe(false);

            const event = new MouseEvent('click');
            // select a leaf under the SALES heading; with allowMultipleExpanded false,
            // setExpandedIndex used to rebuild _expandedIndex from this leaf's ancestors only,
            // which (pre-fix) made CATALOG's children disappear since they are not an ancestor.
            component.selectItem(2, 0, headingMenu[0].menuItems[0], event);
            fixture.detectChanges();
            await fixture.whenStable();

            const catalogList = fixture.nativeElement.querySelectorAll('ul.svy-sidenav-menu.sn-level-2')[1];
            expect(catalogList).toBeTruthy();
            expect(catalogList.classList.contains('svy-sidenav-collapsed')).toBe(true);
            const catalogChildren = catalogList.querySelectorAll('.svy-sidenav-item.sn-level-2');
            expect(catalogChildren.length).toBe(1);
        });
    });

    describe('autoSelectFirstChildNode skips a heading used as first child (SVY-21636 code review)', () => {
        let menuWithHeadingFirstChild: MenuItem[];

        beforeEach(async () => {
            menuWithHeadingFirstChild = [
                {
                    id: 'parent',
                    text: 'Parent',
                    enabled: true,
                    menuItems: [
                        {
                            id: 'group_heading',
                            text: 'GROUP',
                            isHeading: true,
                            enabled: true
                        } as unknown as MenuItem,
                        {
                            id: 'first_real_child',
                            text: 'First real child',
                            formName: 'firstRealChildForm',
                            enabled: true
                        } as unknown as MenuItem
                    ]
                } as unknown as MenuItem
            ];

            fixture.componentRef.setInput('menu', menuWithHeadingFirstChild);
            fixture.componentRef.setInput('autoSelectFirstChildNode', true);
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('should select the first non-heading child, not the heading, as the auto-selected child', () => {
            const event = new MouseEvent('click');
            component.selectItem(1, 0, menuWithHeadingFirstChild[0], event);

            const selected = component['_selectedIndex']();
            expect(selected[2]).toBe('first_real_child');
        });

        it('should auto-show the first non-heading child\'s form, not the heading', () => {
            const servoyApi = component.servoyApi();
            const spy = vi.spyOn(servoyApi, 'callServerSideApi');
            const event = new MouseEvent('click');

            component.selectItem(1, 0, menuWithHeadingFirstChild[0], event);

            expect(spy).toHaveBeenCalledWith('showForm', [undefined, 'first_real_child']);
            spy.mockRestore();
        });
    });

    describe('servoyMenu once-per-second NG0100 loop (SVY-21654)', () => {
        // Build a minimal IJSMenu where 'customers' is the server-selected item, reproducing the
        // reporter's {"1":"customers"} selection derived purely from the server menu.
        const makeServoyMenu = (): any => ({
            name: 'mainMenu',
            styleClass: '',
            items: [
                { itemID: 'home', menuText: 'Home', enabled: true, isSelected: false, items: [] },
                { itemID: 'customers', menuText: 'Customers', enabled: true, isSelected: true, items: [] },
                { itemID: 'orders', menuText: 'Orders', enabled: true, isSelected: false, items: [] }
            ],
            setSelectedItem: vi.fn(),
            pushDataProviderValue: vi.fn()
        });

        // Simulate one server model sync: a servoyMenu push flowing through svyOnChanges, which
        // schedules copyServoyMenu() in a microtask (Promise.resolve().then) exactly like runtime.
        const syncServoyMenu = async (menu: any) => {
            fixture.componentRef.setInput('servoyMenu', menu);
            component.svyOnChanges({
                servoyMenu: { currentValue: menu, previousValue: undefined, firstChange: false, isFirstChange: () => false }
            } as any);
            // let the microtask (copyServoyMenu) run
            await Promise.resolve();
            await fixture.whenStable();
        };

        let originalCreateJSEvent: typeof component.createJSEvent;

        beforeEach(async () => {
            // the loop is the servoyMenu-driven path, so drop the plain menu input
            fixture.componentRef.setInput('menu', undefined);
            fixture.detectChanges();
            await fixture.whenStable();
            // copyServoyMenu re-selects via selectItem(..., null event), which calls createJSEvent();
            // jsdom's initMouseEvent rejects the global window arg, so return a plain click event
            // (restore afterwards) to exercise the real re-derivation path without that jsdom quirk.
            originalCreateJSEvent = component.createJSEvent;
            component.createJSEvent = () => new MouseEvent('click');
        });

        afterEach(() => {
            component.createJSEvent = originalCreateJSEvent;
        });

        it('should not throw NG0100 across repeated identical servoyMenu syncs', async () => {
            await syncServoyMenu(makeServoyMenu());

            // the server selection must be reflected (SVY-21634 preserved)
            expect(component['_selectedIndex']()).toEqual({ 1: 'customers' });

            // repeated identical syncs (the ~1 Hz loop) plus CD must not throw ExpressionChanged
            for (let i = 0; i < 5; i++) {
                await syncServoyMenu(makeServoyMenu());
                expect(() => fixture.detectChanges()).not.toThrow();
                // rendered selection stays stable across every sync
                expect(component['_selectedIndex']()).toEqual({ 1: 'customers' });
            }
        });

        it('should NOT emit selectedIndexChange for the server-originated selection', async () => {
            const emitSpy = vi.fn();
            component.selectedIndexChange.subscribe(emitSpy);

            await syncServoyMenu(makeServoyMenu());
            // repeated syncs must not echo the server value back over the two-way channel
            for (let i = 0; i < 4; i++) {
                await syncServoyMenu(makeServoyMenu());
            }

            expect(emitSpy).not.toHaveBeenCalled();
        });

        it('should still emit selectedIndexChange for a genuine user selection', async () => {
            await syncServoyMenu(makeServoyMenu());

            const emitSpy = vi.fn();
            component.selectedIndexChange.subscribe(emitSpy);

            // a real user click on a different node goes through setSelectedIndex and must emit
            const event = new MouseEvent('click');
            component.selectItem(1, 2, component['_menu']()![2], event, true);

            expect(emitSpy).toHaveBeenCalled();
            expect(component['_selectedIndex']()).toEqual({ 1: 'orders' });
        });

        it('should keep a server-selected parent with children expanded across repeated syncs (no expand/collapse toggle)', async () => {
            const makeParentMenu = (): any => ({
                name: 'mainMenu',
                styleClass: '',
                items: [
                    {
                        itemID: 'parent', menuText: 'Parent', enabled: true, isSelected: true,
                        items: [{ itemID: 'child', menuText: 'Child', enabled: true, isSelected: false, items: [] }]
                    }
                ],
                setSelectedItem: vi.fn(),
                pushDataProviderValue: vi.fn()
            });
            const collapseSpy = vi.spyOn(component, 'collapseItem');

            for (let i = 0; i < 5; i++) {
                await syncServoyMenu(makeParentMenu());
                // the re-derived server selection must never collapse the node
                expect(collapseSpy).not.toHaveBeenCalled();
                expect(component.isMenuItemExpanded('parent')).toBe(true);
            }
        });

        it('should keep a stable _selectedIndex reference across syncs for an autoSelectFirstChildNode parent', async () => {
            fixture.componentRef.setInput('autoSelectFirstChildNode', true);
            const makeParentMenu = (): any => ({
                name: 'mainMenu',
                styleClass: '',
                items: [
                    {
                        itemID: 'parent', menuText: 'Parent', enabled: true, isSelected: true,
                        items: [{ itemID: 'child', menuText: 'Child', enabled: true, isSelected: false, items: [] }]
                    }
                ],
                setSelectedItem: vi.fn(),
                pushDataProviderValue: vi.fn()
            });

            await syncServoyMenu(makeParentMenu());
            await syncServoyMenu(makeParentMenu());
            const settled = component['_selectedIndex']();
            expect(settled).toEqual({ 1: 'parent', 2: 'child' });

            // further identical syncs must leave the very same object in the signal (no churn)
            for (let i = 0; i < 3; i++) {
                await syncServoyMenu(makeParentMenu());
                expect(component['_selectedIndex']()).toBe(settled);
            }
        });

        it('should still collapse a selected, expanded parent on a genuine user re-click', async () => {
            const menu: any = {
                name: 'mainMenu',
                styleClass: '',
                items: [
                    {
                        itemID: 'parent', menuText: 'Parent', enabled: true, isSelected: true,
                        items: [{ itemID: 'child', menuText: 'Child', enabled: true, isSelected: false, items: [] }]
                    }
                ],
                setSelectedItem: vi.fn(),
                pushDataProviderValue: vi.fn()
            };
            await syncServoyMenu(menu);
            expect(component.isMenuItemExpanded('parent')).toBe(true);

            // user clicks the already selected + expanded parent again: toggle (collapse) must still work
            component.selectItem(1, 0, component['_menu']()![0], new MouseEvent('click'), true, true);
            expect(component.isMenuItemExpanded('parent')).toBe(false);
        });

        // SVY-21634: a servoyMenu where NO item is isSelected, but the server also pushed the
        // two-way selectedIndex string. The copyServoyMenu no-isSelected branch must keep the
        // seeded selection instead of clearing it to {}. Distinct from the tests above which
        // hand-set isSelected:true on 'customers'.
        const makeUnselectedServoyMenu = (): any => ({
            name: 'mainMenu',
            styleClass: '',
            items: [
                { itemID: 'home', menuText: 'Home', enabled: true, isSelected: false, items: [] },
                { itemID: 'customers', menuText: 'Customers', enabled: true, isSelected: false, items: [] },
                { itemID: 'orders', menuText: 'Orders', enabled: true, isSelected: false, items: [] }
            ],
            setSelectedItem: vi.fn(),
            pushDataProviderValue: vi.fn()
        });

        it('should keep the onLoad-seeded selection when the servoyMenu has no isSelected item (SVY-21634)', async () => {
            // onLoad set the two-way selectedIndex string before the component existed; the runtime
            // seeds it in svyOnInit (parsed by parseIndex). The menu itself carries no isSelected.
            fixture.componentRef.setInput('selectedIndex', JSON.stringify({ 1: 'customers' }));
            component.svyOnInit();

            await syncServoyMenu(makeUnselectedServoyMenu());
            fixture.detectChanges();

            // the seeded selection must survive copyServoyMenu's no-isSelected branch, not be wiped to {}
            expect(component['_selectedIndex']()).toEqual({ 1: 'customers' });

            const items = fixture.nativeElement.querySelectorAll('.svy-sidenav-dropdown.sn-level-1');
            const customersItem = Array.from(items).find((el: any) => el.textContent.includes('Customers')) as HTMLElement;
            expect(customersItem.classList.contains('svy-navitem-selected')).toBe(true);
        });

        // SVY-21634 review follow-up: the no-isSelected branch must not leave a stale selection behind
        // when the rebuilt servoyMenu no longer contains the item the selection points to.
        const makeMenuWithout = (...ids: string[]): any => ({
            name: 'mainMenu',
            styleClass: '',
            items: ids.map(id => ({ itemID: id, menuText: id, enabled: true, isSelected: false, items: [] })),
            setSelectedItem: vi.fn(),
            pushDataProviderValue: vi.fn()
        });

        it('should clear the selection when the rebuilt servoyMenu no longer contains the selected item', async () => {
            await syncServoyMenu(makeServoyMenu());
            expect(component['_selectedIndex']()).toEqual({ 1: 'customers' });

            // the server swaps in a menu without 'customers' and without any isSelected item
            await syncServoyMenu(makeMenuWithout('home', 'orders'));
            fixture.detectChanges();

            expect(component['_selectedIndex']()).toEqual({});
            const selected = fixture.nativeElement.querySelectorAll('.svy-navitem-selected');
            expect(selected.length).toBe(0);
        });

        it('should keep the selection when the rebuilt servoyMenu still contains the selected item', async () => {
            await syncServoyMenu(makeServoyMenu());
            expect(component['_selectedIndex']()).toEqual({ 1: 'customers' });

            // same item still present, none flagged isSelected: the seeded selection survives (SVY-21634)
            await syncServoyMenu(makeMenuWithout('home', 'customers', 'orders'));

            expect(component['_selectedIndex']()).toEqual({ 1: 'customers' });
        });

        it('should show the form of a re-added item after its selection was dropped with the menu', async () => {
            await syncServoyMenu(makeServoyMenu());
            await syncServoyMenu(makeMenuWithout('home', 'orders'));
            expect(component['_selectedIndex']()).toEqual({});

            const menu = makeMenuWithout('home', 'customers', 'orders');
            menu.items[1].extraProperties = { Sidenav: { formName: 'customers_form' } };
            await syncServoyMenu(menu);

            const spy = vi.spyOn(component.servoyApi(), 'callServerSideApi');
            component.selectItem(1, 1, component['_menu']()![1], new MouseEvent('click'), true);

            // not treated as 'already selected', so the contained form is requested
            expect(spy).toHaveBeenCalledWith('showForm', [undefined, 'customers']);
        });
    });

    describe('first-show servoyMenu NG0100 (SVY-21686)', () => {
        // The ticket's exact case: a servoyMenu is present, NO item carries isSelected, and the
        // onLoad two-way selectedIndex/expandedIndex strings are NOT set (left undefined). Pre-fix,
        // svyOnInit seeded _selectedIndex/_expandedIndex with a fresh parseIndex(undefined) -> {},
        // flipping the host-bound two-way property undefined -> {} inside the after-checked
        // svyOnInit, which the host FormComponent's exhaustive dev-mode re-check saw as a single
        // launch NG0100. The fix keeps the stable constructor {} reference when the input is
        // undefined (does not manufacture a new one). This test guards that stable reference.
        const makeUnselectedServoyMenuNoOnLoad = (): any => ({
            name: 'mainMenu',
            styleClass: '',
            items: [
                { itemID: 'home', menuText: 'Home', enabled: true, isSelected: false, items: [] },
                { itemID: 'customers', menuText: 'Customers', enabled: true, isSelected: false, items: [] },
                { itemID: 'orders', menuText: 'Orders', enabled: true, isSelected: false, items: [] }
            ],
            setSelectedItem: vi.fn(),
            pushDataProviderValue: vi.fn()
        });

        let originalCreateJSEvent: typeof component.createJSEvent;

        beforeEach(async () => {
            // this is the servoyMenu-driven first-show path, so drop the plain menu input and leave
            // selectedIndex/expandedIndex unset (undefined) - the ticket's no-onLoad-index case.
            fixture.componentRef.setInput('menu', undefined);
            fixture.detectChanges();
            await fixture.whenStable();
            // copyServoyMenu's re-derivation can reach selectItem(..., null event) -> createJSEvent();
            // jsdom's initMouseEvent rejects the global window arg, so return a plain click event
            // (restored afterwards), mirroring the SVY-21654 suite.
            originalCreateJSEvent = component.createJSEvent;
            component.createJSEvent = () => new MouseEvent('click');
        });

        afterEach(() => {
            component.createJSEvent = originalCreateJSEvent;
        });

        it('should keep the stable {} reference for _selectedIndex/_expandedIndex across the first show and not throw NG0100', async () => {
            // capture the constructor-created {} references BEFORE the first-show seed. The fix must
            // keep these exact references when the two-way inputs are undefined; pre-fix svyOnInit
            // manufactured a fresh parseIndex(undefined) -> {} and replaced them (identity broken).
            const selectedRefBefore = component['_selectedIndex']();
            const expandedRefBefore = component['_expandedIndex']();
            expect(selectedRefBefore).toEqual({});
            expect(expandedRefBefore).toEqual({});

            // present the servoyMenu with no isSelected item and no onLoad indexes, then run the real
            // first-show lifecycle: svyOnInit seeds + schedules copyServoyMenu in a microtask.
            fixture.componentRef.setInput('servoyMenu', makeUnselectedServoyMenuNoOnLoad());
            expect(component.selectedIndex()).toBeUndefined();
            expect(component.expandedIndex()).toBeUndefined();

            component.svyOnInit();

            // the seed must NOT have manufactured a fresh {} - same reference as construction.
            expect(component['_selectedIndex']()).toBe(selectedRefBefore);
            expect(component['_expandedIndex']()).toBe(expandedRefBefore);

            // let the Promise.resolve().then(copyServoyMenu) microtask run.
            await Promise.resolve();
            await fixture.whenStable();

            // after the microtask, with no isSelected item, the selection stays the same stable
            // reference - copyServoyMenu must not have flipped it to a fresh {}.
            expect(component['_selectedIndex']()).toBe(selectedRefBefore);
            expect(component['_expandedIndex']()).toBe(expandedRefBefore);

            // the first host check: the bound two-way values held one stable value (never
            // undefined -> {}), so the exhaustive re-check must not throw ExpressionChanged (NG0100).
            expect(() => fixture.detectChanges()).not.toThrow();

            // and the stable reference survives that first detectChanges as well.
            expect(component['_selectedIndex']()).toBe(selectedRefBefore);
            expect(component['_expandedIndex']()).toBe(expandedRefBefore);
        });
    });

    describe('onLoad selection/expansion on first show (SVY-21634)', () => {
        // nav_nested/nav_states plain-menu path: 'customers' is a top-level item selected via the
        // two-way selectedIndex string; 'sales' is a top-level group expanded via expandedIndex.
        let firstShowMenu: MenuItem[];

        beforeEach(() => {
            firstShowMenu = [
                {
                    id: 'customers',
                    text: 'Customers',
                    enabled: true,
                    formName: 'customersForm'
                } as unknown as MenuItem,
                {
                    id: 'sales',
                    text: 'Sales',
                    enabled: true,
                    menuItems: [
                        {
                            id: 'leads',
                            text: 'Leads',
                            formName: 'leadsForm',
                            enabled: true
                        } as unknown as MenuItem
                    ]
                } as unknown as MenuItem
            ];
        });

        it('should seed a PARSED selection/expansion object and render them on first show', async () => {
            // The two-way index properties arrive as JSON strings (the wire type). onLoad set them
            // before the component existed, so they are present at the first svyOnInit seed.
            fixture.componentRef.setInput('menu', firstShowMenu);
            fixture.componentRef.setInput('selectedIndex', JSON.stringify({ 1: 'customers' }));
            fixture.componentRef.setInput('expandedIndex', JSON.stringify({ 1: 'sales' }));

            // re-run the first-show seed now that the inputs are set (mirrors runtime svyOnInit).
            // Assert directly on the seeded signals BEFORE any svyOnChanges replay, so this isolates
            // the svyOnInit seed itself: pre-fix it seeds the RAW JSON STRING (so _selectedIndex()[1]
            // indexes a character, never matching a menu id). This assertion fails against pre-fix.
            component.svyOnInit();
            expect(component['_selectedIndex']()).toEqual({ 1: 'customers' });
            expect(component['_expandedIndex']()).toEqual({ 1: 'sales' });
            expect(typeof component['_selectedIndex']()).toBe('object');

            fixture.detectChanges();
            await fixture.whenStable();

            const items = fixture.nativeElement.querySelectorAll('.svy-sidenav-dropdown.sn-level-1');
            const customersItem = Array.from(items).find((el: any) => el.textContent.includes('Customers')) as HTMLElement;
            expect(customersItem.classList.contains('svy-navitem-selected')).toBe(true);

            // the expanded 'sales' group shows its children on first render
            const subItems = fixture.nativeElement.querySelectorAll('.svy-sidenav-item.sn-level-2');
            expect(subItems.length).toBe(1);
        });
    });

    describe('allowMultipleExpanded (SVY-21635)', () => {
        // Flat menu of sibling top-level groups, each with its own children, mirroring the
        // ticket's Sales/Catalog/People/Reference navigation. Groups are MenuItem nodes with
        // menuItems so expandItem/setExpandedIndex treats them as expandable branches.
        let groupsMenu: MenuItem[];

        beforeEach(async () => {
            groupsMenu = [
                {
                    id: 'sales',
                    text: 'Sales',
                    enabled: true,
                    menuItems: [
                        { id: 'leads', text: 'Leads', formName: 'leadsForm', enabled: true } as unknown as MenuItem,
                        { id: 'orders', text: 'Orders', formName: 'ordersForm', enabled: true } as unknown as MenuItem
                    ]
                } as unknown as MenuItem,
                {
                    id: 'catalog',
                    text: 'Catalog',
                    enabled: true,
                    menuItems: [
                        { id: 'products', text: 'Products', formName: 'productsForm', enabled: true } as unknown as MenuItem,
                        { id: 'categories', text: 'Categories', formName: 'categoriesForm', enabled: true } as unknown as MenuItem
                    ]
                } as unknown as MenuItem,
                {
                    id: 'people',
                    text: 'People',
                    enabled: true,
                    menuItems: [
                        { id: 'employees', text: 'Employees', formName: 'employeesForm', enabled: true } as unknown as MenuItem
                    ]
                } as unknown as MenuItem,
                {
                    id: 'reference',
                    text: 'Reference',
                    enabled: true,
                    menuItems: [
                        { id: 'countries', text: 'Countries', formName: 'countriesForm', enabled: true } as unknown as MenuItem
                    ]
                } as unknown as MenuItem
            ];

            fixture.componentRef.setInput('menu', groupsMenu);
            fixture.detectChanges();
            await fixture.whenStable();
        });

        describe('flag OFF (default single-open accordion)', () => {
            it('should default allowMultipleExpanded to false when input not set', () => {
                expect(component.allowMultipleExpanded()).toBe(false);
            });

            it('should collapse the previously open sibling when a second sibling is expanded', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                expect(component.isNodeExpanded('sales', 1)).toBe(true);

                component.expandItem(1, 1, groupsMenu[1], event);
                expect(component.isNodeExpanded('catalog', 1)).toBe(true);
                // the first sibling must be dropped - accordion behaviour unchanged
                expect(component.isNodeExpanded('sales', 1)).toBe(false);
            });

            it('should report only the last-expanded sibling via isNodeExpanded (no-level scan)', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);

                expect(component.isMenuItemExpanded('catalog')).toBe(true);
                expect(component.isMenuItemExpanded('sales')).toBe(false);
            });

            it('should keep the single-id {level->id} shape in the stored expandedIndex (never an array)', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);

                const stored = component['_expandedIndex']();
                expect(stored[1]).toBe('catalog');
                expect(Array.isArray(stored[1])).toBe(false);
            });

            it('should emit a single-id serialized expandedIndex (byte-for-byte accordion shape)', () => {
                const emitSpy = vi.fn();
                component.expandedIndexChange.subscribe(emitSpy);

                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);

                const lastEmitted = emitSpy.mock.calls[emitSpy.mock.calls.length - 1][0];
                expect(lastEmitted).toBe(JSON.stringify({ 1: 'catalog' }));
            });

            it('should expand the ancestor path when a deep node is opened', () => {
                const event = new MouseEvent('click');
                component.expandItem(2, 0, groupsMenu[0].menuItems[0], event);

                expect(component.isNodeExpanded('sales', 1)).toBe(true);
                expect(component.isNodeExpanded('leads', 2)).toBe(true);
            });
        });

        describe('flag ON (allow several groups open)', () => {
            beforeEach(async () => {
                fixture.componentRef.setInput('allowMultipleExpanded', true);
                fixture.detectChanges();
                await fixture.whenStable();
            });

            it('should leave the first sibling open when a second sibling is expanded', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);

                expect(component.isNodeExpanded('sales', 1)).toBe(true);
                expect(component.isNodeExpanded('catalog', 1)).toBe(true);
            });

            it('should keep multiple sibling groups open simultaneously', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);
                component.expandItem(1, 2, groupsMenu[2], event);

                expect(component.isNodeExpanded('sales', 1)).toBe(true);
                expect(component.isNodeExpanded('catalog', 1)).toBe(true);
                expect(component.isNodeExpanded('people', 1)).toBe(true);
            });

            it('should store an array at a level once two siblings are open', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);

                const stored = component['_expandedIndex']();
                expect(Array.isArray(stored[1])).toBe(true);
                expect(stored[1]).toContain('sales');
                expect(stored[1]).toContain('catalog');
            });

            it('should leave the other sibling open when one is collapsed', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);

                component.collapseItem(1, 0, groupsMenu[0], event);

                expect(component.isNodeExpanded('sales', 1)).toBe(false);
                expect(component.isNodeExpanded('catalog', 1)).toBe(true);
            });

            it('should still expand the ancestor path when a deep node is opened', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 1, groupsMenu[1], event);
                component.expandItem(2, 0, groupsMenu[0].menuItems[0], event);

                // the deep node and its ancestor are expanded
                expect(component.isNodeExpanded('leads', 2)).toBe(true);
                expect(component.isNodeExpanded('sales', 1)).toBe(true);
                // and the previously open sibling group survives
                expect(component.isNodeExpanded('catalog', 1)).toBe(true);
            });

            it('should round-trip an array-valued expandedIndex through parseIndex', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);

                const serialized = JSON.stringify(component['_expandedIndex']());
                const parsed = component['parseIndex'](serialized);
                expect(Array.isArray(parsed[1])).toBe(true);
                expect(parsed[1]).toEqual(['sales', 'catalog']);
            });
        });

        describe('multi-mode descendant scoping regression (the bug the fix addresses)', () => {
            // A 3-level menu: top-level groups each own sub-groups which own leaves. Acting on a
            // third top-level group must NOT clear a deeper expansion that lives under a different
            // sibling. The pre-fix blanket "clear every level > level" would wipe level 2/3.
            let deepMenu: MenuItem[];

            beforeEach(async () => {
                deepMenu = [
                    {
                        id: 'A',
                        text: 'A',
                        enabled: true,
                        menuItems: [
                            {
                                id: 'A1',
                                text: 'A1',
                                enabled: true,
                                menuItems: [
                                    { id: 'A1a', text: 'A1a', formName: 'a1aForm', enabled: true } as unknown as MenuItem
                                ]
                            } as unknown as MenuItem
                        ]
                    } as unknown as MenuItem,
                    {
                        id: 'B',
                        text: 'B',
                        enabled: true,
                        menuItems: [
                            {
                                id: 'B1',
                                text: 'B1',
                                enabled: true,
                                menuItems: [
                                    { id: 'B1a', text: 'B1a', formName: 'b1aForm', enabled: true } as unknown as MenuItem
                                ]
                            } as unknown as MenuItem
                        ]
                    } as unknown as MenuItem,
                    {
                        id: 'C',
                        text: 'C',
                        enabled: true,
                        menuItems: [
                            { id: 'C1', text: 'C1', formName: 'c1Form', enabled: true } as unknown as MenuItem
                        ]
                    } as unknown as MenuItem
                ];

                fixture.componentRef.setInput('menu', deepMenu);
                fixture.componentRef.setInput('allowMultipleExpanded', true);
                fixture.detectChanges();
                await fixture.whenStable();
            });

            it('should not collapse a sibling branch deep expansion when acting on a third top-level group', () => {
                const event = new MouseEvent('click');
                // open A and its child A1 (level 2 expanded under A)
                component.expandItem(1, 0, deepMenu[0], event);
                component.expandItem(2, 0, deepMenu[0].menuItems[0], event);
                // open sibling B
                component.expandItem(1, 1, deepMenu[1], event);

                expect(component.isNodeExpanded('A1', 2)).toBe(true);

                // acting on a third top-level group C must leave A1 (a different sibling's child) expanded
                component.expandItem(1, 2, deepMenu[2], event);

                expect(component.isNodeExpanded('A1', 2)).toBe(true);
                expect(component.isNodeExpanded('A', 1)).toBe(true);
                expect(component.isNodeExpanded('B', 1)).toBe(true);
                expect(component.isNodeExpanded('C', 1)).toBe(true);
            });

            it('should prune only the collapsed node descendants, leaving a sibling branch and its descendants', () => {
                const event = new MouseEvent('click');
                // expand A -> A1, and B -> B1
                component.expandItem(1, 0, deepMenu[0], event);
                component.expandItem(2, 0, deepMenu[0].menuItems[0], event);
                component.expandItem(1, 1, deepMenu[1], event);
                component.expandItem(2, 0, deepMenu[1].menuItems[0], event);

                expect(component.isNodeExpanded('A1', 2)).toBe(true);
                expect(component.isNodeExpanded('B1', 2)).toBe(true);

                // collapse A: only A's descendants (A1) must be pruned; B and B1 survive
                component.collapseItem(1, 0, deepMenu[0], event);

                expect(component.isNodeExpanded('A', 1)).toBe(false);
                expect(component.isNodeExpanded('A1', 2)).toBe(false);
                expect(component.isNodeExpanded('B', 1)).toBe(true);
                expect(component.isNodeExpanded('B1', 2)).toBe(true);
            });
        });

        describe('onLoad setMenuItemExpanded scenario (ticket)', () => {
            // The ticket's onLoad expands several sibling groups up front. The component exposes
            // expansion through expandItem (the handler surface); drive it for each sibling and
            // assert the flag governs whether earlier ones survive.
            it('should leave all sibling groups open when the flag is ON', async () => {
                fixture.componentRef.setInput('allowMultipleExpanded', true);
                fixture.detectChanges();
                await fixture.whenStable();

                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);
                component.expandItem(1, 2, groupsMenu[2], event);
                component.expandItem(1, 3, groupsMenu[3], event);

                expect(component.isMenuItemExpanded('sales')).toBe(true);
                expect(component.isMenuItemExpanded('catalog')).toBe(true);
                expect(component.isMenuItemExpanded('people')).toBe(true);
                expect(component.isMenuItemExpanded('reference')).toBe(true);
            });

            it('should leave only the last sibling group open when the flag is OFF', () => {
                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);
                component.expandItem(1, 2, groupsMenu[2], event);
                component.expandItem(1, 3, groupsMenu[3], event);

                expect(component.isMenuItemExpanded('sales')).toBe(false);
                expect(component.isMenuItemExpanded('catalog')).toBe(false);
                expect(component.isMenuItemExpanded('people')).toBe(false);
                expect(component.isMenuItemExpanded('reference')).toBe(true);
            });
        });

        describe('NG0600 / change-detection safety', () => {
            it('should not throw when detecting changes after toggling expansion with the flag ON', async () => {
                fixture.componentRef.setInput('allowMultipleExpanded', true);
                fixture.detectChanges();
                await fixture.whenStable();

                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);

                expect(() => fixture.detectChanges()).not.toThrow();
            });

            it('should render sublists of several open sibling groups without throwing (flag ON)', async () => {
                fixture.componentRef.setInput('allowMultipleExpanded', true);
                fixture.detectChanges();
                await fixture.whenStable();

                const event = new MouseEvent('click');
                component.expandItem(1, 0, groupsMenu[0], event);
                component.expandItem(1, 1, groupsMenu[1], event);
                expect(() => fixture.detectChanges()).not.toThrow();

                const subItems = fixture.nativeElement.querySelectorAll('.svy-sidenav-item.sn-level-2');
                // Sales (2) + Catalog (2) children both rendered at once
                expect(subItems.length).toBe(4);
            });
        });
    });

    describe('navigation helpers and API', () => {
        it('getNodeByIndexPath returns the root when the path is empty', () => {
            expect(component.getNodeByIndexPath([], testMenu)).toBe(testMenu);
        });

        it('getNodeByIndexPath returns a top-level node for a single-element path', () => {
            expect(component.getNodeByIndexPath([0], testMenu).id).toBe('dashboard');
        });

        it('getAllNodesToNodeId returns the ancestor chain including the node', () => {
            const chain = component.getAllNodesToNodeId('user_list');
            expect(chain.map((n: any) => n.id)).toEqual(['users', 'user_list']);
        });

        it('getNodeAnchestors excludes the node itself', () => {
            const chain = component.getNodeAnchestors('user_list');
            expect(chain.map((n: any) => n.id)).toEqual(['users']);
        });

        it('getParentNode returns the direct parent', () => {
            expect(component.getParentNode('user_groups').id).toBe('users');
            expect(component.getParentNode('dashboard')).toBeNull();
        });

        it('getNodeLevel returns the 1-based depth', () => {
            expect(component.getNodeLevel('dashboard')).toBe(1);
            expect(component.getNodeLevel('user_list')).toBe(2);
            expect(component.getNodeLevel('does-not-exist')).toBeNull();
        });

        it('isNodeSelected checks a specific level and any level', () => {
            component._selectedIndex.set({ 1: 'users', 2: 'user_list' });
            expect(component.isNodeSelected('user_list', 2)).toBe(true);
            expect(component.isNodeSelected('user_list', 1)).toBe(false);
            expect(component.isNodeSelected('users', 0 as any)).toBe(true);
        });

        it('getSelectedNode returns the deepest selected node', () => {
            component._selectedIndex.set({ 1: 'users', 2: 'user_list' });
            expect(component.getSelectedNode(0).id).toBe('user_list');
            expect(component.getSelectedNode(1).id).toBe('users');
        });

        it('getSelectedIndexPath returns the path of the selected node', () => {
            component._selectedIndex.set({ 1: 'users', 2: 'user_groups' });
            expect(component.getSelectedIndexPath(0)).toEqual([1, 1]);
        });

        it('clearSelectedIndex removes deeper levels', () => {
            component._selectedIndex.set({ 1: 'users', 2: 'user_list' });
            component.clearSelectedIndex(1);
            expect(component._selectedIndex()[2]).toBeUndefined();
            expect(component._selectedIndex()[1]).toBe('users');
        });

        it('clearExpandedIndex removes deeper levels', () => {
            component._expandedIndex.set({ 1: 'users', 2: 'user_list' });
            component.clearExpandedIndex(1);
            expect(component._expandedIndex()[2]).toBeUndefined();
        });

        it('toggleExpandedItem expands then collapses a node', () => {
            const event = new MouseEvent('click');
            component.toggleExpandedItem(1, 1, testMenu[1], event);
            expect(component.isNodeExpanded('users', 1)).toBe(true);
            component.toggleExpandedItem(1, 1, testMenu[1], event);
            expect(component.isNodeExpanded('users', 1)).toBe(false);
        });

        it('setSelectedByIndexPath selects the node at the given path', () => {
            // createJSEvent uses jsdom initMouseEvent which rejects the window arg; stub it
            component.createJSEvent = () => new MouseEvent('click');
            component.setSelectedByIndexPath([1, 0], true);
            expect(component._selectedIndex()[1]).toBe('users');
            expect(component._selectedIndex()[2]).toBe('user_list');
        });

        it('getSidenavClass maps slidePosition and styleClass', () => {
            fixture.componentRef.setInput('slidePosition', 'right');
            fixture.componentRef.setInput('slideAnimation', 'collapse-menu');
            fixture.componentRef.setInput('styleClass', 'extra1 extra2');
            fixture.detectChanges();
            const cls = component.getSidenavClass();
            expect(cls['svy-sidenav-right']).toBe(true);
            expect(cls['nav-collapse-menu']).toBe(true);
            expect(cls['extra1']).toBe(true);
            expect(cls['extra2']).toBe(true);
        });

        it('isDesignTime reflects servoyApi.isInDesigner', () => {
            const api: any = component.servoyApi();
            vi.spyOn(api, 'isInDesigner').mockReturnValue(true);
            expect(component.isDesignTime()).toBe(true);
        });

        it('isDesignTime stays false in the sample data render so the contained form is rendered, not its name', () => {
            const api: any = component.servoyApi();
            vi.spyOn(api, 'isInDesigner').mockReturnValue(false);
            api.isInSampleDataMode = () => true;
            expect(component.isDesignTime()).toBe(false);
        });

        it('getContainerStyle sets a left margin for a left slide position', () => {
            fixture.componentRef.setInput('slidePosition', 'left');
            fixture.componentRef.setInput('sidenavWidth', 200);
            fixture.detectChanges();
            const api: any = component.servoyApi();
            vi.spyOn(api, 'isInAbsoluteLayout').mockReturnValue(false);
            const style = component.getContainerStyle();
            expect(style.position).toBe('relative');
            expect(style.marginLeft).toBe('200px');
        });

        it('getSidenavWidth returns the width for responsive layout', () => {
            const api: any = component.servoyApi();
            vi.spyOn(api, 'isInAbsoluteLayout').mockReturnValue(false);
            fixture.componentRef.setInput('sidenavWidth', 250);
            fixture.detectChanges();
            expect(component.getSidenavWidth()).toBe(250);
        });

        it('getHeaderFormStyle sets a minHeight for an absolute header form', () => {
            fixture.componentRef.setInput('headerForm', 'hdr');
            fixture.detectChanges();
            vi.spyOn((component as any).servoyPublic, 'getFormCacheByName').mockReturnValue({ absolute: true, size: { height: 60 } } as any);
            expect(component.getHeaderFormStyle().minHeight).toBe('60px');
        });

        it('getFooterFormStyle sets a minHeight for an absolute footer form', () => {
            fixture.componentRef.setInput('footerForm', 'ftr');
            fixture.detectChanges();
            vi.spyOn((component as any).servoyPublic, 'getFormCacheByName').mockReturnValue({ absolute: true, size: { height: 40 } } as any);
            expect(component.getFooterFormStyle().minHeight).toBe('40px');
        });

        it('getForm/getHeaderForm/getFooterForm expose the real forms', () => {
            component.realContainedForm.set('mainForm');
            expect(component.getForm()).toBe('mainForm');
            expect(component.getHeaderForm()).toBeUndefined();
            expect(component.getFooterForm()).toBeUndefined();
        });

        it('findDuplicateIds returns the duplicated ids', () => {
            const dupe = [
                { id: 'x' }, { id: 'y' }, { id: 'x', menuItems: [{ id: 'z' }] }
            ] as any;
            expect((component as any).findDuplicateIds(dupe)).toEqual(['x']);
        });

        it('parseIndex parses a JSON string and passes through an object', () => {
            expect((component as any).parseIndex('{"1":"a"}')).toEqual({ 1: 'a' });
            expect((component as any).parseIndex({ 2: 'b' })).toEqual({ 2: 'b' });
            expect((component as any).parseIndex(undefined)).toEqual({});
        });

        it('isMenuItemExpanded is true after expanding the node', () => {
            component.expandItem(1, 1, testMenu[1], new MouseEvent('click'));
            expect(component.isMenuItemExpanded('users')).toBe(true);
        });

        it('slideMenu fires onOpenToggled when the open state changes', () => {
            const spy = vi.fn();
            fixture.componentRef.setInput('onOpenToggled', spy);
            fixture.detectChanges();
            component._open.set(false);
            component.slideMenu(new MouseEvent('click'));
            expect(spy).toHaveBeenCalled();
            expect(component._open()).toBe(true);
        });
    });

    describe('servoyMenu copy', () => {
        const makeMenu = (): any => ({
            name: 'm',
            styleClass: '',
            items: [
                { itemID: 'home', menuText: 'Home', enabled: true, isSelected: false, items: [] },
                {
                    itemID: 'grp', menuText: 'Group', enabled: true, isSelected: false,
                    items: [{ itemID: 'leaf', menuText: 'Leaf', enabled: true, isSelected: true, items: [] }]
                }
            ],
            setSelectedItem: vi.fn(),
            pushDataProviderValue: vi.fn()
        });

        it('copyServoyMenu builds the menu and applies the server selection', async () => {
            fixture.componentRef.setInput('menu', undefined);
            const menu = makeMenu();
            fixture.componentRef.setInput('servoyMenu', menu);
            component.createJSEvent = () => new MouseEvent('click');
            (component as any).copyServoyMenu();
            expect(component['_menu']()!.length).toBe(2);
            expect(component['_menu']()![1].menuItems.length).toBe(1);
            expect(component['_selectedIndex']()).toEqual({ 1: 'grp', 2: 'leaf' });
        });

        it('copyServoyMenuItem maps the sidenav extra properties', () => {
            const dest: any[] = [];
            const src: any = {
                itemID: 'i', menuText: 'Item', enabled: true, iconStyleClass: 'ic', styleClass: 'sc', tooltipText: 'tip',
                extraProperties: { Sidenav: { isDivider: true, isHeading: false, badgeText: '3', badgeStyleClass: 'bg', formName: 'f', relationName: 'r', data: { a: 1 } } },
                items: []
            };
            (component as any).copyServoyMenuItem(dest, src, 1, {});
            expect(dest[0].id).toBe('i');
            expect(dest[0].badgeText).toBe('3');
            expect(dest[0].isDivider).toBe(true);
            expect(dest[0].formName).toBe('f');
            expect(dest[0].data).toEqual({ a: 1 });
        });
    });

});
