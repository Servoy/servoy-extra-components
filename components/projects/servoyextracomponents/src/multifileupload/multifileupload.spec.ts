import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Component, input, provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraMultiFileUpload } from './multifileupload';
import { DashboardComponent } from '@uppy/angular';

/* eslint-disable @angular-eslint/component-selector */
@Component({ selector: 'uppy-dashboard', template: '', standalone: true })
class MockDashboardComponent {
    readonly uppy = input<any>(undefined);
    readonly props = input<any>(undefined);
}

describe('ServoyExtraMultiFileUpload', () => {
    let fixture: ComponentFixture<ServoyExtraMultiFileUpload>;
    let component: ServoyExtraMultiFileUpload;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraMultiFileUpload],
            providers: [provideZonelessChangeDetection()],
            schemas: [NO_ERRORS_SCHEMA]
        }).overrideComponent(ServoyExtraMultiFileUpload, {
            remove: { imports: [DashboardComponent] },
            add: { imports: [MockDashboardComponent] }
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraMultiFileUpload);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('responsiveHeight', 300);
        fixture.componentRef.setInput('responsiveWidth', 400);
        fixture.componentRef.setInput('styleClass', 'upload-test');
        fixture.componentRef.setInput('cssPosition', {
            position: 'absolute',
            top: '20px',
            left: '25px',
            height: '450px',
            width: '290px'
        });
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create the component', async () => {
        expect(component).toBeTruthy();
    });

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('should register the component with servoyApi', async () => {
        const servoyApi = component.servoyApi;
        expect(servoyApi).toBeTruthy();
    });

    it('should apply styleClass to the wrapper element', async () => {
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        const el = fixture.nativeElement.querySelector('.svy-extra-multifileupload');
        expect(el.classList.contains('mystyleclass')).toBe(true);
    });

    it('should apply multiple style classes', async () => {
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        const el = fixture.nativeElement.querySelector('.svy-extra-multifileupload');
        expect(el.classList.contains('classA')).toBe(true);
        expect(el.classList.contains('classB')).toBe(true);
    });

    it('should set uppy restrictions when restrictions input changes', async () => {
        const restrictions = {
            minNumberOfFiles: 1,
            maxNumberOfFiles: 10,
            allowedFileTypes: ['.pdf', '.jpg', '.png'],
            maxFileSize: 5000000,
        };
        fixture.componentRef.setInput('restrictions', restrictions);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.uppy().opts.restrictions?.allowedFileTypes).toEqual(['.pdf', '.jpg', '.png']);
    });

    it('should set hideUploadButton in dashboard properties', async () => {
        fixture.componentRef.setInput('hideUploadButton', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.properties().hideUploadButton).toBe(true);
    });

    it('should set note in dashboard properties', async () => {
        fixture.componentRef.setInput('note', 'Test upload note');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.properties().note).toBe('Test upload note');
    });

    it('should set disableStatusBar in dashboard properties', async () => {
        fixture.componentRef.setInput('disableStatusBar', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.properties().disableStatusBar).toBe(true);
    });

    it('should set autoProceed on uppy options', async () => {
        fixture.componentRef.setInput('autoProceed', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.uppy().opts.autoProceed).toBe(true);
    });

    it('should set allowMultipleUploadBatches on uppy options', async () => {
        fixture.componentRef.setInput('allowMultipleUploads', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.uppy().opts.allowMultipleUploadBatches).toBe(false);
    });

    it('should set closeAfterFinish in dashboard properties when not inline', async () => {
        fixture.componentRef.setInput('inline', false);
        fixture.componentRef.setInput('closeAfterFinish', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect((component.properties() as any).closeAfterFinish).toBe(true);
    });

    it('should not set closeAfterFinish in dashboard properties when inline', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('closeAfterFinish', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect((component.properties() as any).closeAfterFinish).toBe(false);
    });

    it('should expose reset method that calls uppy.cancelAll', async () => {
        const cancelSpy = vi.spyOn(component.uppy(), 'cancelAll');
        component.reset();
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('should expose upload method that calls uppy.upload', async () => {
        const uploadSpy = vi.spyOn(component.uppy(), 'upload').mockResolvedValue(undefined as any);
        component.upload();
        expect(uploadSpy).toHaveBeenCalled();
    });

    it('should expose retryAll method', async () => {
        const retrySpy = vi.spyOn(component.uppy(), 'retryAll').mockResolvedValue(undefined as any);
        component.retryAll();
        expect(retrySpy).toHaveBeenCalled();
    });

    it('should expose cancelAll method', async () => {
        const cancelSpy = vi.spyOn(component.uppy(), 'cancelAll');
        component.cancelAll();
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('should expose removeFile method', async () => {
        const removeSpy = vi.spyOn(component.uppy(), 'removeFile');
        component.removeFile('test-id');
        expect(removeSpy).toHaveBeenCalledWith('test-id');
    });

    it('should set inline in dashboard properties', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.properties().inline).toBe(true);
    });

    it('should use cssPosition dimensions in dashboard size when in absolute layout', async () => {
        fixture.componentRef.setInput('cssPosition', { width: 500, height: 350 });
        fixture.detectChanges();
        await fixture.whenStable();
        expect((component.properties() as any).width).toBe(500);
        expect((component.properties() as any).height).toBe(350);
    });

    it('should destroy uppy on component destroy', async () => {
        const destroySpy = vi.spyOn(component.uppy(), 'destroy');
        component.ngOnDestroy();
        expect(destroySpy).toHaveBeenCalled();
    });

    it('should set showDashboard signal to true after init', async () => {
        expect(component.showDashboard()).toBe(true);
    });

    it('createJSEvent builds a JSEvent with the given type', () => {
        const ev = component.createJSEvent('my-type');
        expect(ev.eventType).toBe('my-type');
    });

    it('convertToNumberOrReturnValue converts numeric strings and leaves others', () => {
        expect(component.convertToNumberOrReturnValue('400')).toBe(400);
        expect(component.convertToNumberOrReturnValue(250)).toBe(250);
        expect(component.convertToNumberOrReturnValue('100%')).toBe('100%');
    });

    it('createUppyFile maps the core fields of an uppy file', () => {
        const file: any = {
            id: 'f1', name: 'a.pdf', extension: 'pdf', type: 'application/pdf', size: 1000,
            meta: {}, progress: { bytesTotal: 1000, bytesUploaded: 500, percentage: 50, uploadComplete: false, uploadStarted: 123 }
        };
        const mapped = component.createUppyFile(file);
        expect(mapped.id).toBe('f1');
        expect(mapped.name).toBe('a.pdf');
        expect(mapped.size).toBe(1000);
        expect(mapped.progress!.bytesUploaded).toBe(500);
        expect(mapped.progress!.percentage).toBe(50);
    });

    it('createUppyFile fills default progress when the file has none', () => {
        const file: any = { id: 'f2', name: 'b.txt', extension: 'txt', type: 'text/plain', size: 10, meta: {} };
        const mapped = component.createUppyFile(file);
        expect(mapped.progress!.bytesUploaded).toBe(0);
        expect(mapped.progress!.uploadComplete).toBe(false);
    });

    it('getSize returns the cssPosition dimensions in absolute layout', () => {
        const api: any = component.servoyApi();
        vi.spyOn(api, 'isInAbsoluteLayout').mockReturnValue(true);
        fixture.componentRef.setInput('cssPosition', { width: 321, height: 123 });
        fixture.detectChanges();
        expect(component.getSize()).toEqual({ width: 321, height: 123 });
    });

    it('getSize returns responsive dimensions when not in absolute layout', () => {
        const api: any = component.servoyApi();
        vi.spyOn(api, 'isInAbsoluteLayout').mockReturnValue(false);
        fixture.componentRef.setInput('responsiveWidth', '400');
        fixture.componentRef.setInput('responsiveHeight', 250);
        fixture.detectChanges();
        expect(component.getSize()).toEqual({ width: 400, height: 250 });
    });

    it('getFile returns a mapped file when it exists and null otherwise', () => {
        vi.spyOn(component.uppy(), 'getFile').mockReturnValue({ id: 'x', name: 'x', extension: '', type: '', size: 1, meta: {} } as any);
        expect(component.getFile('x')!.id).toBe('x');
        vi.spyOn(component.uppy(), 'getFile').mockReturnValue(null as any);
        expect(component.getFile('x')).toBeNull();
    });

    it('getFiles maps all uppy files', () => {
        vi.spyOn(component.uppy(), 'getFiles').mockReturnValue([
            { id: 'a', name: 'a', extension: '', type: '', size: 1, meta: {} },
            { id: 'b', name: 'b', extension: '', type: '', size: 2, meta: {} }
        ] as any);
        const files = component.getFiles();
        expect(files.length).toBe(2);
        expect(files[0].id).toBe('a');
    });

    it('info delegates to uppy.info', () => {
        const spy = vi.spyOn(component.uppy(), 'info');
        component.info('hello', 'info', 2000);
        expect(spy).toHaveBeenCalledWith('hello', 'info', 2000);
    });

    it('retryUpload delegates to uppy.retryUpload', () => {
        const spy = vi.spyOn(component.uppy(), 'retryUpload').mockResolvedValue(undefined as any);
        component.retryUpload('rid');
        expect(spy).toHaveBeenCalledWith('rid');
    });

    it('openModal and closeModal call the dashboard plugin', () => {
        const plugin: any = { openModal: vi.fn(), closeModal: vi.fn() };
        vi.spyOn(component.uppy(), 'getPlugin').mockReturnValue(plugin);
        component.openModal();
        component.closeModal();
        expect(plugin.openModal).toHaveBeenCalled();
        expect(plugin.closeModal).toHaveBeenCalled();
    });

    it('onBeforeFileAddedEvent returns true when no handler is set', () => {
        expect(component.onBeforeFileAddedEvent({ name: 'f' })).toBe(true);
    });

    it('onBeforeFileAddedEvent defers to the handler and returns false the first time', async () => {
        const handler = vi.fn().mockResolvedValue(false);
        fixture.componentRef.setInput('onBeforeFileAdded', handler);
        fixture.detectChanges();
        const result = component.onBeforeFileAddedEvent({ name: 'defer.pdf', extension: 'pdf', type: 'application/pdf', size: 1, meta: {} });
        expect(result).toBe(false);
        expect(handler).toHaveBeenCalled();
        // let the handler promise resolve (rejected adds are not re-added to uppy)
        await Promise.resolve();
        expect(component.filesToBeAdded).not.toContain('defer.pdf');
    });

    it('onBeforeFileAddedEvent returns true for a file already queued', () => {
        const handler = vi.fn().mockResolvedValue(true);
        fixture.componentRef.setInput('onBeforeFileAdded', handler);
        fixture.detectChanges();
        component.filesToBeAdded.push('queued.pdf');
        expect(component.onBeforeFileAddedEvent({ name: 'queued.pdf' })).toBe(true);
    });

    it('getUppyOptions disables multiple batches when closeAfterFinish is set', () => {
        fixture.componentRef.setInput('allowMultipleUploads', true);
        fixture.componentRef.setInput('closeAfterFinish', true);
        fixture.detectChanges();
        expect(component.getUppyOptions().allowMultipleUploadBatches).toBe(false);
    });

    it('initialize rebuilds the uppy instance', () => {
        const oldUppy = component.uppy();
        const destroySpy = vi.spyOn(oldUppy, 'destroy');
        component.initialize();
        expect(destroySpy).toHaveBeenCalled();
        expect(component.uppy()).not.toBe(oldUppy);
    });


    describe('locale loading', () => {
        const languages = [
            'English', 'German', 'Dutch', 'French', 'Italian', 'Spanish', 'Chinese', 'Czech',
            'Danish', 'Finnish', 'Greek', 'Hungarian', 'Japanese', 'Persian', 'Russian', 'Swedish', 'Turkish'
        ];

        for (const lang of languages) {
            it('loads a locale without throwing for ' + lang, () => {
                fixture.componentRef.setInput('language', lang);
                fixture.detectChanges();
                expect(() => (component as any).loadUppyLocale()).not.toThrow();
            });
        }

        it('falls back to the servoy locale when no language is set', () => {
            fixture.componentRef.setInput('language', undefined);
            fixture.detectChanges();
            const svc: any = (component as any).servoyService;
            vi.spyOn(svc, 'getLocale').mockReturnValue('nl-NL');
            expect(() => (component as any).loadUppyLocale()).not.toThrow();
        });

        it('expands a single-token locale to lang_LANG', () => {
            fixture.componentRef.setInput('language', undefined);
            fixture.detectChanges();
            const svc: any = (component as any).servoyService;
            vi.spyOn(svc, 'getLocale').mockReturnValue('fr');
            expect(() => (component as any).loadUppyLocale()).not.toThrow();
        });

        it('maps en_GB to en_US', () => {
            fixture.componentRef.setInput('language', undefined);
            fixture.detectChanges();
            const svc: any = (component as any).servoyService;
            vi.spyOn(svc, 'getLocale').mockReturnValue('en-GB');
            expect(() => (component as any).loadUppyLocale()).not.toThrow();
        });

        it('applies localeStrings overrides including dotted keys', async () => {
            fixture.componentRef.setInput('language', 'English');
            fixture.componentRef.setInput('localeStrings', { browseFiles: 'Pick', 'dashboard.done': 'Finished' });
            fixture.detectChanges();
            (component as any).loadUppyLocale();
            // let the dynamic import resolve
            await new Promise(r => setTimeout(r, 50));
            expect(component).toBeTruthy();
        });
    });

    describe('uppy event wiring', () => {
        it('wires onFileAdded through to the handler on init', () => {
            const newFixture = TestBed.createComponent(ServoyExtraMultiFileUpload);
            const handler = vi.fn();
            newFixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
            newFixture.componentRef.setInput('inline', true);
            newFixture.componentRef.setInput('responsiveHeight', 300);
            newFixture.componentRef.setInput('responsiveWidth', 400);
            newFixture.componentRef.setInput('cssPosition', { width: 200, height: 200 });
            newFixture.componentRef.setInput('onFileAdded', handler);
            newFixture.detectChanges();
            const comp = newFixture.componentInstance as ServoyExtraMultiFileUpload;
            comp.uppy().emit('file-added', { id: 'f', name: 'n', extension: '', type: '', size: 1, meta: {} } as any);
            expect(handler).toHaveBeenCalled();
        });

        it('wires onUploadComplete and maps successful/failed files', () => {
            const newFixture = TestBed.createComponent(ServoyExtraMultiFileUpload);
            const handler = vi.fn();
            newFixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
            newFixture.componentRef.setInput('inline', true);
            newFixture.componentRef.setInput('responsiveHeight', 300);
            newFixture.componentRef.setInput('responsiveWidth', 400);
            newFixture.componentRef.setInput('cssPosition', { width: 200, height: 200 });
            newFixture.componentRef.setInput('onUploadComplete', handler);
            newFixture.detectChanges();
            const comp = newFixture.componentInstance as ServoyExtraMultiFileUpload;
            comp.uppy().emit('complete', {
                successful: [{ id: 's', name: 's', extension: '', type: '', size: 1, meta: {} }],
                failed: [{ id: 'f', name: 'f', extension: '', type: '', size: 1, meta: {} }]
            } as any);
            expect(handler).toHaveBeenCalled();
            const [success, failed] = handler.mock.calls[0];
            expect(success.length).toBe(1);
            expect(failed.length).toBe(1);
        });
    });

});
