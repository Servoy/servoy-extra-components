/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraDbtreeview } from './dbtreeview';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { TreeModule, TreeComponent } from '@ali-hm/angular-tree-component';

@Component({
    template: `<servoyextra-dbtreeview 
                [servoyApi]="servoyApi"
                [onDrop]="onDrop"
                [onReady]="onReady"
                [onRowDrop]="onRowDrop"
                [autoRefresh]="autoRefresh"
                [enabled]="enabled"
                [responsiveHeight]="responsiveHeight"
                [showLoadingIndicator]="showLoadingIndicator"
                [styleClass] = "styleClass"
                #element>
                </servoyextra-dbtreeview>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;
    
    onDrop: (e: Event, data?: unknown) => void = () => {};
    onReady: (e: Event, data?: unknown) => void = () => {};
    onRowDrop: (e: Event, data?: unknown) => void = () => {};

    autoRefresh: boolean;
    enabled: boolean;
    responsiveHeight: number;
    showLoadingIndicator: boolean;
    styleClass: string;
    displayNodes: any[];

    @ViewChild('element') element: ServoyExtraDbtreeview;
    @ViewChild('tree') tree: TreeComponent;
}

describe('ServoyExtraDbtreeview', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraDbtreeview],
        imports: [ServoyPublicTestingModule, FormsModule, TreeModule]
    }

    beforeEach(() => {
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            styleClass: 'dbtreeview-test',
            autoRefresh: true,
            enabled: true,
            showLoadingIndicator: true
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.dbtreeview').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.dbtreeview').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('.dbtreeview').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.dbtreeview').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('.dbtreeview').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });
    
    it('when enabled state is changed through wrapper', () => {
        cy.mount(WrapperComponent, config).then((wrapper) => {
            cy.get('.dbtreeview-disabled').should('not.exist').then(_ => {
                wrapper.component.enabled = false;
                wrapper.fixture.detectChanges();
                cy.get('.dbtreeview-disabled').should('exist');
            });
        });
    });
});