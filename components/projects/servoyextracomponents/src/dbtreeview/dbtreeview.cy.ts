/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraDbtreeview } from './dbtreeview';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { TreeModule, TreeComponent } from '@ali-hm/angular-tree-component';

@Component({
    template: `<servoyextra-dbtreeview 
                [servoyApi]="servoyApi()"
                [onDrop]="onDrop"
                [onReady]="onReady"
                [onRowDrop]="onRowDrop"
                [autoRefresh]="autoRefresh()"
                [enabled]="enabled()"
                [responsiveHeight]="responsiveHeight()"
                [showLoadingIndicator]="showLoadingIndicator()"
                [styleClass] = "styleClass()"
                #element>
                </servoyextra-dbtreeview>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onDrop = () => { };
    onReady = () => { };
    onRowDrop = () => { };

    autoRefresh = signal<boolean>(undefined);
    enabled = signal<boolean>(undefined);
    responsiveHeight = signal<number>(undefined);
    showLoadingIndicator = signal<boolean>(undefined);
    styleClass = signal<string>(undefined);
    displayNodes: any[];

    @ViewChild('element') element: ServoyExtraDbtreeview;
    @ViewChild('tree') tree: TreeComponent;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    styleClass: 'dbtreeview-test',
    autoRefresh: true,
    enabled: true,
    showLoadingIndicator: true,
    responsiveHeight: 0
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
    declarations: [ServoyExtraDbtreeview],
    imports: [ServoyPublicTestingModule, FormsModule, TreeModule]
};

describe('ServoyExtraDbtreeview', () => {
    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.dbtreeview').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.dbtreeview').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.dbtreeview').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.dbtreeview').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('.dbtreeview').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('when enabled state is changed through wrapper', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.dbtreeview-disabled').should('not.exist').then(_ => {
                wrapper.component.enabled.set(false);
                cy.get('.dbtreeview-disabled').should('exist');
            });
        });
    });
});