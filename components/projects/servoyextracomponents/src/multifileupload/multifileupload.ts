import { Component, SimpleChanges, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy, input, viewChild } from '@angular/core';
import { JSEvent, LoggerFactory, LoggerService, ServoyBaseComponent, ServoyPublicService } from '@servoy/public';
import { Uppy, UppyFile, UppyOptions,Restrictions } from '@uppy/core';
import { FileProgress } from '@uppy/utils';
import { DashboardComponent } from '@uppy/angular';
import Dashboard from '@uppy/dashboard';
import Tus, { TusOpts } from '@uppy/tus';
import type { DashboardOptions } from '@uppy/dashboard';
import type { WebcamOptions } from '@uppy/webcam';

@Component({
    selector: 'servoyextra-multifileupload',
    templateUrl: './multifileupload.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ServoyExtraMultiFileUpload extends ServoyBaseComponent<HTMLDivElement> {

    readonly dashboard = viewChild(DashboardComponent);

    readonly autoProceed = input<boolean>(undefined);
    readonly allowMultipleUploads = input<boolean>(undefined);
    readonly hideUploadButton = input<boolean>(undefined);
    readonly restrictions = input<Restrictions>(undefined);
    readonly note = input<string>(undefined);
    readonly metaFields = input<MetaField[]>(undefined);
    readonly cssPosition = input<{
        width: number;
        height: number;
    }>(undefined);
    readonly disableStatusBar = input<boolean>(undefined);
    readonly inline = input<boolean>(undefined);
    readonly closeAfterFinish = input<boolean>(undefined);
    readonly sources = input<string[]>(undefined);
    readonly options = input<any>(undefined);
    readonly tusOptions = input<TusOpts<any, any>>(undefined);
    readonly webcamOptions = input<WebcamOptions<any, any>>(undefined);
    readonly localeStrings = input<any>(undefined);
    readonly language = input<string>(undefined);
	readonly responsiveWidth = input<string>(undefined);
	readonly responsiveHeight = input<number>(undefined);
    readonly styleClass = input<string>(undefined);

    readonly onFileUploaded = input<(file: any, event: JSEvent) => void>(undefined);
    readonly onFileAdded = input<(file: UploadFile, event: JSEvent) => void>(undefined);
    readonly onBeforeFileAdded = input<(fileToAdd: UploadFile, files: UploadFile[], event: JSEvent) => Promise<boolean>>(undefined);
    readonly onFileRemoved = input<(file: UploadFile, event: JSEvent) => void>(undefined);
    readonly onUploadComplete = input<(successfulFiles: UploadFile[], failedFiles: UploadFile[], event: JSEvent) => void>(undefined);
    readonly onModalOpened = input<() => void>(undefined);
    readonly onModalClosed = input<() => void>(undefined);
    readonly onRestrictionFailed = input<(file: UploadFile, error: string, event: JSEvent) => void>(undefined);

    showDashboard = false;

    filesToBeAdded: Array<string> = [];

    uppy: Uppy = new Uppy();
    properties: DashboardOptions<any,any> = {
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
        if (this.onFileAdded()) {
            this.uppy.on('file-added', (file) => {
                this.onFileAdded()(this.createUppyFile(file), this.createJSEvent('file-added'));
            });
        }

        if (this.onFileRemoved()) {
            this.uppy.on('file-removed', (file: UppyFile<any,any>) => {
                this.onFileRemoved()(this.createUppyFile(file), this.createJSEvent('file-removed'));
            });
        }

        if (this.onRestrictionFailed()) {
            this.uppy.on('restriction-failed', (file: UppyFile<any,any>, error: { message: string }) => {
                if (file) this.onRestrictionFailed()(this.createUppyFile(file), error.message, this.createJSEvent('restriction-failed'));
                else if (error?.message) {
                    if (error.message.indexOf('onBeforeFileAdded') === -1) {
                        this.log.error(error.message);
                    }
                }
            });
        }

        if (this.onModalOpened()) {
            this.uppy.on('dashboard:modal-open', () => {
                this.onModalOpened()();
            });
        }

        if (this.onModalClosed()) {
            this.uppy.on('dashboard:modal-closed', () => {
                this.onModalOpened()();
            });
        }

        if (this.onUploadComplete()) {
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
                this.onUploadComplete()(filesSuccess, filesFailed, this.createJSEvent('complete'));
            });
        }
        this.uppy.on('error', (error) => {
            this.log.error(error);
        });
        const tusOptionsValue = this.tusOptions();
        const tusOptions: TusOpts<any,any> = Object.assign({} as TusOpts<any,any>, tusOptionsValue ? tusOptionsValue : {});
        tusOptions.endpoint = this.servoyService.generateUploadUrl(this.servoyApi.getFormName(), this.name, 'onFileUploaded', true);
        if (!tusOptions.retryDelays) tusOptions.retryDelays = [0, 1000, 3000, 5000];
        if (tusOptions.removeFingerprintOnSuccess === undefined) tusOptions.removeFingerprintOnSuccess = true;
        this.uppy.use(Tus, tusOptions);

        const debugLogger = {
            debug: (...args) => this.log.debug(args),
            warn: (...args) => this.log.warn(args),
            error: (...args) => this.log.error(args),
        };
        const options = this.getUppyOptions();
        options.logger = debugLogger;
        options.onBeforeFileAdded = (currentFile: UppyFile<any,any>) => this.onBeforeFileAddedEvent(currentFile);
        this.uppy.setOptions(options);

        this.pushDashboardOptions();

        const sources = this.sources();
        if (sources) {
            Promise.allSettled(sources.map(value => this.plugins[value]())).then(() => {
                this.showDashboard = true;
                this.cdRef.detectChanges();
            });
        }
        else {
            this.showDashboard = true;
        }
    }

    installWebcam = () => import('@uppy/webcam').then(module => {
        this.uppy.use(module.default, this.webcamOptions());
        this.properties.plugins.push('Webcam');
    }, (err) => {
        this.log.error(err);
    }
    );

    installScreenCapture = () => import('@uppy/screen-capture').then(module => {
        this.uppy.use(module.default);
        this.properties.plugins.push('ScreenCapture');
    }, (err) => {
        this.log.error(err);
    }
    );

    getUppyOptions() {
        const options: UppyOptions<any,any> = {
            autoProceed: this.autoProceed(),
            allowMultipleUploadBatches: this.allowMultipleUploads(),
            restrictions: this.restrictions(),
        };
        if (this.closeAfterFinish()) {
            options.allowMultipleUploadBatches = false;
        }
        return options;
    }

    pushDashboardOptions() {
		const size = this.getSize();
        this.properties = {
            note: this.note(),
            width: size.width,
            height: size.height,
            hideUploadButton: this.hideUploadButton(),
            proudlyDisplayPoweredByUppy: false,
            disableStatusBar: this.disableStatusBar(),
            inline: this.inline(),
            closeAfterFinish: this.closeAfterFinish() && !this.inline(),
            metaFields: this.metaFields(),
            plugins: []
        };

        const options = this.options();
        if (options) {
            for (const x of Object.keys(options)) {
                this.properties[x] = options[x];
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
        if (this.language() || this.localeStrings()) {
            this.loadUppyLocale();
        }
    }

    reset(): void {
        this.uppy.cancelAll();
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
        this.uppy.destroy();
        this.uppy = new Uppy();
        this.initUppy();
        this.loadUppyLocale();
        this.cdRef.detectChanges();
    }

    openModal(): void {
        (this.uppy.getPlugin('angular:Dashboard') as Dashboard<any,any>).openModal();
    }

    closeModal(): void {
        (this.uppy.getPlugin('angular:Dashboard') as Dashboard<any,any>).closeModal();
    }

    onBeforeFileAddedEvent(currentFile: any): boolean {
        const onBeforeFileAdded = this.onBeforeFileAdded();
        if (!onBeforeFileAdded) {
            return true;
        }
        const currentFiles = this.getFiles();

        if (this.filesToBeAdded.indexOf(currentFile.name) !== -1) {
            return true;
        }

        this.filesToBeAdded.push(currentFile.name);

        onBeforeFileAdded(this.createUppyFile(currentFile), currentFiles, this.createJSEvent('before-file-added')).then((result: boolean) => {
            if (result === true) {
                this.uppy.addFile(currentFile);
            }
            this.filesToBeAdded.splice(this.filesToBeAdded.indexOf(currentFile.name), 1);
        });
        return false;
    }

    createJSEvent(type: string): JSEvent {
        const event = new JSEvent();
        event.eventType = type;

        return event;
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

    createUppyFile(file: UppyFile<any,any>): UploadFile {
        const result: UploadFile = {
            id: file.id,
            name: file.name,
            extension: file.extension,
            type: file.type,
            size: file.size,
            metaFields: {},
            error: null
        };
        const metaFields = this.metaFields();
        if (metaFields && file.meta) {
            for (const m of Object.keys(metaFields)) {
                const fieldName = metaFields[m].id;
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
            result.progress.bytesUploaded = file.progress.bytesUploaded as number;
            result.progress.percentage = file.progress.percentage;
            result.progress.uploadComplete = file.progress.uploadComplete;
            result.progress.uploadStarted = file.progress.uploadStarted;
        }
        return result;
    }
	
	getSize() {
		if (this.servoyApi.isInAbsoluteLayout()) {
			return {
				width: this.cssPosition().width,
				height: this.cssPosition().height
			}
		} else {
			return {
				width: this.convertToNumberOrReturnValue(this.responsiveWidth()),
				height: this.responsiveHeight()
			}
		}
	}
	
	convertToNumberOrReturnValue(value: string) {
		if (Number(value) >= 0) {
			return Number(value);
		}
		return value;
	}

    private loadUppyLocale() {
        let localeId = null;
        const language = this.language();
        if (language) {
            if (language === 'English') {
                localeId = 'en_US';
            } else if (language === 'German') {
                localeId = 'de_DE';
            } else if (language === 'Dutch') {
                localeId = 'nl_NL';
            } else if (language === 'French') {
                localeId = 'fr_FR';
            } else if (language === 'Italian') {
                localeId = 'it_IT';
            } else if (language === 'Spanish') {
                localeId = 'es_ES';
            } else if (language === 'Chinese') {
                localeId = 'zh_CN';
            } else if (language === 'Czech') {
                localeId = 'cs_CZ';
            } else if (language === 'Danish') {
                localeId = 'da_DK';
            } else if (language === 'Finnish') {
                localeId = 'fi_FI';
            } else if (language === 'Greek') {
                localeId = 'el_GR';
            } else if (language === 'Hungarian') {
                localeId = 'hu_HU';
            } else if (language === 'Japanese') {
                localeId = 'ja_JP';
            } else if (language === 'Persian') {
                localeId = 'fa_IR';
            } else if (language === 'Russian') {
                localeId = 'ru_RU';
            } else if (language === 'Swedish') {
                localeId = 'sv_SE';
            } else if (language === 'Turkish') {
                localeId = 'tr_TR';
            }
        } else {
            localeId = this.servoyService.getLocale().replace('-', '_');
        }
        if (localeId.indexOf('_') === -1) {
            localeId = localeId + '_' + localeId.toUpperCase();
        }
        if (localeId == 'en_GB'){
            localeId = 'en_US';
        }
        const moduleLoader =  module => {
            const locale = module.default;
            const localeStrings = this.localeStrings();
            if (localeStrings) {
                for (const key of Object.keys(localeStrings)) {
                    const localeString = localeStrings[key];
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
            this.uppy.setOptions({ locale });
        }
        const errorHandler = () => {
                console.log('not found uppy locale data for ' + localeId);
        }
        switch(localeId) {
            case 'ar_SA':import('@uppy/locales/lib/ar_SA.js').then(moduleLoader,errorHandler); break;
            case 'bg_BG':import('@uppy/locales/lib/bg_BG.js').then(moduleLoader,errorHandler); break;
            case 'ca_ES':import('@uppy/locales/lib/ca_ES.js').then(moduleLoader,errorHandler); break;
            case 'cs_CZ':import('@uppy/locales/lib/cs_CZ.js').then(moduleLoader,errorHandler); break;
            case 'da_DK':import('@uppy/locales/lib/da_DK.js').then(moduleLoader,errorHandler); break;
            case 'de_DE':import('@uppy/locales/lib/de_DE.js').then(moduleLoader,errorHandler); break;
            case 'el_GR':import('@uppy/locales/lib/el_GR.js').then(moduleLoader,errorHandler); break;
            case 'es_ES':import('@uppy/locales/lib/es_ES.js').then(moduleLoader,errorHandler); break;
            case 'es_MX':import('@uppy/locales/lib/es_MX.js').then(moduleLoader,errorHandler); break;
            case 'fa_IR':import('@uppy/locales/lib/fa_IR.js').then(moduleLoader,errorHandler); break;
            case 'fi_FI':import('@uppy/locales/lib/fi_FI.js').then(moduleLoader,errorHandler); break;
            case 'fr_FR':import('@uppy/locales/lib/fr_FR.js').then(moduleLoader,errorHandler); break;
            case 'gl_ES':import('@uppy/locales/lib/gl_ES.js').then(moduleLoader,errorHandler); break;
            case 'he_IL':import('@uppy/locales/lib/he_IL.js').then(moduleLoader,errorHandler); break;
            case 'hi_IN':import('@uppy/locales/lib/hi_IN.js').then(moduleLoader,errorHandler); break;
            case 'hr_HR':import('@uppy/locales/lib/hr_HR.js').then(moduleLoader,errorHandler); break;
            case 'hu_HU':import('@uppy/locales/lib/hu_HU.js').then(moduleLoader,errorHandler); break;
            case 'id_ID':import('@uppy/locales/lib/id_ID.js').then(moduleLoader,errorHandler); break;
            case 'is_IS':import('@uppy/locales/lib/is_IS.js').then(moduleLoader,errorHandler); break;
            case 'it_IT':import('@uppy/locales/lib/it_IT.js').then(moduleLoader,errorHandler); break;
            case 'ja_JP':import('@uppy/locales/lib/ja_JP.js').then(moduleLoader,errorHandler); break;
            case 'ko_KR':import('@uppy/locales/lib/ko_KR.js').then(moduleLoader,errorHandler); break;
            case 'nb_NO':import('@uppy/locales/lib/nb_NO.js').then(moduleLoader,errorHandler); break;
            case 'nl_NL':import('@uppy/locales/lib/nl_NL.js').then(moduleLoader,errorHandler); break;
            case 'pl_PL':import('@uppy/locales/lib/pl_PL.js').then(moduleLoader,errorHandler); break;
            case 'pt_BR':import('@uppy/locales/lib/pt_BR.js').then(moduleLoader,errorHandler); break;
            case 'pt_PT':import('@uppy/locales/lib/pt_PT.js').then(moduleLoader,errorHandler); break;
            case 'ro_RO':import('@uppy/locales/lib/ro_RO.js').then(moduleLoader,errorHandler); break;
            case 'ru_RU':import('@uppy/locales/lib/ru_RU.js').then(moduleLoader,errorHandler); break;
            case 'sk_SK':import('@uppy/locales/lib/sk_SK.js').then(moduleLoader,errorHandler); break;
            case 'sr_RS_Cyrillic':import('@uppy/locales/lib/sr_RS_Cyrillic.js').then(moduleLoader,errorHandler); break;
            case 'sr_RS_Latin':import('@uppy/locales/lib/sr_RS_Latin.js').then(moduleLoader,errorHandler); break;
            case 'sv_SE':import('@uppy/locales/lib/sv_SE.js').then(moduleLoader,errorHandler); break;
            case 'th_TH':import('@uppy/locales/lib/th_TH.js').then(moduleLoader,errorHandler); break;
            case 'tr_TR':import('@uppy/locales/lib/tr_TR.js').then(moduleLoader,errorHandler); break;
            case 'uk_UA':import('@uppy/locales/lib/uk_UA.js').then(moduleLoader,errorHandler); break;
            case 'uz_UZ':import('@uppy/locales/lib/uz_UZ.js').then(moduleLoader,errorHandler); break;
            case 'vi_VN':import('@uppy/locales/lib/vi_VN.js').then(moduleLoader,errorHandler); break;
            case 'zh_CN':import('@uppy/locales/lib/zh_CN.js').then(moduleLoader,errorHandler); break;
            case 'zh_TW':import('@uppy/locales/lib/zh_TW.js').then(moduleLoader,errorHandler); break;
            default:import('@uppy/locales/lib/en_US.js').then(moduleLoader,errorHandler); break;
        }
        
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

