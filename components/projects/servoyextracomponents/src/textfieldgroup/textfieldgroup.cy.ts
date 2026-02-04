/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule, Format } from '@servoy/public';
import { ServoyExtraTextfieldGroup } from './textfieldgroup';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-textfieldgroup 
                    [servoyApi]="servoyApi()"
                    [onActionMethodID]="onActionMethodID"
                    [onFocusGainedMethodID]="onFocusGainedMethodID"
                    [onFocusLostMethodID]="onFocusLostMethodID"
                    [onRightClickMethodID]="onRightClickMethodID"
                    [dataProviderID]="dataProviderID()"
                    (dataProviderIDChange)="dataProviderIDChange($event)"
                    [enabled]="enabled()"
                    [faclass]="faclass()"
                    [format]="format()"
                    [inputType]="inputType()"
                    [inputValidation]="inputValidation()"
                    [invalidEmailMessage]="invalidEmailMessage()"
                    [placeholderText]="placeholderText()"
                    [readOnly]="readOnly()"
                    [styleClass]="styleClass()"
                    [tabSeq]="tabSeq()"
                    #element>
                </servoyextra-textfieldgroup>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onActionMethodID: (e: Event, data?: unknown) => void;
    onFocusGainedMethodID: (e: Event, data?: unknown) => void;
    onFocusLostMethodID: (e: Event, data?: unknown) => void;
    onRightClickMethodID: (e: Event, data?: unknown) => void;

    dataProviderID = signal<unknown>(undefined);
    dataProviderIDChange: (newData: unknown) => void;
    enabled = signal<boolean>(undefined);
    faclass = signal<string>(undefined);
    format = signal<Format>(undefined);
    inputType = signal<string>(undefined);
    inputValidation = signal<string>(undefined);
    invalidEmailMessage = signal<string>(undefined);
    placeholderText = signal<string>(undefined);
    readOnly = signal<boolean>(undefined);
    styleClass = signal<string>(undefined);
    tabSeq = signal<number>(undefined);

    @ViewChild('element') element: ServoyExtraTextfieldGroup;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    enabled: true,
    readOnly: false,
    format: { type: 'TEXT' } as Format,
    placeholderText: 'Enter text',
    inputType: 'text',
    dataProviderID: 'initialValue',
    faclass: '',
    inputValidation: '',
    invalidEmailMessage: '',
    styleClass: '',
    tabSeq: 0,
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
    declarations: [ServoyExtraTextfieldGroup],
    imports: [ServoyPublicTestingModule, FormsModule]
};

describe('ServoyExtraTextfieldGroup', () => {
    beforeEach(() => {
        defaultValues.enabled = true;
        defaultValues.readOnly = false;
        defaultValues.format = { type: 'TEXT' } as Format;
        defaultValues.placeholderText = 'Enter text';
        defaultValues.inputType = 'text';
        defaultValues.dataProviderID = 'initialValue';
        defaultValues.inputValidation = '';
        defaultValues.invalidEmailMessage = '';
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
        defaultValues.dataProviderID = 'myvalue';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.value', 'myvalue');
        });
    });

    it('should set the placeholder text', () => {
        defaultValues.placeholderText = 'Enter your name';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.attr', 'placeholder', 'Enter your name');
        });
    });

    it('show fa class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.input-group-text i').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.faclass.set('myfaclass');
                cy.get('.input-group-text i').should('have.class', 'myfaclass');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('input').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('input').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('input').should('have.class', 'classA').should('have.class', 'classB');
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

    it('should have the correct input type', () => {
        defaultValues.inputType = 'password';
        defaultValues.readOnly = false;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.attr', 'type', 'password');
        });
    });

    it('should handle onaction event', () => {
        const onActionMethodID = cy.stub();
        defaultValues.onActionMethodID = onActionMethodID;
        defaultValues.dataProviderID = 'initialValue';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.wrap(onActionMethodID).should('be.not.called');
            cy.get('input').should('have.value', 'initialValue').focus().type('{enter}').then(() => {
                cy.wrap(onActionMethodID).should('be.called');
            });
        });
    });

    it('should handle focus gained event', () => {
        const onFocusGainedMethodID = cy.stub();
        defaultValues.onFocusGainedMethodID = onFocusGainedMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.value', 'initialValue').focus().then(() => {
                cy.wrap(onFocusGainedMethodID).should('be.called');
            });
        });
    });

    it('should handle focus lost event', () => {
        const onFocusLostMethodID = cy.stub();
        defaultValues.onFocusLostMethodID = onFocusLostMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.value', 'initialValue').focus().blur().then(() => {
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
        defaultValues.dataProviderID = '';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input').type('New Value').blur();
            cy.wrap(dataProviderIDChange).should('have.been.calledWith', 'New Value');
        });
    });

    it('should not emit dataProviderIDChange event dataprovder change', () => {
        const dataProviderIDChange = cy.stub();
        defaultValues.dataProviderIDChange = dataProviderIDChange;
        defaultValues.dataProviderID = 'initialValue';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.value', 'initialValue').then(() => {
                wrapper.component.dataProviderID.set('new value');
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('input').should('have.value', 'new value')
            });
        });
    });

    it('should select text and return it', () => {
        const focusGainedSpy = cy.stub();
        defaultValues.onFocusGainedMethodID = focusGainedSpy;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.value', 'initialValue').should('not.have.focus').then(() => {
                wrapper.component.element.requestFocus(true);
                cy.get('input').should('have.focus');
                cy.wrap(focusGainedSpy).should('be.called');
            });
        });
    });

    it('should test email', () => {
        defaultValues.inputValidation = 'email';
        defaultValues.invalidEmailMessage = 'Invalid email format';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('input').should('have.value', 'initialValue').clear().type('invalid-email').blur();
            cy.get('.textfieldgroup-msg-error').should('exist').should('have.text', 'Invalid email format').then(() => {
                wrapper.component.dataProviderID.set('abc@abc.com');
                wrapper.fixture.detectChanges();
                cy.get('input').should('have.value', 'abc@abc.com');
                cy.get('.textfieldgroup-msg-error').should('not.exist');
            });
        });
    });
});