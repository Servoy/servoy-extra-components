import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Component, input } from '@angular/core';
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
        expect(component.uppy.opts.restrictions?.allowedFileTypes).toEqual(['.pdf', '.jpg', '.png']);
    });

    it('should set hideUploadButton in dashboard properties', async () => {
        fixture.componentRef.setInput('hideUploadButton', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.properties.hideUploadButton).toBe(true);
    });

    it('should set note in dashboard properties', async () => {
        fixture.componentRef.setInput('note', 'Test upload note');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.properties.note).toBe('Test upload note');
    });

    it('should set disableStatusBar in dashboard properties', async () => {
        fixture.componentRef.setInput('disableStatusBar', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.properties.disableStatusBar).toBe(true);
    });

    it('should set autoProceed on uppy options', async () => {
        fixture.componentRef.setInput('autoProceed', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.uppy.opts.autoProceed).toBe(true);
    });

    it('should set allowMultipleUploadBatches on uppy options', async () => {
        fixture.componentRef.setInput('allowMultipleUploads', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.uppy.opts.allowMultipleUploadBatches).toBe(false);
    });

    it('should set closeAfterFinish in dashboard properties when not inline', async () => {
        fixture.componentRef.setInput('inline', false);
        fixture.componentRef.setInput('closeAfterFinish', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect((component.properties as any).closeAfterFinish).toBe(true);
    });

    it('should not set closeAfterFinish in dashboard properties when inline', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.componentRef.setInput('closeAfterFinish', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect((component.properties as any).closeAfterFinish).toBe(false);
    });

    it('should expose reset method that calls uppy.cancelAll', async () => {
        const cancelSpy = vi.spyOn(component.uppy, 'cancelAll');
        component.reset();
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('should expose upload method that calls uppy.upload', async () => {
        const uploadSpy = vi.spyOn(component.uppy, 'upload').mockResolvedValue(undefined as any);
        component.upload();
        expect(uploadSpy).toHaveBeenCalled();
    });

    it('should expose retryAll method', async () => {
        const retrySpy = vi.spyOn(component.uppy, 'retryAll').mockResolvedValue(undefined as any);
        component.retryAll();
        expect(retrySpy).toHaveBeenCalled();
    });

    it('should expose cancelAll method', async () => {
        const cancelSpy = vi.spyOn(component.uppy, 'cancelAll');
        component.cancelAll();
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('should expose removeFile method', async () => {
        const removeSpy = vi.spyOn(component.uppy, 'removeFile');
        component.removeFile('test-id');
        expect(removeSpy).toHaveBeenCalledWith('test-id');
    });

    it('should set inline in dashboard properties', async () => {
        fixture.componentRef.setInput('inline', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.properties.inline).toBe(true);
    });

    it('should use cssPosition dimensions in dashboard size when in absolute layout', async () => {
        fixture.componentRef.setInput('cssPosition', { width: 500, height: 350 });
        fixture.detectChanges();
        await fixture.whenStable();
        expect((component.properties as any).width).toBe(500);
        expect((component.properties as any).height).toBe(350);
    });

    it('should destroy uppy on component destroy', async () => {
        const destroySpy = vi.spyOn(component.uppy, 'destroy');
        component.ngOnDestroy();
        expect(destroySpy).toHaveBeenCalled();
    });
});
