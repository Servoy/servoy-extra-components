import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraYoutubeVideoEmbedder } from './youtubevideoembedder';

describe('ServoyExtraYoutubeVideoEmbedder', () => {
    let fixture: ComponentFixture<ServoyExtraYoutubeVideoEmbedder>;
    let component: ServoyExtraYoutubeVideoEmbedder;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServoyExtraYoutubeVideoEmbedder],
            imports: [ServoyPublicTestingModule, FormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraYoutubeVideoEmbedder);
        component = fixture.componentInstance;

        fixture.componentRef.setInput('servoyApi', new ServoyApiTesting());
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('styleClass', 'youtube-test');
        fixture.componentRef.setInput('tabSeq', 0);
        fixture.componentRef.setInput('allowFullScreen', false);
        fixture.componentRef.setInput('autoPlay', false);
        fixture.componentRef.setInput('embeddedVideoURL', 'https://www.youtube.com/embed/2xYLTfDQJLw');
        fixture.componentRef.setInput('showControls', true);
        fixture.componentRef.setInput('dataProviderID', null);
        fixture.componentRef.setInput('modestBranding', false);
        fixture.componentRef.setInput('showRelatedVideosAtEnd', false);
        fixture.componentRef.setInput('videoHeight', 0);
        fixture.componentRef.setInput('videoWidth', 0);

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should mount and render the iframe', async () => {
        const iframe = fixture.nativeElement.querySelector('iframe');
        expect(iframe).not.toBeNull();
        expect(iframe.className).toContain('youtube-test');
    });

    it('should show a style class', async () => {
        const iframe = fixture.nativeElement.querySelector('iframe');
        expect(iframe.className).toContain('youtube-test');

        fixture.componentRef.setInput('styleClass', 'mystyleclass');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(iframe.className).toContain('mystyleclass');
    });

    it('should show more than 1 style class', async () => {
        fixture.componentRef.setInput('styleClass', 'classA classB');
        fixture.detectChanges();
        await fixture.whenStable();

        const iframe = fixture.nativeElement.querySelector('iframe');
        expect(iframe.className).toContain('classA');
        expect(iframe.className).toContain('classB');
    });

    it('should not emit dataProviderIDChange on dataprovider change', async () => {
        const iframe = fixture.nativeElement.querySelector('iframe');
        expect(iframe.getAttribute('src')).toContain('2xYLTfDQJLw');

        fixture.componentRef.setInput('dataProviderID', 'https://www.youtube.com/embed/5MJEK-5LPS8');
        fixture.detectChanges();
        await fixture.whenStable();

        expect(iframe.getAttribute('src')).toContain('5MJEK-5LPS8');
    });

    it('should auto play the video', async () => {
        fixture.componentRef.setInput('autoPlay', true);
        fixture.detectChanges();
        await fixture.whenStable();

        const iframe = fixture.nativeElement.querySelector('iframe');
        expect(iframe.getAttribute('src')).toContain('autoplay=1');
    });

    it('should hide controls', async () => {
        const iframe = fixture.nativeElement.querySelector('iframe');
        expect(iframe.getAttribute('src')).not.toContain('controls=0');

        fixture.componentRef.setInput('showControls', false);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(iframe.getAttribute('src')).toContain('controls=0');
    });

    it('should show fullscreen', async () => {
        const iframe = fixture.nativeElement.querySelector('iframe');
        expect(iframe.getAttribute('src')).toContain('fs=0');

        fixture.componentRef.setInput('allowFullScreen', true);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(iframe.getAttribute('src')).not.toContain('fs=0');
    });
});
