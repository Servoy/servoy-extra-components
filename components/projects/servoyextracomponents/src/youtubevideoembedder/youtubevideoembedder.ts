import { Component, SimpleChanges, Renderer2, ChangeDetectorRef, input } from '@angular/core';
import { ServoyBaseComponent } from '@servoy/public';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'servoyextra-youtubevideoembedder',
    templateUrl: './youtubevideoembedder.html',
    styleUrls: ['./youtubevideoembedder.css'],
    standalone: false
})
export class ServoyExtraYoutubeVideoEmbedder extends ServoyBaseComponent<HTMLIFrameElement> {

    readonly enabled = input<boolean>(undefined);
    readonly styleClass = input<string>(undefined);
    readonly tabSeq = input<number>(undefined);
    readonly videoWidth = input<number>(undefined);
    readonly videoHeight = input<number>(undefined);
    readonly allowFullScreen = input<boolean>(undefined);
    readonly autoPlay = input<boolean>(undefined);
    readonly showControls = input<boolean>(undefined);
    readonly modestBranding = input<boolean>(undefined);
    readonly showRelatedVideosAtEnd = input<boolean>(undefined);

    readonly embeddedVideoURL = input<string>(undefined);
    readonly dataProviderID = input<string>(undefined);

    public fullYoutubeURL: SafeResourceUrl;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private sanitizer: DomSanitizer) {
        super(renderer, cdRef);
         this.fullYoutubeURL = this.sanitizer.bypassSecurityTrustResourceUrl('');
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case "embeddedVideoURL":
                    case "dataProviderID":
                    case "allowFullScreen":
                    case "autoPlay":
                    case "showControls":
                    case "modestBranding":
                    case "showRelatedVideosAtEnd":
                        this.updateYoutubeURL();
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
        super.svyOnChanges(changes);
    }

    private updateYoutubeURL() {
        let urlWithParams = this.dataProviderID() || this.embeddedVideoURL();
        if (!urlWithParams) return;
        let params = "";

        // in these if's we rely on YouTube defaults as well; we only set them when non-default
        if (!this.allowFullScreen()) params += "&fs=0";
        if (!this.showControls()) params += "&controls=0";
        if (this.modestBranding()) params += "&modestbranding=1";
        if (this.autoPlay()) params += "&autoplay=1&mute=1"; // autoplay requires mute
        if (!this.showRelatedVideosAtEnd()) params += "&rel=0";

        if (params.length > 0) urlWithParams += "?" + params.substr(1);
        this.fullYoutubeURL = this.sanitizer.bypassSecurityTrustResourceUrl(urlWithParams);
    }

}

