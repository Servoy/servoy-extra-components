import { Component, SimpleChanges, Input, Renderer2, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy, Inject, ViewChild, ElementRef, DOCUMENT } from '@angular/core';
import { ServoyBaseComponent, ServoyPublicService } from '@servoy/public';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';

import { LoggerFactory, LoggerService } from '@servoy/public';
import {FileTypesUtilsService} from './lib/filetypes';

@Component({
    selector: 'servoyextra-fileupload',
    templateUrl: './fileupload.html',
    styleUrls: ['./fileupload.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
    @Input() name: string;
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
    @Input() maxFileSize: number;

    @ViewChild('fileInputLabel') fileInputLabel: ElementRef;
    @ViewChild('fileInputSingleUpload') fileInput: ElementRef;

    uploader: FileUploader;
    hasBaseDropZoneOver = false;
    customText: string;
    acceptFiles = '*/*';
    private ready = true;
    private log: LoggerService;
    private hideProgressTimer: any;

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
        if (!this.uploader) {
            if (this.multiFileUpload && !this.onFileUploadedMethodID) {
                this.log.warn('Multifile upload without onFileUploaded Method isn\'t supported. To upload multi file start using onFileUploaded Method');
            }
            const url = this.onFileUploadedMethodID ? this.servoyService.generateUploadUrl(this.servoyApi.getFormName(), this.name, 'onFileUploadedMethodID') :
                this.servoyService.generateUploadUrl(this.servoyApi.getFormName(), this.name, 'dataProviderID');
            const options: FileUploaderOptions = { url }
            if (this.accept && '*/*' != this.accept) {
                const acceptedFiles = new Array();
                const acceptedMimeTypes = new Array();
                this.accept.split(',').forEach(value => {
                    // library wants mime type here, so try to guess it
                    value = value.trim();
                    if (value.indexOf('/') > -1) {
                        if (value === 'image/*') {
                            const allImagesAccepted: any[] = this.fileutilsService.find('image/');
                            allImagesAccepted.forEach(item => {
                                acceptedFiles.push(item.mime[0]);
                                acceptedMimeTypes.push(item.mime[0]);
                            });
                        } else if (value === 'video/*') {
                            const allVideosAccepted: any[] = this.fileutilsService.find('video/');
                            allVideosAccepted.forEach(item => {
                                acceptedFiles.push(item.mime[0]);
                                acceptedMimeTypes.push(item.mime[0]);
                            });
                        } else {
                            acceptedFiles.push(value);
                            acceptedMimeTypes.push(value);
                        }
                    } else {
                        if (value.indexOf('.') >= 0) value = value.substring(value.indexOf('.') + 1);
                        const mime = this.fileutilsService.mimeFor(value);
                        if (!mime) {
                            console.warn("Cannot set accept value for fileupload component, cannot determine mime type from: " + value);
                            acceptedFiles.push('.' + value);
                        }
                        else {
                            acceptedFiles.push(mime);
                            acceptedMimeTypes.push(mime);
                        }
                        if (mime == 'application/zip') {
                            acceptedMimeTypes.push('application/x-zip-compressed');
                        }
                    }
                });
                this.acceptFiles = acceptedFiles.join(',');
                if (acceptedMimeTypes.length > 0){
                    options.allowedMimeType = acceptedMimeTypes;
                }
            }
            
            if (this.maxFileSize) {
                options.maxFileSize = this.maxFileSize;
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

            this.uploader.onCompleteAll = this.onComplete;
            this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed;
            this.customText = this.uploadText;
        }
    }

    onComplete = () => {
        this.ready = true;
        if (this.onFileTransferFinishedMethodID) this.onFileTransferFinishedMethodID(new CustomEvent('onFileTransferFinishedMethodID'));
        this.customText = this.uploadSuccessText;
        if (this.fileInput){
            this.fileInput.nativeElement.value = null;
        }
        this.cdRef.detectChanges();
        this.hideProgress();
    };

    onWhenAddingFileFailed = (item, filter, options) => {
        if (filter.name === 'fileSize') {
            // File size exceeded the limit            
            this.customText = `File size (${item.size}) exceeds the maximum allowed size (${options.maxFileSize})`;
            this.log.warn(`File ${item.name} rejected: ${this.customText}`);
        } else {
            // Other validation failure
            this.customText = this.uploadNotSupportedFileText;
        }
        this.cdRef.detectChanges();
        this.hideProgress();
    };

    hideProgress = () => {
        if(this.hideProgressTimer) clearTimeout(this.hideProgressTimer);
        if(this.resultDisplayTimeout > -1) {
            this.hideProgressTimer = setTimeout(() =>  {
                this.hideProgressTimer = null;
                this.uploader.progress = 0;
                this.customText = this.uploadText;
                this.cdRef.detectChanges();
            } , this.resultDisplayTimeout);
        }
    }

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
                    case 'uploadText':
                        if (!change.isFirstChange()){
                             this.customText = this.uploadText;
                             this.cdRef.detectChanges();
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

    ngOnDestroy() {
        super.ngOnDestroy();
        if(this.hideProgressTimer) clearTimeout(this.hideProgressTimer);
    }
}

