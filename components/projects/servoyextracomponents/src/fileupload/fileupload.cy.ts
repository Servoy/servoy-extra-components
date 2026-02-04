
import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraFileUpload } from './fileupload';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

@Component({
    template: `<servoyextra-fileupload 
                [servoyApi]="servoyApi()"
                [onDataChangeMethodID]="onDataChangeMethodID"
                [onFileUploadedMethodID]="onFileUploadedMethodID"
                [onFileTransferFinishedMethodID]="onFileTransferFinishedMethodID"
                [accept]="accept()"
                [dataProviderID]="dataProviderID()"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                [displaysTags]="displaysTags()"
                [enabled]="enabled()"
                [iconStyleClass]="iconStyleClass()"
                [multiFileUpload]="multiFileUpload()"
                [resultDisplayTimeout]="resultDisplayTimeout()"
                [showFileName]="showFileName()"
                [showProgress]="showProgress()"
                [styleClass]="styleClass()"
                [styleClassExpression]="styleClassExpression()"
                [successIconStyleClass]="successIconStyleClass()"
                [toolTipText]="toolTipText()"
                [uploadCancelText]="uploadCancelText()"
                [uploadNotSupportedFileText]="uploadNotSupportedFileText()"
                [uploadNotSupportedText]="uploadNotSupportedText()"
                [uploadProgressText]="uploadProgressText()"
                [uploadSuccessText]="uploadSuccessText()"
                [uploadText]="uploadText()"
                #element>
                </servoyextra-fileupload>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onDataChangeMethodID = () => { };
    onFileUploadedMethodID = () => { };
    onFileTransferFinishedMethodID = () => { };

    accept = signal<string>(undefined);
    dataProviderID = signal<any>(undefined);
    dataProviderIDChange = () => { };
    displaysTags = signal<boolean>(undefined);
    enabled = signal<boolean>(undefined);
    styleClass = signal<string>(undefined);
    styleClassExpression = signal<string>(undefined);
    iconStyleClass = signal<string>(undefined);
    resultDisplayTimeout = signal<number>(undefined);
    successIconStyleClass = signal<string>(undefined);
    showFileName = signal<boolean>(undefined);
    showProgress = signal<boolean>(undefined);
    multiFileUpload = signal<boolean>(undefined);
    uploadText = signal<string>(undefined);
    uploadProgressText = signal<string>(undefined);
    uploadSuccessText = signal<string>(undefined);
    uploadCancelText = signal<string>(undefined);
    uploadNotSupportedText = signal<string>(undefined);
    uploadNotSupportedFileText = signal<string>(undefined);
    toolTipText = signal<string>(undefined);

    @ViewChild('element') element: ServoyExtraFileUpload;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    enabled: true,
    styleClass: 'fileupload-test',
    uploadText: 'Upload File',
    uploadProgressText: 'Uploading...',
    uploadSuccessText: 'Success!',
    uploadCancelText: 'Cancel',
    uploadNotSupportedText: 'Upload not supported',
    uploadNotSupportedFileText: 'File type not supported',
    showFileName: true,
    showProgress: true,
    multiFileUpload: false,
    resultDisplayTimeout: 2000,
    accept: '',
    dataProviderID: null,
    displaysTags: false,
    iconStyleClass: '',
    styleClassExpression: '',
    successIconStyleClass: '',
    toolTipText: '',
    onDataChangeMethodID: undefined,
    onFileUploadedMethodID: undefined,
    onFileTransferFinishedMethodID: undefined
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
    declarations: [ServoyExtraFileUpload],
    imports: [ServoyPublicTestingModule, FormsModule, FileUploadModule]
};

describe('ServoyExtraFileUpload', () => {
    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-fileupload').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should show style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-fileupload').should('have.class', 'fileupload-test').then(() => {
                wrapper.component.styleClass.set('new-style');
                cy.get('.svy-extra-fileupload').should('have.class', 'new-style');
            });
        });
    });

    it('should handle enabled state', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('input[type="file"]').should('not.be.disabled').then(() => {
                wrapper.component.enabled.set(false);
                cy.get('input[type="file"]').should('be.disabled');
            });
        });
    });

    it('should handle file type restrictions', () => {
        defaultValues.accept = 'image/*';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input[type="file"]').should('have.attr', 'accept', 'image/bmp,image/cgm,image/g3fax,image/gif,image/ief,image/jpeg,image/ktx,image/png,image/prs.btif,image/svg+xml,image/tiff,image/vnd.adobe.photoshop,image/vnd.dece.graphic,image/vnd.dvb.subtitle,image/vnd.djvu,image/vnd.dwg,image/vnd.dxf,image/vnd.fastbidsheet,image/vnd.fpx,image/vnd.fst,image/vnd.fujixerox.edmics-mmr,image/vnd.fujixerox.edmics-rlc,image/vnd.ms-modi,image/vnd.net-fpx,image/vnd.wap.wbmp,image/vnd.xiff,image/webp,image/x-cmu-raster,image/x-cmx,image/x-freehand,image/x-icon,image/x-pcx,image/x-pict,image/x-portable-anymap,image/x-portable-bitmap,image/x-portable-graymap,image/x-portable-pixmap,image/x-rgb,image/x-xbitmap,image/x-xpixmap,image/x-xwindowdump');
        });
    });

    it('should show upload text', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('label').should('contain.text', 'Upload File');
        });
    });

    it('should handle multi-file upload setting', () => {
        defaultValues.multiFileUpload = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('input[type="file"]').should('have.attr', 'multiple');
        });
    });

    it('should handle file upload events', () => {
        const onFileTransferFinished = cy.stub();
        defaultValues.onFileTransferFinishedMethodID = onFileTransferFinished;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            cy.get('input[type="file"]').selectFile({
                contents: testFile,
                fileName: 'test.txt',
                mimeType: 'text/plain'
            }, { force: true });
        });
    });
});
