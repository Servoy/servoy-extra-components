import { ChangeDetectionStrategy, Component, SimpleChanges, inject, input } from '@angular/core';
import { ServoyBaseComponent, ServoyPublicModule } from '@servoy/public';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'servoyextra-youtubevideoembedder',
    templateUrl: './youtubevideoembedder.html',
    styleUrls: ['./youtubevideoembedder.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ServoyPublicModule]
})
export class ServoyExtraYoutubeVideoEmbedder extends ServoyBaseComponent<HTMLIFrameElement> {

    readonly enabled = input<boolean>(undefined as any);
    readonly styleClass = input<string>(undefined as any);
    readonly tabSeq = input<number>(undefined as any);
    readonly videoWidth = input<number>(undefined as any);
    readonly videoHeight = input<number>(undefined as any);
    readonly allowFullScreen = input<boolean>(undefined as any);
    readonly autoPlay = input<boolean>(undefined as any);
    readonly showControls = input<boolean>(undefined as any);
    readonly modestBranding = input<boolean>(undefined as any);
    readonly showRelatedVideosAtEnd = input<boolean>(undefined as any);

    readonly embeddedVideoURL = input<string>(undefined as any);
    readonly dataProviderID = input<string>(undefined as any);

    private sanitizer = inject(DomSanitizer);
    public fullYoutubeURL: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl('');

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                switch (property) {
                    case 'embeddedVideoURL':
                    case 'dataProviderID':
                    case 'allowFullScreen':
                    case 'autoPlay':
                    case 'showControls':
                    case 'modestBranding':
                    case 'showRelatedVideosAtEnd':
                        this.updateYoutubeURL();
                        break;
                }
            }
        }
        super.svyOnChanges(changes);
    }

    private updateYoutubeURL() {
        let urlWithParams = this.dataProviderID() || this.embeddedVideoURL();
        if (!urlWithParams) return;
        let params = '';

        // in these if's we rely on YouTube defaults as well; we only set them when non-default
        if (!this.allowFullScreen()) params += '&fs=0';
        if (!this.showControls()) params += '&controls=0';
        if (this.modestBranding()) params += '&modestbranding=1';
        if (this.autoPlay()) params += '&autoplay=1&mute=1'; // autoplay requires mute
        if (!this.showRelatedVideosAtEnd()) params += '&rel=0';

        if (params.length > 0) urlWithParams += '?' + params.substr(1);
        this.fullYoutubeURL = this.sanitizer.bypassSecurityTrustResourceUrl(urlWithParams);
    }

}

