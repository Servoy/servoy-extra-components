/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild } from '@angular/core';
import { Format, IValuelist, ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSelect2Tokenizer } from './select2tokenizer';
import { Select2 } from 'ng-select2-component';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-select2tokenizer [servoyApi]="servoyApi"
                [onDataChangeMethodID]="onDataChangeMethodID"
                [onFocusGainedMethodID]="onFocusGainedMethodID"
                [onFocusLostMethodID]="onFocusLostMethodID"
                [allowNewEntries] = "allowNewEntries"
                [clearSearchTextOnSelect] = "clearSearchTextOnSelect"
                [closeOnSelect] = "closeOnSelect"
                [containSearchText] = "containSearchText"
                [dataProviderID] = "dataProviderID"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                [editable] = "editable"
                [enabled] = "enabled"
                [maximumSelectionSize] = "maximumSelectionSize"
                [noMatchesFoundText] = "noMatchesFoundText"
                [openOnUnselect] = "openOnUnselect"
                [placeholderText] = "placeholderText"
                [selectOnClose] = "selectOnClose"
                [styleClass] = "styleClass"
                [tabSeq] = "tabSeq"
                [toolTipText] = "toolTipText"
                [valuelistID] = "valuelistID"
                [format] = "format"
                [readOnly] = "readOnly"
                [hideSelectedItems] = "hideSelectedItems"
                [overlayMode] = "overlayMode"
                #element>
                </servoyextra-select2tokenizer>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onDataChangeMethodID: (e: Event, data?: unknown) => void;
    onFocusGainedMethodID: (e: Event, data?: unknown) => void;
    onFocusLostMethodID: (e: Event, data?: unknown) => void;

    allowNewEntries: boolean;
    clearSearchTextOnSelect: boolean;
    closeOnSelect: boolean;
    containSearchText: boolean;
    dataProviderID: unknown;
    editable: boolean;
    enabled: boolean;
    maximumSelectionSize: number;
    noMatchesFoundText: string;
    openOnUnselect: boolean;
    placeholderText: string;
    selectOnClose: boolean;
    styleClass: string;
    tabSeq: number;
    toolTipText: string;
    valuelistID: IValuelist;
    format: Format;
    readOnly: boolean;
    hideSelectedItems: boolean;
    overlayMode: boolean;

    dataProviderIDChange = (newData: unknown) => { };

    @ViewChild('element') element: ServoyExtraSelect2Tokenizer;
    @ViewChild(Select2) select2: Select2;
}

