import { Component, SimpleChanges, Renderer2, ElementRef, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, input, output, viewChild, signal } from '@angular/core';
import { ServoyBaseComponent, Format } from '@servoy/public';

@Component( {
    selector: 'servoyextra-textfieldgroup',
    styleUrls: ['./textfieldgroup.css'],
    templateUrl: './textfieldgroup.html',
    standalone: false
} )
export class ServoyExtraTextfieldGroup extends ServoyBaseComponent<HTMLDivElement> {

    readonly input = viewChild<ElementRef<HTMLInputElement>>('input');
    readonly span = viewChild<ElementRef<HTMLSpanElement>>('span');
    
    readonly onActionMethodID = input<(e: Event) => void>(undefined);
    readonly onRightClickMethodID = input<(e: Event) => void>(undefined);
    readonly onDataChangeMethodID = input<(e: Event) => void>(undefined);
    readonly onFocusGainedMethodID = input<(e: Event) => void>(undefined);
    readonly onFocusLostMethodID = input<(e: Event) => void>(undefined);

    readonly dataProviderIDChange = output<any>();
    readonly dataProviderID = input<any>(undefined);
    readonly enabled = input<boolean>(undefined);
    readonly format = input<Format>(undefined);
    readonly faclass = input<string>(undefined);
    readonly inputType = input<string>(undefined);
    readonly inputValidation = input<string>(undefined);
    readonly invalidEmailMessage = input<string>(undefined);
    readonly placeholderText = input<string>(undefined);
    readonly readOnly = input<boolean>(undefined);
    readonly styleClass = input<string>(undefined);
    readonly tabSeq = input<number>(undefined);
    readonly visible = input<boolean>(undefined);
    
    _dataProviderID = signal<any>(undefined);
    
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
        return this.input().nativeElement;
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
                        this._dataProviderID.set(this.dataProviderID());
                        this.dataProviderValidation();
                        break;
                    case 'placeholderText':
                        if (change.currentValue) this.renderer.setAttribute(this.getFocusElement(), 'placeholder', change.currentValue);
                        else this.renderer.removeAttribute(this.getFocusElement(), 'placeholder');
                        break;
                    case 'inputType':
                        this.renderer.setAttribute(this.getFocusElement(), 'type', this.inputType());
                        break;
                }
            }
        }
        super.svyOnChanges( changes );
    }

    dataProviderValidation() {
        if ( this.inputValidation() === 'email' ) {
            const email_regexp = /^[_a-z0-9-+^$']+(\.[_a-z0-9-+^$']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;
            let isMatchRegex = email_regexp.test( this._dataProviderID() );
            if ( isMatchRegex || !this._dataProviderID() ) {
                this.showError = false;
            } else {
                this.showError = true;
            }
        } else {
            this.showError = false;
        }
    }
    
    pushUpdate( event: any) {
		const dataProviderID = this.dataProviderID();
        if (event !== dataProviderID) {
			this._dataProviderID.set(event);
        	this.dataProviderIDChange.emit(event);
        	this.dataProviderValidation();
		} 
    }

    protected attachHandlers() {

        this.attachFocusListeners(this.getFocusElement());
        if ( this.onActionMethodID() ) {
            this.renderer.listen( this.getFocusElement(), 'keydown', e => {
                if (e.keyCode === 13) {
                    this.pushUpdate(this.input().nativeElement.value);
                    this.onActionMethodID()( e );
                }
            });
        }
        if ( this.onRightClickMethodID() ) {
            this.renderer.listen( this.getNativeElement(), 'contextmenu', e => {
                this.onRightClickMethodID()( e ); return false;
            } );
        }
    }
    
    attachFocusListeners( nativeElement: any ) {
        if ( this.onFocusGainedMethodID() )
            this.renderer.listen( nativeElement, 'focus', ( e ) => {
                if ( this.mustExecuteOnFocus !== false ) {
                    this.onFocusGainedMethodID()( e );
                }
                this.mustExecuteOnFocus = true;
            } );
        if ( this.onFocusLostMethodID() )
            this.renderer.listen( nativeElement, 'blur', ( e ) => {
                this.onFocusLostMethodID()( e );
            } );
    }
}

