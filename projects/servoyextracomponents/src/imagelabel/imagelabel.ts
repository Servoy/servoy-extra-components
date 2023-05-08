import { Component, SimpleChanges, Input, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ServoyBaseComponent } from '@servoy/public';

@Component( {
    selector: 'servoyextra-imagelabel',
    templateUrl: './imagelabel.html',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ServoyExtraImageLabel extends ServoyBaseComponent<HTMLImageElement> {

    @Input() onActionMethodID: ( e: Event ) => void;
    @Input() onRightClickMethodID: ( e: Event ) => void;

    @Input() enabled: boolean;
    @Input() styleClass: string;
    @Input() tabSeq: number;
    @Input() media: any;

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
        if ( this.onActionMethodID ) {
            this.renderer.listen( this.getNativeElement(), 'click', e => this.onActionMethodID( e ) );
        }
        if ( this.onRightClickMethodID ) {
            this.renderer.listen( this.getNativeElement(), 'contextmenu', e => {
                this.onRightClickMethodID( e ); return false;
            } );
        }
    }
}

