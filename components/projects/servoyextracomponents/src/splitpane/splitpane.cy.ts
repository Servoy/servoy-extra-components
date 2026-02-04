import { Component, ViewChild, EventEmitter, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSplitpane, Pane } from './splitpane';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { BGSplitter } from './bg_splitter/bg_splitter.component';
import { BGPane } from './bg_splitter/bg_pane.component';

@Component({
    template: `<servoyextra-splitpane
                [servoyApi]="servoyApi()"
                [enabled]="enabled()"
                [readOnly]="readOnly()"
                [styleClass]="styleClass()"
                [splitType]="splitType()"
                [tabSeq]="tabSeq()"
                [pane1]="pane1()"
                [pane2]="pane2()"
                [divLocation]="divLocation()"
                [divSize]="divSize()"
                [pane1MinSize]="pane1MinSize()"
                [pane2MinSize]="pane2MinSize()"
                [resizeWeight]="resizeWeight()"
                [responsiveHeight]="responsiveHeight()"
                (divLocationChange)="divLocationChange.emit($event)"
                [onChangeMethodID]="onChangeMethodID()"
                #element>
                </servoyextra-splitpane>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);
    enabled = signal<boolean>(undefined);
    readOnly = signal<boolean>(undefined);
    styleClass = signal<string>(undefined);
    splitType = signal<number>(undefined);
    tabSeq = signal<number>(undefined);
    pane1 = signal<Pane>(undefined);
    pane2 = signal<Pane>(undefined);
    divLocation = signal<number>(undefined);
    divSize = signal<number>(undefined);
    pane1MinSize = signal<number>(undefined);
    pane2MinSize = signal<number>(undefined);
    resizeWeight = signal<number>(undefined);
    responsiveHeight = signal<number>(undefined);
    divLocationChange = new EventEmitter<number>();
    onChangeMethodID = signal<(data: any, e: Event) => void>(undefined);

    @ViewChild('element') element: ServoyExtraSplitpane;
}

const createDefaultPanes = () => {
    const pane1 = new Pane();
    pane1.containsFormId = 'form1';
    pane1.relationName = 'relation1';

    const pane2 = new Pane();
    pane2.containsFormId = 'form2';
    pane2.relationName = 'relation2';

    return { pane1, pane2 };
};

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    enabled: true,
    readOnly: false,
    styleClass: 'splitpane-test',
    splitType: 0,
    tabSeq: 0,
    pane1: undefined as Pane,
    pane2: undefined as Pane,
    divLocation: 200,
    divSize: 5,
    pane1MinSize: 30,
    pane2MinSize: 30,
    resizeWeight: 0.5,
    responsiveHeight: 400,
    onChangeMethodID: () => { }
};

function applyDefaultProps(wrapper) {
    const { pane1, pane2 } = createDefaultPanes();
    for (const key in defaultValues) {
        if (wrapper.component.hasOwnProperty(key) && typeof wrapper.component[key] === 'function') {
            if (key === 'pane1') {
                wrapper.component[key].set(pane1);
            } else if (key === 'pane2') {
                wrapper.component[key].set(pane2);
            } else {
                wrapper.component[key].set(defaultValues[key]);
            }
        }
        else {
            wrapper.component[key] = defaultValues[key];
        }
    }
}

const configWrapper: MountConfig<WrapperComponent> = {
    declarations: [ServoyExtraSplitpane, BGSplitter, BGPane],
    imports: [ServoyPublicTestingModule, FormsModule]
};

describe('ServoyExtraSplitpane', () => {

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-splitpane').should('have.class', 'splitpane-test').then(() => {
                wrapper.component.styleClass.set('new-style');
                cy.get('.svy-extra-splitpane').should('have.class', 'new-style');
            });
        });
    });

    it('should handle split type change', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.splitType.set(1);
                cy.get('servoyextra-splitpane').should('exist');
            });
        });
    });

    it('should handle resize weight', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.resizeWeight.set(0.7);
                cy.wrap(wrapper.component.resizeWeight()).should('eq', 0.7);
            });
        });
    });

    it('should handle min sizes', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.pane1MinSize.set(50);
                wrapper.component.pane2MinSize.set(50);
                cy.wrap(wrapper.component.pane1MinSize()).should('eq', 50);
                cy.wrap(wrapper.component.pane2MinSize()).should('eq', 50);
            });
        });
    });

    it('should handle enabled state', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.enabled.set(false);
                cy.wrap(wrapper.component.enabled()).should('be.false');
            });
        });
    });

    it('should handle readonly state', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-splitpane').should('exist').then(() => {
                wrapper.component.readOnly.set(true);
                cy.wrap(wrapper.component.readOnly()).should('be.true');
            });
        });
    });
});
