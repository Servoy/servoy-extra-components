import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSlider } from './slider';
import { NgxSliderModule, LabelType } from '@angular-slider/ngx-slider';

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

    it('setNewOptions merges a new option without mutating the previous object', () => {
        const before = component.options();
        component.setNewOptions('vertical', true);
        expect((component.options() as any).vertical).toBe(true);
        expect(component.options()).not.toBe(before);
    });

    it('ceilValue returns the given ceil when non-negative', () => {
        expect(component.ceilValue(50)).toBe(50);
    });

    it('ceilValue falls back to dataProviderHigh then dataProvider then 100', async () => {
        fixture.componentRef.setInput('dataProviderHigh', 42);
        fixture.detectChanges();
        expect(component.ceilValue(-1)).toBe(42);

        fixture.componentRef.setInput('dataProviderHigh', -1);
        fixture.componentRef.setInput('dataProvider', 7);
        fixture.detectChanges();
        expect(component.ceilValue(-1)).toBe(7);

        fixture.componentRef.setInput('dataProvider', -1);
        fixture.detectChanges();
        expect(component.ceilValue(-1)).toBe(100);
    });

    it('formatValue uses a custom formatting function when provided', () => {
        component.formattingFunctionParsed = (v: number) => 'val-' + v;
        expect(component.formatValue(3, LabelType.Low)).toBe('val-3');
    });

    it('formatValue delegates to the FormattingService for a NUMBER format', () => {
        component.formattingFunctionParsed = undefined;
        fixture.componentRef.setInput('numberFormat', { type: 'NUMBER', display: '#,##0.00' });
        fixture.detectChanges();
        const svc = (component as any).formatService;
        const spy = vi.spyOn(svc, 'format').mockReturnValue('5.00');
        const out = component.formatValue(5, LabelType.Low);
        expect(spy).toHaveBeenCalled();
        expect(out).toBe('5.00');
        spy.mockRestore();
    });

    it('formatValue returns the plain string when no format applies', () => {
        component.formattingFunctionParsed = undefined;
        fixture.componentRef.setInput('numberFormat', undefined);
        fixture.detectChanges();
        expect(component.formatValue(9, LabelType.Low)).toBe('9');
    });

    it('onUserChange emits data changes when dataChangeOnSlideEnd is false', async () => {
        fixture.componentRef.setInput('dataChangeOnSlideEnd', false);
        fixture.detectChanges();
        const lowSpy = vi.fn();
        const highSpy = vi.fn();
        component.dataProviderChange.subscribe(lowSpy);
        component.dataProviderHighChange.subscribe(highSpy);
        component.onUserChange({ value: 4, highValue: 9, pointerType: 0 } as any);
        expect(lowSpy).toHaveBeenCalledWith(4);
        expect(highSpy).toHaveBeenCalledWith(9);
    });

    it('onUserChange does not emit when dataChangeOnSlideEnd is true but still fires onTick', async () => {
        fixture.componentRef.setInput('dataChangeOnSlideEnd', true);
        const onTick = vi.fn();
        fixture.componentRef.setInput('onTick', onTick);
        fixture.detectChanges();
        const lowSpy = vi.fn();
        component.dataProviderChange.subscribe(lowSpy);
        component.onUserChange({ value: 4, highValue: 9, pointerType: 0 } as any);
        expect(onTick).toHaveBeenCalled();
        expect(lowSpy).not.toHaveBeenCalled();
    });

    it('onUserChangeStart passes the high pointer label for a max pointer', async () => {
        const onSlideStart = vi.fn();
        fixture.componentRef.setInput('onSlideStart', onSlideStart);
        fixture.detectChanges();
        component.onUserChangeStart({ value: 4, highValue: 9, pointerType: 1 } as any);
        expect(onSlideStart).toHaveBeenCalledWith(null, 4, 9, 'high');
    });

    it('refresh emits the manual refresh event', () => {
        const spy = vi.fn();
        component.manualRefresh.subscribe(spy);
        component.refresh();
        expect(spy).toHaveBeenCalled();
    });

    it('svyOnChanges maps a stepsValueList into a stepsArray option', () => {
        component.svyOnChanges({
            stepsValueList: { currentValue: [{ realValue: 1, displayValue: 1 }, { realValue: 2, displayValue: 'Two' }], previousValue: undefined, isFirstChange: () => true }
        } as any);
        const steps = (component.options() as any).stepsArray;
        expect(steps.length).toBe(2);
        expect(steps[0]).toEqual({ value: 1 });
        expect(steps[1]).toEqual({ value: 2, legend: 'Two' });
    });

    it('svyOnChanges applies the precision option only within 1..100', () => {
        component.svyOnChanges({ precision: { currentValue: 5, previousValue: undefined, isFirstChange: () => false } } as any);
        expect((component.options() as any).precisionLimit).toBe(5);
        component.svyOnChanges({ precision: { currentValue: 200, previousValue: 5, isFirstChange: () => false } } as any);
        expect((component.options() as any).precisionLimit).toBe(5);
    });

    it('svyOnChanges toggles the disabled option from enabled', () => {
        component.svyOnChanges({ enabled: { currentValue: false, previousValue: true, isFirstChange: () => false } } as any);
        expect((component.options() as any).disabled).toBe(true);
    });

});
