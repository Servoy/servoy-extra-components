import { Component, ViewChild } from '@angular/core';
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
                [dataProviderID]="dataProviderID"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                [displayTags]="displayTags"
                [editable]="editable"
                [enabled]="enabled"
                [format]="format"
                [placeholderText]="placeholderText"
                [readOnly]="readOnly"
                [responsiveHeight]="responsiveHeight"
                [styleClass]="styleClass"
                [tabSeq]="tabSeq"
                [text]="text"
                [toolTipText]="toolTipText"
                [valuelistID]="valuelistID"
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

    dataProviderID: any;
    dataProviderIDChange: (value: any) => void;
    displayTags: boolean;
    editable: boolean;
    enabled: boolean;
    format: string;
    placeholderText: string;
    readOnly: boolean;
    responsiveHeight: number;
    styleClass: string;
    tabSeq: number;
    text: string;
    toolTipText: string;
    valuelistID: IValuelist;

    @ViewChild('element') element: ServoyExtraSpinner;
}

describe('ServoyExtraSpinner', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraSpinner],
        imports: [ServoyPublicTestingModule, FormsModule]
    }

    beforeEach(() => {
        const mockData = [
            { realValue: 3, displayValue: 'Value 3' },
            { realValue: 1, displayValue: 'Value 1' },
            { realValue: 2, displayValue: 'Value 2' }
        ] as IValuelist;

        config.componentProperties = {
            servoyApi: servoyApiSpy,
            enabled: true,
            readOnly: false,
            styleClass: 'spinner-test',
            tabSeq: 0,
            dataProviderID: 1,
            valuelistID: mockData,
            editable: true,
            format: '#.00',
            toolTipText: 'Test tooltip'
        };
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
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.value', 'Value 1');
        });
    });

    it('should set the placeholder text', () => {
        config.componentProperties.placeholderText = 'Enter your value';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.attr', 'placeholder', 'Enter your value');
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-spinner').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-spinner').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-spinner').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-spinner').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should be read-only', () => {
        config.componentProperties.readOnly = true;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input').should('have.attr', 'readonly');
        });
    });

    it('should handle onaction  event', () => {
        const onActionMethodID = cy.stub();
        config.componentProperties.onActionMethodID = onActionMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.wrap(onActionMethodID).should('be.not.called');
            cy.get('input').click().then(() => {
                cy.wrap(onActionMethodID).should('be.called');
            });
        });
    });

    it('should handle focus gained event', () => {
        const onFocusGainedMethodID = cy.stub();
        config.componentProperties.onFocusGainedMethodID = onFocusGainedMethodID;
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.spinner-button-up').should('exist').click({ force: true }).then(() => {
                cy.wrap(onFocusGainedMethodID).should('be.called');
            });
        });
    });

    it('should handle focus lost event', () => {
        const onFocusLostMethodID = cy.stub();
        config.componentProperties.onFocusLostMethodID = onFocusLostMethodID;
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.spinner-button-up').should('exist').click({ force: true }).blur().then(() => {
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
        cy.get('.spinner-button-up').click().then(() => {
            cy.wrap(dataProviderIDChange).should('have.been.calledWith', 1);
        });
    });

    it('should not emit dataProviderIDChange event dataprovder change', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('input').should('have.value', 'Value 1').then(() => {
                wrapper.component.dataProviderID = 2;
                wrapper.fixture.detectChanges();
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('input').should('have.value', 'Value 2');
            });
        });
    });

    it('should see the tooltip', () => {
        cy.mount(WrapperComponent, config).then((wrapper) => {
            cy.get('input').trigger('pointerenter').then(() => {
                cy.get('div[id="mktipmsg"]').should('contain', 'Test tooltip');
            });
        });
    });
});