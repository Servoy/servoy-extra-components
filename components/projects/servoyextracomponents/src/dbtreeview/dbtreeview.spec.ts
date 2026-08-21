import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraDbtreeview } from './dbtreeview';

describe('ServoyExtraDbtreeview', () => {
    let fixture: ComponentFixture<ServoyExtraDbtreeview>;
    let component: ServoyExtraDbtreeview;
    let servoyApi: ServoyApiTesting;

    beforeEach(async () => {
        servoyApi = new ServoyApiTesting();

        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraDbtreeview],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraDbtreeview);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', servoyApi);
        fixture.componentRef.setInput('autoRefresh', true);
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('showLoadingIndicator', true);
        fixture.componentRef.setInput('responsiveHeight', 0);
        fixture.componentRef.setInput('styleClass', 'dbtreeview-test');
        fixture.componentRef.setInput('onDrop', vi.fn());
        fixture.componentRef.setInput('onReady', vi.fn());
        fixture.componentRef.setInput('onRowDrop', vi.fn());
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create the component and register it', async () => {
        expect(component).toBeTruthy();
        expect(servoyApi.registerComponent).toBeTruthy();
    });

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('should apply a style class', async () => {
        const nativeEl = fixture.nativeElement as HTMLElement;
        const treeDiv = nativeEl.querySelector('.dbtreeview');
        expect(treeDiv).toBeTruthy();
        expect(treeDiv!.classList.contains('mystyleclass')).toBe(false);

        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(treeDiv!.classList.contains('mystyleclass')).toBe(true);
    });

    it('should apply multiple style classes', async () => {
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();

        const nativeEl = fixture.nativeElement as HTMLElement;
        const treeDiv = nativeEl.querySelector('.dbtreeview');
        expect(treeDiv!.classList.contains('mystyleclass')).toBe(true);

        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(treeDiv!.classList.contains('classA')).toBe(true);
        expect(treeDiv!.classList.contains('classB')).toBe(true);
    });

    it('should add dbtreeview-disabled class when enabled is false', async () => {
        const nativeEl = fixture.nativeElement as HTMLElement;
        const treeDiv = nativeEl.querySelector('.dbtreeview');
        expect(treeDiv!.classList.contains('dbtreeview-disabled')).toBe(false);

        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(treeDiv!.classList.contains('dbtreeview-disabled')).toBe(true);
    });
});
