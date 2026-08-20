import { Component, SimpleChanges, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { ServoyBaseComponent, ServoyPublicModule } from '@servoy/public';

@Component( {
    selector: 'servoyextra-imagelabel',
    templateUrl: './imagelabel.html',
    styleUrls: ['./imagelabel.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ServoyPublicModule]
} )
export class ServoyExtraImageLabel extends ServoyBaseComponent<HTMLImageElement> {

    readonly onActionMethodID = input<((e: Event) => void) | undefined>(undefined);
    readonly onRightClickMethodID = input<((e: Event) => void) | undefined>(undefined);

    readonly enabled = input<boolean>(undefined as any);
    readonly styleClass = input<string>(undefined as any);
    readonly tabSeq = input<number>(undefined as any);
    readonly media = input<any>(undefined as any);
    readonly centerImage = input<boolean>(undefined as any);

    readonly imageURL = signal('servoyextra/imagelabel/empty.gif');

    designerURL = 'servoyextra/imagelabel/label.png';
    

    svyOnInit() {
        super.svyOnInit();
        this.attachHandlers();
        if (this.servoyApi().isInDesigner()){
            this.imageURL.set(this.designerURL);
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
                    case 'centerImage':
						this.renderer.removeClass(this.getNativeElement(), 'svy-extra-imagelabel-center');
						if (change.currentValue && !this.servoyApi().isInDesigner()) {
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
        if (!this.servoyApi().isInDesigner()){
            this.imageURL.set(media);
        }
    }

    protected attachHandlers() {
        if ( this.onActionMethodID() ) {
            this.renderer.listen( this.getNativeElement(), 'click', e => this.onActionMethodID()!( e ) );
        }
        if ( this.onRightClickMethodID() ) {
            this.renderer.listen( this.getNativeElement(), 'contextmenu', e => {
                this.onRightClickMethodID()!( e ); return false;
            } );
        }
    }
}

