import { Component, Renderer2, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { Format, FormattingService, ServoyBaseComponent, IValuelist } from '@servoy/public';

@Component({
    selector: 'servoyextra-spinner',
    templateUrl: './spinner.html',
    styleUrls: ['./spinner.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ServoyExtraSpinner extends ServoyBaseComponent<HTMLDivElement> {
    readonly onDataChangeMethodID = input<(e: Event, data?: any) => void>(undefined);
    readonly onActionMethodID = input<(e: Event, data?: any) => void>(undefined);
    readonly onFocusGainedMethodID = input<(e: Event, data?: any) => void>(undefined);
    readonly onRightClickMethodID = input<(e: Event, data?: any) => void>(undefined);
    readonly onFocusLostMethodID = input<(e: Event, data?: any) => void>(undefined);

    readonly dataProviderIDChange = output<any>();
    readonly dataProviderID = input<any>(undefined);
    readonly enabled = input<boolean>(undefined);
    readonly editable = input<boolean>(undefined);
    readonly format = input<Format>(undefined);
    readonly tabSeq = input<number>(undefined);
    readonly toolTipText = input<string>(undefined);
    readonly valuelistID = input<IValuelist>(undefined);
    readonly responsiveHeight = input<number>(undefined);
    readonly placeholderText = input<string>(undefined);
    readonly styleClass = input<string>(undefined);
    
    _dataProviderID = signal<any>(undefined);
       
    selection: any;
    private counter = 0;



    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, formattingService: FormattingService) {
        super(renderer, cdRef);
    }

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
                    if (!this.servoyApi.isInAbsoluteLayout()) {
                        this.getNativeElement().style.minHeight = this.responsiveHeight() + 'px';
                        this.getNativeElement().style.position = 'relative';
                    }
                    break;
                case 'styleClass':
                    if (change.previousValue) {
                        const array = change.previousValue.trim().split(' ');
                        array.filter((element: string) => element !== '').forEach((element: string) => this.renderer.removeClass(this.getNativeElement(), element));
                    }
                    if (change.currentValue) {
                        const array = change.currentValue.trim().split(' ');
                        array.filter((element: string) => element !== '').forEach((element: string) => this.renderer.addClass(this.getNativeElement(), element));
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

        this.renderer.listen(spinnerButtons[0], 'click', e => this.increment());
        this.renderer.listen(spinnerButtons[1], 'click', e => this.decrement());
        
         const onActionMethodID = this.onActionMethodID();
         if (onActionMethodID)
                this.renderer.listen(this.getNativeChild(), 'click', e => this.onActionMethodID()(e));

         if (this.onRightClickMethodID())
                this.renderer.listen(this.getNativeChild(), 'contextmenu', e => {
                 this.onRightClickMethodID()(e);
                 return false;
                });

        for (const i of Object.keys(spinnerButtons)) {
            if (onActionMethodID)
                this.renderer.listen(spinnerButtons[i], 'click', e => this.onActionMethodID()(e));

            if (this.onFocusLostMethodID())
                this.renderer.listen(spinnerButtons[i], 'blur', e => this.onFocusLostMethodID()(e));

            if (this.onFocusGainedMethodID())
                this.renderer.listen(spinnerButtons[i], 'focus', e => this.onFocusGainedMethodID()(e));
        }
    }

    getFocusElement(): HTMLElement {
        return this.getNativeElement();
    }

    pushUpdate() {
        this.dataProviderIDChange.emit(this._dataProviderID());
    }

    // copied from angularui timepicker
    isScrollingUp(e): boolean {
        if (e.originalEvent) {
            e = e.originalEvent;
        }
        // pick correct delta variable depending on event
        const delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
        return (e.detail || delta > 0);
    }

    scrollCallback(e) {
        if (!this.isDisabled()) {
            if (this.isScrollingUp(e))this.increment();
            else this.decrement();
        }
        e.preventDefault();
    }

    keydownKeypressCallback(e) {
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

        for (let i = 0; i < this.valuelistID().length; i++) {
            const item = this.valuelistID()[i];
            if (item && item.realValue && dataProviderID === item.realValue) {
                let displayFormat;
                let type;
                const format = this.format();
                if (format && format.display)
                    displayFormat = format.display;
                if (format && format.type)
                    type = format.type;
                this.counter = i;
                return item.displayValue;
            }
        }
        return null;
    }

}

