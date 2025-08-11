/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraTreeview } from './treeview';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { AngularTreeGridModule, AngularTreeGridComponent } from 'angular-tree-grid';
import { ServoyExtraTreeviewCellRenderer } from './cellrenderer';

@Component({
    template: `<servoyextra-treeview 
                [servoyApi]="servoyApi"
                (click)="onNodeClicked($event, $event.data)"
                (dblclick)="onNodeDoubleClicked($event, $event.data)"
                (contextmenu)="onNodeRightClicked($event, $event.data)"
                (click)="onNodeSelected($event, $event.data)"
                (expand)="onNodeExpanded($event)"
                (collapse)="onNodeCollapsed($event)"
                [jsDataSet]="jsDataSet"
                [styleClass] = "styleClass"
                #element>
                </servoyextra-treeview>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onNodeClicked: (e: Event, data?: unknown) => void = () => { };
    onNodeCollapsed: (e: Event, data?: unknown) => void = () => { };
    onNodeDoubleClicked: (e: Event, data?: unknown) => void = () => { };
    onNodeExpanded: (e: Event, data?: unknown) => void = () => { };
    onNodeRightClicked: (e: Event, data?: unknown) => void = () => { };
    onNodeSelected: (e: Event, data?: unknown) => void = () => { };
    onReady: (e: Event, data?: unknown) => void = () => { };
    onRowDrop: (e: Event, data?: unknown) => void = () => { };

    jsDataSet: any[] = [];
    styleClass: string;

    @ViewChild('element') element: ServoyExtraTreeview;
    @ViewChild('angularGrid') angularGrid: AngularTreeGridComponent;
}

describe('ServoyExtraTreeview', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraTreeview, ServoyExtraTreeviewCellRenderer],
        imports: [ServoyPublicTestingModule, FormsModule, AngularTreeGridModule]
    }

    beforeEach(() => {
        const treeData = [
            ['id', 'pid', 'treeColumn', 'fa-icon'],
            ['1', null, 'Main group', null],
            ['2', null, 'Second group', null],
            ['3', '2', 'Subgroup', null],
            ['4', '3', 'Mark', null],
            ['5', '3', 'George', null]
        ];
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            jsDataSet: treeData,
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-treeview').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-treeview').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('.svy-treeview').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-treeview').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('.svy-treeview').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should handle node click events', () => {
        const onNodeClicked = cy.spy();
        config.componentProperties.onNodeClicked = onNodeClicked;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.wrap(onNodeClicked).should('be.not.called');
            cy.get('.svy-treeview').contains('Main group').click().then(() => {
                cy.wrap(onNodeClicked).should('be.called');
            });
        });
    });

    it('should handle node double click events', () => {
        const onNodeDoubleClicked = cy.spy();
        config.componentProperties.onNodeDoubleClicked = onNodeDoubleClicked;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.wrap(onNodeDoubleClicked).should('be.not.called');
            cy.get('.svy-treeview').contains('Main group').dblclick().then(() => {
                cy.wrap(onNodeDoubleClicked).should('be.called');
            });
        });
    });

    it('should handle node right click events', () => {
        const onNodeRightClicked = cy.spy();
        config.componentProperties.onNodeRightClicked = onNodeRightClicked;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.wrap(onNodeRightClicked).should('be.not.called');
            cy.get('.svy-treeview').contains('Main group').trigger('contextmenu').then(() => {
                cy.wrap(onNodeRightClicked).should('be.called');
            });
        });
    });

    it('should handle node select events', () => {
        const onNodeSelected = cy.spy();
        config.componentProperties.onNodeSelected = onNodeSelected;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.wrap(onNodeSelected).should('be.not.called');
            cy.get('.svy-treeview').contains('Main group').click().then(() => {
                cy.wrap(onNodeSelected).should('be.called');
            });
        });
    });

    it('should handle node expand events', () => {
        const onNodeExpanded = cy.spy();
        config.componentProperties.onNodeExpanded = onNodeExpanded;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.wrap(onNodeExpanded).should('be.not.called');
            cy.get('.expand-icon-container i').then($el => {
                $el.css('visibility', 'visible');
                $el.css('display', 'block');
                $el.css('height', '10px');
            });
            cy.get('.expand-icon-container i').first().trigger('expand').then(() => {
                cy.wrap(onNodeExpanded).should('be.called');
            });
        });
    });

    it('should handle node collapse events', () => {
        const onNodeCollapsed = cy.spy();
        config.componentProperties.onNodeCollapsed = onNodeCollapsed;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.wrap(onNodeCollapsed).should('be.not.called');
            cy.get('.expand-icon-container i').then($el => {
                $el.css('visibility', 'visible');
                $el.css('display', 'block');
                $el.css('height', '10px');
            });
            cy.get('.expand-icon-container i').first().trigger('expand').trigger('collapse').then(() => {
                cy.wrap(onNodeCollapsed).should('be.called');
            });
        });
    });
});