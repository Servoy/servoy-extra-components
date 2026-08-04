import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSplitpane, Pane } from './splitpane';

describe('ServoyExtraSplitpane', () => {
    let fixture: ComponentFixture<ServoyExtraSplitpane>;
    let component: ServoyExtraSplitpane;
    let servoyApi: ServoyApiTesting;

    const createDefaultPanes = () => {
        const pane1 = new Pane();
        pane1.containsFormId = 'form1';
        pane1.relationName = 'relation1';

        const pane2 = new Pane();
        pane2.containsFormId = 'form2';
        pane2.relationName = 'relation2';

        return { pane1, pane2 };
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServoyExtraSplitpane],
            imports: [ServoyPublicTestingModule, FormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        servoyApi = new ServoyApiTesting();
        fixture = TestBed.createComponent(ServoyExtraSplitpane);
        component = fixture.componentInstance;

        const { pane1, pane2 } = createDefaultPanes();

        fixture.componentRef.setInput('servoyApi', servoyApi);
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('readOnly', false);
        fixture.componentRef.setInput('styleClass', 'splitpane-test');
        fixture.componentRef.setInput('splitType', 0);
        fixture.componentRef.setInput('tabSeq', 0);
        fixture.componentRef.setInput('pane1', pane1);
        fixture.componentRef.setInput('pane2', pane2);
        fixture.componentRef.setInput('divLocation', 200);
        fixture.componentRef.setInput('divSize', 5);
        fixture.componentRef.setInput('pane1MinSize', 30);
        fixture.componentRef.setInput('pane2MinSize', 30);
        fixture.componentRef.setInput('resizeWeight', 0.5);
        fixture.componentRef.setInput('responsiveHeight', 400);
        fixture.componentRef.setInput('onChangeMethodID', vi.fn());

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should mount and register the component', async () => {
        expect(component).toBeTruthy();
        expect(fixture.nativeElement.querySelector('.svy-extra-splitpane')).toBeTruthy();
    });

    it('should apply style class', async () => {
        const el = fixture.nativeElement.querySelector('.svy-extra-splitpane') as HTMLElement;
        expect(el.classList.contains('splitpane-test')).toBe(true);
    });

    it('should handle style class change', async () => {
        fixture.componentRef.setInput('styleClass', 'new-style');
        fixture.detectChanges();
        await fixture.whenStable();
        const el = fixture.nativeElement.querySelector('.svy-extra-splitpane') as HTMLElement;
        expect(el.classList.contains('new-style')).toBe(true);
        expect(el.classList.contains('splitpane-test')).toBe(false);
    });

    it('should handle split type change', async () => {
        fixture.componentRef.setInput('splitType', 1);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.splitType()).toBe(1);
    });

    it('should handle resize weight', async () => {
        fixture.componentRef.setInput('resizeWeight', 0.7);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.resizeWeight()).toBe(0.7);
    });

    it('should handle min sizes', async () => {
        fixture.componentRef.setInput('pane1MinSize', 50);
        fixture.componentRef.setInput('pane2MinSize', 50);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.pane1MinSize()).toBe(50);
        expect(component.pane2MinSize()).toBe(50);
    });

    it('should handle enabled state', async () => {
        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.enabled()).toBe(false);
    });

    it('should handle readonly state', async () => {
        fixture.componentRef.setInput('readOnly', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.readOnly()).toBe(true);
    });

    it('should emit divLocationChange on onChange', async () => {
        const spy = vi.fn();
        component.divLocationChange.subscribe(spy);
        component.onChange(300);
        expect(spy).toHaveBeenCalledWith(300);
    });

    it('should call onChangeMethodID on onChange', async () => {
        const handler = vi.fn();
        fixture.componentRef.setInput('onChangeMethodID', handler);
        fixture.detectChanges();
        await fixture.whenStable();
        component.onChange(250);
        expect(handler).toHaveBeenCalledWith(-1, expect.any(Event));
    });
});
