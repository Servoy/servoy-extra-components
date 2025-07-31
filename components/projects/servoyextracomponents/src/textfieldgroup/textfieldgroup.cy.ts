/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule, Format } from '@servoy/public';
import { ServoyExtraTextfieldGroup } from './textfieldgroup';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-textfieldgroup 
                    [servoyApi]="servoyApi"
                    [onActionMethodID] = "onActionMethodID"
                    [onFocusGainedMethodID] = "onFocusGainedMethodID"
                    [onFocusLostMethodID] = "onFocusLostMethodID"
                    [onRightClickMethodID] = "onRightClickMethodID"
                    [dataProviderID]="dataProviderID"
                    (dataProviderIDChange)="dataProviderIDChange($event)"
                    [enabled]="enabled"
                    [faclass] = "faclass"
                    [format]="format"
                    [inputType] = "inputType"
                    [inputValidation]="inputValidation"
                    [invalidEmailMessage]="invalidEmailMessage"
                    [placeholderText]="placeholderText"
                    [readOnly]="readOnly"
                    [styleClass]="styleClass"
                    [tabSeq]="tabSeq"
                    #element>
                </servoyextra-textfieldgroup>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onActionMethodID: (e: Event, data?: unknown) => void;
    onFocusGainedMethodID: (e: Event, data?: unknown) => void;
    onFocusLostMethodID: (e: Event, data?: unknown) => void;
    onRightClickMethodID: (e: Event, data?: unknown) => void;

    dataProviderID: unknown;
    dataProviderIDChange = (newData: unknown) => { };
    enabled: boolean;
    faclass: string;
    format: Format = { type: 'TEXT' } as Format
    inputType: string;
    inputValidation: string;
    invalidEmailMessage: string;
    placeholderText: string;
    readOnly: boolean;
    styleClass: string;
    tabSeq: number;

    @ViewChild('element') element: ServoyExtraTextfieldGroup;
}

describe('ServoyExtraTextfieldGroup', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraTextfieldGroup],
        imports: [ServoyPublicTestingModule, FormsModule]
    }

    beforeEach(() => {
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            enabled: true,
            readOnly: false,
            format: { type: 'TEXT' } as Format,
            placeholderText: 'Enter text',
            inputType: 'text',
            dataProviderID: 'initialValue'
        }
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should show the dataprovider value', () => {
        config.componentProperties.dataProviderID = 'myvalue';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.value', 'myvalue');
        });
    });

    it('should set the placeholder text', () => {
        config.componentProperties.placeholderText = 'Enter your name';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Enter your name');
        });
    });

    it('show fa class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.input-group-text i').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.faclass = 'myfaclass';
                wrapper.fixture.detectChanges();
                cy.get('.input-group-text i').should('have.class', 'myfaclass');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('input').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('input').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('input').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('input').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should be read-only', () => {
        config.componentProperties.readOnly = true;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.attr', 'readonly');
        });
    });

    it('should have the correct input type', () => {
        config.componentProperties.inputType = 'password';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.attr', 'type', 'password');
        });
    });

    it('should handle onaction  event', () => {
        const onActionMethodID = cy.stub();
        config.componentProperties.onActionMethodID = onActionMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.wrap(onActionMethodID).should('be.not.called');
            cy.get('input').should('have.value', 'initialValue').focus().type('{enter}').then(() => {
                cy.wrap(onActionMethodID).should('be.called');
            });
        });
    });

    it('should handle focus gained event', () => {
        const onFocusGainedMethodID = cy.stub();
        config.componentProperties.onFocusGainedMethodID = onFocusGainedMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.value', 'initialValue').focus().then(() => {
                cy.wrap(onFocusGainedMethodID).should('be.called');
            });
        });
    });

    it('should handle focus lost event', () => {
        const onFocusLostMethodID = cy.stub();
        config.componentProperties.onFocusLostMethodID = onFocusLostMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.value', 'initialValue').focus().blur().then(() => {
                cy.wrap(onFocusLostMethodID).should('be.called');
            });
        });
    });

    it('should handle right click event', () => {
        const onRightClickMethodID = cy.stub();
        config.componentProperties.onRightClickMethodID = onRightClickMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').rightclick().then(() => {
                expect(onRightClickMethodID).to.have.been.called;
            });
        });
    });

    it('should emit dataProviderIDChange event on input change', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        config.componentProperties.dataProviderID = '';
        cy.mount(WrapperComponent, config);
        cy.get('input').type('New Value').blur();
        cy.wrap(dataProviderIDChange).should('have.been.calledWith', 'New Value');
    });

    it('should not emit dataProviderIDChange event dataprovder change', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(wrapper => {

            cy.get('input').should('have.value', 'initialValue').then(() => {
                wrapper.component.dataProviderID = 'new value';
                wrapper.fixture.detectChanges();
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('input').should('have.value', 'new value')
            });
        });
    });

    it('should select text and return it', () => {
        const focusGainedSpy = cy.stub();
        config.componentProperties.onFocusGainedMethodID = focusGainedSpy;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('input').should('have.value', 'initialValue').should('not.have.focus').then(() => {
                wrapper.component.element.requestFocus(true);
                cy.get('input').should('have.focus');
                cy.wrap(focusGainedSpy).should('be.called');
            });
        });
    });

    it('should test email', () => {
        config.componentProperties.inputValidation = 'email';
        config.componentProperties.invalidEmailMessage = 'Invalid email format';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.textfieldgroup-msg-error').should('exist').should('have.text', 'Invalid email format').then(() => {
                wrapper.component.dataProviderID = 'abc@abc.com';
                wrapper.fixture.detectChanges();
                cy.get('.textfieldgroup-msg-error').should('not.exist');
            });

        });
    });
});