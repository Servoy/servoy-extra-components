import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';

vi.mock('@servoy/ngx-lightbox', () => {
    class MockLightbox {
 open = vi.fn(); close = vi.fn(); 
}
    class MockLightboxConfig {}
    class MockLightboxModule {}
    return { Lightbox: MockLightbox, LightboxConfig: MockLightboxConfig, LightboxModule: MockLightboxModule };
});

import { Lightbox, LightboxConfig } from '@servoy/ngx-lightbox';
import { ServoyExtraLightboxGallery, Image } from './lightboxgallery';

const createImages = (): Image[] => {
    const image1 = new Image();
    image1.imageUrl = 'https://cdn.pixabay.com/photo/2014/03/06/13/08/tester-280809_1280.jpg';
    image1.thumbnailUrl = 'https://cdn.pixabay.com/photo/2014/03/06/13/08/tester-280809_1280.jpg';
    image1.caption = 'Image 1';
    image1.id = '1';

    const image2 = new Image();
    image2.imageUrl = 'https://cdn.pixabay.com/photo/2023/01/20/05/23/checklist-7730756_1280.jpg';
    image2.thumbnailUrl = 'https://cdn.pixabay.com/photo/2023/01/20/05/23/checklist-7730756_1280.jpg';
    image2.caption = 'Image 2';
    image2.id = '2';

    return [image1, image2];
};

