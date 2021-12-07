import { Component, Renderer2, SimpleChanges, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Select2Option, Select2UpdateEvent, Select2, Select2RemoveEvent } from 'ng-select2-component';
import { ServoyBaseComponent, IValuelist } from '@servoy/public';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'servoyextra-select2tokenizer',
    templateUrl: './select2tokenizer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraSelect2Tokenizer extends ServoyBaseComponent<HTMLDivElement> {

    @Input() onDataChangeMethodID: (e: Event, data?: any) => void;
    @Input() onFocusGainedMethodID: (e: Event, data?: any) => void;
    @Input() onFocusLostMethodID: (e: Event, data?: any) => void;

    @Output() dataProviderIDChange = new EventEmitter();
    @Input() placeholderText: string;
    @Input() readOnly: boolean;
    @Input() valuelistID: IValuelist;
    @Input() styleClass: string;
    @Input() tabSeq: number;
    @Input() toolTipText: string;
    @Input() dataProviderID: any;
    @Input() enabled: boolean;
    @Input() editable: boolean;
    @Input() noMatchesFoundText: string;
    @Input() maximumSelectionSize: number;
    @Input() openOnUnselect: boolean;
    @Input() closeOnSelect: boolean;
    @Input() clearSearchTextOnSelect: boolean;
    @Input() selectOnClose: boolean;
    @Input() allowNewEntries: boolean;
    @Input() size: { width: number; height: number };

    tabIndex: number;

    @ViewChild(Select2) select2: Select2;

    data: Select2Option[] = [];
    filteredDataProviderId: Array<any>;
    listPosition: 'above' | 'below' = "below";
    mustExecuteOnFocus = true;
    newEntriesInit = false;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, @Inject(DOCUMENT) private doc: Document) {
        super(renderer, cdRef);
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            // stop propagation when using list form component (to not break the selection)
            event.stopPropagation();
        }
    }

    svyOnInit() {
        super.svyOnInit();
        //this.setData(); it is already done in svyOnChanges
        this.attachFocusListeners(this.getNativeElement());
        const position = this.getNativeElement().getBoundingClientRect();
        let availableHeight = this.doc.defaultView.innerHeight - position.top - position.height;
        let dropDownheight = this.valuelistID.length * 30;
        if (dropDownheight > availableHeight) {
            this.listPosition = 'above';
        }
    }

    attachFocusListeners( nativeElement: HTMLDivElement ) {
        if ( this.onFocusGainedMethodID ) {
            this.select2.focus.subscribe(() => {
                if ( this.mustExecuteOnFocus === true ) {
                    this.onFocusGainedMethodID( new CustomEvent( 'focus' ) );
                }
                this.mustExecuteOnFocus = true;
            } );
            /* used for triggering a focus gained when the component is not editable
             * fix for SVYX-210 */
            this.renderer.listen( nativeElement, 'focusin', ( e ) => {
                if ( !this.isEditable() ) {
                    this.onFocusGainedMethodID( e );
                }
            } );
        }
        if ( this.onFocusLostMethodID ) {
            this.select2.close.subscribe(() => {
                this.onFocusLostMethodID( new CustomEvent( 'close' ) );
            } );

            /* used for triggering a focus lost when the component is not editable
             * fix for SVYX-210 */
            this.renderer.listen( nativeElement, 'focusout', ( e ) => {
                if ( !this.isEditable() ) {
                    this.onFocusLostMethodID( e );
                }
            } );
        }
    }

    requestFocus(mustExecuteOnFocusGainedMethod: boolean) {
        this.mustExecuteOnFocus = mustExecuteOnFocusGainedMethod;
        this.getNativeElement().focus();
        this.select2.toggleOpenAndClose();
    }

    isEnabled() {
        return this.enabled === true && this.isEditable();
    }

    isEditable() {
        return this.readOnly === false && this.editable === true;
    }

    setData() {
        if (this.valuelistID) {
            const options: Select2Option[] = [];
            for (const value of this.valuelistID) {
                if (value.realValue === null || value.realValue === '') {
                    continue;
                }
                options.push({
                    value: value.realValue,
                    label: value.displayValue
                });
            }
            this.data = options;
        }
    }

    onDataChangeCallback(event: any, returnval: any) {
        const stringValue = (typeof returnval === 'string' || returnval instanceof String);
        if (returnval === false || stringValue) {
            //this.renderer.removeClass( this.select2, 'ng-valid' );
            this.renderer.addClass(this.elementRef.nativeElement, 'ng-invalid');
        } else {
            this.renderer.removeClass(this.elementRef.nativeElement, 'ng-invalid');
            //this.renderer.addClass( this.select2, 'ng-valid' );
        }
    }

    /**
     * Compares 2 arrays
     * @param arr1
     * @param arr2
     */
    private compareArrays( arr1: any, arr2: any ) {
        if(!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if ( arr1.length !== arr2.length ) return false;
        for ( var i = 0, len = arr1.length; i < len; i++ ) {
            if ( arr1[i] + '' !== arr2[i] + '') {
                return false;
            }
        }
        return true;
    }
    
    updateValue(event: Select2UpdateEvent<any>) {
        if (!this.compareArrays(this.filteredDataProviderId, event.value)) {
            if(event.value.length > 0){
                if(event.value.length > 1 && (typeof this.dataProviderID === "string")){
                    this.filteredDataProviderId = event.value;
                    this.dataProviderID = event.value.join('\n');
                }
                else if(event.value.length === 1 || (typeof this.dataProviderID === "number") || (typeof this.dataProviderID === "boolean")){
                    this.filteredDataProviderId[0] = event.value[event.value.length - 1];
                    this.dataProviderID = this.filteredDataProviderId[0];
                } else {
                    console.log("Warning dataProviderID typeof " + typeof this.dataProviderID  + " not allowed")
                }
            } else {
                this.dataProviderID = undefined;
            }
            this.dataProviderIDChange.emit(this.dataProviderID);
            if (this.closeOnSelect && event.component.isOpen) {
                event.component.toggleOpenAndClose();
            }
            if (this.clearSearchTextOnSelect && !this.closeOnSelect && event.component.isOpen) {
                let searchText = this.getNativeChild().querySelector('input');
                if (searchText) {
                    searchText.value = '';
                    searchText.dispatchEvent(new KeyboardEvent('keyup'))
                }
            }
        }
    }

    svyOnChanges( changes: SimpleChanges ) {
        if ( changes['valuelistID'] ) {
            this.setData();
        }
        if ( changes['dataProviderID'] ) {
            this.setData();
            this.filteredDataProviderId = this.dataProviderID ? ( ( typeof this.dataProviderID === 'string' ) ? this.dataProviderID.split( '\n' ) : [this.dataProviderID] ) : [];

            if ( this.filteredDataProviderId && this.filteredDataProviderId.length ) {
                let realValue: any;
                for ( let i = 0; this.filteredDataProviderId && i < this.filteredDataProviderId.length; i++ ) {
                    realValue = this.filteredDataProviderId[i];
                    this.selectRealValue( realValue );
                }
            }
        }
        if ( changes['size'] ) {
            this.renderer.setProperty( this.elementRef.nativeElement, 'height', this.size.height );
        }
        super.svyOnChanges( changes );
    }

    selectRealValue(realValue: any) {
        let found = false;
        for (let i = 0; i < this.valuelistID.length; i++) {
            if (this.valuelistID[i].realValue === realValue) {
                // set value
                found = true;
                break;
            }
        }
        if (!found) {
            const option: Select2Option = {
                value: realValue,
                label: realValue
            };
            if (!this.data.includes(option)) {
                this.data.push(option);
            }
        }
    }

    removedOption(event: Select2RemoveEvent<any>) {
        if (this.openOnUnselect && !event.component.isOpen) {
            event.component.toggleOpenAndClose();
        }
    }

    listClosed(event: Select2) {
        if (this.selectOnClose) {
            let highlightItem = this.getNativeChild().querySelector('.select2-results__option--highlighted')
            if (highlightItem) {
                let displayValue = highlightItem.textContent;
                let found = false;
                let realValue:any;
                for (let i = 0; i < this.valuelistID.length; i++) {
                    if (this.valuelistID[i].displayValue === displayValue) {
                        // set value
                        found = true;
                        realValue = this.valuelistID[i].realValue;
                        break;
                    }
                }
                if (found && this.filteredDataProviderId.indexOf(realValue) < 0) {
                    event.select({
                        value: realValue,
                        label: realValue
                    });
                }
            }
        }
    }

    listOpened(event: Select2) {
        if (this.allowNewEntries && !this.newEntriesInit) {
            this.newEntriesInit = true;
            let inputTextfield = this.getNativeChild().querySelector('input');
            if (inputTextfield) {
                let prevValue: string;
                inputTextfield.addEventListener('keyup', () => {
                    let newValue = inputTextfield.value;
                    if (prevValue != newValue) {
                        const option: Select2Option = {
                            value: newValue,
                            label: newValue
                        };
                        if (prevValue) {
                            if (newValue != '' && !this.data.some(item => item.value == newValue)){
                              this.data[0] = option;  
                            }
                            else
                            {
                                this.data.shift();
                            }
                        }
                        else
                        {
                            this.data.unshift(option);
                        }
                        prevValue = newValue;
                    }
                });
            }
        }
    }

    setTabIndex(tabIndex: number) {
        this.tabIndex = tabIndex;
    }
}
