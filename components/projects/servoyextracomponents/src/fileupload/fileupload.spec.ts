import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraFileUpload } from './fileupload';
import { FileUploadModule } from 'ng2-file-upload';

describe('ServoyExtraFileUpload', () => {
    let fixture: ComponentFixture<ServoyExtraFileUpload>;
    let component: ServoyExtraFileUpload;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, FileUploadModule, ServoyExtraFileUpload],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraFileUpload);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('styleClass', 'fileupload-test');
        fixture.componentRef.setInput('uploadText', 'Upload File');
        fixture.componentRef.setInput('uploadProgressText', 'Uploading...');
        fixture.componentRef.setInput('uploadSuccessText', 'Success!');
        fixture.componentRef.setInput('uploadCancelText', 'Cancel');
        fixture.componentRef.setInput('uploadNotSupportedText', 'Upload not supported');
        fixture.componentRef.setInput('uploadNotSupportedFileText', 'File type not supported');
        fixture.componentRef.setInput('showFileName', true);
        fixture.componentRef.setInput('showProgress', true);
        fixture.componentRef.setInput('multiFileUpload', false);
        fixture.componentRef.setInput('resultDisplayTimeout', 2000);
        fixture.componentRef.setInput('accept', '');
        fixture.componentRef.setInput('dataProviderID', null);
        fixture.componentRef.setInput('displaysTags', false);
        fixture.componentRef.setInput('iconStyleClass', '');
        fixture.componentRef.setInput('styleClassExpression', '');
        fixture.componentRef.setInput('successIconStyleClass', '');
        fixture.componentRef.setInput('toolTipText', '');
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should mount and register the component', async () => {
        expect(fixture.nativeElement.querySelector('.svy-extra-fileupload')).toBeTruthy();
    });

    it('should show style class', async () => {
        const el = fixture.nativeElement.querySelector('.svy-extra-fileupload');
        expect(el.classList.contains('fileupload-test')).toBe(true);
        fixture.componentRef.setInput('styleClass', 'new-style');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.classList.contains('new-style')).toBe(true);
    });

    it('should handle enabled state', async () => {
        const input = fixture.nativeElement.querySelector('input[type="file"]');
        expect(input.disabled).toBe(false);
        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(input.disabled).toBe(true);
    });

    it('should handle file type restrictions', async () => {
        fixture.componentRef.setInput('accept', 'image/*');
        fixture.detectChanges();
        await fixture.whenStable();
        const newFixture = TestBed.createComponent(ServoyExtraFileUpload);
        newFixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        newFixture.componentRef.setInput('enabled', true);
        newFixture.componentRef.setInput('accept', 'image/*');
        newFixture.componentRef.setInput('multiFileUpload', false);
        newFixture.componentRef.setInput('resultDisplayTimeout', 2000);
        newFixture.componentRef.setInput('uploadText', 'Upload File');
        newFixture.componentRef.setInput('uploadSuccessText', 'Success!');
        newFixture.componentRef.setInput('uploadNotSupportedFileText', 'File type not supported');
        newFixture.detectChanges();
        await newFixture.whenStable();
        const input = newFixture.nativeElement.querySelector('input[type="file"]');
        expect(input.getAttribute('accept')).toContain('image/');
    });

    it('should show upload text', async () => {
        const label = fixture.nativeElement.querySelector('label');
        expect(label.textContent).toContain('Upload File');
    });

    it('should handle multi-file upload setting', async () => {
        const multiFixture = TestBed.createComponent(ServoyExtraFileUpload);
        multiFixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        multiFixture.componentRef.setInput('enabled', true);
        multiFixture.componentRef.setInput('multiFileUpload', true);
        multiFixture.componentRef.setInput('accept', '');
        multiFixture.componentRef.setInput('resultDisplayTimeout', 2000);
        multiFixture.componentRef.setInput('uploadText', 'Upload File');
        multiFixture.componentRef.setInput('uploadSuccessText', 'Success!');
        multiFixture.componentRef.setInput('uploadNotSupportedFileText', 'File type not supported');
        multiFixture.componentRef.setInput('onFileUploadedMethodID', () => { /* noop */ });
        multiFixture.detectChanges();
        await multiFixture.whenStable();
        const input = multiFixture.nativeElement.querySelector('input[type="file"]');
        expect(input.hasAttribute('multiple')).toBe(true);
    });

    it('should handle file upload events', async () => {
        const onFileTransferFinished = vi.fn();
        fixture.componentRef.setInput('onFileTransferFinishedMethodID', onFileTransferFinished);
        fixture.detectChanges();
        await fixture.whenStable();
        component.onComplete();
        expect(onFileTransferFinished).toHaveBeenCalled();
    });
});
