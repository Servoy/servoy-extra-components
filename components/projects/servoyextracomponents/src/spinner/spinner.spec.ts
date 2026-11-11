import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule, IValuelist } from '@servoy/public';
import { ServoyExtraSpinner } from './spinner';

describe('ServoyExtraSpinner', () => {
    let fixture: ComponentFixture<ServoyExtraSpinner>;
    let component: ServoyExtraSpinner;
    let mockData: IValuelist;

    beforeEach(async () => {
        mockData = [
            { realValue: 3, displayValue: 'Value 3' },
            { realValue: 1, displayValue: 'Value 1' },
            { realValue: 2, displayValue: 'Value 2' }
        ] as IValuelist;

        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraSpinner]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraSpinner);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('onActionMethodID', vi.fn());
        fixture.componentRef.setInput('onFocusGainedMethodID', vi.fn());
        fixture.componentRef.setInput('onFocusLostMethodID', vi.fn());
        fixture.componentRef.setInput('onRightClickMethodID', vi.fn());
        fixture.componentRef.setInput('dataProviderID', 1);
        fixture.componentRef.setInput('editable', true);
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('format', { display: '#.00', type: 'NUMBER' });
        fixture.componentRef.setInput('placeholderText', '');
        fixture.componentRef.setInput('responsiveHeight', 0);
        fixture.componentRef.setInput('styleClass', 'spinner-test');
        fixture.componentRef.setInput('tabSeq', 0);
        fixture.componentRef.setInput('toolTipText', 'Test tooltip');
        fixture.componentRef.setInput('valuelistID', mockData);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('should show the dataprovider value', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input).not.toBeNull();
        expect(input.value).toBe('Value 1');
    });

    it('should set the placeholder text', async () => {
        fixture.componentRef.setInput('placeholderText', 'Enter your value');
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.getAttribute('placeholder')).toBe('Enter your value');
    });

    it('should show a style class', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const el = fixture.nativeElement.querySelector('.svy-extra-spinner');
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
        const el = fixture.nativeElement.querySelector('.svy-extra-spinner');
        expect(el.classList.contains('mystyleclass')).toBe(true);
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(el.classList.contains('classA')).toBe(true);
        expect(el.classList.contains('classB')).toBe(true);
    });

    it('should be read-only (input always readonly)', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.hasAttribute('readonly')).toBe(true);
    });

    it('should handle onaction event', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.onActionMethodID()).toHaveBeenCalled();
    });

    it('should handle focus gained event', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const upButton = fixture.nativeElement.querySelector('.spinner-button-up');
        expect(upButton).not.toBeNull();
        upButton.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.onFocusGainedMethodID()).toHaveBeenCalled();
    });

    it('should handle focus lost event', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const upButton = fixture.nativeElement.querySelector('.spinner-button-up');
        upButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        upButton.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.onFocusLostMethodID()).toHaveBeenCalled();
    });

    it('should handle right click event', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        input.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.onRightClickMethodID()).toHaveBeenCalled();
    });

    it('should emit dataProviderIDChange event on input change', async () => {
        const changeSpy = vi.fn();
        component.dataProviderIDChange.subscribe(changeSpy);
        fixture.componentRef.setInput('dataProviderID', null);
        fixture.detectChanges();
        await fixture.whenStable();
        const upButton = fixture.nativeElement.querySelector('.spinner-button-up');
        upButton.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(changeSpy).toHaveBeenCalledWith(1);
    });

    it('should not emit dataProviderIDChange event on dataprovider change', async () => {
        const changeSpy = vi.fn();
        component.dataProviderIDChange.subscribe(changeSpy);
        fixture.detectChanges();
        await fixture.whenStable();
        const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
        expect(input.value).toBe('Value 1');
        fixture.componentRef.setInput('dataProviderID', 2);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(changeSpy).not.toHaveBeenCalled();
        expect(input.value).toBe('Value 2');
    });

    it('should have tooltip text configured', async () => {
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.toolTipText()).toBe('Test tooltip');
    });

    it('should not change value when editable is false and arrow key is pressed', async () => {
        const changeSpy = vi.fn();
        component.dataProviderIDChange.subscribe(changeSpy);
        fixture.componentRef.setInput('editable', false);
        fixture.componentRef.setInput('dataProviderID', 1);
        fixture.detectChanges();
        await fixture.whenStable();
        const spinnerEl = fixture.nativeElement.querySelector('.svy-extra-spinner');
        spinnerEl.dispatchEvent(new KeyboardEvent('keydown', { which: 38, bubbles: true } as any));
        fixture.detectChanges();
        await fixture.whenStable();
        expect(changeSpy).not.toHaveBeenCalled();
    });

    it('increment advances the counter and wraps around at the end', async () => {
        fixture.componentRef.setInput('dataProviderID', 3);
        fixture.detectChanges();
        await fixture.whenStable();
        // mockData order: realValue 3,1,2 -> starting counter is 0 (value 3)
        component.increment();
        expect(component._dataProviderID()).toBe(1);
        component.increment();
        expect(component._dataProviderID()).toBe(2);
        component.increment();
        // wraps back to the first
        expect(component._dataProviderID()).toBe(3);
    });

    it('decrement goes backwards and wraps to the end', async () => {
        fixture.componentRef.setInput('dataProviderID', 3);
        fixture.detectChanges();
        await fixture.whenStable();
        component.decrement();
        // from counter 0 wraps to last (value 2)
        expect(component._dataProviderID()).toBe(2);
    });

    it('isDisabled reflects enabled and editable', async () => {
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('editable', true);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(false);
        fixture.componentRef.setInput('editable', false);
        fixture.detectChanges();
        expect(component.isDisabled()).toBe(true);
    });

    it('getSelectionFromDataprovider returns the display value for the current data', async () => {
        fixture.componentRef.setInput('dataProviderID', 2);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.getSelectionFromDataprovider()).toBe('Value 2');
    });

    it('getSelectionFromDataprovider returns undefined for empty data', async () => {
        fixture.componentRef.setInput('dataProviderID', null);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.getSelectionFromDataprovider()).toBeUndefined();
    });

    it('isScrollingUp detects wheel direction', () => {
        expect(component.isScrollingUp({ wheelDelta: 10 })).toBe(true);
        expect(component.isScrollingUp({ deltaY: 10 })).toBe(false);
    });

    it('scrollCallback increments when scrolling up and the field is enabled', async () => {
        fixture.componentRef.setInput('dataProviderID', 3);
        fixture.detectChanges();
        await fixture.whenStable();
        const spy = vi.spyOn(component, 'increment');
        component.scrollCallback({ wheelDelta: 10, preventDefault: vi.fn() });
        expect(spy).toHaveBeenCalled();
    });

    it('scrollCallback decrements when scrolling down', async () => {
        fixture.componentRef.setInput('dataProviderID', 3);
        fixture.detectChanges();
        await fixture.whenStable();
        const spy = vi.spyOn(component, 'decrement');
        component.scrollCallback({ deltaY: 10, preventDefault: vi.fn() });
        expect(spy).toHaveBeenCalled();
    });

    it('keydownKeypressCallback handles arrow up and down', async () => {
        fixture.componentRef.setInput('dataProviderID', 3);
        fixture.detectChanges();
        await fixture.whenStable();
        const up = vi.spyOn(component, 'increment');
        const down = vi.spyOn(component, 'decrement');
        component.keydownKeypressCallback({ which: 38 });
        expect(up).toHaveBeenCalled();
        component.keydownKeypressCallback({ which: 40 });
        expect(down).toHaveBeenCalled();
    });

    it('getFocusElement returns the native element', () => {
        expect(component.getFocusElement()).toBe(component.getNativeElement());
    });

    it('pushUpdate emits the current dataProviderID', () => {
        const spy = vi.fn();
        component.dataProviderIDChange.subscribe(spy);
        component._dataProviderID.set(42);
        component.pushUpdate();
        expect(spy).toHaveBeenCalledWith(42);
    });

});
