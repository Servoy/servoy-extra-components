import { Component, ViewChild, EventEmitter } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSplitpane, Pane } from './splitpane';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { BGSplitter } from './bg_splitter/bg_splitter.component';
import { BGPane } from './bg_splitter/bg_pane.component';

@Component({
    template: `<servoyextra-splitpane
                [servoyApi]="servoyApi"
                [enabled]="enabled"
                [readOnly]="readOnly"
                [styleClass]="styleClass"
                [splitType]="splitType"
                [tabSeq]="tabSeq"
                [pane1]="pane1"
                [pane2]="pane2"
                [divLocation]="divLocation"
                [divSize]="divSize"
                [pane1MinSize]="pane1MinSize"
                [pane2MinSize]="pane2MinSize"
                [resizeWeight]="resizeWeight"
                [responsiveHeight]="responsiveHeight"
                (divLocationChange)="divLocationChange.emit($event)"
                [onChangeMethodID]="onChangeMethodID"
                #element>
                </servoyextra-splitpane>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;
    enabled: boolean;
    readOnly: boolean;
    styleClass: string;
    splitType: number;
    tabSeq: number;
    pane1: Pane;
    pane2: Pane;
    divLocation: number;
    divSize: number;
    pane1MinSize: number;
    pane2MinSize: number;
    resizeWeight: number;
    responsiveHeight: number;
    divLocationChange = new EventEmitter<number>();
    onChangeMethodID: (data:any, e: Event) => void;

    @ViewChild('element') element: ServoyExtraSplitpane;
}

describe('ServoyExtraSplitpane', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraSplitpane, BGSplitter, BGPane],
        imports: [ServoyPublicTestingModule, FormsModule]
    }

    beforeEach(() => {
        const pane1 = new Pane();
        pane1.containsFormId = 'form1';
        pane1.relationName = 'relation1';

        const pane2 = new Pane();
        pane2.containsFormId = 'form2';
        pane2.relationName = 'relation2';

        config.componentProperties = {
            servoyApi: servoyApiSpy,
            enabled: true,
            readOnly: false,
            styleClass: 'splitpane-test',
            splitType: 0, // horizontal split
            tabSeq: 0,
            pane1: pane1,
            pane2: pane2,
            divLocation: 200,
            divSize: 5,
            pane1MinSize: 30,
            pane2MinSize: 30,
            resizeWeight: 0.5,
            responsiveHeight: 400
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-splitpane').should('have.class', 'splitpane-test').then(() => {
                wrapper.component.styleClass = 'new-style';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-splitpane').should('have.class', 'new-style');
            });
        });
    });

    /*it('should handle div location change', () => {
        const onChangeMethodID = cy.stub();
        config.componentProperties.onChangeMethodID = onChangeMethodID;

        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('bg-splitter').should('be.visible').then($splitter => {
                // Get initial position
                const initialLocation = wrapper.component.divLocation;

                // Simulate drag and drop
                cy.wrap($splitter)
                    .trigger('mousedown', { clientX: initialLocation })
                    .trigger('mousemove', { clientX: initialLocation + 100 })
                    .trigger('mouseup', { force: true });

                // Verify the change handler was called
                cy.wrap(onChangeMethodID).should('be.called');

                // Verify the div location changed
                cy.get('bg-splitter').should('have.attr', 'position')
                    .and('not.eq', initialLocation.toString());
            });
        });
    });*/

    it('should handle split type change', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.splitType = 1; // vertical split
                wrapper.fixture.detectChanges();
                cy.get('servoyextra-splitpane').should('exist');
            });
        });
    });

    it('should handle resize weight', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.resizeWeight = 0.7;
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.resizeWeight).should('eq', 0.7);
            });
        });
    });

    it('should handle min sizes', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.pane1MinSize = 50;
                wrapper.component.pane2MinSize = 50;
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.pane1MinSize).should('eq', 50);
                cy.wrap(wrapper.component.element.pane2MinSize).should('eq', 50);
            });
        });
    });

    it('should handle enabled state', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.enabled = false;
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.enabled).should('be.false');
            });
        });
    });

    it('should handle readonly state', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.readOnly = true;
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.readOnly).should('be.true');
            });
        });
    });
});
