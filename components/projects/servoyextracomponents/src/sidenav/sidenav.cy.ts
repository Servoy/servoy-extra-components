import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSidenav, MenuItem } from './sidenav';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    template: `<servoyextra-sidenav
                [servoyApi]="servoyApi()"
                [onMenuItemCollapsed]="onMenuItemCollapsed"
                [onMenuItemExpanded]="onMenuItemExpanded"
                [onMenuItemSelected]="onMenuItemSelected"
                [onOpenToggled]="onOpenToggled"
                [animate]="animate()"
                [containedForm]="containedForm()"
                [enabled]="enabled()"
                [expandedIndex]="expandedIndex()"
                [footerForm]="footerForm()"
                [footerFormStickyBottom]="footerFormStickyBottom()"
                [headerForm]="headerForm()"
                [iconCloseStyleClass]="iconCloseStyleClass()"
                [iconCollapseStyleClass]="iconCollapseStyleClass()"
                [iconExpandStyleClass]="iconExpandStyleClass()"
                [iconOpenStyleClass]="iconOpenStyleClass()"
                [menu]="menu()"
                [open]="open()"
                [relationName]="relationName()"
                [responsiveHeight]="responsiveHeight()"
                [scrollbarPosition]="scrollbarPosition()"
                [selectedIndex]="selectedIndex()"
                [servoyMenu]="servoyMenu()"
                [sidenavWidth]="sidenavWidth()"
                [slideAnimation]="slideAnimation()"
                [slidePosition]="slidePosition()"
                [styleClass]="styleClass()"
                [tabSeq]="tabSeq()"
                [togglePosition]="togglePosition()"
                #element>
                </servoyextra-sidenav>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onMenuItemCollapsed = () => { };
    onMenuItemExpanded = () => { };
    onMenuItemSelected = () => { };
    onOpenToggled = () => { };

    animate = signal<boolean>(undefined);
    containedForm = signal<string>(undefined);
    enabled = signal<boolean>(undefined);
    expandedIndex = signal<string>(undefined);
    footerForm = signal<string>(undefined);
    footerFormStickyBottom = signal<boolean>(undefined);
    headerForm = signal<string>(undefined);
    iconCloseStyleClass = signal<string>(undefined);
    iconCollapseStyleClass = signal<string>(undefined);
    iconExpandStyleClass = signal<string>(undefined);
    iconOpenStyleClass = signal<string>(undefined);
    menu = signal<MenuItem[]>(undefined);
    open = signal<boolean>(undefined);
    relationName = signal<string>(undefined);
    responsiveHeight = signal<number>(undefined);
    scrollbarPosition = signal<string>(undefined);
    selectedIndex = signal<string>(undefined);
    servoyMenu = signal<any>(undefined);
    sidenavWidth = signal<number>(undefined);
    slideAnimation = signal<string>(undefined);
    slidePosition = signal<string>(undefined);
    styleClass = signal<string>(undefined);
    tabSeq = signal<number>(undefined);
    togglePosition = signal<string>(undefined);

    @ViewChild('element') element: ServoyExtraSidenav;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    enabled: true,
    styleClass: 'sidenav-test',
    open: true,
    responsiveHeight: 400,
    menu: null as MenuItem[],
    slidePosition: 'left',
    iconOpenStyleClass: 'custom-open',
    iconCloseStyleClass: 'custom-close',
    slideAnimation: 'slide-menu',
    iconExpandStyleClass: 'custom-expand',
    iconCollapseStyleClass: 'custom-collapse',
    animate: false,
    containedForm: '',
    expandedIndex: '',
    footerForm: '',
    footerFormStickyBottom: false,
    headerForm: '',
    relationName: '',
    scrollbarPosition: '',
    selectedIndex: '',
    servoyMenu: null,
    sidenavWidth: 0,
    tabSeq: 0,
    togglePosition: '',
    onMenuItemCollapsed: undefined,
    onMenuItemExpanded: undefined,
    onMenuItemSelected: undefined,
    onOpenToggled: undefined
};

function applyDefaultProps(wrapper) {
    for (const key in defaultValues) {
        if (wrapper.component[key] && typeof wrapper.component[key].set === 'function') {
            wrapper.component[key].set(defaultValues[key]);
        }
        else {
            wrapper.component[key] = defaultValues[key];
        }
    }
}

const configWrapper: MountConfig<WrapperComponent> = {
    declarations: [ServoyExtraSidenav],
    imports: [ServoyPublicTestingModule, FormsModule, NgbModule]
};

describe('ServoyExtraSidenav', () => {

    beforeEach(() => {
        const testMenu = [
            {
                id: 'dashboard',
                text: 'Dashboard',
                iconStyleClass: 'fas fa-home',
                enabled: true,
                formName: 'dashboardForm',
                tooltip: 'Go to Dashboard',
                badgeText: '99+',
                badgeStyleClass: 'badge text-bg-secondary'
            },
            {
                id: 'users',
                text: 'Users',
                iconStyleClass: 'fas fa-users',
                badgeText: '5',
                badgeStyleClass: 'badge text-bg-primary',
                menuItems: [
                    {
                        id: 'user_list',
                        text: 'User List',
                        formName: 'userListForm',
                        iconStyleClass: 'fas fa-list'
                    },
                    {
                        id: 'user_groups',
                        text: 'User Groups',
                        formName: 'userGroupsForm',
                        iconStyleClass: 'fas fa-user-friends'
                    }
                ]
            },
            {
                id: 'divider1',
                isDivider: true,
                text: ''
            },
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
                        formName: 'generalSettingsForm'
                    },
                    {
                        id: 'security',
                        text: 'Security',
                        formName: 'securitySettingsForm',
                        badgeText: 'New',
                        badgeStyleClass: 'badge text-bg-warning'
                    }
                ]
            }
        ] as MenuItem[];
        defaultValues.menu = testMenu;
    });

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-sidenav').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.svy-sidenav').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav').should('have.class', 'sidenav-test').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('.svy-sidenav').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should toggle menu open/close state', () => {
        const onOpenToggled = cy.stub();
        defaultValues.onOpenToggled = onOpenToggled;
        defaultValues.open = false;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.wait(500); // wait for sidenav to initialize
            cy.get('.svy-sidenav-action-open').click({ force: true }).then(() => {
                cy.wrap(onOpenToggled).should('be.called');
                cy.get('.svy-sidenav-action-open').click({ force: true }).then(() => {
                    cy.wrap(onOpenToggled).should('be.calledTwice');
                });
            });
        });
    });

    it('should handle menu item selection', () => {
        const onMenuItemSelected = cy.stub().resolves(true);
        defaultValues.onMenuItemSelected = onMenuItemSelected;
        defaultValues.open = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav-item-text').first().click().then(() => {
                expect(onMenuItemSelected).to.have.been.called;
            });
        });
    });

    it('should expand/collapse menu items', () => {
        const onMenuItemExpanded = cy.stub().resolves(true);
        const onMenuItemCollapsed = cy.stub().resolves(true);
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            wrapper.component.onMenuItemExpanded = onMenuItemExpanded;
            wrapper.component.onMenuItemCollapsed = onMenuItemCollapsed;
            cy.get('.svy-sidenav-item-text').eq(1).click().then(() => {
                expect(onMenuItemExpanded).to.have.been.called;
                cy.get('.svy-sidenav-collapse-icon').eq(1).click({ force: true }).then(() => {
                    expect(onMenuItemCollapsed).to.have.been.called;
                });
            });
        });
    });

    it('should apply custom icon classes', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav-action-open').should('have.class', 'custom-open').then(() => {
                cy.get('.svy-sidenav-action-open').click({ force: true }).then(() => {
                    cy.get('.svy-sidenav-action-open').should('have.class', 'custom-close');
                });
            });
        });
    });

    it('should handle sticky footer', () => {
        defaultValues.footerFormStickyBottom = true;
        defaultValues.footerForm = 'testFooter';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('#footerForm').should('exist').then(() => {
                wrapper.component.footerFormStickyBottom.set(false);
                cy.get('#footerForm').should('not.exist');
            });
        });
    });

    it('should show badge text when provided', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.badge').should('exist')
                .and('contain.text', '99+')
                .and('have.class', 'badge')
                .and('have.class', 'text-bg-secondary');
        });
    });

    it('should disable nav when enabled is false', () => {
        defaultValues.enabled = false;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('nav').should('have.class', 'svy-sidenav-disabled').and('have.attr', 'disabled').then(() => {
                wrapper.component.enabled.set(true);
                cy.get('nav').should('not.have.class', 'svy-sidenav-disabled').and('not.have.attr', 'disabled');
            });
        });
    });

    it('should apply slidePosition class to svy-sidenav', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav').should('have.class', 'svy-sidenav-left').then(() => {
                wrapper.component.slidePosition.set('right');
                cy.get('.svy-sidenav').should('have.class', 'svy-sidenav-right').and('not.have.class', 'svy-sidenav-left');
            });
        });
    });

    it('should apply slideAnimation class to svy-sidenav', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav').should('have.class', 'nav-slide-menu').then(() => {
                wrapper.component.slideAnimation.set('collapse-menu');
                cy.get('.svy-sidenav').should('have.class', 'nav-collapse-menu').and('not.have.class', 'nav-slide-menu');
            });
        });
    });

    it('should render divider items as svy-sidenav-divider', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav-divider').should('exist');
        });
    });

    it('should not select a disabled menu item', () => {
        const onMenuItemSelected = cy.stub().resolves(true);
        defaultValues.onMenuItemSelected = onMenuItemSelected;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            // 'Settings' has enabled: false — it is the 3rd anchor (index 2); divider has no .svy-sidenav-item
            cy.get('.svy-sidenav-item.sn-level-1').eq(2).click({ force: true }).then(() => {
                expect(onMenuItemSelected).not.to.have.been.called;
            });
        });
    });

    it('should apply expand/collapse icon classes', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            // 'Users' item (index 1) has sub-items — shows the expand icon before expand
            cy.get('.svy-sidenav-collapse-icon.sn-level-1').eq(1).should('have.class', 'custom-expand').then(() => {
                // set expandedIndex to show 'users' as expanded and trigger change detection
                wrapper.component.expandedIndex.set(JSON.stringify({ 1: 'users' }));
                cy.get('.svy-sidenav-collapse-icon.sn-level-1').eq(1).should('have.class', 'custom-collapse');
            });
        });
    });

    it('should show sub-menu items after expanding a parent', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav-item.sn-level-2').should('not.exist').then(() => {
                // set expandedIndex to expand 'Users' and trigger change detection
                wrapper.component.expandedIndex.set(JSON.stringify({ 1: 'users' }));
                cy.get('.svy-sidenav-item.sn-level-2').should('exist');
                cy.get('.svy-sidenav-item-text').contains('User List').should('exist');
                cy.get('.svy-sidenav-item-text').contains('User Groups').should('exist');
            });
        });
    });

    it('should reflect selectedIndex in DOM after input change', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav-dropdown.sn-level-1').first().should('not.have.class', 'svy-navitem-selected').then(() => {
                // drive selection via the input signal — this goes through svyOnChanges → _selectedIndex.set → markForCheck
                wrapper.component.selectedIndex.set(JSON.stringify({ 1: 'dashboard' }));
                cy.get('.svy-sidenav-dropdown.sn-level-1').first().should('have.class', 'svy-navitem-selected');
            });
        });
    });

    it('should update rendered items when menu input changes', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav-item-text').contains('Dashboard').should('exist').then(() => {
                wrapper.component.menu.set([{ id: 'home', text: 'Home', enabled: true } as MenuItem]);
                cy.get('.svy-sidenav-item-text').contains('Home').should('exist');
                cy.get('.svy-sidenav-item-text').contains('Dashboard').should('not.exist');
            });
        });
    });

    it('should remove styleClass when set to empty string', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-sidenav').should('have.class', 'sidenav-test').then(() => {
                wrapper.component.styleClass.set('');
                cy.get('.svy-sidenav').should('not.have.class', 'sidenav-test');
            });
        });
    });
});