import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraGauge } from './gauge';

describe('ServoyExtraGauge', () => {
    let fixture: ComponentFixture<ServoyExtraGauge>;
    let component: ServoyExtraGauge;
    let servoyApi: ServoyApiTesting;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServoyExtraGauge],
            imports: [ServoyPublicTestingModule, FormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraGauge);
        component = fixture.componentInstance;
        servoyApi = new ServoyApiTesting();

        component.canvasGauge = {
            update: vi.fn(),
            draw: vi.fn()
        };

        fixture.componentRef.setInput('servoyApi', servoyApi);
        fixture.componentRef.setInput('gaugeType', 'radial');
        fixture.componentRef.setInput('minValue', 0);
        fixture.componentRef.setInput('maxValue', 100);
        fixture.componentRef.setInput('value', 50);
        fixture.componentRef.setInput('units', 'km/h');
        fixture.componentRef.setInput('title', { text: 'Speed' });
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should mount and register the component', async () => {
        const api = new ServoyApiTesting();
        const registerSpy = vi.spyOn(api, 'registerComponent');

        const f = TestBed.createComponent(ServoyExtraGauge);
        f.componentInstance.canvasGauge = { update: vi.fn(), draw: vi.fn() };
        f.componentRef.setInput('servoyApi', api);
        f.componentRef.setInput('gaugeType', 'radial');
        f.componentRef.setInput('minValue', 0);
        f.componentRef.setInput('maxValue', 100);
        f.componentRef.setInput('value', 50);
        f.componentRef.setInput('units', 'km/h');
        f.componentRef.setInput('title', { text: 'Speed' });
        f.detectChanges();
        await f.whenStable();
        expect(registerSpy).toHaveBeenCalled();
    });

    it('should handle gauge type change', async () => {
        fixture.componentRef.setInput('gaugeType', 'linear');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.gaugeType()).toBe('linear');
    });

    it('should update value', async () => {
        fixture.componentRef.setInput('value', 75);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.value()).toBe(75);
    });

    it('should handle min/max values', async () => {
        fixture.componentRef.setInput('minValue', -50);
        fixture.componentRef.setInput('maxValue', 150);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.minValue()).toBe(-50);
        expect(component.maxValue()).toBe(150);
    });

    it('should update units', async () => {
        fixture.componentRef.setInput('units', 'mph');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.units()).toBe('mph');
    });

    it('should handle title changes', async () => {
        fixture.componentRef.setInput('title', { text: 'New Title' });
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.title().text).toBe('New Title');
    });

    it('should handle highlights configuration', async () => {
        const highlights = [
            { from: 0, to: 30, color: 'green' },
            { from: 30, to: 70, color: 'yellow' },
            { from: 70, to: 100, color: 'red' }
        ];
        fixture.componentRef.setInput('highlights', highlights);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.highlights()).toEqual(highlights);
    });
});
