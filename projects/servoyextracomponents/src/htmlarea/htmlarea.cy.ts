/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraHtmlarea } from './htmlarea';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
    template: `<servoyextra-htmlarea 
                [servoyApi]="servoyApi"
                (onClick)="onActionMethodID($event)"
                [onDataChangeMethodID]="onDataChangeMethodID"
                (onFocus)="onFocusGainedMethodID($event)"
                (onBlur)="onFocusLostMethodID($event)"
                (onContextMenu)="onRightClickMethodID($event)"
                [dataProviderID]="dataProviderID"
                [editable]="editable"
                [enabled]="enabled"
                [placeholderText]="placeholderText"
                [responsiveHeight]="responsiveHeight"
                [scrollbars]="scrollbars"
                [styleClass]="styleClass"
                [tabSeq]="tabSeq"
                [text]="text"
                [toolTipText]="toolTipText"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                #element>
                </servoyextra-htmlarea>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onActionMethodID: (e: Event) => void;
    onDataChangeMethodID: (oldValue: any, newValue: any, e: Event) => void;
    onFocusGainedMethodID: (e: Event) => void;
    onFocusLostMethodID: (e: Event) => void;
    onRightClickMethodID: (e: Event) => void;

    dataProviderID: any;
    dataProviderIDChange = (newData: any) => { };

    editable: boolean;
    enabled: boolean;
    placeholderText: string;
    responsiveHeight: number;
    scrollbars: any;
    styleClass: string;
    tabSeq: number;
    text: string;
    toolTipText: string;

    lastServerValueAsSeenByTinyMCEContent: string;

    @ViewChild('element') element: ServoyExtraHtmlarea;
}

describe('ServoyExtraHtmlarea', () => {
    let editorContent = 'initialValue';
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraHtmlarea],
        imports: [ServoyPublicTestingModule, FormsModule, EditorModule]
    }

    beforeEach(() => {
        window['tinymce'] = {
            init: () => Promise.resolve(),
            remove: () => { },
            get: () => { }
        };
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            styleClass: 'htmlarea-test',
            enabled: true,
            editable: true,
            placeholderText: 'Enter text',
            dataProviderID: editorContent,
            toolTipText: 'tooltip text',
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-extra-htmlarea').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should show the dataprovider value', () => {
        config.componentProperties.dataProviderID = 'myvalue';
        cy.mount(WrapperComponent, config).then(() => {
            // its really tricky to test this because this is really internal to tinyMCE (in its iframe,and then body and its already also more html like <p>myvalue</p>)
          //  cy.get('editor').should('have.attr', 'ng-reflect-model', 'myvalue');
        });
    });


    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-htmlarea').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-htmlarea').should('have.class', 'mystyleclass')
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-htmlarea').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-htmlarea').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should be editable', () => {
        config.componentProperties.editable = true;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-extra-htmlarea').should('not.have.attr', 'readonly');
        });
    });

    it('should handle onaction  event', () => {
        const onActionMethodID = cy.stub();
        config.componentProperties.onActionMethodID = onActionMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.wrap(onActionMethodID).should('be.not.called');
            cy.get('textarea').trigger('onClick').then(() => {
                cy.wrap(onActionMethodID).should('be.called');
            });
        });
    });

    it('should handle focus gained event', () => {
        const onFocusGainedMethodID = cy.stub();
        config.componentProperties.onFocusGainedMethodID = onFocusGainedMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('textarea').trigger('onFocus').then(() => {
                cy.wrap(onFocusGainedMethodID).should('be.called');
            });
        });
    });

    it('should handle focus lost event', () => {
        const onFocusLostMethodID = cy.stub();
        config.componentProperties.onFocusLostMethodID = onFocusLostMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('textarea').trigger('onBlur').then(() => {
                cy.wrap(onFocusLostMethodID).should('be.called');
            });
        });
    });

    it('should handle right click event', () => {
        const onRightClickMethodID = cy.stub();
        config.componentProperties.onRightClickMethodID = onRightClickMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('textarea').trigger('onContextMenu').then(() => {
                expect(onRightClickMethodID).to.have.been.called;
            });
        });
    });

    it('should see the tooltip', () => {
        cy.mount(WrapperComponent, config).then((wrapper) => {
            cy.get('textarea').trigger('pointerenter').then(() => {
                cy.get('div[id="mktipmsg"]').should('contain', 'tooltip text');
            });
        });
    });

});