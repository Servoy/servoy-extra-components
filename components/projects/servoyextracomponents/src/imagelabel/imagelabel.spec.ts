import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraImageLabel } from './imagelabel';

describe('ServoyExtraImageLabel', () => {
    let fixture: ComponentFixture<ServoyExtraImageLabel>;
    let component: ServoyExtraImageLabel;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraImageLabel],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraImageLabel);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('centerImage', true);
        fixture.componentRef.setInput('media', undefined);
        fixture.componentRef.setInput('styleClass', undefined);
        fixture.componentRef.setInput('tabSeq', undefined);
        fixture.componentRef.setInput('onActionMethodID', undefined);
        fixture.componentRef.setInput('onRightClickMethodID', undefined);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create and register the component', async () => {
        expect(component).toBeTruthy();
    });

    it('should show a style class', async () => {
        const el = fixture.nativeElement.querySelector('.svy-extra-imagelabel');
        expect(el.classList.contains('mystyleclass')).toBe(false);
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.classList.contains('mystyleclass')).toBe(true);
    });

    it('should show more than 1 style class', async () => {
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        const el = fixture.nativeElement.querySelector('.svy-extra-imagelabel');
        expect(el.classList.contains('mystyleclass')).toBe(true);
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.classList.contains('classA')).toBe(true);
        expect(el.classList.contains('classB')).toBe(true);
    });

    it('should set centerImage class when centerImage is true', async () => {
        const el = fixture.nativeElement.querySelector('.svy-extra-imagelabel');
        expect(el.classList.contains('svy-extra-imagelabel-center')).toBe(true);
        fixture.componentRef.setInput('centerImage', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.classList.contains('svy-extra-imagelabel-center')).toBe(false);
    });

    it('should handle enabled state', async () => {
        const el = fixture.nativeElement.querySelector('.svy-extra-imagelabel');
        expect(el.hasAttribute('disabled')).toBe(false);
        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.hasAttribute('disabled')).toBe(true);
    });

    it('should handle media changes', async () => {
        fixture.componentRef.setInput('media', 'https://picsum.photos/200/300');
        fixture.detectChanges();
        await fixture.whenStable();
        const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
        expect(img).not.toBeNull();
        expect(img.getAttribute('src')).toBe('https://picsum.photos/200/300');
    });

    it('should handle click events', async () => {
        const onAction = vi.fn();
        fixture.componentRef.setInput('onActionMethodID', onAction);
        fixture.detectChanges();
        await fixture.whenStable();
        component.svyOnInit();
        const el = fixture.nativeElement.querySelector('.svy-extra-imagelabel');
        el.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(onAction).toHaveBeenCalled();
    });

    it('should handle right-click events', async () => {
        const onRightClick = vi.fn();
        fixture.componentRef.setInput('media', 'https://picsum.photos/200/300');
        fixture.componentRef.setInput('onRightClickMethodID', onRightClick);
        fixture.detectChanges();
        await fixture.whenStable();
        component.svyOnInit();
        const el = fixture.nativeElement.querySelector('.svy-extra-imagelabel');
        el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(onRightClick).toHaveBeenCalled();
    });

    it('should update imageURL signal when media changes', async () => {
        fixture.componentRef.setInput('media', 'http://example.com/image.png');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.imageURL()).toBe('http://example.com/image.png');
        fixture.componentRef.setInput('media', 'http://example.com/other.png');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.imageURL()).toBe('http://example.com/other.png');
    });
});
