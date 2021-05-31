import { Component, ViewChild, SimpleChanges, Input, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ServoyBaseComponent, ServoyPublicService } from '@servoy/public';
import { UppyConfig, UppyAngularComponent } from 'uppy-angular';

@Component({
    selector: 'servoyextra-multifileupload',
    templateUrl: './multifileupload.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraMultiFileUpload extends ServoyBaseComponent<HTMLDivElement> {

    @Input() autoProceed: boolean;
    @Input() allowMultipleUploads: boolean;
    @Input() hideUploadButton: boolean;
    @Input() restrictions: UploadRestriction;
    @Input() note: string;
    @Input() metaFields: {[key: string]: MetaField};
    @Input() cssPosition: {width: number; height: number};
    @Input() disableStatusBar: boolean;
    @Input() inline: boolean;
    @Input() closeAfterFinish: boolean;
    @Input() sources: string[];
    @Input() options: any;
    @Input() localeStrings: any;

    @Input() onFileUploaded: (file: any) => void;
    @Input() onFileAdded: (file: UploadFile) => void;
    @Input() onBeforeFileAdded: (fileToAdd: UploadFile, files: UploadFile[]) => Promise<boolean>;
    @Input() onFileRemoved: (file: UploadFile) => void;
    @Input() onUploadComplete: (successfulFiles: UploadFile[], failedFiles: UploadFile[]) => void;
    @Input() onModalOpened: () => void;
    @Input() onModalClosed: () => void;
    @Input() onRestrictionFailed: (file: UploadFile, error: string) => void;

    @ViewChild(UppyAngularComponent) uppy: UppyAngularComponent;

    settings: UppyConfig = null;
    filesToBeAdded: Array<string> = [];


    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private servoyService: ServoyPublicService) {
        super(renderer, cdRef);
    }

    ngOnInit() {
        super.ngOnInit();
        this.internalInit();
    }

    svyOnInit() {
        super.svyOnInit();
        if (this.onFileAdded) {
            this.uppy.uppyInstance.on('file-added', (file: UppyFile) => {
                this.onFileAdded(this.createUppyFile(file));
            });
        }

        if (this.onFileRemoved) {
            this.uppy.uppyInstance.on('file-removed', (file: UppyFile) => {
                this.onFileRemoved(this.createUppyFile(file));
            });
        }

        if (this.onRestrictionFailed) {
            this.uppy.uppyInstance.on('restriction-failed', (file: UppyFile, error: {message: string}) => {
                this.onRestrictionFailed(this.createUppyFile(file), error.message);
            });
        }

        if (this.onModalOpened) {
            this.uppy.uppyInstance.on('dashboard:modal-open', () => {
                this.onModalOpened();
            });
        }

        if (this.onModalClosed) {
            this.uppy.uppyInstance.on('dashboard:modal-closed', () => {
                this.onModalOpened();
            });
        }

        if (this.onUploadComplete) {
            this.uppy.uppyInstance.on('complete', (result: {successful: []; failed: []}) => {
                const filesSuccess = [];
                if (result.successful) {
                    for (const o of Object.keys(result.successful)) {
                        filesSuccess.push(this.createUppyFile(result.successful[o]));
                    }
                }
                const filesFailed = [];
                if (result.failed) {
                    for (const f of Object.keys(result.failed)) {
                        filesFailed.push(this.createUppyFile(result.failed[f]));
                    }
                }
                this.onUploadComplete(filesSuccess, filesFailed);
            });
        }
        this.uppy.uppyInstance.setOptions({
            onBeforeFileAdded: (currentFile: UppyFile) => this.onBeforeFileAddedEvent(currentFile)
        });
        const locale = null;
        if (this.localeStrings) {
            for (const key of  Object.keys(this.localeStrings)) {
                const localeString = this.localeStrings[key];
                if (key.indexOf('.') !== -1) {
                    const keyParts = key.split('.');
                    if (!locale.strings.hasOwnProperty(keyParts[0])) {
                        locale.strings[keyParts[0]] = {};
                    }
                    locale.strings[keyParts[0]][keyParts[1]] = localeString;
                } else {
                    locale.strings[key] = localeString;
                }
            }
        }

        const dashBoardOptions = {
            disableStatusBar: this.disableStatusBar,
            inline: this.inline,
            closeAfterFinish: this.closeAfterFinish,
            locale
        };

        if (this.options) {
            for (const x of  Object.keys(this.options)) {
                dashBoardOptions[x] = this.options[x];
            }
        }
        this.uppy.uppyInstance.getPlugin('Dashboard').setOptions(dashBoardOptions);
    }

    svyOnChanges(changes: SimpleChanges) {
        super.svyOnChanges(changes);
        this.internalInit();
    }

    reset(): void {
        this.uppy.uppyInstance.reset();
    }

    upload(): void {
        this.uppy.uppyInstance.upload();
    }

    retryAll(): void {
        this.uppy.uppyInstance.retryAll();
    }

    cancelAll(): void {
        this.uppy.uppyInstance.cancelAll();
    }

    retryUpload(fileID: string): void {
        this.uppy.uppyInstance.retryUpload(fileID);
    }

    removeFile(fileID: string): void {
        this.uppy.uppyInstance.removeFile(fileID);
    }

    info(message: any, type?: string, duration?: number): void {
        this.uppy.uppyInstance.info(message, type, duration);
    }

    initialize(): void {
        this.uppy.uppyInstance.close();
        this.internalInit();
    }

    openModal(): void {
        this.uppy.uppyInstance.getPlugin('Dashboard').openModal();
    }

    closeModal(): void {
        this.uppy.uppyInstance.getPlugin('Dashboard').closeModal();
    }

    internalInit(): void {
        const uppyPlugins = {};
        if (this.sources) {
            this.sources.forEach((value) => {
                uppyPlugins[value] = true;
            });
        }
        this.settings = {
            uploadAPI: {
                endpoint: this.servoyService.generateUploadUrl(this.servoyApi.getFormName(), this.name, 'onFileUploaded')
            },
            plugins: uppyPlugins,
            restrictions: this.restrictions,
            statusBarOptions: {
                hideUploadButton: this.hideUploadButton
            },
            uploaderLook: {
                note: this.note,
                width: this.cssPosition.width,
                height: this.cssPosition.height
            },
            options: {
                autoProceed: this.autoProceed,
                allowMultipleUploads: this.allowMultipleUploads,
                meta: this.metaFields
            }
        };
    }

    onBeforeFileAddedEvent(currentFile: any): boolean {
        if (!this.onBeforeFileAdded) {
            return true;
        }
        const currentFiles = this.getFiles();

        if (this.filesToBeAdded.indexOf(currentFile.name) !== -1) {
            return true;
        }

        this.filesToBeAdded.push(currentFile.name);

        this.onBeforeFileAdded(this.createUppyFile(currentFile), currentFiles).then((result: boolean) => {
            if (result === true) {
                this.uppy.uppyInstance.addFile(currentFile);
            }
            this.filesToBeAdded.splice(this.filesToBeAdded.indexOf(currentFile.name), 1);
        });
        return false;
    }

    getFile(fileID: string): UploadFile {
        const file = this.uppy.uppyInstance.getFile(fileID);
        if (file != null) {
            return this.createUppyFile(file);
        }
        return null;
    }

    getFiles(): UploadFile[] {
        const files = this.uppy.uppyInstance.getFiles();
        const result = [];
        if (files) {
            for (const f of Object.keys(files)) {
                result.push(this.createUppyFile(files[f]));
            }
        }
        return result;
    }

    createUppyFile(file: UppyFile): UploadFile {
        const result: UploadFile = {
            id: file.id,
            name: file.name,
            extension: file.extension,
            type: file.type,
            size: file.size,
            metaFields: {},
            error: null
        };

        if (this.metaFields && file.meta) {
            for (const m of Object.keys(this.metaFields)) {
                const fieldName = this.metaFields[m].id;
                result.metaFields[fieldName] = file.meta[fieldName] || null;
            }
        }

        if (!file.progress) {
            result.progress = {
                bytesTotal: file.size,
                bytesUploaded: 0,
                percentage: 0,
                uploadComplete: false,
                uploadStarted: null
            };
        } else {
            result.progress = file.progress;
            if (result.progress.uploadStarted) {
                result.progress.uploadStarted = new Date(result.progress.uploadStarted);
            }
        }

        if (file.error) {
            result.error = file.error;
        }

        return result;
    }
}

interface MetaField {
    id: string;
    name: string;
    placeholder: string;
}

interface BaseFile {
    id: string;
    name: string;
    extension: string;
    type: string;
    size: number;
    progress?: Progress;
    error: string;
}

interface UppyFile extends BaseFile {
    meta: {[key: string]: MetaField} ;
}

interface UploadFile extends BaseFile {
    metaFields: {[key: string]: MetaField};
}

interface Progress {
    bytesTotal: number;
    bytesUploaded: number;
    percentage: number;
    uploadComplete: boolean;
    uploadStarted: Date;
}

interface UploadRestriction {
    maxFileSize: number;
    maxNumberOfFiles: number;
    minNumberOfFiles: number;
    allowedFileTypes: string[];
}
