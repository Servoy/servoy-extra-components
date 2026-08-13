import { Component, SimpleChanges, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Format, ServoyBaseComponent, IValuelist, ServoyPublicModule } from '@servoy/public';

@Component({
    selector: 'servoyextra-spinner',
    templateUrl: './spinner.html',
    styleUrls: ['./spinner.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormsModule, ServoyPublicModule]
})
export class ServoyExtraSpinner extends ServoyBaseComponent<HTMLDivElement> {
    readonly onDataChangeMethodID = input<((e: Event, data?: any) => void) | undefined>(undefined);
    readonly onActionMethodID = input<((e: Event, data?: any) => void) | undefined>(undefined);
    readonly onFocusGainedMethodID = input<((e: Event, data?: any) => void) | undefined>(undefined);
    readonly onRightClickMethodID = input<((e: Event, data?: any) => void) | undefined>(undefined);
    readonly onFocusLostMethodID = input<((e: Event, data?: any) => void) | undefined>(undefined);

    readonly dataProviderIDChange = output<any>();
    readonly dataProviderID = input<any>(undefined as any);
    readonly enabled = input<boolean>(undefined as any);
    readonly editable = input<boolean>(undefined as any);
    readonly format = input<Format>(undefined as any);
    readonly tabSeq = input<number>(undefined as any);
    readonly toolTipText = input<string>(undefined as any);
    readonly valuelistID = input<IValuelist>(undefined as any);
    readonly responsiveHeight = input<number>(undefined as any);
    readonly placeholderText = input<string>(undefined as any);
    readonly styleClass = input<string>(undefined as any);
    
    _dataProviderID = signal<any>(undefined);
       
    selection: any;
    private counter = 0;

    svyOnInit() {
        this._dataProviderID.set(this.dataProviderID());
        this.selection = this.getSelectionFromDataprovider();
        this.addHandlersToInputAndSpinnerButtons();
        super.svyOnInit();
    }

    requestFocus() {
        const spinnerDiv = this.getFocusElement().children[0];
        (spinnerDiv.children[0] as HTMLElement).focus();
    }

    svyOnChanges(changes: SimpleChanges) {
        for (const property of Object.keys(changes)) {
            const change = changes[property];
            switch (property) {
                case 'dataProviderID':
                    this._dataProviderID.set(this.dataProviderID());
                    this.selection = this.getSelectionFromDataprovider();
                    break;
                case 'responsiveHeight':
                    if (!this.servoyApi().isInAbsoluteLayout()) {
                        this.getNativeElement().style.minHeight = this.responsiveHeight() + 'px';
                        this.getNativeElement().style.position = 'relative';
                    }
                    break;
                case 'placeholderText':
                    if (change.currentValue) this.renderer.setAttribute(this.getFocusElement().querySelector('input'), 'placeholder', change.currentValue);
                    else this.renderer.removeAttribute(this.getFocusElement().querySelector('input'), 'placeholder');
                    break;
            }
        }
        super.svyOnChanges(changes);
    }

    addHandlersToInputAndSpinnerButtons() {
        const spinnerButtons = this.getNativeElement().getElementsByTagName('button');

        this.renderer.listen(this.getNativeChild(), 'scroll', e => this.scrollCallback(e));
        this.renderer.listen(this.getNativeChild(), 'keydown keypress', e => this.keydownKeypressCallback(e));

        this.renderer.listen(spinnerButtons[0], 'click', _e => this.increment());
        this.renderer.listen(spinnerButtons[1], 'click', _e => this.decrement());
        
         const onActionMethodID = this.onActionMethodID();
         if (onActionMethodID)
                this.renderer.listen(this.getNativeChild(), 'click', e => this.onActionMethodID()!(e));

         if (this.onRightClickMethodID())
                this.renderer.listen(this.getNativeChild(), 'contextmenu', e => {
                 this.onRightClickMethodID()!(e);
                 return false;
                });

        for (const i of Object.keys(spinnerButtons)) {
            if (onActionMethodID)
                this.renderer.listen((spinnerButtons as any)[i], 'click', e => this.onActionMethodID()!(e));

            if (this.onFocusLostMethodID())
                this.renderer.listen((spinnerButtons as any)[i], 'blur', e => this.onFocusLostMethodID()!(e));

            if (this.onFocusGainedMethodID())
                this.renderer.listen((spinnerButtons as any)[i], 'focus', e => this.onFocusGainedMethodID()!(e));
        }
    }

    getFocusElement(): HTMLElement {
        return this.getNativeElement();
    }

    pushUpdate() {
        this.dataProviderIDChange.emit(this._dataProviderID());
    }

    // copied from angularui timepicker
    isScrollingUp(e: any): boolean {
        if (e.originalEvent) {
            e = e.originalEvent;
        }
        // pick correct delta variable depending on event
        const delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
        return (e.detail || delta > 0);
    }

    scrollCallback(e: any) {
        if (!this.isDisabled()) {
            if (this.isScrollingUp(e))this.increment();
            else this.decrement();
        }
        e.preventDefault();
    }

    keydownKeypressCallback(e: any) {
        if (!this.isDisabled()) {
            if (e.which === 40)
                this.decrement();
            if (e.which === 38)
                this.increment();
        }
    }

    isDisabled() {
        return this.enabled() === false || this.editable() === false;
    }

    increment() {
        const valuelistID = this.valuelistID();
        if (valuelistID) {
            this.counter = this.counter < valuelistID.length - 1 ? this.counter + 1 : 0;
            this._dataProviderID.set(valuelistID[this.counter].realValue);
        }
        this.pushUpdate();
    }

    decrement() {
        const valuelistID = this.valuelistID();
        if (valuelistID) {
            this.counter = this.counter > 0 ? this.counter - 1 : valuelistID.length - 1;
            this._dataProviderID.set(valuelistID[this.counter].realValue);
        }
        this.pushUpdate();
    }

    getSelectionFromDataprovider() {
        const dataProviderID = this._dataProviderID();
        if (!dataProviderID) {
            this.counter = 0;
            return undefined;
        }

        for (let i = 0; i < this.valuelistID()!.length; i++) {
            const item = this.valuelistID()![i];
            if (item && item.realValue && dataProviderID === item.realValue) {
                this.counter = i;
                return item.displayValue;
            }
        }
        return null;
    }

}

