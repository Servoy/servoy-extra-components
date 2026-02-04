/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraTreeview } from './treeview';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { AngularTreeGridModule, AngularTreeGridComponent } from 'angular-tree-grid';
import { ServoyExtraTreeviewCellRenderer } from './cellrenderer';

@Component({
    template: `<servoyextra-treeview 
                [servoyApi]="servoyApi()"
                (click)="onNodeClicked($event, $event.data)"
                (dblclick)="onNodeDoubleClicked($event, $event.data)"
                (contextmenu)="onNodeRightClicked($event, $event.data)"
                (click)="onNodeSelected($event, $event.data)"
                (expand)="onNodeExpanded($event)"
                (collapse)="onNodeCollapsed($event)"
                [jsDataSet]="jsDataSet()"
                [styleClass] = "styleClass()"
                #element>
                </servoyextra-treeview>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onNodeClicked = () => { };
    onNodeCollapsed = () => { };
    onNodeDoubleClicked = () => { };
    onNodeExpanded = () => { };
    onNodeRightClicked = () => { };
    onNodeSelected = () => { };
    onReady = () => { };
    onRowDrop = () => { };

    jsDataSet = signal<any[]>(undefined);
    styleClass = signal<string>(undefined);

    @ViewChild('element') element: ServoyExtraTreeview;
    @ViewChild('angularGrid') angularGrid: AngularTreeGridComponent;
}

const defaultValues = {
    jsDataSet: null as any[],
    styleClass: '',
    servoyApi: new ServoyApiTesting(),
    onNodeClicked: () => { },
    onNodeCollapsed: () => { },
    onNodeDoubleClicked: () => { },
    onNodeExpanded: () => { },
    onNodeRightClicked: () => { },
    onNodeSelected: () => { },
    onReady: () => { },
    onRowDrop: () => { }
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
    declarations: [ServoyExtraTreeview, ServoyExtraTreeviewCellRenderer],
    imports: [ServoyPublicTestingModule, FormsModule, AngularTreeGridModule]
};

describe('ServoyExtraTreeview', () => {

    beforeEach(() => {
        const treeData = [
            ['id', 'pid', 'treeColumn', 'fa-icon'],
            ['1', null, 'Main group', null],
            ['2', null, 'Second group', null],
            ['3', '2', 'Subgroup', null],
            ['4', '3', 'Mark', null],
            ['5', '3', 'George', null]
        ];
        defaultValues.jsDataSet = treeData;
        defaultValues.styleClass = '';
        defaultValues.onNodeClicked = () => { };
        defaultValues.onNodeCollapsed = () => { };
        defaultValues.onNodeDoubleClicked = () => { };
        defaultValues.onNodeExpanded = () => { };
        defaultValues.onNodeRightClicked = () => { };
        defaultValues.onNodeSelected = () => { };
    });

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.svy-treeview').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-treeview').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.svy-treeview').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-treeview').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('.svy-treeview').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should handle node click events', () => {
        const onNodeClicked = cy.spy();
        defaultValues.onNodeClicked = onNodeClicked;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.wrap(onNodeClicked).should('be.not.called');
            cy.get('.svy-treeview').contains('Main group').click().then(() => {
                cy.wrap(onNodeClicked).should('be.called');
            });
        });
    });

    it('should handle node double click events', () => {
        const onNodeDoubleClicked = cy.spy();
        defaultValues.onNodeDoubleClicked = onNodeDoubleClicked;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.wrap(onNodeDoubleClicked).should('be.not.called');
            cy.get('.svy-treeview').contains('Main group').dblclick().then(() => {
                cy.wrap(onNodeDoubleClicked).should('be.called');
            });
        });
    });

    it('should handle node right click events', () => {
        const onNodeRightClicked = cy.spy();
        defaultValues.onNodeRightClicked = onNodeRightClicked;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.wrap(onNodeRightClicked).should('be.not.called');
            cy.get('.svy-treeview').contains('Main group').trigger('contextmenu').then(() => {
                cy.wrap(onNodeRightClicked).should('be.called');
            });
        });
    });

    it('should handle node select events', () => {
        const onNodeSelected = cy.spy();
        defaultValues.onNodeSelected = onNodeSelected;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.wrap(onNodeSelected).should('be.not.called');
            cy.get('.svy-treeview').contains('Main group').click().then(() => {
                cy.wrap(onNodeSelected).should('be.called');
            });
        });
    });

    it('should handle node expand events', () => {
        const onNodeExpanded = cy.spy();
        defaultValues.onNodeExpanded = onNodeExpanded;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
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
        defaultValues.onNodeCollapsed = onNodeCollapsed;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
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