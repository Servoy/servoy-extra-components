import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraTextfieldGroup } from './textfieldgroup';

describe('ServoyExtraTextfieldGroup', () => {
    let fixture: ComponentFixture<ServoyExtraTextfieldGroup>;
    let component: ServoyExtraTextfieldGroup;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraTextfieldGroup],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraTextfieldGroup);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('onActionMethodID', vi.fn());
        fixture.componentRef.setInput('onFocusGainedMethodID', vi.fn());
        fixture.componentRef.setInput('onFocusLostMethodID', vi.fn());
        fixture.componentRef.setInput('onRightClickMethodID', vi.fn());
        fixture.componentRef.setInput('dataProviderID', 'initialValue');
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('readOnly', false);
        fixture.componentRef.setInput('format', { type: 'TEXT' });
        fixture.componentRef.setInput('placeholderText', 'Enter text');
        fixture.componentRef.setInput('inputType', 'text');
        fixture.componentRef.setInput('faclass', '');
        fixture.componentRef.setInput('inputValidation', '');
        fixture.componentRef.setInput('invalidEmailMessage', '');
        fixture.componentRef.setInput('styleClass', '');
        fixture.componentRef.setInput('tabSeq', 0);

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

    it('should mount and register the component', async () => {
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input).not.toBeNull();
    });

    it('should show the dataprovider value', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('initialValue');
    });

    it('should set the placeholder text', async () => {
        fixture.componentRef.setInput('placeholderText', 'Enter your name');
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.getAttribute('placeholder')).toBe('Enter your name');
    });

    it('should show fa class', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const icon = fixture.nativeElement.querySelector('.input-group-text i');
        expect(icon.classList.contains('myfaclass')).toBe(false);
        fixture.componentRef.setInput('faclass', 'myfaclass');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(icon.classList.contains('myfaclass')).toBe(true);
    });

    it('should show a style class', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.classList.contains('mystyleclass')).toBe(false);
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(input.classList.contains('mystyleclass')).toBe(true);
    });

    it('should show more than 1 style class', async () => {
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.classList.contains('mystyleclass')).toBe(true);
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(input.classList.contains('classA')).toBe(true);
        expect(input.classList.contains('classB')).toBe(true);
    });

    it('should be read-only', async () => {
        fixture.componentRef.setInput('readOnly', true);
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.hasAttribute('readonly')).toBe(true);
    });

    it('should have the correct input type', async () => {
        fixture.componentRef.setInput('inputType', 'password');
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.getAttribute('type')).toBe('password');
    });

    it('should handle onaction event', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, bubbles: true } as any));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.onActionMethodID()).toHaveBeenCalled();
    });

    it('should handle focus gained event', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.onFocusGainedMethodID()).toHaveBeenCalled();
    });

    it('should handle focus lost event', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.onFocusLostMethodID()).toHaveBeenCalled();
    });

    it('should handle right click event', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const el = fixture.nativeElement.querySelector('.input-group');
        el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.onRightClickMethodID()).toHaveBeenCalled();
    });

    it('should emit dataProviderIDChange event on input change', async () => {
        const changeSpy = vi.fn();
        component.dataProviderIDChange.subscribe(changeSpy);
        fixture.componentRef.setInput('dataProviderID', '');
        fixture.detectChanges();
        await fixture.whenStable();
        component.pushUpdate('New Value');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(changeSpy).toHaveBeenCalledWith('New Value');
    });

    it('should not emit dataProviderIDChange event on dataprovider change', async () => {
        const changeSpy = vi.fn();
        component.dataProviderIDChange.subscribe(changeSpy);
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('initialValue');
        fixture.componentRef.setInput('dataProviderID', 'new value');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(changeSpy).not.toHaveBeenCalled();
        expect(input.value).toBe('new value');
    });

    it('should request focus and trigger focus gained', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        component.requestFocus(true);
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(document.activeElement === input || input.matches(':focus')).toBe(true);
    });

    it('should test email validation - invalid email shows error', async () => {
        fixture.componentRef.setInput('inputValidation', 'email');
        fixture.componentRef.setInput('invalidEmailMessage', 'Invalid email format');
        fixture.componentRef.setInput('dataProviderID', 'initialValue');
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.value = 'invalid-email';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        const errorEl = fixture.nativeElement.querySelector('.textfieldgroup-msg-error');
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe('Invalid email format');
    });

    it('should test email validation - valid email hides error', async () => {
        fixture.componentRef.setInput('inputValidation', 'email');
        fixture.componentRef.setInput('invalidEmailMessage', 'Invalid email format');
        fixture.componentRef.setInput('dataProviderID', 'abc@abc.com');
        fixture.detectChanges();
        await fixture.whenStable();
        const errorEl = fixture.nativeElement.querySelector('.textfieldgroup-msg-error');
        expect(errorEl).toBeNull();
    });
});
