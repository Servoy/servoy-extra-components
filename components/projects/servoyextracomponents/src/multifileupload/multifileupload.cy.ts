import { Component, ViewChild, signal } from '@angular/core';
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
                [servoyApi]="servoyApi()"
                [onBeforeFileAdded]="onBeforeFileAdded"
                [onFileAdded]="onFileAdded"
                [onFileRemoved]="onFileRemoved"
                [onFileUploaded]="onFileUploaded"
                [onModalClosed]="onModalClosed"
                [onRestrictionFailed]="onRestrictionFailed"
                [onUploadComplete]="onUploadComplete"
                [allowMultipleUploads]="allowMultipleUploads()"
                [autoProceed]="autoProceed()"
                [closeAfterFinish]="closeAfterFinish()"
                [disableStatusBar]="disableStatusBar()"
                [hideUploadButton]="hideUploadButton()"
                [inline]="inline()"
                [language]="language()"
                [localeStrings]="localeStrings()"
                [metaFields]="metaFields()"
                [note]="note()"
                [options]="options()"
                [responsiveHeight]="responsiveHeight()"
                [responsiveWidth]="responsiveWidth()"
                [restrictions]="restrictions()"
                [sources]="sources()"
                [styleClass]="styleClass()"
                [tusOptions]="tusOptions()"
                [webcamOptions]="webcamOptions()"
                [cssPosition]="cssPosition()"
                #element>
                </servoyextra-multifileupload>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onBeforeFileAdded = () => { };
    onFileAdded = () => { };
    onFileRemoved = () => { };
    onFileUploaded = () => { };
    onModalClosed = () => { };
    onRestrictionFailed = () => { };
    onUploadComplete = () => { };

    allowMultipleUploads = signal<boolean>(undefined);
    autoProceed = signal<boolean>(undefined);
    closeAfterFinish = signal<boolean>(undefined);
    disableStatusBar = signal<boolean>(undefined);
    hideUploadButton = signal<boolean>(undefined);
    inline = signal<boolean>(undefined);
    language = signal<string>(undefined);
    localeStrings = signal<any>(undefined);
    metaFields = signal<any>(undefined);
    note = signal<string>(undefined);
    options = signal<any>(undefined);
    responsiveHeight = signal<number>(undefined);
    responsiveWidth = signal<number>(undefined);
    restrictions = signal<Restrictions>(undefined);
    sources = signal<string[]>(undefined);
    styleClass = signal<string>(undefined);
    tusOptions = signal<TusOpts<any, any>>(undefined);
    webcamOptions = signal<WebcamOptions<any, any>>(undefined);

    cssPosition = signal<any>(undefined);

    @ViewChild('element') element: ServoyExtraMultiFileUpload;
    @ViewChild(DashboardComponent) dashboard: DashboardComponent<any, any>;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
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
    inline: true,
    onBeforeFileAdded: undefined,
    onFileAdded: undefined,
    onFileRemoved: undefined,
    onFileUploaded: undefined,
    onModalClosed: undefined,
    onRestrictionFailed: undefined,
    onUploadComplete: undefined,
    allowMultipleUploads: undefined,
    autoProceed: undefined,
    closeAfterFinish: undefined,
    disableStatusBar: undefined,
    hideUploadButton: undefined,
    language: undefined,
    localeStrings: undefined,
    metaFields: undefined,
    note: undefined,
    options: undefined,
    restrictions: undefined,
    sources: undefined,
    tusOptions: undefined,
    webcamOptions: undefined
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
    declarations: [ServoyExtraMultiFileUpload],
    imports: [ServoyPublicTestingModule, FormsModule, DashboardComponent]
};

describe('ServoyExtraMultiFileUpload', () => {

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-multifileupload').should('exist');
            cy.wrap(registerComponent).should('be.called');
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-multifileupload').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.svy-extra-multifileupload').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'classA classB';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-multifileupload').should('have.class', 'classA').should('have.class', 'classB');
        });
    });

    it('should respect file type restrictions', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            wrapper.component.restrictions.set({
                minNumberOfFiles: 1,
                maxNumberOfFiles: 10,
                allowedFileTypes: ['.pdf', '.jpg', '.png'],
                maxFileSize: 5000000, // 5 MB
            } as Restrictions);
            cy.get('input[type="file"]').should('have.attr', 'accept', '.pdf, .jpg, .png');
        });
    });

    it('should handle hideUploadButton property', () => {
        defaultValues.hideUploadButton = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.uppy-StatusBar-actionBtn--upload').should('not.exist');
        });
    });

    it('should handle note property', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            wrapper.component.note.set('Test upload note');
            cy.get('.uppy-Dashboard-note').should('contain', 'Test upload note');
        });
    });

    it('should handle language property', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            wrapper.component.language.set('German');
            cy.get('.uppy-Dashboard-browse').should('contain', 'durchsuchen');
        });
    });

    it('should trigger onFileAdded event', () => {
        const onFileAdded = cy.spy();
        defaultValues.onFileAdded = onFileAdded;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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
        defaultValues.autoProceed = true;
        defaultValues.onUploadComplete = onUploadComplete;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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
        defaultValues.onRestrictionFailed = onRestrictionFailed;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            wrapper.component.restrictions.set({
                minNumberOfFiles: 1,
                maxNumberOfFiles: 10,
                allowedFileTypes: ['.pdf', '.jpg', '.png'],
                maxFileSize: 10,
            } as Restrictions);
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
        defaultValues.onFileRemoved = onFileRemoved;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            wrapper.component.allowMultipleUploads.set(false);
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
        defaultValues.disableStatusBar = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.uppy-StatusBar').should('not.exist');
        });
    });

    it('should handle onBeforeFileAdded event', () => {
        const onBeforeFileAdded = cy.spy().as('onBeforeFileAdded');
        defaultValues.onBeforeFileAdded = onBeforeFileAdded;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.uppy-Dashboard-input').first().selectFile({
                contents: Cypress.Buffer.from('test'),
                fileName: 'test.pdf',
                mimeType: 'application/pdf'
            }, { force: true });
            cy.get('@onBeforeFileAdded').should('have.been.called');
        });
    });
});