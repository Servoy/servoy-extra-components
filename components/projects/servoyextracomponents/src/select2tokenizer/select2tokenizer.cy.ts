/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild, signal } from '@angular/core';
import { Format, IValuelist, ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSelect2Tokenizer } from './select2tokenizer';
import { Select2 } from 'ng-select2-component';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
    template: `<servoyextra-select2tokenizer [servoyApi]="servoyApi()"
                [onDataChangeMethodID]="onDataChangeMethodID"
                [onFocusGainedMethodID]="onFocusGainedMethodID"
                [onFocusLostMethodID]="onFocusLostMethodID"
                [allowNewEntries] = "allowNewEntries()"
                [clearSearchTextOnSelect] = "clearSearchTextOnSelect()"
                [closeOnSelect] = "closeOnSelect()"
                [containSearchText] = "containSearchText()"
                [dataProviderID] = "dataProviderID()"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                [editable] = "editable()"
                [enabled] = "enabled()"
                [maximumSelectionSize] = "maximumSelectionSize()"
                [noMatchesFoundText] = "noMatchesFoundText()"
                [openOnUnselect] = "openOnUnselect()"
                [placeholderText] = "placeholderText()"
                [selectOnClose] = "selectOnClose()"
                [styleClass] = "styleClass()"
                [tabSeq] = "tabSeq()"
                [toolTipText] = "toolTipText()"
                [valuelistID] = "valuelistID()"
                [format] = "format()"
                [readOnly] = "readOnly()"
                [hideSelectedItems] = "hideSelectedItems()"
                [overlayMode] = "overlayMode()"
                #element>
                </servoyextra-select2tokenizer>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onDataChangeMethodID = () => { };
    onFocusGainedMethodID = () => { };
    onFocusLostMethodID = () => { };

    allowNewEntries = signal<boolean>(undefined);
    clearSearchTextOnSelect = signal<boolean>(undefined);
    closeOnSelect = signal<boolean>(undefined);
    containSearchText = signal<boolean>(undefined);
    dataProviderID = signal<unknown>(undefined);
    editable = signal<boolean>(undefined);
    enabled = signal<boolean>(undefined);
    maximumSelectionSize = signal<number>(undefined);
    noMatchesFoundText = signal<string>(undefined);
    openOnUnselect = signal<boolean>(undefined);
    placeholderText = signal<string>(undefined);
    selectOnClose = signal<boolean>(undefined);
    styleClass = signal<string>(undefined);
    tabSeq = signal<number>(undefined);
    toolTipText = signal<string>(undefined);
    valuelistID = signal<IValuelist>(undefined);
    format = signal<Format>(undefined);
    readOnly = signal<boolean>(undefined);
    hideSelectedItems = signal<boolean>(undefined);
    overlayMode = signal<boolean>(undefined);

    dataProviderIDChange = () => { };

    @ViewChild('element') element: ServoyExtraSelect2Tokenizer;
    @ViewChild(Select2) select2: Select2;
}

const mockData = [{
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
mockData.filterList = (value) => { return of(mockData.filter(item => item.displayValue.includes(value))); };
mockData.getDisplayValue = (value) => {
    const item = mockData.find(({ realValue }) => realValue === value);
    if (item) return of(item.displayValue);
    return of(value + '');
};

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    allowNewEntries: true,
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
    hideSelectedItems: false,
    overlayMode: undefined,
    onDataChangeMethodID: undefined,
    onFocusGainedMethodID: undefined,
    onFocusLostMethodID: undefined
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
    declarations: [ServoyExtraSelect2Tokenizer],
    imports: [ServoyPublicTestingModule, FormsModule, Select2]
};

describe('ServoyExtraSelect2Tokenizer', () => {

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('select2').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should set the placeholder text', () => {
        defaultValues.dataProviderID = '';
        defaultValues.placeholderText = 'Enter your name';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('select2 ul span').should('have.text', defaultValues.placeholderText);
        });
    });

    it('should show the dataprovider value', () => {
        defaultValues.dataProviderID = '2';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('select2 ul li').should('have.attr', 'title', 'two');
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('select2').closest('div').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('select2').closest('div').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('select2').closest('div').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('select2').closest('div').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should be read-only', () => {
        defaultValues.readOnly = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('div.select2-container--readonly').should('exist');
        });
    });

    it('should be editable', () => {
        defaultValues.readOnly = false;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('div.select2-container--readonly').should('not.exist');
        });
    });

    it('should handle select on enter', () => {
        defaultValues.dataProviderID = '1';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('select2 ul li').first().should('have.attr', 'title', 'one').focus().then(() => {
                cy.get('select2 ul li').should('have.attr', 'title', 'one');
            });
        });
    });

    it('should handle focus gained event', () => {
        const onFocusGainedMethodID = cy.stub();
        defaultValues.onFocusGainedMethodID = onFocusGainedMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('select2').click().then(() => {
                cy.wrap(onFocusGainedMethodID).should('be.called');
            });
        });
    });

    it('should handle focus lost event', () => {
        const onFocusLostMethodID = cy.stub();
        defaultValues.onFocusLostMethodID = onFocusLostMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('select2').click().click({ force: true }).then(() => {
                cy.wrap(onFocusLostMethodID).should('be.called');
            });
        });
    });

    it('should emit dataProviderIDChange event on input change', () => {
        const dataProviderIDChange = cy.stub();
        defaultValues.dataProviderID = '';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            wrapper.component.dataProviderIDChange = dataProviderIDChange;
            cy.get('select2').click().then(() => {
                cy.get('input').type('two{enter}').then(() => {
                    cy.wrap(dataProviderIDChange).should('have.been.calledWith', 2);
                });
            });
        });
    });

    it('should not emit dataProviderIDChange event dataprovider change', () => {
        const dataProviderIDChange = cy.stub();
        defaultValues.dataProviderID = '1';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            wrapper.component.dataProviderIDChange = dataProviderIDChange;
            cy.get('select2 ul li').should('have.attr', 'title', 'one').then(() => {
                wrapper.component.dataProviderID.set('2');
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('select2 ul li').should('have.attr', 'title', 'two');
            });
        });
    });

    it('should multiselect on dataprovider change', () => {
        const dataProviderIDChange = cy.stub();
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            wrapper.component.dataProviderIDChange = dataProviderIDChange;
            cy.get('select2 ul li').should('have.attr', 'title', 'one').then(() => {
                wrapper.component.dataProviderID.set('2\n3');
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('select2 ul li').should('have.attr', 'title', 'two');
                cy.get('select2 ul li:nth-child(3)').should('have.attr', 'title', 'three');
            });
        });
    });

    it('should select one not in the list', () => {
        const dataProviderIDChange = cy.stub();
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            wrapper.component.dataProviderIDChange = dataProviderIDChange;
            cy.get('select2 ul li').should('have.attr', 'title', 'one').then(() => {
                wrapper.component.dataProviderID.set('5');
                expect(dataProviderIDChange).not.to.have.been.called;
                wrapper.component.valuelistID.set([...mockData, { displayValue: '5', realValue: 5 }] as IValuelist);
            }).then(() => {
                wrapper.component.dataProviderID.set('4');
                wrapper.component.dataProviderID.set('5');
                cy.get('select2 ul li').should('have.attr', 'title', '5');
            });
        });
    });

    it('change valuelist and dataprovider together', () => {
        const dataProviderIDChange = cy.stub();
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            wrapper.component.dataProviderIDChange = dataProviderIDChange;
            cy.get('select2 ul li').should('have.attr', 'title', 'one').then(() => {
                const newValuelist = [{
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
                newValuelist.getDisplayValue = (value) => {
                    const item = mockData.find(({ realValue }) => realValue === value);
                    if (item) return of(item.displayValue);
                    return of(value);
                };
                wrapper.component.valuelistID.set(newValuelist);
                wrapper.component.dataProviderID.set('AAAA');
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('select2 ul li').should('have.attr', 'title', 'AAAA');
            });
        });
    });

    it('should select the highlighted item on close', () => {
        defaultValues.dataProviderID = '';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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
        defaultValues.dataProviderID = '';
        defaultValues.selectOnClose = false;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('select2').click().then(() => {
                cy.get('input').type('{downarrow}').then(() => {
                    cy.get('select2').click({ force: true }).then(() => {
                        cy.get('select2 ul span').should('have.text', defaultValues.placeholderText);
                    });
                });
            });
        });
    });

    it('should hide selected items', () => {
        defaultValues.hideSelectedItems = true;
        defaultValues.selectOnClose = false;
        defaultValues.dataProviderID = '1';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('select2').click().then(() => {
                cy.get('.select2-results ul li div').should('have.length', 3);
                cy.get('.select2-results ul li div').eq(0).should('have.text', 'two');
                cy.get('.select2-results ul li div').eq(1).should('have.text', 'three');
                cy.get('.select2-results ul li div').eq(2).should('have.text', 'four');
            });
        });
    });

    it('should not hide selected items', () => {
        defaultValues.selectOnClose = false;
        defaultValues.hideSelectedItems = false;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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
        defaultValues.overlayMode = true;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('select2').click().then(() => {
                cy.get('.cdk-overlay-container').should('exist');
            });
        });
    });

    it('should not have ovarlay when dropdown list is open', () => {
        defaultValues.overlayMode = false;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('select2').click().then(() => {
                cy.get('.cdk-overlay-container').should('not.exist');
            });
        });
    });
});