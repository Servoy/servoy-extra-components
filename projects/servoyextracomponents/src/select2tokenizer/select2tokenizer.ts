import { Component, Renderer2, SimpleChanges, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Select2Option, Select2UpdateEvent, Select2 } from 'ng-select2-component';
import { ServoyBaseComponent, IValuelist } from '@servoy/public';
import { DOCUMENT } from '@angular/common';

@Component( {
    selector: 'servoyextra-select2tokenizer',
    templateUrl: './select2tokenizer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ServoyExtraSelect2Tokenizer extends ServoyBaseComponent<HTMLDivElement> {

    @Input() onDataChangeMethodID: ( e: Event, data?: any ) => void;
    @Input() onFocusGainedMethodID: ( e: Event, data?: any ) => void;
    @Input() onFocusLostMethodID: ( e: Event, data?: any ) => void;

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

    @ViewChild( Select2 ) select2: Select2;

    data: Select2Option[] = [];
    filteredDataProviderId: any;
    listPosition: 'above' | 'below' = "below";
    mustExecuteOnFocus = true;

    constructor( renderer: Renderer2, cdRef: ChangeDetectorRef, @Inject( DOCUMENT ) private doc: Document ) {
        super( renderer, cdRef );
    }

    @HostListener( 'keydown', ['$event'] )
    handleKeyDown( event: KeyboardEvent ) {
        if ( event.key === 'ArrowUp' || event.key === 'ArrowDown' ) {
            // stop propagation when using list form component (to not break the selection)
            event.stopPropagation();
        }
    }

    svyOnInit() {
        super.svyOnInit();
        this.setData();
        this.attachFocusListeners(this.getNativeElement());
        const position = this.getNativeElement().getBoundingClientRect();
        let availableHeight = this.doc.defaultView.innerHeight - position.top - position.height;
        let dropDownheight = this.valuelistID.length * 30;
        if ( dropDownheight > availableHeight ) {
            this.listPosition = 'above';
        }
    }

    attachFocusListeners( nativeElement: HTMLDivElement ) {
        if ( this.onFocusGainedMethodID ) {
            this.renderer.listen(  this.getNativeElement(), 'focusin', ( e ) => {
                if (this.mustExecuteOnFocus === true) {
                    this.onFocusGainedMethodID(e);
                }
                this.mustExecuteOnFocus = true;
            } );
        }

        if ( this.onFocusLostMethodID) {
            this.renderer.listen(  this.getNativeElement(), 'focusout', ( e ) => {
                this.onFocusLostMethodID( e );
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
        if ( this.valuelistID ) {
            const options: Select2Option[] = [];
            for ( const value of this.valuelistID ) {
                if ( value.realValue === null || value.realValue === '' ) {
                    continue;
                }
                options.push( {
                    value: value.realValue,
                    label: value.displayValue
                } );
            }
            this.data = options;
        }
    }

    onDataChangeCallback( event, returnval ) {
        const stringValue = ( typeof returnval === 'string' || returnval instanceof String );
        if ( returnval === false || stringValue ) {
            //this.renderer.removeClass( this.select2, 'ng-valid' );
            this.renderer.addClass( this.elementRef.nativeElement, 'ng-invalid' );
        } else {
            this.renderer.removeClass( this.elementRef.nativeElement, 'ng-invalid' );
            //this.renderer.addClass( this.select2, 'ng-valid' );
        }
    }    
    
    updateValue( event: Select2UpdateEvent<any> ) {
        if ( this.filteredDataProviderId !== event.value ) {
            this.filteredDataProviderId = event.value;
            this.dataProviderID = event.value.join( '\n' );
            this.dataProviderIDChange.emit( this.dataProviderID );
        }
    }

    svyOnChanges( changes: SimpleChanges ) {
        if ( changes['valuelistID'] ) {
            this.setData();
        }
        if ( changes['dataProviderID'] ) {
            this.setData();
            let hashMap = {};
            this.filteredDataProviderId = this.dataProviderID ? (( typeof this.dataProviderID === 'string' ) ? this.dataProviderID.split( '\n' ) : [this.dataProviderID]) : [];
            
            if( this.filteredDataProviderId &&  this.filteredDataProviderId.length){
                let realValue:any;
                for (let  i = 0; this.filteredDataProviderId && i < this.filteredDataProviderId.length;  i++) {
                    realValue = this.filteredDataProviderId[i];
                    hashMap[realValue] = realValue;
                }
                // select each value
                for (realValue in hashMap) {
                    this.selectRealValue(realValue, this.filteredDataProviderId);
                }
            }
        }
        super.svyOnChanges( changes );
    }
    
    selectRealValue( realValue: any, values: any ) {
        let found = false;
        for ( let i = 0; i < this.valuelistID.length; i++ ) {
            if ( this.valuelistID[i].realValue === realValue ) {
                // set value
                found = true;
                break;
            }
        }
        if ( !found ) {
            const options: Select2Option[] = [];
            options.push( {
                value: realValue,
                label: realValue
            } );
            if ( !this.data.includes( options[0] ) ) {
                this.data.push( {
                    value: realValue,
                    label: realValue
                } );
            }
        }
    }
}
