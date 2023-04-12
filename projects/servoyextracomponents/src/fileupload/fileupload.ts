import { Component, SimpleChanges, Input, Renderer2, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy, Inject, ViewChild, ElementRef } from '@angular/core';
import { ServoyBaseComponent, ServoyPublicService } from '@servoy/public';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { DOCUMENT } from '@angular/common';
import { LoggerFactory, LoggerService } from '@servoy/public';
import {FileTypesUtilsService} from './lib/filetypes';

@Component({
    selector: 'servoyextra-fileupload',
    templateUrl: './fileupload.html',
    styleUrls: ['./fileupload.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraFileUpload extends ServoyBaseComponent<HTMLDivElement> {

    @Input() onDataChangeMethodID: (e: Event) => void;
    @Input() onFileUploadedMethodID: () => void;
    @Input() onFileTransferFinishedMethodID: (e: Event) => void;

    @Output() dataProviderIDChange = new EventEmitter();
    @Input() dataProviderID: any;
    @Input() displaysTags: boolean;
    @Input() accept: string;
    @Input() enabled: boolean;
    @Input() location: any;
    @Input() name: string;
    @Input() size: any;
    @Input() styleClass: string;
    @Input() styleClassExpression: string;
    @Input() iconStyleClass: string;
    @Input() resultDisplayTimeout: number;
    @Input() successIconStyleClass: string;
    @Input() showFileName: boolean;
    @Input() showProgress: boolean;
    @Input() multiFileUpload: boolean;
    @Input() uploadText: string;
    @Input() uploadProgressText: string;
    @Input() uploadSuccessText: string;
    @Input() uploadCancelText: string;
    @Input() uploadNotSupportedText: string;
    @Input() uploadNotSupportedFileText: string;
    @Input() toolTipText: string;

    @ViewChild('fileInputLabel') fileInputLabel: ElementRef;
    @ViewChild('fileInputSingleUpload') fileInput: ElementRef;

    uploader: FileUploader;
    hasBaseDropZoneOver = false;
    customText: string;
    acceptMimeTypes = '*/*';
    private ready = true;
    private log: LoggerService;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private servoyService: ServoyPublicService, @Inject(DOCUMENT) private doc: Document, 
        logFactory: LoggerFactory,private fileutilsService: FileTypesUtilsService) {
        super(renderer, cdRef);
        this.log = logFactory.getLogger('FileUpload');
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileInputClick(): void {
        this.fileInputLabel.nativeElement.click();
    }

    initializeComponent() {
        super.initializeComponent();
        if (this.multiFileUpload && !this.onFileUploadedMethodID) {
            this.log.warn('Multifile upload without onFileUploaded Method isn\'t supported. To upload multi file start using onFileUploaded Method');
        }
        const url = this.onFileUploadedMethodID ? this.servoyService.generateUploadUrl(this.servoyApi.getFormName(), this.name, 'onFileUploadedMethodID') :
            this.servoyService.generateUploadUrl(this.servoyApi.getFormName(), this.name, 'dataProviderID');
        const options: FileUploaderOptions = { url }
        if (this.accept && '*/*' != this.accept) {
            options.allowedMimeType = this.accept.split(',').map(value => {
                // library wants mime type here, so try to guess it
                if (value.indexOf('/') > -1) {
                    return value;
                } else{
                    value = value.trim();
                    if (value.indexOf('.') >= 0) value = value.substring(value.indexOf('.')+1);
                    const mime = this.fileutilsService.mimeFor(value);
                    if (!mime) console.warn("Cannot set accept value for fileupload component, cannot determine mime type from: " + value);
                    return mime;
                }
            });
            this.acceptMimeTypes =  options.allowedMimeType.join(',');
        }
        if (!this.multiFileUpload) {
            options.filters = [{
                    name: 'multi', fn: (): boolean => {
                        const retValue = this.ready;
                        this.ready = false;
                        return retValue;
                    }
                }];
            this.uploader = new FileUploader(options);
        }
        else this.uploader = new FileUploader(options);
        this.uploader.onProgressItem = () => {
            this.cdRef.detectChanges();
        };
        if (!this.multiFileUpload || this.onFileTransferFinishedMethodID) {
            this.uploader.onCompleteAll = this.onComplete;
        }
        this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed;
        this.customText = this.uploadText;
    }

    onComplete = () => {
        this.ready = true;
        if (this.onFileTransferFinishedMethodID) this.onFileTransferFinishedMethodID(new CustomEvent('onFileTransferFinishedMethodID'));
        this.customText = this.uploadSuccessText;
        if (this.fileInput){
            this.fileInput.nativeElement.value = null;
        }
        this.cdRef.detectChanges();
    };

    onWhenAddingFileFailed = () => {
        this.customText = this.uploadNotSupportedFileText;
        this.cdRef.detectChanges();
    };

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case 'enabled':
                        if (change.currentValue){
                             this.renderer.removeAttribute(this.getFocusElement(), 'disabled');
                             this.customText = this.uploadText;
                        } else{
                            this.renderer.setAttribute(this.getFocusElement(), 'disabled', 'disabled');
                            if (!this.servoyApi.isInDesigner()) this.customText = "Component disabled, cannot upload file.";
                        }
                        break;
                }
            }
        }
        super.svyOnChanges(changes);
    }

    getFocusElement(): any {
        return this.getNativeElement();
    }
}

