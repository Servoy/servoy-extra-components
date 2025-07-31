
import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraFileUpload } from './fileupload';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';

@Component({
    template: `<servoyextra-fileupload 
                [servoyApi]="servoyApi"
                [onDataChangeMethodID]="onDataChangeMethodID"
                [onFileUploadedMethodID]="onFileUploadedMethodID"
                [onFileTransferFinishedMethodID]="onFileTransferFinishedMethodID"
                [accept]="accept"
                [dataProviderID]="dataProviderID"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                [displaysTags]="displaysTags"
                [enabled]="enabled"
                [iconStyleClass]="iconStyleClass"
                [multiFileUpload]="multiFileUpload"
                [resultDisplayTimeout]="resultDisplayTimeout"
                [showFileName]="showFileName"
                [showProgress]="showProgress"
                [styleClass]="styleClass"
                [styleClassExpression]="styleClassExpression"
                [successIconStyleClass]="successIconStyleClass"
                [toolTipText]="toolTipText"
                [uploadCancelText]="uploadCancelText"
                [uploadNotSupportedFileText]="uploadNotSupportedFileText"
                [uploadNotSupportedText]="uploadNotSupportedText"
                [uploadProgressText]="uploadProgressText"
                [uploadSuccessText]="uploadSuccessText"
                [uploadText]="uploadText"
                #element>
                </servoyextra-fileupload>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onDataChangeMethodID: (e: Event) => void;
    onFileUploadedMethodID: () => void;
    onFileTransferFinishedMethodID: (e: Event) => void;
    
    accept: string;
    dataProviderID: any;
    dataProviderIDChange: (e: any) => void;
    displaysTags: boolean;
    enabled: boolean;
    styleClass: string;
    styleClassExpression: string;
    iconStyleClass: string;
    resultDisplayTimeout: number;
    successIconStyleClass: string;
    showFileName: boolean;
    showProgress: boolean;
    multiFileUpload: boolean;
    uploadText: string;
    uploadProgressText: string;
    uploadSuccessText: string;
    uploadCancelText: string;
    uploadNotSupportedText: string;
    uploadNotSupportedFileText: string;
    toolTipText: string;

    @ViewChild('element') element: ServoyExtraFileUpload;
}

describe('ServoyExtraFileUpload', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraFileUpload],
        imports: [ServoyPublicTestingModule, FormsModule, FileUploadModule]
    }

    beforeEach(() => {
        config.componentProperties = {
            servoyApi: servoyApiSpy,
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
            resultDisplayTimeout: 2000
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-fileupload').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should show style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-fileupload').should('have.class', 'fileupload-test').then(() => {
                wrapper.component.styleClass = 'new-style';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-fileupload').should('have.class', 'new-style');
            });
        });
    });

    it('should handle enabled state', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('input[type="file"]').should('not.be.disabled').then(() => {
                wrapper.component.enabled = false;
                wrapper.fixture.detectChanges();
                cy.get('input[type="file"]').should('be.disabled');
            });
        });
    });

    it('should handle file type restrictions', () => {
        config.componentProperties.accept = 'image/*';
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input[type="file"]').should('have.attr', 'accept', 'image/bmp,image/cgm,image/g3fax,image/gif,image/ief,image/jpeg,image/ktx,image/png,image/prs.btif,image/svg+xml,image/tiff,image/vnd.adobe.photoshop,image/vnd.dece.graphic,image/vnd.dvb.subtitle,image/vnd.djvu,image/vnd.dwg,image/vnd.dxf,image/vnd.fastbidsheet,image/vnd.fpx,image/vnd.fst,image/vnd.fujixerox.edmics-mmr,image/vnd.fujixerox.edmics-rlc,image/vnd.ms-modi,image/vnd.net-fpx,image/vnd.wap.wbmp,image/vnd.xiff,image/webp,image/x-cmu-raster,image/x-cmx,image/x-freehand,image/x-icon,image/x-pcx,image/x-pict,image/x-portable-anymap,image/x-portable-bitmap,image/x-portable-graymap,image/x-portable-pixmap,image/x-rgb,image/x-xbitmap,image/x-xpixmap,image/x-xwindowdump');
        });
    });

    it('should show upload text', () => {
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('label').should('contain.text', 'Upload File');
        });
    });

    it('should handle multi-file upload setting', () => {
        config.componentProperties.multiFileUpload = true;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('input[type="file"]').should('have.attr', 'multiple');
        });
    });

    it('should handle file upload events', () => {
        const onFileTransferFinished = cy.stub();
        config.componentProperties.onFileTransferFinishedMethodID = onFileTransferFinished;
        cy.mount(WrapperComponent, config).then(() => {
            const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
            cy.get('input[type="file"]').selectFile({
                contents: testFile,
                fileName: 'test.txt',
                mimeType: 'text/plain'
            }, { force: true });
        });
    });
});
