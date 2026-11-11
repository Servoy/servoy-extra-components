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
    class MockLightboxEvent {}
    class MockLightboxWindowRef {}
    class MockLightboxModule {}
    return { Lightbox: MockLightbox, LightboxConfig: MockLightboxConfig, LightboxEvent: MockLightboxEvent, LightboxWindowRef: MockLightboxWindowRef, LightboxModule: MockLightboxModule };
});

import { Lightbox, LightboxConfig } from '@servoy/ngx-lightbox';
import { ServoyExtraLightboxGallery, Image } from './lightboxgallery';

const createImages = (): Image[] => {
    const image1 = {
        imageUrl: 'https://cdn.pixabay.com/photo/2014/03/06/13/08/tester-280809_1280.jpg',
        thumbnailUrl: 'https://cdn.pixabay.com/photo/2014/03/06/13/08/tester-280809_1280.jpg',
        caption: 'Image 1',
        id: '1'
    } as Image;

    const image2 = {
        imageUrl: 'https://cdn.pixabay.com/photo/2023/01/20/05/23/checklist-7730756_1280.jpg',
        thumbnailUrl: 'https://cdn.pixabay.com/photo/2023/01/20/05/23/checklist-7730756_1280.jpg',
        caption: 'Image 2',
        id: '2'
    } as Image;

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

    it('should return a valid native element from getNativeElement()', () => {
        expect(component.getNativeElement()).not.toBeNull();
        expect(component.getNativeElement()).toBeInstanceOf(HTMLElement);
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

    function makeImagesFoundset(serverSize = 4, viewSize = 2) {
        const rows: any[] = [];
        for (let i = 0; i < viewSize; i++) {
            rows.push({ image: { url: 'img' + i + '.jpg' }, thumbnail: { url: 'thumb' + i + '.jpg' }, caption: 'cap' + i, imageId: 'id' + i });
        }
        return {
            serverSize,
            hasMoreRows: false,
            viewPort: { startIndex: 0, size: viewSize, rows },
            loadExtraRecordsAsync: vi.fn().mockResolvedValue(undefined)
        } as any;
    }

    it('createImages builds images from a foundset viewport', () => {
        const fs = makeImagesFoundset(2, 2);
        fixture.componentRef.setInput('imagesFoundset', fs);
        fixture.detectChanges();
        (component as any).createImages();
        expect(component.images().length).toBe(2);
        expect(component.images()[0].src).toBe('img0.jpg');
        expect(component.images()[0].thumb).toBe('thumb0.jpg');
        expect(component.images()[0].caption).toBe('cap0');
    });

    it('createImages skips rows without an image and counts null images', () => {
        const fs = makeImagesFoundset(3, 3);
        fs.viewPort.rows[1].image = null;
        fixture.componentRef.setInput('imagesFoundset', fs);
        fixture.detectChanges();
        (component as any).createImages();
        // one row had no image, so only 2 remain
        expect(component.images().length).toBe(2);
    });

    it('onScroll loads more records when scrolled to the bottom and more are available', () => {
        const fs = makeImagesFoundset(10, 2);
        fixture.componentRef.setInput('imagesFoundset', fs);
        fixture.componentRef.setInput('imageBatchSize', 5);
        fixture.detectChanges();
        const native = component['elementRef']()!.nativeElement as HTMLElement;
        Object.defineProperty(native, 'scrollHeight', { value: 100, configurable: true });
        Object.defineProperty(native, 'clientHeight', { value: 50, configurable: true });
        Object.defineProperty(native, 'scrollTop', { value: 50, configurable: true });
        component.onScroll();
        expect(fs.loadExtraRecordsAsync).toHaveBeenCalledWith(5);
    });

    it('open warns when the requested index does not exist', () => {
        const fs = makeImagesFoundset(2, 2);
        fixture.componentRef.setInput('imagesFoundset', fs);
        fixture.detectChanges();
        (component as any).createImages();
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => { /* noop */ });
        component.open(99);
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it('open opens the lightbox for a valid index', () => {
        const fs = makeImagesFoundset(2, 2);
        fixture.componentRef.setInput('imagesFoundset', fs);
        fixture.detectChanges();
        (component as any).createImages();
        const openSpy = vi.spyOn((component as any)._lightbox, 'open');
        component.open(0);
        expect(openSpy).toHaveBeenCalled();
    });

    it('close delegates to the lightbox', () => {
        const closeSpy = vi.spyOn((component as any)._lightbox, 'close');
        component.close();
        expect(closeSpy).toHaveBeenCalled();
    });

    it('setHeight applies the responsive height in responsive layout', () => {
        const api: any = component.servoyApi();
        vi.spyOn(api, 'isInAbsoluteLayout').mockReturnValue(false);
        fixture.componentRef.setInput('responsiveHeight', 333);
        fixture.detectChanges();
        component.setHeight();
        expect(component['elementRef']()!.nativeElement.style.height).toBe('333px');
    });

    it('setHeight applies 100% when no responsive height is set', () => {
        const api: any = component.servoyApi();
        vi.spyOn(api, 'isInAbsoluteLayout').mockReturnValue(false);
        fixture.componentRef.setInput('responsiveHeight', 0);
        fixture.detectChanges();
        component.setHeight();
        expect(component['elementRef']()!.nativeElement.style.height).toBe('100%');
    });

    it('onKeyDown clicks the next button when the lightbox is open', () => {
        const lb = document.createElement('div');
        lb.className = 'fadeIn lightbox';
        const next = document.createElement('a');
        next.className = 'lb-next';
        const clickSpy = vi.fn();
        next.addEventListener('click', clickSpy);
        lb.appendChild(next);
        document.body.appendChild(lb);
        component.onKeyDown(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
        expect(clickSpy).toHaveBeenCalled();
        document.body.removeChild(lb);
    });

    it('onKeyDown clicks the prev button on ArrowLeft', () => {
        const lb = document.createElement('div');
        lb.className = 'fadeIn lightbox';
        const prev = document.createElement('a');
        prev.className = 'lb-prev';
        const clickSpy = vi.fn();
        prev.addEventListener('click', clickSpy);
        lb.appendChild(prev);
        document.body.appendChild(lb);
        component.onKeyDown(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
        expect(clickSpy).toHaveBeenCalled();
        document.body.removeChild(lb);
    });

    it('refresh re-runs svyOnInit', () => {
        const spy = vi.spyOn(component, 'svyOnInit');
        component.refresh();
        expect(spy).toHaveBeenCalled();
    });

    it('loadMoreData requests more records when the content fits and more exist', () => {
        const fs = makeImagesFoundset(10, 2);
        fixture.componentRef.setInput('imagesFoundset', fs);
        fixture.componentRef.setInput('imageBatchSize', 5);
        fixture.componentRef.setInput('maxImageHeight', 100);
        fixture.detectChanges();
        const native = component['elementRef']()!.nativeElement as HTMLElement;
        Object.defineProperty(native, 'clientHeight', { value: 100, configurable: true });
        Object.defineProperty(native, 'scrollHeight', { value: 100, configurable: true });
        component.loadMoreData();
        expect(fs.loadExtraRecordsAsync).toHaveBeenCalledWith(5);
    });

});
