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

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
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
        expect(component.tinyConfig().height).toBe('100%');
        expect(component.tinyConfig().menubar).toBe(false);
        expect(component.tinyConfig().statusbar).toBe(false);
        expect(component.tinyConfig().readonly).toBe(false);
    });

    it('should call pushUpdate which emits dataProviderIDChange', async () => {
        const emitSpy = vi.fn();
        component.dataProviderIDChange.subscribe(emitSpy);

        component._dataProviderID.set('test value');
        component.pushUpdate();
        expect(emitSpy).toHaveBeenCalledWith('test value');
    });

    function makeEditorMock() {
        return {
            mode: { set: vi.fn() },
            getContent: vi.fn().mockReturnValue('<p>content</p>'),
            getContainer: vi.fn().mockReturnValue(document.createElement('div')),
            addShortcut: vi.fn(),
            focus: vi.fn(),
            selection: { select: vi.fn(), getContent: vi.fn().mockReturnValue('sel'), setContent: vi.fn() },
            getBody: vi.fn().mockReturnValue(document.createElement('div')),
            getWin: vi.fn().mockReturnValue({ scrollX: 10, scrollY: 20, scrollTo: vi.fn() })
        } as any;
    }

    it('onInit stores the editor and sets readonly when not editable', () => {
        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        const editor = makeEditorMock();
        component.onInit({ editor });
        expect(component.getEditor()).toBe(editor);
        expect(editor.mode.set).toHaveBeenCalledWith('readonly');
    });

    it('onInit leaves the editor in design mode when editable', () => {
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('editable', true);
        fixture.componentRef.setInput('readOnly', false);
        fixture.detectChanges();
        const editor = makeEditorMock();
        component.onInit({ editor });
        expect(editor.mode.set).not.toHaveBeenCalledWith('readonly');
    });

    it('svyOnChanges toggles editor mode to readonly when disabled', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        editor.mode.set.mockClear();
        fixture.componentRef.setInput('enabled', false);
        component.svyOnChanges({ enabled: { previousValue: true, currentValue: false, firstChange: false, isFirstChange: () => false } });
        expect(editor.mode.set).toHaveBeenCalledWith('readonly');
    });

    it('svyOnChanges adds and removes style classes', () => {
        component.svyOnChanges({ styleClass: { previousValue: '', currentValue: 'a b', firstChange: false, isFirstChange: () => false } });
        expect(component.getNativeElement().classList.contains('a')).toBe(true);
        expect(component.getNativeElement().classList.contains('b')).toBe(true);
        component.svyOnChanges({ styleClass: { previousValue: 'a b', currentValue: 'c', firstChange: false, isFirstChange: () => false } });
        expect(component.getNativeElement().classList.contains('a')).toBe(false);
        expect(component.getNativeElement().classList.contains('c')).toBe(true);
    });

    it('addShortCut registers a shortcut on the editor when present', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        const cb = vi.fn();
        component.addShortCut('ctrl+k', cb);
        expect(editor.addShortcut).toHaveBeenCalledWith('ctrl+k', '', cb);
    });

    it('selectAll selects the whole editor body', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        component.selectAll();
        expect(editor.selection.select).toHaveBeenCalled();
    });

    it('getSelectedText returns the current selection content', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        expect(component.getSelectedText()).toBe('sel');
    });

    it('getAsPlainText reads the text content of the editor', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        component.getAsPlainText();
        expect(editor.getContent).toHaveBeenCalledWith({ format: 'text' });
    });

    it('getScrollX and getScrollY read the editor window scroll position', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        expect(component.getScrollX()).toBe(10);
        expect(component.getScrollY()).toBe(20);
    });

    it('setScroll scrolls the editor window', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        component.setScroll(5, 6);
        expect(editor.getWin().scrollTo).toHaveBeenCalledWith(5, 6);
    });

    it('replaceSelectedText sets content and emits a data change when it changed', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        component.lastServerValueAsSeenByTinyMCEContent = 'old';
        const emitSpy = vi.fn();
        component.dataProviderIDChange.subscribe(emitSpy);
        const result = component.replaceSelectedText('new text');
        expect(editor.selection.setContent).toHaveBeenCalledWith('new text');
        expect(emitSpy).toHaveBeenCalled();
        expect(result).toContain('content');
    });

    it('setTabIndex applies the tab index to the editor iframe', () => {
        const container = document.createElement('div');
        const iframe = document.createElement('iframe');
        container.appendChild(iframe);
        const editor = makeEditorMock();
        editor.getContainer = vi.fn().mockReturnValue(container);
        component.onInit({ editor });
        component.setTabIndex(4);
        expect(iframe.tabIndex).toBe(4);
    });

    it('keyUp re-dispatches a keyup on the native element', () => {
        const spy = vi.fn();
        component.getNativeElement().addEventListener('keyup', spy);
        component.keyUp({ event: { key: 'a' } });
        expect(spy).toHaveBeenCalled();
    });

    it('requestFocus focuses the editor when it is present', () => {
        const editor = makeEditorMock();
        component.onInit({ editor });
        component.requestFocus(true);
        expect(editor.focus).toHaveBeenCalled();
    });

    it('svyOnChanges sets minHeight for responsiveHeight in responsive layout', () => {
        const api: any = component.servoyApi();
        vi.spyOn(api, 'isInAbsoluteLayout').mockReturnValue(false);
        fixture.componentRef.setInput('responsiveHeight', 250);
        component.svyOnChanges({ responsiveHeight: { previousValue: 0, currentValue: 250, firstChange: false, isFirstChange: () => false } });
        expect(component.getNativeElement().style.minHeight).toBe('250px');
    });

});
