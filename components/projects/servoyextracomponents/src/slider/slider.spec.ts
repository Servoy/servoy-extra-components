import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSlider } from './slider';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

beforeAll(() => {
    globalThis.ResizeObserver = class {
        observe() { /* noop */ }
        unobserve() { /* noop */ }
        disconnect() { /* noop */ }
    } as any;
});

describe('ServoyExtraSlider', () => {
    let fixture: ComponentFixture<ServoyExtraSlider>;
    let component: ServoyExtraSlider;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, NgxSliderModule, ServoyExtraSlider],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraSlider);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('dataProvider', 5);
        fixture.componentRef.setInput('ceil', 20);
        fixture.componentRef.setInput('floor', 0);
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('step', 1);
        fixture.componentRef.setInput('dataChangeOnSlideEnd', true);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should mount and register the component', async () => {
        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('servoyextra-slider, .svy-slider-container')).not.toBeNull();
    });

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('should show a style class', async () => {
        const el: HTMLElement = fixture.nativeElement;
        const container = el.querySelector('.svy-slider-container');
        expect(container?.classList.contains('mystyleclass')).toBe(false);
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(container?.classList.contains('mystyleclass')).toBe(true);
    });

    it('should show more than 1 style class', async () => {
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        const el: HTMLElement = fixture.nativeElement;
        const container = el.querySelector('.svy-slider-container');
        expect(container?.classList.contains('classA')).toBe(true);
        expect(container?.classList.contains('classB')).toBe(true);
    });

    it('should call onSlideStart handler', async () => {
        const onSlideStartFn = vi.fn();
        fixture.componentRef.setInput('onSlideStart', onSlideStartFn);
        fixture.detectChanges();
        await fixture.whenStable();
        component.onUserChangeStart({ value: 5, highValue: 0, pointerType: 0 } as any);
        expect(onSlideStartFn).toHaveBeenCalled();
    });

    it('should call onSlideEnd handler', async () => {
        const onSlideEndFn = vi.fn();
        fixture.componentRef.setInput('onSlideEnd', onSlideEndFn);
        fixture.detectChanges();
        await fixture.whenStable();
        component.onUserChangeEnd({ value: 5, highValue: 0, pointerType: 0 } as any);
        expect(onSlideEndFn).toHaveBeenCalled();
    });

    it('should emit dataProviderChange on user change end', async () => {
        const spy = vi.fn();
        component.dataProviderChange.subscribe(spy);
        fixture.detectChanges();
        await fixture.whenStable();
        component.onUserChangeEnd({ value: 10, highValue: 0, pointerType: 0 } as any);
        expect(spy).toHaveBeenCalledWith(10);
    });

    it('should show floor and ceil', async () => {
        fixture.componentRef.setInput('floor', 1);
        fixture.componentRef.setInput('ceil', 8);
        fixture.detectChanges();
        await fixture.whenStable();
        const el: HTMLElement = fixture.nativeElement;
        const floorEl = el.querySelector('span.ngx-slider-floor');
        const ceilEl = el.querySelector('span.ngx-slider-ceil');
        expect(floorEl?.textContent?.trim()).toBe('1');
        expect(ceilEl?.textContent?.trim()).toBe('8');
    });

    it('should show ticks when enabled', async () => {
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.ngx-slider-tick')).toBeNull();
        fixture.componentRef.setInput('showTicks', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.querySelector('.ngx-slider-tick')).not.toBeNull();
    });

    it('should handle disabled state', async () => {
        const el: HTMLElement = fixture.nativeElement;
        const slider = el.querySelector('.ngx-slider');
        expect(slider?.hasAttribute('disabled')).toBe(false);
        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(slider?.hasAttribute('disabled')).toBe(true);
    });

    it('should show two pointers in range mode when dataProviderHigh is set', async () => {
        fixture.componentRef.setInput('dataProviderHigh', 15);
        fixture.detectChanges();
        await fixture.whenStable();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.ngx-slider-pointer-min')).not.toBeNull();
        expect(el.querySelector('.ngx-slider-pointer-max')).not.toBeNull();
    });
});
