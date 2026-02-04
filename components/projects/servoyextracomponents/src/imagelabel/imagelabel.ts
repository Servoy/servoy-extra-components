import { Component, SimpleChanges, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy, input } from '@angular/core';
import { ServoyBaseComponent } from '@servoy/public';

@Component( {
    selector: 'servoyextra-imagelabel',
    templateUrl: './imagelabel.html',
    styleUrls: ['./imagelabel.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
} )
export class ServoyExtraImageLabel extends ServoyBaseComponent<HTMLImageElement> {

    readonly onActionMethodID = input<(e: Event) => void>(undefined);
    readonly onRightClickMethodID = input<(e: Event) => void>(undefined);

    readonly enabled = input<boolean>(undefined);
    readonly styleClass = input<string>(undefined);
    readonly tabSeq = input<number>(undefined);
    readonly media = input<any>(undefined);
    readonly centerImage = input<boolean>(undefined);

    imageURL = 'servoyextra/imagelabel/empty.gif';

    designerURL = 'servoyextra/imagelabel/label.png';
    
    constructor( renderer: Renderer2, cdRef: ChangeDetectorRef) {
        super( renderer, cdRef );
    }

    svyOnInit() {
        super.svyOnInit();
        this.attachHandlers();
        if (this.servoyApi.isInDesigner()){
            this.imageURL = this.designerURL;
        }
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
                    case 'media':
                        this.updateImageURL( change.currentValue );
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
                    case 'centerImage':
						this.renderer.removeClass(this.getNativeElement(), 'svy-extra-imagelabel-center');
						if (change.currentValue && !this.servoyApi.isInDesigner()) {
							this.renderer.addClass(this.getNativeElement(), 'svy-extra-imagelabel-center');
						}
                }
            }
        }
        super.svyOnChanges( changes );
    }

    getFocusElement(): any {
        return this.getNativeElement();
    }

    private updateImageURL( media: any ) {
        if (!this.servoyApi.isInDesigner()){
            this.imageURL = media;
        }
    }

    protected attachHandlers() {
        if ( this.onActionMethodID() ) {
            this.renderer.listen( this.getNativeElement(), 'click', e => this.onActionMethodID()( e ) );
        }
        if ( this.onRightClickMethodID() ) {
            this.renderer.listen( this.getNativeElement(), 'contextmenu', e => {
                this.onRightClickMethodID()( e ); return false;
            } );
        }
    }
}

