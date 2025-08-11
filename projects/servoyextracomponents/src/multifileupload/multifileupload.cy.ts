import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraMultiFileUpload } from './multifileupload';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { Restrictions } from '@uppy/core/lib/Restricter';
import { TusOpts } from '@uppy/tus';
import type { WebcamOptions } from '@uppy/webcam';
import { DashboardComponent } from '@uppy/angular';

@Component({
    template: `<servoyextra-multifileupload
                [servoyApi]="servoyApi"
                [onBeforeFileAdded]="onBeforeFileAdded"
                [onFileAdded]="onFileAdded"
                [onFileRemoved]="onFileRemoved"
                [onFileUploaded]="onFileUploaded"
                [onModalClosed]="onModalClosed"
                [onRestrictionFailed]="onRestrictionFailed"
                [onUploadComplete]="onUploadComplete"
                [allowMultipleUploads]="allowMultipleUploads"
                [autoProceed]="autoProceed"
                [closeAfterFinish]="closeAfterFinish"
                [disableStatusBar]="disableStatusBar"
                [hideUploadButton]="hideUploadButton"
                [inline]="inline"
                [language]="language"
                [localeStrings]="localeStrings"
                [metaFields]="metaFields"
                [note]="note"
                [options]="options"
                [responsiveHeight]="responsiveHeight"
                [responsiveWidth]="responsiveWidth"
                [restrictions]="restrictions"
                [sources]="sources"
                [styleClass]="styleClass"
                [tusOptions]="tusOptions"
                [webcamOptions]="webcamOptions"
                [cssPosition]="cssPosition"
                #element>
                </servoyextra-multifileupload>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onBeforeFileAdded: (e: Event) => void;
    onFileAdded: (e: Event) => void;
    onFileRemoved: (e: Event) => void;
    onFileUploaded: (e: Event) => void;
    onModalClosed: (e: Event) => void;
    onRestrictionFailed: (e: Event) => void;
    onUploadComplete: (e: Event) => void;

    allowMultipleUploads: boolean;
    autoProceed: boolean;
    closeAfterFinish: boolean;
    disableStatusBar: boolean;
    hideUploadButton: boolean;
    inline: boolean;
    language: string;
    localeStrings: any;
    metaFields: any;
    note: string;
    options: any;
    responsiveHeight: number;
    responsiveWidth: number;
    restrictions: Restrictions;
    sources: string[];
    styleClass: string;
    tusOptions: TusOpts<any, any>;
    webcamOptions: WebcamOptions<any, any>;

    cssPosition: any;

    @ViewChild('element') element: ServoyExtraMultiFileUpload;
    @ViewChild(DashboardComponent) dashboard: DashboardComponent<any, any>;
}

describe('ServoyExtraMultiFileUpload', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraMultiFileUpload],
        imports: [ServoyPublicTestingModule, FormsModule, DashboardComponent],
    }

    beforeEach(() => {
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            styleClass: 'upload-test',
            responsiveHeight: 300,
            responsiveWidth: 400,
            cssPosition: {
                "position": "absolute",
                "top": "20px",
                "left": "25px",
                "height": "450px",
                "width": "290px"
            },
            restrictions: {
                minNumberOfFiles: 1,
                maxNumberOfFiles: 10,
                allowedFileTypes: ['.pdf', '.jpg', '.png'],
                maxFileSize: 5000000, // 5 MB
            } as Restrictions,
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-multifileupload').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-multifileupload').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-multifileupload').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-multifileupload').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-multifileupload').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should respect file type restrictions', () => {
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input[type="file"]').should('have.attr', 'accept', '.pdf, .jpg, .png');
        });
    });

    it('should handle hideUploadButton property', () => {
        config.componentProperties.hideUploadButton = true;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-StatusBar-actionBtn--upload').should('not.exist');
        });
    });

    it('should handle note property', () => {
        const testNote = 'Test upload note';
        config.componentProperties.note = testNote;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-Dashboard-note').should('contain', testNote);
        });
    });

    it('should handle language property', () => {
        config.componentProperties.language = 'German';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-Dashboard-browse').should('contain', 'durchsuchen');
        });
    });

    it('should trigger onFileAdded event', () => {
        const onFileAdded = cy.spy();
        config.componentProperties.onFileAdded = onFileAdded;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-Dashboard-input').first().selectFile({
                contents: Cypress.Buffer.from('test content'),
                fileName: 'test.pdf',
                mimeType: 'application/pdf'
            }, { force: true });
            cy.wrap(onFileAdded).should('be.called');
        });
    });

    it('should handle autoProceed property', () => {
        const onUploadComplete = cy.spy().as('onUploadComplete');
        config.componentProperties.autoProceed = true;
        config.componentProperties.onUploadComplete = onUploadComplete;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-Dashboard-input').first().selectFile({
                contents: Cypress.Buffer.from('test content'),
                fileName: 'test.pdf',
                mimeType: 'application/pdf'
            }, { force: true });
            cy.get('@onUploadComplete').should('have.been.called');
        });
    });

    it('should respect maxFileSize restriction', () => {
        const onRestrictionFailed = cy.spy().as('onRestrictionFailed');
        config.componentProperties.onRestrictionFailed = onRestrictionFailed;
        config.componentProperties.restrictions.maxFileSize = 10; // 10 bytes
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-Dashboard-input').first().selectFile({
                contents: Cypress.Buffer.from('test content larger than 10 bytes'),
                fileName: 'large.pdf',
                mimeType: 'application/pdf'
            }, { force: true });
            cy.get('@onRestrictionFailed').should('have.been.called');
        });
    });

    it('should handle file removal', () => {
        const onFileRemoved = cy.spy().as('onFileRemoved');
        config.componentProperties.onFileRemoved = onFileRemoved;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-Dashboard-input').first().selectFile({
                contents: Cypress.Buffer.from('test content'),
                fileName: 'test.pdf',
                mimeType: 'application/pdf'
            }, { force: true }).then(() => {
                cy.get('.uppy-Dashboard-Item-action--remove').click();
                cy.get('@onFileRemoved').should('have.been.called');
            });
        });
    });
    
    it('should handle allowMultipleUploads property', () => {
        config.componentProperties.allowMultipleUploads = false;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-Dashboard-input').first().selectFile([
                {
                    contents: Cypress.Buffer.from('test1'),
                    fileName: 'test1.pdf',
                    mimeType: 'application/pdf'
                },
                {
                    contents: Cypress.Buffer.from('test2'),
                    fileName: 'test2.pdf',
                    mimeType: 'application/pdf'
                }
            ], { force: true });
            cy.get('.uppy-Dashboard-Item').should('have.length', 2);
        });
    });

    it('should handle disableStatusBar property', () => {
        config.componentProperties.disableStatusBar = true;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-StatusBar').should('not.exist');
        });
    });

    it('should handle onBeforeFileAdded event', () => {
        const onBeforeFileAdded = cy.spy().as('onBeforeFileAdded');
        config.componentProperties.onBeforeFileAdded = onBeforeFileAdded;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.uppy-Dashboard-input').first().selectFile({
                contents: Cypress.Buffer.from('test'),
                fileName: 'test.pdf',
                mimeType: 'application/pdf'
            }, { force: true });
            cy.get('@onBeforeFileAdded').should('have.been.called');
        });
    });
});