import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSidenav, MenuItem } from './sidenav';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    template: `<servoyextra-sidenav
                [servoyApi]="servoyApi"
                [onMenuItemCollapsed]="onMenuItemCollapsed"
                [onMenuItemExpanded]="onMenuItemExpanded"
                [onMenuItemSelected]="onMenuItemSelected"
                [onOpenToggled]="onOpenToggled"
                [animate]="animate"
                [containedForm]="containedForm"
                [enabled]="enabled"
                [expandedIndex]="expandedIndex"
                [footerForm]="footerForm"
                [footerFormStickyBottom]="footerFormStickyBottom"
                [headerForm]="headerForm"
                [iconCloseStyleClass]="iconCloseStyleClass"
                [iconCollapseStyleClass]="iconCollapseStyleClass"
                [iconExpandStyleClass]="iconExpandStyleClass"
                [iconOpenStyleClass]="iconOpenStyleClass"
                [menu]="menu"
                [open]="open"
                [relationName]="relationName"
                [responsiveHeight]="responsiveHeight"
                [scrollbarPosition]="scrollbarPosition"
                [selectedIndex]="selectedIndex"
                [servoyMenu]="servoyMenu"
                [sidenavWidth]="sidenavWidth"
                [slideAnimation]="slideAnimation"
                [slidePosition]="slidePosition"
                [styleClass]="styleClass"
                [tabSeq]="tabSeq"
                [togglePosition]="togglePosition"
                #element>
                </servoyextra-sidenav>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onMenuItemCollapsed: (id: string, event: MouseEvent) => Promise<boolean>;
    onMenuItemExpanded: (id: string, event: MouseEvent) => Promise<boolean>;
    onMenuItemSelected: (id: string, event: MouseEvent) => Promise<boolean>;
    onOpenToggled: (event: MouseEvent) => void;

    animate: boolean;
    containedForm: string;
    enabled: boolean;
    expandedIndex: string;
    footerForm: string;
    footerFormStickyBottom: boolean;
    headerForm: string;
    iconCloseStyleClass: string;
    iconCollapseStyleClass: string;
    iconExpandStyleClass: string;
    iconOpenStyleClass: string;
    menu: MenuItem[];
    open: boolean;
    relationName: string;
    responsiveHeight: number;
    scrollbarPosition: string;
    selectedIndex: string;
    servoyMenu: any;
    sidenavWidth: number;
    slideAnimation: string;
    slidePosition: string;
    styleClass: string;
    tabSeq: number;
    togglePosition: string;

    @ViewChild('element') element: ServoyExtraSidenav;
}

describe('ServoyExtraSidenav', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraSidenav],
        imports: [ServoyPublicTestingModule, FormsModule, NgbModule]
    }

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
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            enabled: true,
            styleClass: 'sidenav-test',
            open: true,
            responsiveHeight: 400,
            menu: testMenu,
            slidePosition: 'left',
            iconOpenStyleClass: 'custom-open',
            iconCloseStyleClass: 'custom-close',
            slideAnimation: 'slide-menu',
            iconExpandStyleClass: 'custom-expand',
            iconCollapseStyleClass: 'custom-collapse',
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-sidenav').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-sidenav').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('.svy-sidenav').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-sidenav').should('have.class', 'sidenav-test').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('.svy-sidenav').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should toggle menu open/close state', () => {
        const onOpenToggled = cy.stub();
        config.componentProperties.onOpenToggled = onOpenToggled;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-extra-sidenav').should('not.have.class', 'svy-slide-out');
            cy.get('.svy-sidenav-action-open').click({ force: true }).then(() => {
                cy.get('.svy-extra-sidenav').should('have.class', 'svy-slide-out');
                cy.wrap(onOpenToggled).should('be.called');
                cy.get('.svy-sidenav-action-open').click({ force: true }).then(() => {
                    cy.get('.svy-extra-sidenav').should('not.have.class', 'svy-slide-out');
                    cy.wrap(onOpenToggled).should('be.calledTwice');
                });
            });
        });
    });

    it('should handle menu item selection', () => {
        const onMenuItemSelected = cy.stub().resolves(true);
        config.componentProperties.onMenuItemSelected = onMenuItemSelected;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-sidenav-item-text').first().click().then(() => {
                expect(onMenuItemSelected).to.have.been.called;
            });
        });
    });

    it('should expand/collapse menu items', () => {
        const onMenuItemExpanded = cy.stub().resolves(true);
        const onMenuItemCollapsed = cy.stub().resolves(true);
        config.componentProperties.onMenuItemExpanded = onMenuItemExpanded;
        config.componentProperties.onMenuItemCollapsed = onMenuItemCollapsed;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-sidenav-item-text').eq(1).click().then(() => {
                expect(onMenuItemExpanded).to.have.been.called;
                cy.get('.svy-sidenav-collapse-icon').eq(1).click({force: true}).then(() => {
                    expect(onMenuItemCollapsed).to.have.been.called;
                });
            });
        });
    });

    it('should apply custom icon classes', () => {
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-sidenav-action-open').should('have.class', 'custom-open').then(() => {
                cy.get('.svy-sidenav-action-open').click({ force: true }).then(() => {
                    cy.get('.svy-sidenav-action-open').should('have.class', 'custom-close');
                });
            });
        });
    });

    it('should handle sticky footer', () => {
        config.componentProperties.footerFormStickyBottom = true;
        config.componentProperties.footerForm = 'testFooter';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('#footerForm').should('exist').then(() => {
                wrapper.component.footerFormStickyBottom = false;
                wrapper.fixture.detectChanges();
                cy.get('#footerForm').should('not.exist');
            });
        });
    });

    it('should show badge text when provided', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.badge').should('exist')
                .and('contain.text', '99+')
                .and('have.class', 'badge')
                .and('have.class', 'text-bg-secondary');
        });
    });
});