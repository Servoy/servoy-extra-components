import { Component, SimpleChanges, ChangeDetectionStrategy, ElementRef, inject, input, output, viewChild, signal } from '@angular/core';
import { ServoyBaseComponent, ServoyPublicService, ServoyPublicModule } from '@servoy/public';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';

import { LoggerFactory } from '@servoy/public';
import { DOCUMENT } from '@angular/common';
import {FileTypesUtilsService} from './lib/filetypes';

@Component({
    selector: 'servoyextra-fileupload',
    templateUrl: './fileupload.html',
    styleUrls: ['./fileupload.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FileUploadModule, ServoyPublicModule]
})
export class ServoyExtraFileUpload extends ServoyBaseComponent<HTMLDivElement> {

    readonly onDataChangeMethodID = input<((e: Event) => void) | undefined>(undefined);
    readonly onFileUploadedMethodID = input<(() => void) | undefined>(undefined);
    readonly onFileTransferFinishedMethodID = input<((e: Event) => void) | undefined>(undefined);

    readonly dataProviderIDChange = output();
    readonly dataProviderID = input<any>(undefined as any);
    readonly displaysTags = input<boolean>(undefined as any);
    readonly accept = input<string>(undefined as any);
    readonly enabled = input<boolean>(undefined as any);
    readonly styleClass = input<string>(undefined as any);
    readonly styleClassExpression = input<string>(undefined as any);
    readonly iconStyleClass = input<string>(undefined as any);
    readonly resultDisplayTimeout = input<number>(undefined as any);
    readonly successIconStyleClass = input<string>(undefined as any);
    readonly showFileName = input<boolean>(undefined as any);
    readonly showProgress = input<boolean>(undefined as any);
    readonly multiFileUpload = input<boolean>(undefined as any);
    readonly uploadText = input<string>(undefined as any);
    readonly uploadProgressText = input<string>(undefined as any);
    readonly uploadSuccessText = input<string>(undefined as any);
    readonly uploadCancelText = input<string>(undefined as any);
    readonly uploadNotSupportedText = input<string>(undefined as any);
    readonly uploadNotSupportedFileText = input<string>(undefined as any);
    readonly toolTipText = input<string>(undefined as any);
    readonly maxFileSize = input<number>(undefined as any);

    readonly fileInputLabel = viewChild<ElementRef>('fileInputLabel');
    readonly fileInput = viewChild<ElementRef>('fileInputSingleUpload');

    uploader!: FileUploader;
    readonly hasBaseDropZoneOver = signal(false);
    readonly customText = signal<string>(undefined as any);
    readonly acceptFiles = signal('*/*');
    private ready = true;
    private servoyService = inject(ServoyPublicService);
    private doc = inject(DOCUMENT);
    private log = inject(LoggerFactory).getLogger('FileUpload');
    private fileutilsService = inject(FileTypesUtilsService);
    private hideProgressTimer: any;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver.set(e);
    }

    public fileInputClick(): void {
        this.fileInputLabel()!.nativeElement.click();
    }

    initializeComponent() {
        super.initializeComponent();
        if (!this.uploader) {
            const multiFileUpload = this.multiFileUpload();
            const onFileUploadedMethodID = this.onFileUploadedMethodID();
            if (multiFileUpload && !onFileUploadedMethodID) {
                this.log.warn('Multifile upload without onFileUploaded Method isn\'t supported. To upload multi file start using onFileUploaded Method');
            }
            const url = onFileUploadedMethodID ? this.servoyService.generateUploadUrl(this.servoyApi().getFormName(), this.name(), 'onFileUploadedMethodID') :
                this.servoyService.generateUploadUrl(this.servoyApi().getFormName(), this.name(), 'dataProviderID');
            const options: FileUploaderOptions = { url }
            const accept = this.accept();
            if (accept && '*/*' != accept) {
                const acceptedFiles: any[] = [];
                const acceptedMimeTypes: any[] = [];
                accept.split(',').forEach(value => {
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
                            console.warn('Cannot set accept value for fileupload component, cannot determine mime type from: ' + value);
                            acceptedFiles.push('.' + value);
                        } else {
                            acceptedFiles.push(mime);
                            acceptedMimeTypes.push(mime);
                        }
                        if (mime == 'application/zip') {
                            acceptedMimeTypes.push('application/x-zip-compressed');
                        }
                    }
                });
                this.acceptFiles.set(acceptedFiles.join(','));
                if (acceptedMimeTypes.length > 0){
                    options.allowedMimeType = acceptedMimeTypes;
                }
            }
            
            const maxFileSize = this.maxFileSize();
            if (maxFileSize) {
                options.maxFileSize = maxFileSize;
            }

            options.filters = [{
                name: 'emptyType', fn: (item: any, options: any): boolean => {
                    if (!item.type && options.allowedMimeType) {
                        const fileExtension = item.name.split('.').at(-1).toLowerCase();
                        const allowedExtensions = options.allowedMimeType.map((mime: any) => mime.split('/').at(-1).toLowerCase());
                        return allowedExtensions.includes(fileExtension);
                    }
                    return true;
                }
            }];
            
            if (!multiFileUpload) {
                options.filters.push({
                    name: 'multi', fn: (): boolean => {
                        const retValue = this.ready;
                        this.ready = false;
                        return retValue;
                    }
                });
                this.uploader = new FileUploader(options);
            } else this.uploader = new FileUploader(options);
            this.uploader.onProgressItem = () => {
                this.cdRef.detectChanges();
            };

            this.uploader.onCompleteAll = this.onComplete;
            this.uploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed;
            this.customText.set(this.uploadText() ?? '');
        }
    }

    onComplete = () => {
        this.ready = true;
        const onFileTransferFinishedMethodID = this.onFileTransferFinishedMethodID();
        if (onFileTransferFinishedMethodID) onFileTransferFinishedMethodID(new CustomEvent('onFileTransferFinishedMethodID'));
        this.customText.set(this.uploadSuccessText() ?? '');
        const fileInput = this.fileInput();
        if (fileInput){
            fileInput.nativeElement.value = null;
        }
        this.cdRef.detectChanges();
        this.hideProgress();
    };

    onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
        if (filter.name === 'fileSize') {
            this.customText.set(`File size (${item.size}) exceeds the maximum allowed size (${options.maxFileSize})`);
            this.log.warn(`File ${item.name} rejected: ${this.customText()}`);
        } else {
            this.customText.set(this.uploadNotSupportedFileText() ?? '');
        }
        this.cdRef.detectChanges();
        this.hideProgress();
    };

    hideProgress = () => {
        if(this.hideProgressTimer) clearTimeout(this.hideProgressTimer);
        if(this.resultDisplayTimeout()! > -1) {
            this.hideProgressTimer = setTimeout(() =>  {
                this.hideProgressTimer = null;
                this.uploader.progress = 0;
                this.customText.set(this.uploadText() ?? '');
                this.cdRef.detectChanges();
            } , this.resultDisplayTimeout());
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
                             this.customText.set(this.uploadText() ?? '');
                        } else{
                            this.renderer.setAttribute(this.getFocusElement(), 'disabled', 'disabled');
                            if (!this.servoyApi().isInDesigner()) this.customText.set('Component disabled, cannot upload file.');
                        }
                        break;
                    case 'uploadText':
                        if (!change.isFirstChange()){
                             this.customText.set(this.uploadText() ?? '');
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