describe('ServoyExtraLightboxGallery', () => {
    let fixture: ComponentFixture<ServoyExtraLightboxGallery>;
    let component: ServoyExtraLightboxGallery;
    let servoyApi: ServoyApiTesting;
    let images: Image[];

    beforeEach(async () => {
        images = createImages();
        servoyApi = new ServoyApiTesting();

        await TestBed.configureTestingModule({
            imports: [ServoyPublicTestingModule, FormsModule, ServoyExtraLightboxGallery],
            providers: [
                { provide: Lightbox, useValue: { open: vi.fn(), close: vi.fn() } },
                { provide: LightboxConfig, useValue: {} }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ServoyExtraLightboxGallery);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('servoyApi', servoyApi);
        fixture.componentRef.setInput('enabled', true);
        fixture.componentRef.setInput('maxImageWidth', 200);
        fixture.componentRef.setInput('maxImageHeight', 200);
        fixture.componentRef.setInput('albumLabel', 'Image %1 of %2');
        fixture.componentRef.setInput('fadeDuration', 500);
        fixture.componentRef.setInput('fitImagesInViewport', true);
        fixture.componentRef.setInput('imageFadeDuration', 500);
        fixture.componentRef.setInput('positionFromTop', 50);
        fixture.componentRef.setInput('resizeDuration', 500);
        fixture.componentRef.setInput('wrapAround', true);
        fixture.componentRef.setInput('galleryVisible', true);
        fixture.componentRef.setInput('showCaptionInGallery', true);
        fixture.componentRef.setInput('showImageNumberLabel', true);
        fixture.componentRef.setInput('hoverButtonIcon', 'fa fa-search');
        fixture.componentRef.setInput('buttonText', 'View');
        fixture.componentRef.setInput('buttonStyleClass', 'btn-primary');
        fixture.componentRef.setInput('imageBatchSize', 10);
        fixture.componentRef.setInput('responsiveHeight', 400);
        fixture.componentRef.setInput('imagesDataset', images);
        fixture.detectChanges();
        await fixture.whenStable();
    });

    function populateImages() {
        (component as any).createImages();
        (component as any).cdRef.markForCheck();
        fixture.detectChanges();
    }

    it('should mount and register the component', async () => {
        expect(component).toBeTruthy();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.svyextra-lightboxgallery')).not.toBeNull();
    });

    it('should create images from imagesDataset', async () => {
        populateImages();
        await fixture.whenStable();

        expect(component.images().length).toBe(2);
        expect(component.images()[0].src).toBe(images[0].imageUrl);
        expect(component.images()[1].src).toBe(images[1].imageUrl);
        expect(component.images()[0].thumb).toBe(images[0].thumbnailUrl);
        expect(component.images()[1].thumb).toBe(images[1].thumbnailUrl);
        expect(component.images()[0].caption).toBe('Image 1');
        expect(component.images()[1].caption).toBe('Image 2');
        expect(component.images()[0].imageId).toBe('1');
        expect(component.images()[1].imageId).toBe('2');
    });

    it('should show gallery when galleryVisible is true', async () => {
        const el: HTMLElement = fixture.nativeElement;
        const gallery = el.querySelector('.svyextra-lightboxgallery');
        expect(gallery).not.toBeNull();
    });

    it('should show button when galleryVisible is false', async () => {
        fixture.componentRef.setInput('galleryVisible', false);
        fixture.detectChanges();
        await fixture.whenStable();

        const el: HTMLElement = fixture.nativeElement;
        const button = el.querySelector('.svyextra-lightboxgallery-button');
        expect(button).not.toBeNull();
        expect(button!.textContent!.trim()).toBe('View');
    });

    it('should not show thumbnails when galleryVisible is false', async () => {
        fixture.componentRef.setInput('galleryVisible', false);
        fixture.detectChanges();
        await fixture.whenStable();

        const el: HTMLElement = fixture.nativeElement;
        const thumbs = el.querySelectorAll('.svyextra-lightboxgallery-thumbnail');
        expect(thumbs.length).toBe(0);
    });

    it('should show captions in gallery when showCaptionInGallery is true', async () => {
        populateImages();
        fixture.detectChanges();
        await fixture.whenStable();

        const el: HTMLElement = fixture.nativeElement;
        const captions = el.querySelectorAll('.svyextra-lightboxgallery-image-caption');
        expect(captions.length).toBe(2);
        expect(captions[0].textContent).toContain('Image 1');
        expect(captions[1].textContent).toContain('Image 2');
    });

    it('should call onHoverButtonClicked handler when hover button is clicked', async () => {
        const hoverSpy = vi.fn();
        fixture.componentRef.setInput('onHoverButtonClicked', hoverSpy);
        populateImages();
        await fixture.whenStable();

        const el: HTMLElement = fixture.nativeElement;
        const deleteBtn = el.querySelector('.svyextra-lightboxgallery-image-delete') as HTMLElement;
        expect(deleteBtn).not.toBeNull();
        deleteBtn.click();
        expect(hoverSpy).toHaveBeenCalled();
    });

    it('should apply maxImageWidth style', async () => {
        const style = component.getStyle();
        expect(style['maxWidth']).toBe('200px');
    });

    it('should apply maxImageHeight style', async () => {
        const style = component.getStyle();
        expect(style['maxHeight']).toBe('200px');
    });

    it('should set maxWidth to none when maxImageWidth is -1', async () => {
        fixture.componentRef.setInput('maxImageWidth', -1);
        fixture.detectChanges();
        await fixture.whenStable();

        const style = component.getStyle();
        expect(style['maxWidth']).toBe('none');
    });

    it('should set height to auto when maxImageHeight is -1', async () => {
        fixture.componentRef.setInput('maxImageHeight', -1);
        fixture.detectChanges();
        await fixture.whenStable();

        const style = component.getStyle();
        expect(style['height']).toBe('auto');
    });

    it('should call showLightbox with correct index', async () => {
        populateImages();
        await fixture.whenStable();

        const openSpy = vi.spyOn(component, 'open');
        component.showLightbox(1);
        expect(openSpy).toHaveBeenCalledWith(1);
    });

    it('should call showLightbox with 0 for negative index', async () => {
        populateImages();
        await fixture.whenStable();

        const openSpy = vi.spyOn(component, 'open');
        component.showLightbox(-1);
        expect(openSpy).toHaveBeenCalledWith(0);
    });

    it('should render thumbnails with correct src', async () => {
        populateImages();
        fixture.detectChanges();
        await fixture.whenStable();

        const el: HTMLElement = fixture.nativeElement;
        const thumbs = el.querySelectorAll('.svyextra-lightboxgallery-thumbnail') as NodeListOf<HTMLImageElement>;
        expect(thumbs.length).toBe(2);
        expect(thumbs[0].src).toBe(images[0].thumbnailUrl);
        expect(thumbs[1].src).toBe(images[1].thumbnailUrl);
    });

    it('should getCaptionStyle respect maxImageWidth', async () => {
        const style = component.getCaptionStyle();
        expect(style['maxWidth']).toBe('200px');
    });

    it('should getCaptionStyle set maxWidth to none when -1', async () => {
        fixture.componentRef.setInput('maxImageWidth', -1);
        fixture.detectChanges();
        await fixture.whenStable();

        const style = component.getCaptionStyle();
        expect(style['maxWidth']).toBe('none');
    });

    it('should update images signal when imagesDataset changes', async () => {
        populateImages();
        await fixture.whenStable();
        expect(component.images().length).toBe(2);

        fixture.componentRef.setInput('imagesDataset', [
            { imageUrl: 'new1.jpg', caption: 'New 1', thumbnailUrl: 'thumb1.jpg', id: '10' }
        ]);
        fixture.detectChanges();
        (component as any).createImages();
        (component as any).cdRef.markForCheck();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.images().length).toBe(1);
        expect(component.images()[0].src).toBe('new1.jpg');
    });
});
