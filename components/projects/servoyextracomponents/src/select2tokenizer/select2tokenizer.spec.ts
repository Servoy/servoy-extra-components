import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IValuelist, Format, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSelect2Tokenizer } from './select2tokenizer';
import { Select2 } from 'ng-select2-component';
import { of } from 'rxjs';

const mockData = [{
    'displayValue': 'one',
    'realValue': 1
},
{
    'displayValue': 'two',
    'realValue': 2
},
{
    'displayValue': 'three',
    'realValue': 3
},
{
    'displayValue': 'four',
    'realValue': 4
}] as IValuelist;
mockData.hasRealValues = () => {
    return true; 
};
mockData.filterList = (value: any) => {
 return of(mockData.filter(item => item.displayValue.includes(value))); 
};
mockData.getDisplayValue = (value: any) => {
    const item = mockData.find(({ realValue }) => realValue === value);
    if (item) return of(item.displayValue);
    return of(value + '');
};

function setDefaultInputs(fixture: ComponentFixture<ServoyExtraSelect2Tokenizer>) {
    fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
    fixture.componentRef.setInput('allowNewEntries', true);
    fixture.componentRef.setInput('clearSearchTextOnSelect', false);
    fixture.componentRef.setInput('closeOnSelect', true);
    fixture.componentRef.setInput('containSearchText', true);
    fixture.componentRef.setInput('dataProviderID', '1');
    fixture.componentRef.setInput('editable', true);
    fixture.componentRef.setInput('enabled', true);
    fixture.componentRef.setInput('maximumSelectionSize', 0);
    fixture.componentRef.setInput('noMatchesFoundText', 'No matches found');
    fixture.componentRef.setInput('openOnUnselect', true);
    fixture.componentRef.setInput('placeholderText', 'Select...');
    fixture.componentRef.setInput('selectOnClose', true);
    fixture.componentRef.setInput('styleClass', 'select2-sm');
    fixture.componentRef.setInput('tabSeq', 0);
    fixture.componentRef.setInput('toolTipText', '');
    fixture.componentRef.setInput('valuelistID', mockData);
    fixture.componentRef.setInput('format', { 'type': 'TEXT' } as Format);
    fixture.componentRef.setInput('readOnly', false);
    fixture.componentRef.setInput('hideSelectedItems', false);
    fixture.componentRef.setInput('overlayMode', undefined);
}