describe('ServoyExtraSelect2Tokenizer', () => {
    let servoyApiSpy;
    let mockData;

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraSelect2Tokenizer],
        imports: [ServoyPublicTestingModule, FormsModule, Select2]
    }

    beforeEach(() => {
        servoyApiSpy = new ServoyApiTesting();

        mockData = [{
            "displayValue": "one",
            "realValue": 1
        },
        {
            "displayValue": "two",
            "realValue": 2
        },
        {
            "displayValue": "three",
            "realValue": 3
        },
        {
            "displayValue": "four",
            "realValue": 4
        }] as IValuelist;
        mockData.hasRealValues = () => { return true; };
        mockData.filterList = (value) => { return mockData.filter(item => item.displayValue.includes(value)); };
        mockData.getDisplayValue = (value) => { return mockData.filter(item => item.realValue === value)[0].displayValue; };

        config.componentProperties = {
            servoyApi: servoyApiSpy,
            allowNewEntries: false,
            clearSearchTextOnSelect: false,
            closeOnSelect: true,
            containSearchText: true,
            dataProviderID: '1',
            editable: true,
            enabled: true,
            maximumSelectionSize: 0,
            noMatchesFoundText: 'No matches found',
            openOnUnselect: true,
            placeholderText: 'Select...',
            selectOnClose: true,
            styleClass: 'select2-sm',
            tabSeq: 0,
            toolTipText: '',
            valuelistID: mockData,
            format: { "type": "TEXT" } as Format,
            readOnly: false,
            hideSelectedItems: false
        };

        cy.mount(WrapperComponent, config);
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should set the placeholder text', () => {
        config.componentProperties.dataProviderID = '';
        config.componentProperties.placeholderText = 'Enter your name';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2 ul span').should('have.text', config.componentProperties.placeholderText);
        });
    });

    it('should show the dataprovider value', () => {
        config.componentProperties.dataProviderID = '2';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2 ul li').should('have.attr', 'title', 'two');
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('select2').closest('div').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('select2').closest('div').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('select2').closest('div').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('select2').closest('div').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should be read-only', () => {
        config.componentProperties.readOnly = true;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').should('have.attr', 'ng-reflect-readonly', 'true');
        });
    });

    it('should be editable', () => {
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').should('not.have.attr', 'ng-reflect-readonly', 'true');
        });
    });

    it('should handle select on enter', () => {
        cy.mount(WrapperComponent, config).then(() => {
            // you need to test if the value is there for the component to be fully initialized
            // just getting the input (of the textbox) can result in that it is not fully mounted yet (svnOnchanges not called yet)
            // and focus() will bomb out because the Format property is not yet set
            cy.get('select2 ul li').first().should('have.attr', 'title', 'one').focus().then(() => {
                // see the commands.ts file in the cypress/support folder for the have.selection example
                cy.get('select2 ul li').should('have.attr', 'title', 'one');
            });
        });
    });

    it('should handle focus gained event', () => {
        const onFocusGainedMethodID = cy.stub();
        config.componentProperties.onFocusGainedMethodID = onFocusGainedMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').click().then(() => {
                cy.wrap(onFocusGainedMethodID).should('be.called');
            });
        });
    });

    it('should handle focus lost event', () => {
        const onFocusLostMethodID = cy.stub();
        config.componentProperties.onFocusLostMethodID = onFocusLostMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').click().click({ force: true }).then(() => {
                cy.wrap(onFocusLostMethodID).should('be.called');
            });
        });
    });

    it('should emit dataProviderIDChange event on input change', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        config.componentProperties.dataProviderID = '';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').click().then(() => {
                cy.get('input').type('two{enter}').then(() => {
                    cy.wrap(dataProviderIDChange).should('have.been.calledWith', 2);
                });
            });
        });
    });

    it('should not emit dataProviderIDChange event dataprovider change', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(wrapper => {

            cy.get('select2 ul li').should('have.attr', 'title', 'one').then(() => {
                wrapper.component.dataProviderID = '2';
                wrapper.fixture.detectChanges();
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('select2 ul li').should('have.attr', 'title', 'two');
            });
        });
    });

     it('should multiselect on dataprovider change', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(wrapper => {

            cy.get('select2 ul li').should('have.attr', 'title', 'one').then(() => {
                wrapper.component.dataProviderID = '2\n3';
                wrapper.fixture.detectChanges();
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('select2 ul li').should('have.attr', 'title', 'two');
                cy.get('select2 ul li:nth-child(3)').should('have.attr', 'title', 'three');
            });
        });
    });

     it('should select one not in the list', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(wrapper => {

            cy.get('select2 ul li').should('have.attr', 'title', 'one').then(() => {
                wrapper.component.dataProviderID = '5';
                wrapper.fixture.detectChanges();
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('select2 ul li').should('have.attr', 'title', '5');
            });
        });
    });

    it('change valuelist and dataprovider together', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(wrapper => {

            cy.get('select2 ul li').should('have.attr', 'title', 'one').then(() => {
                wrapper.component.valuelistID =[{
                    "displayValue": "AAAA",
                    "realValue": "AAAA"
                },
                {
                    "displayValue": "BBBB",
                    "realValue": "BBBB"
                },
                {
                    "displayValue": "CCCC",
                    "realValue": "CCCC"
                },
                {
                    "displayValue": "DDDD",
                    "realValue": "DDDD"
                }] as IValuelist;
                wrapper.component.dataProviderID = 'AAAA';
                wrapper.fixture.detectChanges();
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('select2 ul li').should('have.attr', 'title', 'AAAA');
            });
        });
    });

    it('should select the highlighted item on close', () => {
        config.componentProperties.dataProviderID = '';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').click().then(() => {
                cy.get('input').type('{downarrow}').then(() => {
                    cy.get('select2').click({ force: true }).then(() => {
                        cy.get('select2 ul li').should('have.attr', 'title', 'two');
                    });
                });
            });
        });
    });

    it('should not select the highlighted item on close', () => {
        config.componentProperties.dataProviderID = '';
        config.componentProperties.selectOnClose = false;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').click().then(() => {
                cy.get('input').type('{downarrow}').then(() => {
                    cy.get('select2').click({ force: true }).then(() => {
                        cy.get('select2 ul span').should('have.text', config.componentProperties.placeholderText);
                    });
                });
            });
        });
    });
    
    it('should hide selected items', () => {
        config.componentProperties.hideSelectedItems = true;
        config.componentProperties.selectOnClose = false;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').click().then(() => {
                cy.get('.select2-results ul li div').should('have.length', 3);
                cy.get('.select2-results ul li div').eq(0).should('have.text', 'two');
                cy.get('.select2-results ul li div').eq(1).should('have.text', 'three');
                cy.get('.select2-results ul li div').eq(2).should('have.text', 'four');
            });
        });
    });
    
    it('should not hide selected items', () => {
        config.componentProperties.selectOnClose = false;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('select2').click().then(() => {
                cy.get('.select2-results ul li div').should('have.length', 4);
                cy.get('.select2-results ul li div').eq(0).should('have.text', 'one');
                cy.get('.select2-results ul li div').eq(1).should('have.text', 'two');
                cy.get('.select2-results ul li div').eq(2).should('have.text', 'three');
                cy.get('.select2-results ul li div').eq(3).should('have.text', 'four');
            });
        });
    });
    
    it('should have ovarlay when dropdown list is open', () => {
        config.componentProperties.overlayMode = true;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('select2').click().then(() => {
                cy.get('.cdk-overlay-container').should('exist');
            });
        });
    });

    it('should not have ovarlay when dropdown list is open', () => {
        config.componentProperties.overlayMode = false;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('select2').click().then(() => {
                cy.get('.cdk-overlay-container').should('not.exist');
            });
        });
    });
});