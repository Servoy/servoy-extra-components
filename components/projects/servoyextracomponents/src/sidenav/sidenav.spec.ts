import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
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
});
