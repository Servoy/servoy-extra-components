/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraHtmlarea } from './htmlarea';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
    template: `<servoyextra-htmlarea 
                [servoyApi]="servoyApi()"
                (onClick)="onActionMethodID($event)"
                [onDataChangeMethodID]="onDataChangeMethodID"
                (onFocus)="onFocusGainedMethodID($event)"
                (onBlur)="onFocusLostMethodID($event)"
                (onContextMenu)="onRightClickMethodID($event)"
                [dataProviderID]="dataProviderID()"
                [editable]="editable()"
                [enabled]="enabled()"
                [responsiveHeight]="responsiveHeight()"
                [scrollbars]="scrollbars()"
                [styleClass]="styleClass()"
                [tabSeq]="tabSeq()"
                [text]="text()"
                [toolTipText]="toolTipText()"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                #element>
                </servoyextra-htmlarea>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onActionMethodID = () => { };
    onDataChangeMethodID = () => { };
    onFocusGainedMethodID = () => { };
    onFocusLostMethodID = () => { };
    onRightClickMethodID = () => { };

    dataProviderID = signal<any>(undefined);
    dataProviderIDChange = () => { };

    editable = signal<boolean>(undefined);
    enabled = signal<boolean>(undefined);
    responsiveHeight = signal<number>(undefined);
    scrollbars = signal<any>(undefined);
    styleClass = signal<string>(undefined);
    tabSeq = signal<number>(undefined);
    text = signal<string>(undefined);
    toolTipText = signal<string>(undefined);

    lastServerValueAsSeenByTinyMCEContent: string;

    @ViewChild('element') element: ServoyExtraHtmlarea;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    styleClass: 'htmlarea-test',
    enabled: true,
    editable: true,
    dataProviderID: 'initialValue',
    toolTipText: 'tooltip text',
    responsiveHeight: 0,
    scrollbars: null,
    tabSeq: 0,
    text: '',
    onActionMethodID: undefined,
    onDataChangeMethodID: undefined,
    onFocusGainedMethodID: undefined,
    onFocusLostMethodID: undefined,
    onRightClickMethodID: undefined
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
    declarations: [ServoyExtraHtmlarea],
    imports: [ServoyPublicTestingModule, FormsModule, EditorModule]
};

describe('ServoyExtraHtmlarea', () => {
    let editorContent = 'initialValue';

    beforeEach(() => {
        window['tinymce'] = {
            init: () => Promise.resolve(),
            remove: () => { },
            get: () => { }
        };
        defaultValues.dataProviderID = editorContent;
    });

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-htmlarea').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should show the new value', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('textarea').type('New Value').blur().then(() => {
                cy.get('textarea').should('have.value', 'New Value');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-htmlarea').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.svy-extra-htmlarea').should('have.class', 'mystyleclass')
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-htmlarea').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('.svy-extra-htmlarea').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should be editable', () => {
        defaultValues.editable = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-htmlarea').should('not.have.attr', 'readonly');
        });
    });

    it('should handle onaction  event', () => {
        const onActionMethodID = cy.stub();
        defaultValues.onActionMethodID = onActionMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.wrap(onActionMethodID).should('be.not.called');
            cy.get('textarea').trigger('onClick').then(() => {
                cy.wrap(onActionMethodID).should('be.called');
            });
        });
    });

    it('should handle focus gained event', () => {
        const onFocusGainedMethodID = cy.stub();
        defaultValues.onFocusGainedMethodID = onFocusGainedMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('textarea').trigger('onFocus').then(() => {
                cy.wrap(onFocusGainedMethodID).should('be.called');
            });
        });
    });

    it('should handle focus lost event', () => {
        const onFocusLostMethodID = cy.stub();
        defaultValues.onFocusLostMethodID = onFocusLostMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('textarea').trigger('onBlur').then(() => {
                cy.wrap(onFocusLostMethodID).should('be.called');
            });
        });
    });

    it('should handle right click event', () => {
        const onRightClickMethodID = cy.stub();
        defaultValues.onRightClickMethodID = onRightClickMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('textarea').trigger('onContextMenu').then(() => {
                expect(onRightClickMethodID).to.have.been.called;
            });
        });
    });

    it('should see the tooltip', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('textarea').trigger('pointerenter').then(() => {
                cy.get('div[id="mktipmsg"]').should('contain', 'tooltip text');
            });
        });
    });

});