describe('ServoyExtraSelect2Tokenizer', () => {
    let fixture: ComponentFixture<ServoyExtraSelect2Tokenizer>;
    let component: ServoyExtraSelect2Tokenizer;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, Select2, ServoyExtraSelect2Tokenizer],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraSelect2Tokenizer);
        component = fixture.componentInstance;
    });

    it('should create the component', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component).toBeTruthy();
    });

    it('should return a valid native element from getNativeElement()', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
    });

    it('should register the component with servoyApi', async () => {
        const servoyApi = new ServoyApiTesting();
        const registerSpy = vi.spyOn(servoyApi, 'registerComponent');
        fixture.componentRef.setInput('servoyApi', servoyApi);
        fixture.componentRef.setInput('allowNewEntries', true);
        fixture.componentRef.setInput('clearSearchTextOnSelect', false);
        fixture.componentRef.setInput('closeOnSelect', true);
        fixture.componentRef.setInput('containSearchText', true);
        fixture.componentRef.setInput('dataProviderID', '1');
        fixture.componentRef.setInput('editable', true);
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('maximumSelectionSize', 0);
        fixture.componentRef.setInput('noMatchesFoundText', 'No matches found');
        fixture.componentRef.setInput('openOnUnselect', true);
        fixture.componentRef.setInput('placeholderText', 'Select...');
        fixture.componentRef.setInput('selectOnClose', true);
        fixture.componentRef.setInput('styleClass', 'select2-sm');
        fixture.componentRef.setInput('tabSeq', 0);
        fixture.componentRef.setInput('toolTipText', '');
        fixture.componentRef.setInput('valuelistID', mockData);
        fixture.componentRef.setInput('format', { 'type': 'TEXT' } as Format);
        fixture.componentRef.setInput('readOnly', false);
        fixture.componentRef.setInput('hideSelectedItems', false);
        fixture.componentRef.setInput('overlayMode', undefined);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(registerSpy).toHaveBeenCalled();
    });

    it('should set placeholder text when dataProviderID is empty', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('dataProviderID', '');
        fixture.componentRef.setInput('placeholderText', 'Enter your name');
        fixture.detectChanges();
        await fixture.whenStable();
        const placeholder = fixture.nativeElement.querySelector('select2 ul span');
        expect(placeholder?.textContent).toBe('Enter your name');
    });

    it('should show the dataprovider value', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('dataProviderID', '2');
        fixture.detectChanges();
        await fixture.whenStable();
        const item = fixture.nativeElement.querySelector('select2 ul li');
        expect(item?.getAttribute('title')).toBe('two');
    });

    it('should apply style class', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        const container = fixture.nativeElement.querySelector('select2')?.closest('div');
        expect(container?.classList.contains('select2-sm')).toBe(true);
        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(container?.classList.contains('mystyleclass')).toBe(true);
    });

    it('should apply multiple style classes', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();
        const container = fixture.nativeElement.querySelector('select2')?.closest('div');
        expect(container?.classList.contains('classA')).toBe(true);
        expect(container?.classList.contains('classB')).toBe(true);
    });

    it('should be read-only', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('readOnly', true);
        fixture.detectChanges();
        await fixture.whenStable();
        const readOnlyEl = fixture.nativeElement.querySelector('div.select2-container--readonly');
        expect(readOnlyEl).toBeTruthy();
    });

    it('should be editable', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('readOnly', false);
        fixture.detectChanges();
        await fixture.whenStable();
        const readOnlyEl = fixture.nativeElement.querySelector('div.select2-container--readonly');
        expect(readOnlyEl).toBeFalsy();
    });

    it('should set data from valuelist', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.data().length).toBeGreaterThan(0);
        expect(component.data().find(d => d.label === 'one')).toBeTruthy();
        expect(component.data().find(d => d.label === 'two')).toBeTruthy();
    });

    it('should set filteredDataProviderId from dataProviderID', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('dataProviderID', '2');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.filteredDataProviderId()).toContain(2);
    });

    it('should handle multiselect dataprovider (newline-separated)', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('dataProviderID', '2\n3');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.filteredDataProviderId()).toContain(2);
        expect(component.filteredDataProviderId()).toContain(3);
    });

    it('should not emit dataProviderIDChange on programmatic dataprovider change', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        const spy = vi.fn();
        component.dataProviderIDChange.subscribe(spy);
        fixture.componentRef.setInput('dataProviderID', '2');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should handle isEnabled correctly', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('readOnly', false);
        fixture.componentRef.setInput('editable', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.isEnabled()).toBe(true);
    });

    it('should handle isEnabled when disabled', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('enabled', false);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.isEnabled()).toBe(false);
    });

    it('should handle isEditable correctly', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('readOnly', false);
        fixture.componentRef.setInput('editable', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.isEditable()).toBe(true);
    });

    it('should not be editable when readOnly is true', async () => {
        setDefaultInputs(fixture);
        fixture.componentRef.setInput('readOnly', true);
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.isEditable()).toBe(false);
    });

    it('should handle keyboard ArrowDown stopPropagation', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        const stopSpy = vi.spyOn(event, 'stopPropagation');
        component.handleKeyDown(event);
        expect(stopSpy).toHaveBeenCalled();
    });

    it('should handle keyboard ArrowUp stopPropagation', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        const stopSpy = vi.spyOn(event, 'stopPropagation');
        component.handleKeyDown(event);
        expect(stopSpy).toHaveBeenCalled();
    });

    it('should not stop propagation for other keys', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        const stopSpy = vi.spyOn(event, 'stopPropagation');
        component.handleKeyDown(event);
        expect(stopSpy).not.toHaveBeenCalled();
    });

    it('should update valuelist and dataprovider together', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        const spy = vi.fn();
        component.dataProviderIDChange.subscribe(spy);
        const newValuelist = [{
            'displayValue': 'AAAA',
            'realValue': 'AAAA'
        },
        {
            'displayValue': 'BBBB',
            'realValue': 'BBBB'
        },
        {
            'displayValue': 'CCCC',
            'realValue': 'CCCC'
        },
        {
            'displayValue': 'DDDD',
            'realValue': 'DDDD'
        }] as IValuelist;
        newValuelist.getDisplayValue = (value: any) => {
            const item = newValuelist.find(({ realValue }) => realValue === value);
            if (item) return of(item.displayValue);
            return of(value);
        };
        newValuelist.hasRealValues = () => true;
        newValuelist.filterList = (value: any) => of(newValuelist.filter(item => item.displayValue.includes(value)));
        fixture.componentRef.setInput('valuelistID', newValuelist);
        fixture.componentRef.setInput('dataProviderID', 'AAAA');
        fixture.detectChanges();
        await fixture.whenStable();
        expect(spy).not.toHaveBeenCalled();
        expect(component.filteredDataProviderId()).toContain('AAAA');
    });

    it('should set tabIndex via setTabIndex', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        component.setTabIndex(5);
        expect(component.tabIndex()).toBe(5);
    });

    it('should update tabIndex signal reactively', async () => {
        setDefaultInputs(fixture);
        fixture.detectChanges();
        await fixture.whenStable();
        component.setTabIndex(10);
        expect(component.tabIndex()).toBe(10);
    });

    describe('newest-value collapse (SVY-21666)', () => {
        it('should emit the newest value when a numeric column already has a value', async () => {
            setDefaultInputs(fixture);
            fixture.componentRef.setInput('format', { 'type': 'INTEGER' } as Format);
            fixture.componentRef.setInput('dataProviderID', 1);
            fixture.detectChanges();
            await fixture.whenStable();
            const spy = vi.fn();
            component.dataProviderIDChange.subscribe(spy);
            component.userChangedValue = true;
            component.updateValue({ value: [1, 3], component: { isOpen: false } as any, options: [] } as any);
            expect(spy).toHaveBeenCalledWith(3);
            expect(spy).not.toHaveBeenCalledWith(1);
        });

        it('should emit the selected value for a single select', async () => {
            setDefaultInputs(fixture);
            fixture.componentRef.setInput('format', { 'type': 'INTEGER' } as Format);
            fixture.componentRef.setInput('dataProviderID', '');
            fixture.detectChanges();
            await fixture.whenStable();
            const spy = vi.fn();
            component.dataProviderIDChange.subscribe(spy);
            component.userChangedValue = true;
            component.updateValue({ value: [2], component: { isOpen: false } as any, options: [] } as any);
            expect(spy).toHaveBeenCalledWith(2);
        });

        it('should emit null when the last token is removed', async () => {
            setDefaultInputs(fixture);
            fixture.componentRef.setInput('format', { 'type': 'INTEGER' } as Format);
            fixture.componentRef.setInput('dataProviderID', 1);
            fixture.detectChanges();
            await fixture.whenStable();
            const spy = vi.fn();
            component.dataProviderIDChange.subscribe(spy);
            component.userChangedValue = true;
            component.updateValue({ value: [], component: { isOpen: false } as any, options: [] } as any);
            expect(spy).toHaveBeenCalledWith(null);
        });

        it('should emit the newest value for a boolean column', async () => {
            setDefaultInputs(fixture);
            fixture.componentRef.setInput('format', { 'type': 'INTEGER' } as Format);
            fixture.componentRef.setInput('dataProviderID', false);
            fixture.detectChanges();
            await fixture.whenStable();
            const spy = vi.fn();
            component.dataProviderIDChange.subscribe(spy);
            component.filteredDataProviderId.set([false]);
            component.userChangedValue = true;
            component.updateValue({ value: [false, true], component: { isOpen: false } as any, options: [] } as any);
            expect(spy).toHaveBeenCalledWith(true);
        });
    });

    describe('additional behavior', () => {
        beforeEach(async () => {
            setDefaultInputs(fixture);
            fixture.detectChanges();
            await fixture.whenStable();
        });

        it('onDataChangeCallback adds ng-invalid for a string return value', () => {
            component.onDataChangeCallback(null, 'error message');
            expect(component.getNativeElement().classList.contains('ng-invalid')).toBe(true);
        });

        it('onDataChangeCallback adds ng-invalid for a false return value', () => {
            component.onDataChangeCallback(null, false);
            expect(component.getNativeElement().classList.contains('ng-invalid')).toBe(true);
        });

        it('onDataChangeCallback removes ng-invalid for a valid return value', () => {
            component.onDataChangeCallback(null, false);
            component.onDataChangeCallback(null, true);
            expect(component.getNativeElement().classList.contains('ng-invalid')).toBe(false);
        });

        it('updateValue joins multiple string tokens with a newline', () => {
            const spy = vi.fn();
            component.dataProviderIDChange.subscribe(spy);
            component.userChangedValue = true;
            component.updateValue({ value: ['2', '3'], component: { isOpen: false } as any, options: [] } as any);
            expect(spy).toHaveBeenCalledWith('2\n3');
        });

        it('updateValue does nothing when the user did not change the value', () => {
            const spy = vi.fn();
            component.dataProviderIDChange.subscribe(spy);
            component.userChangedValue = false;
            component.updateValue({ value: [2], component: { isOpen: false } as any, options: [] } as any);
            expect(spy).not.toHaveBeenCalled();
        });

        it('updateValue closes the popup when closeOnSelect is true and it is open', () => {
            const toggle = vi.fn();
            component.userChangedValue = true;
            component.updateValue({ value: ['2'], component: { isOpen: true, toggleOpenAndClose: toggle } as any, options: [] } as any);
            expect(toggle).toHaveBeenCalled();
        });

        it('removedOption marks a user change and re-opens when openOnUnselect is set', () => {
            const toggle = vi.fn();
            component.updateValue = vi.fn();
            component.removedOption({ value: [], component: { isOpen: false, toggleOpenAndClose: toggle } as any } as any);
            expect(component.userChangedValue).toBe(true);
            expect(toggle).toHaveBeenCalled();
        });

        it('isEnabled is false when not editable even if enabled', async () => {
            fixture.componentRef.setInput('enabled', true);
            fixture.componentRef.setInput('editable', false);
            fixture.detectChanges();
            expect(component.isEnabled()).toBe(false);
        });

        it('compareArrays returns false for different lengths and true for equal contents', () => {
            const cmp = (component as any).compareArrays.bind(component);
            expect(cmp([1, 2], [1])).toBe(false);
            expect(cmp([1, 2], [1, 2])).toBe(true);
            expect(cmp('x', [1])).toBe(false);
        });

        it('hasKeyListenerAttribute reflects the servoyAttributes keylistener key', () => {
            expect(component.hasKeyListenerAttribute()).toBe(false);
        });

        it('setData skips null and empty real values', () => {
            const vl = [
                { displayValue: 'empty', realValue: '' },
                { displayValue: 'nullish', realValue: null },
                { displayValue: 'ok', realValue: 7 }
            ] as any;
            vl.hasRealValues = () => true;
            vl.filterList = () => of([]);
            vl.getDisplayValue = (v: any) => of(v + '');
            fixture.componentRef.setInput('valuelistID', vl);
            fixture.detectChanges();
            component.setData();
            expect(component.data().some(d => d.value === 7)).toBe(true);
            expect(component.data().some(d => d.value === '')).toBe(false);
        });

        it('listOpened activates the popup and flags a user change', () => {
            vi.useFakeTimers();
            const activate = vi.spyOn((component as any).popupStateService, 'activatePopup');
            component.listOpened({} as any);
            expect(activate).toHaveBeenCalled();
            expect(component.userChangedValue).toBe(true);
            vi.runAllTimers();
            vi.useRealTimers();
        });

        it('listClosed deactivates the popup and resets the user change flag', () => {
            fixture.componentRef.setInput('selectOnClose', false);
            fixture.detectChanges();
            const deactivate = vi.spyOn((component as any).popupStateService, 'deactivatePopup');
            component.userChangedValue = true;
            component.listClosed({} as any);
            expect(deactivate).toHaveBeenCalled();
            expect(component.userChangedValue).toBe(false);
        });

        it('resetSearch re-filters the valuelist with an empty string', () => {
            const spy = vi.spyOn(mockData, 'filterList');
            component.resetSearch();
            expect(spy).toHaveBeenCalledWith('');
            spy.mockRestore();
        });
    });

});
