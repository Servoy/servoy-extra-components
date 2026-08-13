import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraHtmlarea } from './htmlarea';

describe('ServoyExtraHtmlarea', () => {
    let fixture: ComponentFixture<ServoyExtraHtmlarea>;
    let component: ServoyExtraHtmlarea;

    beforeEach(async () => {
        if (!document.head.querySelector('base')) {
            const base = document.createElement('base');
            base.href = 'http://localhost/';
            document.head.appendChild(base);
        }

        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, ServoyExtraHtmlarea],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraHtmlarea);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('editable', true);
        fixture.componentRef.setInput('dataProviderID', 'initialValue');
        fixture.componentRef.setInput('toolTipText', 'tooltip text');
        fixture.componentRef.setInput('responsiveHeight', 0);
        fixture.componentRef.setInput('tabSeq', 0);
        fixture.componentRef.setInput('text', '');
        fixture.componentRef.setInput('styleClass', '');
        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create the component', async () => {
        expect(component).toBeTruthy();
    });

    it('should initialize dataProviderID via svyOnInit', async () => {
        component.svyOnInit();
        expect(component._dataProviderID()).toBe('initialValue');
        expect(component.tinyValue).toBe('initialValue');
    });

    it('should handle focus event and call onFocusGainedMethodID', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onFocusGainedMethodID', spy);
        fixture.detectChanges();

        component.focus();
        expect(spy).toHaveBeenCalled();
    });

    it('should not call onFocusGainedMethodID when mustExecuteOnFocus is false', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onFocusGainedMethodID', spy);
        fixture.detectChanges();

        component.mustExecuteOnFocus = false;
        component.focus();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should handle blur event and call onFocusLostMethodID', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onFocusLostMethodID', spy);
        fixture.detectChanges();

        component.blur();
        expect(spy).toHaveBeenCalled();
    });

    it('should emit dataProviderIDChange on blur when value changed', async () => {
        const emitSpy = vi.fn();
        component.dataProviderIDChange.subscribe(emitSpy);

        component.lastServerValueAsSeenByTinyMCEContent = 'old';
        component.tinyValue = 'new';
        component.blur();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not emit dataProviderIDChange on blur when value unchanged', async () => {
        const emitSpy = vi.fn();
        component.dataProviderIDChange.subscribe(emitSpy);

        component.lastServerValueAsSeenByTinyMCEContent = 'same';
        component.tinyValue = 'same';
        component.blur();
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should handle click event and call onActionMethodID', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onActionMethodID', spy);
        fixture.detectChanges();

        const mouseEvent = new MouseEvent('click');
        component.click({ event: mouseEvent });
        expect(spy).toHaveBeenCalled();
    });

    it('should handle contextMenu event and call onRightClickMethodID', async () => {
        const spy = vi.fn();
        fixture.componentRef.setInput('onRightClickMethodID', spy);
        fixture.detectChanges();

        const event = { event: { preventDefault: vi.fn() } };
        component.contextMenu(event);
        expect(spy).toHaveBeenCalled();
        expect(event.event.preventDefault).toHaveBeenCalled();
    });

    it('should update dataProviderID on svyOnChanges', async () => {
        component.svyOnInit();
        fixture.componentRef.setInput('dataProviderID', 'newValue');
        fixture.detectChanges();

        component.svyOnChanges({
            dataProviderID: { previousValue: 'initialValue', currentValue: 'newValue', firstChange: false, isFirstChange: () => false }
        });

        expect(component._dataProviderID()).toBe('newValue');
        expect(component.tinyValue).toBe('newValue');
        expect(component.lastServerValueAsSeenByTinyMCEContent).toBe('newValue');
    });

    it('should have default tinyConfig values', async () => {
        expect(component.tinyConfig.height).toBe('100%');
        expect(component.tinyConfig.menubar).toBe(false);
        expect(component.tinyConfig.statusbar).toBe(false);
        expect(component.tinyConfig.readonly).toBe(false);
    });

    it('should call pushUpdate which emits dataProviderIDChange', async () => {
        const emitSpy = vi.fn();
        component.dataProviderIDChange.subscribe(emitSpy);

        component._dataProviderID.set('test value');
        component.pushUpdate();
        expect(emitSpy).toHaveBeenCalledWith('test value');
    });
});
