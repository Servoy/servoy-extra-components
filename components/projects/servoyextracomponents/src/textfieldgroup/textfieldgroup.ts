import { Component, SimpleChanges, ElementRef, ChangeDetectionStrategy, input, output, viewChild, linkedSignal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServoyBaseComponent, Format, ServoyPublicModule } from '@servoy/public';

@Component( {
    selector: 'servoyextra-textfieldgroup',
    styleUrls: ['./textfieldgroup.css'],
    templateUrl: './textfieldgroup.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormsModule, ServoyPublicModule]
} )
export class ServoyExtraTextfieldGroup extends ServoyBaseComponent<HTMLDivElement> {

    /**
     * Suffix appended to the copied data-cy value on the focus element, so it
     * stays a distinct, unique selector from the wrapper's data-cy.
     */
    private static readonly DATA_CY_INPUT_SUFFIX = '-input';

    readonly input = viewChild<ElementRef<HTMLInputElement>>('input');
    readonly span = viewChild<ElementRef<HTMLSpanElement>>('span');
    
    readonly onActionMethodID = input<((e: Event) => void) | undefined>(undefined);
    readonly onRightClickMethodID = input<((e: Event) => void) | undefined>(undefined);
    readonly onDataChangeMethodID = input<((e: Event) => void) | undefined>(undefined);
    readonly onFocusGainedMethodID = input<((e: Event) => void) | undefined>(undefined);
    readonly onFocusLostMethodID = input<((e: Event) => void) | undefined>(undefined);

    readonly dataProviderIDChange = output<any>();
    readonly dataProviderID = input<any>(undefined as any);
    readonly enabled = input<boolean>(undefined as any);
    readonly format = input<Format>(undefined as any);
    readonly faclass = input<string>(undefined as any);
    readonly inputType = input<string>(undefined as any);
    readonly inputValidation = input<string>(undefined as any);
    readonly invalidEmailMessage = input<string>(undefined as any);
    readonly placeholderText = input<string>(undefined as any);
    readonly readOnly = input<boolean>(undefined as any);
    readonly styleClass = input<string>(undefined as any);
    readonly tabSeq = input<number>(undefined as any);
    readonly visible = input<boolean>(undefined as any);
    
    _dataProviderID = linkedSignal<any>(() => this.dataProviderID());

    readonly showError = computed(() => {
        if (this.inputValidation() === 'email') {
            const email_regexp = /^[_a-z0-9-+^$']+(\.[_a-z0-9-+^$']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;
            const val = this._dataProviderID();
            return !!val && !email_regexp.test(val);
        }
        return false;
    });
    
    mustExecuteOnFocus = true;

    svyOnInit() {
        super.svyOnInit();
        this.attachHandlers();
        this.applyAttributesToFocusElement();
    }
    
    getFocusElement() {
        return this.input()!.nativeElement;
    }

    /**
     * servoyAttributes (including data-cy, when servoy.ngclient.testingMode is
     * enabled) is applied by the base class to #element (the wrapper div), which
     * is not the element a test needs to interact with. Copy the same attributes
     * onto the actual focusable <input> as well, so it also gets a stable, unique
     * data-cy selector instead of only the auto-generated markup id.
     * data-cy is suffixed with "-input" on the inner element so it stays a
     * distinct, unique selector from the wrapper's data-cy (which a test may
     * still use to target the group as a whole).
     */
    protected applyAttributesToFocusElement() {
        const attributes = this.servoyAttributes();
        if (!attributes) return;
        for (const key of Object.keys(attributes)) {
            const value = key === 'data-cy' ? attributes[key] + ServoyExtraTextfieldGroup.DATA_CY_INPUT_SUFFIX : attributes[key];
            this.renderer.setAttribute(this.getFocusElement(), key, value);
        }
    }

    requestFocus( mustExecuteOnFocusGainedMethod: boolean ) {
        this.mustExecuteOnFocus = mustExecuteOnFocusGainedMethod;
        this.getFocusElement().focus();
    }

    isValid() {
        return !this.showError();
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
                    case 'placeholderText':
                        if (change.currentValue) this.renderer.setAttribute(this.getFocusElement(), 'placeholder', change.currentValue);
                        else this.renderer.removeAttribute(this.getFocusElement(), 'placeholder');
                        break;
                    case 'inputType':
                        this.renderer.setAttribute(this.getFocusElement(), 'type', this.inputType() ?? 'text');
                        break;
                    case 'servoyAttributes':
                        // svyOnInit() -> applyAttributesToFocusElement() already applied the
                        // initial value; skip the redundant re-application on firstChange,
                        // matching the guard the base class uses for the same signal.
                        if (!change.firstChange) {
                            if (change.previousValue) {
                                for (const key of Object.keys(change.previousValue)) {
                                    this.renderer.removeAttribute(this.getFocusElement(), key);
                                }
                            }
                            this.applyAttributesToFocusElement();
                        }
                        break;
                }
            }
        }
        super.svyOnChanges( changes );
    }

    pushUpdate( event: any) {
		const dataProviderID = this.dataProviderID();
        if (event !== dataProviderID) {
			this._dataProviderID.set(event);
        	this.dataProviderIDChange.emit(event);
		} 
    }

    protected attachHandlers() {

        this.attachFocusListeners(this.getFocusElement());
        if ( this.onActionMethodID() ) {
            this.renderer.listen( this.getFocusElement(), 'keydown', e => {
                if (e.keyCode === 13) {
                    this.pushUpdate(this.input()!.nativeElement.value);
                    this.onActionMethodID()!( e );
                }
            });
        }
        if ( this.onRightClickMethodID() ) {
            this.renderer.listen( this.getNativeElement(), 'contextmenu', e => {
                this.onRightClickMethodID()!( e ); return false;
            } );
        }
    }
    
    attachFocusListeners( nativeElement: any ) {
        if ( this.onFocusGainedMethodID() )
            this.renderer.listen( nativeElement, 'focus', ( e ) => {
                if ( this.mustExecuteOnFocus !== false ) {
                    this.onFocusGainedMethodID()!( e );
                }
                this.mustExecuteOnFocus = true;
            } );
        if ( this.onFocusLostMethodID() )
            this.renderer.listen( nativeElement, 'blur', ( e ) => {
                this.onFocusLostMethodID()!( e );
            } );
    }
}

