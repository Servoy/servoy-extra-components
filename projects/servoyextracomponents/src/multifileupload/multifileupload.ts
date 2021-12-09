import { Component, ViewChild, SimpleChanges, Input, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { LoggerFactory, LoggerService, ServoyBaseComponent, ServoyPublicService } from '@servoy/public';
import { FileProgress, Restrictions, Uppy, UppyFile, UppyOptions } from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import Tus, { TusOptions } from '@uppy/tus';
import type { DashboardOptions } from '@uppy/dashboard';
import { DashboardComponent } from '@servoy/uppy';


@Component({
    selector: 'servoyextra-multifileupload',
    templateUrl: './multifileupload.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraMultiFileUpload extends ServoyBaseComponent<HTMLDivElement> {

    @ViewChild(DashboardComponent) dashboard: DashboardComponent;

    @Input() autoProceed: boolean;
    @Input() allowMultipleUploads: boolean;
    @Input() hideUploadButton: boolean;
    @Input() restrictions: Restrictions;
    @Input() note: string;
    @Input() metaFields: MetaField[];
    @Input() cssPosition: { width: number; height: number };
    @Input() disableStatusBar: boolean;
    @Input() inline: boolean;
    @Input() closeAfterFinish: boolean;
    @Input() sources: string[];
    @Input() options: any;
    @Input() tusOptions: TusOptions;
    @Input() localeStrings: any;

    @Input() onFileUploaded: (file: any) => void;
    @Input() onFileAdded: (file: UploadFile) => void;
    @Input() onBeforeFileAdded: (fileToAdd: UploadFile, files: UploadFile[]) => Promise<boolean>;
    @Input() onFileRemoved: (file: UploadFile) => void;
    @Input() onUploadComplete: (successfulFiles: UploadFile[], failedFiles: UploadFile[]) => void;
    @Input() onModalOpened: () => void;
    @Input() onModalClosed: () => void;
    @Input() onRestrictionFailed: (file: UploadFile, error: string) => void;

    showDashboard = false;

    filesToBeAdded: Array<string> = [];

    uppy: Uppy = new Uppy();
    properties: DashboardOptions = {
        proudlyDisplayPoweredByUppy: false,
        inline: false
    };
    log: LoggerService;

    private plugins: Record<string, () => Promise<void>> = {};

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private servoyService: ServoyPublicService,
        logFactory: LoggerFactory) {
        super(renderer, cdRef);
        this.log = logFactory.getLogger('ServoyExtraMultiFileUpload');
        this.plugins.Webcam = this.installWebcam;
        this.plugins.ScreenCapture = this.installScreenCapture;
        this.loadUppyLocale();
    }

    svyOnInit() {
        super.svyOnInit();
        this.initUppy();
    }

    initUppy() {
        if (this.onFileAdded) {
            this.uppy.on('file-added', (file) => {
                this.onFileAdded(this.createUppyFile(file));
            });
        }

        if (this.onFileRemoved) {
            this.uppy.on('file-removed', (file: UppyFile) => {
                this.onFileRemoved(this.createUppyFile(file));
            });
        }

        if (this.onRestrictionFailed) {
            this.uppy.on('restriction-failed', (file: UppyFile, error: { message: string }) => {
                if (file) this.onRestrictionFailed(this.createUppyFile(file), error.message);
                else if (error?.message) {
                    if (error.message.indexOf('onBeforeFileAdded') === -1) {
                        this.log.error(error.message);
                    }
                }
            });
        }

        if (this.onModalOpened) {
            this.uppy.on('dashboard:modal-open', () => {
                this.onModalOpened();
            });
        }

        if (this.onModalClosed) {
            this.uppy.on('dashboard:modal-closed', () => {
                this.onModalOpened();
            });
        }

        if (this.onUploadComplete) {
            this.uppy.on('complete', (result: { successful: []; failed: [] }) => {
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
        this.uppy.on('error', (error) => {
            this.log.error(error);
        });
        const tusOptions: TusOptions = Object.assign({}, this.tusOptions?this.tusOptions:{});
        tusOptions.endpoint = this.servoyService.generateUploadUrl(this.servoyApi.getFormName(), this.name, 'onFileUploaded', true);
        if (!tusOptions.retryDelays) tusOptions.retryDelays =[0, 1000, 3000, 5000];
        this.uppy.use(Tus, tusOptions);

        const debugLogger = {
            debug: (...args) => this.log.debug(args),
            warn: (...args) => this.log.warn(args),
            error: (...args) => this.log.error(args),
        };
        const options = this.getUppyOptions();
        options.logger = debugLogger;
        options.onBeforeFileAdded = (currentFile: UppyFile) => this.onBeforeFileAddedEvent(currentFile);
        this.uppy.setOptions(options);

        this.pushDashboardOptions();

        if (this.sources) {
            Promise.allSettled(this.sources.map(value => this.plugins[value]())).then(() => {
                this.showDashboard = true;
                this.cdRef.detectChanges();
            });
       }
       else {
            this.showDashboard = true;
        }
    }

    installWebcam = () => import(`@uppy/webcam`).then(module => {
            this.uppy.use(module.default);
            this.properties.plugins.push('Webcam');
        }, (err) => {
            this.log.error(err);
        }
    );

    installScreenCapture = () => import(`@uppy/screen-capture`).then(module => {
            this.uppy.use(module.default);
            this.properties.plugins.push('ScreenCapture');
        }, (err) => {
            this.log.error(err);
        }
    );

    getUppyOptions() {
        const options: UppyOptions = {
            autoProceed: this.autoProceed,
            allowMultipleUploads: this.allowMultipleUploads,
            restrictions: this.restrictions,
        };
        return options;
    }

    pushDashboardOptions() {
        const locale = null;
        if (this.localeStrings) {
            for (const key of Object.keys(this.localeStrings)) {
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

        this.properties = {
            note: this.note,
            width: this.cssPosition.width,
            height: this.cssPosition.height,
            hideUploadButton: this.hideUploadButton,
            proudlyDisplayPoweredByUppy: false,
            disableStatusBar: this.disableStatusBar,
            inline: this.inline,
            closeAfterFinish: this.closeAfterFinish,
            metaFields: this.metaFields,
            plugins: [],
            locale
        };

        if (this.options) {
            for (const x of Object.keys(this.options)) {
                this.properties[x] = this.options[x];
            }
        }
        // this must be done becuse the options above are not set through to the plugin state.
//        this.uppy.getPlugin('angular:Dashboard').setPluginState({
//            metaFields: this.metaFields?this.metaFields:[],
//        });

    }

    svyOnChanges(changes: SimpleChanges) {
        super.svyOnChanges(changes);
        this.pushDashboardOptions();
        const options = this.getUppyOptions();
        this.uppy.setOptions(options);
    }

    reset(): void {
        this.uppy.reset();
    }

    upload(): void {
        this.uppy.upload();
    }

    retryAll(): void {
        this.uppy.retryAll();
    }

    cancelAll(): void {
        this.uppy.cancelAll();
    }

    retryUpload(fileID: string): void {
        this.uppy.retryUpload(fileID);
    }

    removeFile(fileID: string): void {
        this.uppy.removeFile(fileID);
    }

    info(message: any, type?: LogLevel, duration?: number): void {
        this.uppy.info(message, type, duration);
    }

    initialize(): void {
        this.uppy.close();
        this.uppy = new Uppy();
        this.initUppy();
        this.loadUppyLocale();
        this.cdRef.detectChanges();
    }

    openModal(): void {
        (this.uppy.getPlugin('angular:Dashboard') as Dashboard).openModal();
    }

    closeModal(): void {
        (this.uppy.getPlugin('angular:Dashboard') as Dashboard).closeModal();
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
                this.uppy.addFile(currentFile);
            }
            this.filesToBeAdded.splice(this.filesToBeAdded.indexOf(currentFile.name), 1);
        });
        return false;
    }

    getFile(fileID: string): UploadFile {
        const file = this.uppy.getFile(fileID);
        if (file != null) {
            return this.createUppyFile(file);
        }
        return null;
    }

    getFiles(): UploadFile[] {
        const files = this.uppy.getFiles();
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
                if (fieldName) result.metaFields[fieldName] = file.meta[fieldName] as MetaField || null;
            }
        }

        result.progress = {
            bytesTotal: file.size,
            bytesUploaded: 0,
            percentage: 0,
            uploadComplete: false,
            uploadStarted: null
        };
        if (file.progress) {
            result.progress.bytesTotal = file.progress.bytesTotal;
            result.progress.bytesUploaded = file.progress.bytesUploaded;
            result.progress.percentage = file.progress.percentage;
            result.progress.uploadComplete = file.progress.uploadComplete;
            result.progress.uploadStarted = file.progress.uploadStarted;
        }
        return result;
    }

    private loadUppyLocale() {
        let localeId = this.servoyService.getLocale().replace('-', '_');
        if (localeId.indexOf('_') === -1) {
            localeId = localeId + '_' + localeId.toUpperCase();
        }
        import(`@uppy/locales/lib/${localeId}.js`).then(
            module => {
                this.uppy.setOptions({ locale: module });
            },
            () => {
                console.log('not found uppy locale data for ' + localeId);
            });
    }
}

interface BaseFile {
    id: string;
    name: string;
    extension: string;
    type: string;
    size: number;
    progress?: FileProgress;
    error: string;
}

interface UploadFile extends BaseFile {
    metaFields: { [key: string]: MetaField };
}

interface MetaField {
  id: string;
  name: string;
  placeholder?: string;
}


type LogLevel = 'info' | 'warning' | 'error';

const getTimeStamp = () => new Date();

