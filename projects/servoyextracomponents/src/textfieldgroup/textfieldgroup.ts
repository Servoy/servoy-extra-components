import { Component, ViewChild, SimpleChanges, Input, Renderer2, ElementRef, EventEmitter, Output, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ServoyBaseComponent, Format } from '@servoy/public';

@Component( {
    selector: 'servoyextra-textfieldgroup',
    styleUrls: ['./textfieldgroup.css'],
    templateUrl: './textfieldgroup.html'
} )
export class ServoyExtraTextfieldGroup extends ServoyBaseComponent<HTMLDivElement> {

    @ViewChild('input', { static: false }) input: ElementRef<HTMLInputElement>;
    @ViewChild('span', { static: false }) span: ElementRef<HTMLSpanElement>;
    
    @Input() onActionMethodID: ( e: Event ) => void;
    @Input() onRightClickMethodID: ( e: Event ) => void;
    @Input() onDataChangeMethodID: ( e: Event ) => void;
    @Input() onFocusGainedMethodID: ( e: Event ) => void;
    @Input() onFocusLostMethodID: ( e: Event ) => void;

    @Output() dataProviderIDChange = new EventEmitter();
    @Input() dataProviderID: any;
    @Input() enabled: boolean;
    @Input() format: Format;
    @Input() faclass: string;
    @Input() inputType: string;
    @Input() inputValidation: string;
    @Input() invalidEmailMessage: string;
    @Input() placeholderText: string;
    @Input() readOnly: boolean;
    @Input() styleClass: string;
    @Input() tabSeq: number;
    @Input() visible: boolean;
    
    showError = false;
    
    mustExecuteOnFocus = true;

    constructor( renderer: Renderer2, cdRef: ChangeDetectorRef ) {
        super( renderer, cdRef );
    }

    svyOnInit() {
        super.svyOnInit();
        this.attachHandlers();
    }
    
    getFocusElement() {
        return this.input.nativeElement;
    }

    requestFocus( mustExecuteOnFocusGainedMethod: boolean ) {
        this.mustExecuteOnFocus = mustExecuteOnFocusGainedMethod;
        this.getFocusElement().focus();
    }

    isValid() {
        return !this.showError;
    }

    svyOnChanges( changes: SimpleChanges ) {
        if ( changes ) {
            for ( const property of Object.keys( changes ) ) {
                const change = changes[property];
                switch ( property ) {
                    case 'enabled':
                        if ( change.currentValue )
                            this.renderer.removeAttribute( this.getFocusElement(), 'disabled' );
                        else
                            this.renderer.setAttribute( this.getFocusElement(), 'disabled', 'disabled' );
                        break;
                    case 'dataProviderID':
                        this.dataProviderValidation();
                        break;
                    case 'placeholderText':
                        if (change.currentValue) this.renderer.setAttribute(this.getFocusElement(), 'placeholder', change.currentValue);
                        else this.renderer.removeAttribute(this.getFocusElement(), 'placeholder');
                        break;
                    case 'inputType':
                        this.renderer.setAttribute(this.getFocusElement(), 'type', this.inputType);
                        break;
                }
            }
        }
        super.svyOnChanges( changes );
    }

    dataProviderValidation() {
        if ( this.inputValidation === 'email' ) {
            const email_regexp = /^[_a-z0-9-+^$']+(\.[_a-z0-9-+^$']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;
            let isMatchRegex = email_regexp.test( this.dataProviderID );
            if ( isMatchRegex || !this.dataProviderID ) {
                this.showError = false;
            } else {
                this.showError = true;
            }
        } else {
            this.showError = false;
        }
    }
    
    pushUpdate( event: any) {
		if (event !== this.dataProviderID) {
			this.dataProviderID = event;
        	this.dataProviderIDChange.emit(this.dataProviderID);
        	this.dataProviderValidation();
		} 
    }

    protected attachHandlers() {

        this.attachFocusListeners(this.getFocusElement());
        if ( this.onActionMethodID ) {
            this.renderer.listen( this.getFocusElement(), 'keydown', e => {
                if (e.keyCode === 13) {
                    this.pushUpdate(this.input.nativeElement.value);
                    this.onActionMethodID( e );
                }
            });
        }
        if ( this.onRightClickMethodID ) {
            this.renderer.listen( this.getNativeElement(), 'contextmenu', e => {
                this.onRightClickMethodID( e ); return false;
            } );
        }
    }
    
    attachFocusListeners( nativeElement: any ) {
        if ( this.onFocusGainedMethodID )
            this.renderer.listen( nativeElement, 'focus', ( e ) => {
                if ( this.mustExecuteOnFocus !== false ) {
                    this.onFocusGainedMethodID( e );
                }
                this.mustExecuteOnFocus = true;
            } );
        if ( this.onFocusLostMethodID )
            this.renderer.listen( nativeElement, 'blur', ( e ) => {
                this.onFocusLostMethodID( e );
            } );
    }
}

