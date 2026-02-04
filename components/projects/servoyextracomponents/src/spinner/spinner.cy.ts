import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule, IValuelist } from '@servoy/public';
import { ServoyExtraSpinner } from './spinner';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-spinner
                [servoyApi]="servoyApi"
                [onActionMethodID]="onActionMethodID"
                [onFocusGainedMethodID]="onFocusGainedMethodID"
                [onFocusLostMethodID]="onFocusLostMethodID"
                [onRightClickMethodID]="onRightClickMethodID"
                [dataProviderID]="dataProviderID()"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                [displayTags]="displayTags()"
                [editable]="editable()"
                [enabled]="enabled()"
                [format]="format()"
                [placeholderText]="placeholderText()"
                [readOnly]="readOnly()"
                [responsiveHeight]="responsiveHeight()"
                [styleClass]="styleClass()"
                [tabSeq]="tabSeq()"
                [text]="text()"
                [toolTipText]="toolTipText()"
                [valuelistID]="valuelistID()"
                #element>
                </servoyextra-spinner>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onActionMethodID: (e: Event, data?: unknown) => void;
    onFocusGainedMethodID: (e: Event, data?: unknown) => void;
    onFocusLostMethodID: (e: Event, data?: unknown) => void;
    onRightClickMethodID: (e: Event, data?: unknown) => void;

    dataProviderID = signal<any>(undefined);
    dataProviderIDChange: (value: any) => void;
    displayTags = signal<boolean>(undefined);
    editable = signal<boolean>(undefined);
    enabled = signal<boolean>(undefined);
    format = signal<string>(undefined);
    placeholderText = signal<string>(undefined);
    readOnly = signal<boolean>(undefined);
    responsiveHeight = signal<number>(undefined);
    styleClass = signal<string>(undefined);
    tabSeq = signal<number>(undefined);
    text = signal<string>(undefined);
    toolTipText = signal<string>(undefined);
    valuelistID = signal<IValuelist>(undefined);

    @ViewChild('element') element: ServoyExtraSpinner;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    enabled: true,
    readOnly: false,
    styleClass: 'spinner-test',
    tabSeq: 0,
    dataProviderID: 1,
    valuelistID: null as IValuelist,
    editable: true,
    format: '#.00',
    toolTipText: 'Test tooltip',
    displayTags: false,
    responsiveHeight: 0,
    text: '',
    placeholderText: '',
    onActionMethodID: () => { },
    onFocusGainedMethodID: () => { },
    onFocusLostMethodID: () => { },
    onRightClickMethodID: () => { },
    dataProviderIDChange: () => { }
};

function applyDefaultProps(wrapper) {
    for (const key in defaultValues) {
        if (wrapper.component.hasOwnProperty(key) && typeof wrapper.component[key] === 'function') {
            wrapper.component[key].set(defaultValues[key]);
        }
        else {
            wrapper.component[key] = defaultValues[key];
        }
    }
}

const configWrapper: MountConfig<WrapperComponent> = {
    declarations: [ServoyExtraSpinner],
    imports: [ServoyPublicTestingModule, FormsModule]
};

describe('ServoyExtraSpinner', () => {
    beforeEach(() => {
        const mockData = [
            { realValue: 3, displayValue: 'Value 3' },
            { realValue: 1, displayValue: 'Value 1' },
            { realValue: 2, displayValue: 'Value 2' }
        ] as IValuelist;

        defaultValues.valuelistID = mockData;
        defaultValues.enabled = true;
        defaultValues.readOnly = false;
        defaultValues.styleClass = 'spinner-test';
        defaultValues.tabSeq = 0;
        defaultValues.dataProviderID = 1;
        defaultValues.editable = true;
        defaultValues.format = '#.00';
        defaultValues.toolTipText = 'Test tooltip';
    });

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should show the dataprovider value', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.value', 'Value 1');
        });
    });

    it('should set the placeholder text', () => {
        defaultValues.placeholderText = 'Enter your value';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.attr', 'placeholder', 'Enter your value');
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-spinner').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.svy-extra-spinner').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-spinner').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('.svy-extra-spinner').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should be read-only', () => {
        defaultValues.readOnly = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.attr', 'readonly');
        });
    });

    it('should handle onaction event', () => {
        const onActionMethodID = cy.stub();
        defaultValues.onActionMethodID = onActionMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.wrap(onActionMethodID).should('be.not.called');
            cy.get('input').click().then(() => {
                cy.wrap(onActionMethodID).should('be.called');
            });
        });
    });

    it('should handle focus gained event', () => {
        const onFocusGainedMethodID = cy.stub();
        defaultValues.onFocusGainedMethodID = onFocusGainedMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.spinner-button-up').should('exist').click().then(() => {
                cy.wrap(onFocusGainedMethodID).should('be.called');
            });
        });
    });

    it('should handle focus lost event', () => {
        const onFocusLostMethodID = cy.stub();
        defaultValues.onFocusLostMethodID = onFocusLostMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.spinner-button-up').should('exist').click({ force: true }).blur().then(() => {
                cy.wrap(onFocusLostMethodID).should('be.called');
            });
        });
    });

    it('should handle right click event', () => {
        const onRightClickMethodID = cy.stub();
        defaultValues.onRightClickMethodID = onRightClickMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').rightclick().then(() => {
                expect(onRightClickMethodID).to.have.been.called;
            });
        });
    });

    it('should emit dataProviderIDChange event on input change', () => {
        const dataProviderIDChange = cy.stub();
        defaultValues.dataProviderIDChange = dataProviderIDChange;
        defaultValues.dataProviderID = null;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.spinner-button-up').click().then(() => {
                cy.wrap(dataProviderIDChange).should('have.been.calledWith', 1);
            });
        });
    });

    it('should not emit dataProviderIDChange event dataprovder change', () => {
        const dataProviderIDChange = cy.stub();
        defaultValues.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.value', 'Value 1').then(() => {
                wrapper.component.dataProviderID.set(2);
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('input').should('have.value', 'Value 2');
            });
        });
    });

    it('should see the tooltip', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').trigger('pointerenter').then(() => {
                cy.get('div[id="mktipmsg"]').should('contain', 'Test tooltip');
            });
        });
    });
});