import { Component, ChangeDetectorRef, SimpleChanges, Renderer2, ChangeDetectionStrategy, HostListener, input } from '@angular/core';
import { ServoyBaseComponent, IFoundset, BaseCustomObject } from '@servoy/public';
import { Lightbox, LightboxConfig } from '@servoy/ngx-lightbox';

@Component({
    selector: 'servoyextra-lightboxgallery',
    templateUrl: './lightboxgallery.html',
    styleUrls: ['./lightboxgallery.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ServoyExtraLightboxGallery extends ServoyBaseComponent<HTMLDivElement> {

    readonly onHoverButtonClicked = input<(e: Event, imageId: string) => void>(undefined);

    readonly imagesFoundset = input<IFoundset>(undefined);
    readonly maxImageWidth = input<number>(undefined);
    readonly maxImageHeight = input<number>(undefined);
    readonly albumLabel = input<string>(undefined);
    readonly fadeDuration = input<number>(undefined);
    readonly fitImagesInViewport = input<boolean>(undefined);
    readonly imageFadeDuration = input<number>(undefined);
    readonly positionFromTop = input<number>(undefined);
    readonly resizeDuration = input<number>(undefined);
    readonly wrapAround = input<boolean>(undefined);
    readonly galleryVisible = input<boolean>(undefined);
    readonly showCaptionInGallery = input<boolean>(undefined);
    readonly showImageNumberLabel = input<boolean>(undefined);
    readonly hoverButtonIcon = input<string>(undefined);
    readonly buttonText = input<string>(undefined);
    readonly buttonStyleClass = input<string>(undefined);
    readonly enabled = input<boolean>(undefined);
    readonly imageBatchSize = input<number>(undefined);
    readonly responsiveHeight = input<number>(undefined);
    readonly imagesDataset = input<Array<Image>>(undefined);

    public images: Array<any> = [];

    private checkNumber: number;
    private nullImages: number;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig) {
        super(renderer, cdRef);
    }

    svyOnInit() {
        super.svyOnInit();
		setTimeout(() => {
			this.loadMoreData();
		}, 50);
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            if (changes.imagesFoundset) {
                this.createImages();
                this.loadMoreData();
            }
            if (changes.responsiveHeight) {
				this.setHeight();
			}
        }
        super.svyOnChanges(changes);
    }
	
	@HostListener('document:keydown', ['$event'])
		onKeyDown(event: KeyboardEvent) {
			if (event.code === 'ArrowRight') {
				if (document.querySelector('.fadeIn.lightbox')) {
					const nextBtn: HTMLElement = document.querySelector('.fadeIn.lightbox').querySelector('.lb-next');
					if (nextBtn) nextBtn.click();
				}
			} else if (event.code === 'ArrowLeft') {
				if (document.querySelector('.fadeIn.lightbox')) {
					const prevBtn: HTMLElement = document.querySelector('.fadeIn.lightbox').querySelector('.lb-prev');
					if (prevBtn) prevBtn.click();
				}
			}
		}

    onScroll() {
		if (Math.abs(this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight - this.elementRef.nativeElement.scrollTop) < 1) {
			const imagesFoundset = this.imagesFoundset();
            if (imagesFoundset && imagesFoundset.serverSize > imagesFoundset.viewPort.size) {
				imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize());
			}
		}
	}

	loadMoreData() {
		if (this.maxImageHeight() || this.maxImageWidth()) {
			const imagesFoundset = this.imagesFoundset();
            if (imagesFoundset && imagesFoundset.serverSize > imagesFoundset.viewPort.size) {
				if (!(this.elementRef.nativeElement.clientHeight < this.elementRef.nativeElement.scrollHeight)) {
					imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize());
				}
			}
		}
	}

    open(index: number): void {
        const imagesFoundset = this.imagesFoundset();
        if (imagesFoundset && (this.images && this.images.length - 1 <= index) && imagesFoundset.serverSize > imagesFoundset.viewPort.size) {
			imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize()).then(() => {
				this.open(index);
			});
		} else {
			if (this.images && this.images.length - 1 >= index) {
				// open lightbox
				this._lightboxConfig.albumLabel = this.albumLabel();
				this._lightboxConfig.fitImageInViewPort = this.fitImagesInViewport();
				this._lightboxConfig.positionFromTop = this.positionFromTop();
				this._lightboxConfig.wrapAround = this.wrapAround();
				this._lightboxConfig.showImageNumberLabel = this.showImageNumberLabel();
				this._lightboxConfig.disableKeyboardNav = true;
				const fadeDuration = this.fadeDuration();
                if (fadeDuration) this._lightboxConfig.fadeDuration = fadeDuration / 1000;
				const resizeDuration = this.resizeDuration();
                if (resizeDuration) this._lightboxConfig.resizeDuration = resizeDuration / 1000;

				this._lightbox.open(this.images, index);
				if (imagesFoundset && imagesFoundset.serverSize > imagesFoundset.viewPort.size) {
					const interval = setInterval(() => {
						if (document.querySelector('.fadeIn.lightbox')) {
							document.querySelector('.fadeIn.lightbox').querySelector('.lb-next').addEventListener('click', this.handleClick);
							document.querySelector('.fadeIn.lightbox').querySelector('.lb-prev').addEventListener('click', () => {
								this.updateTotalImages(-1);
							});
							setTimeout(()=>{
								this.updateTotalImages(0);
							}, 1000);
							clearInterval(interval);
						}
					}, 50);
				}
			} else {
				console.warn(`Cannot load the image with index ${index}`);
			}
		}
    }

    updateTotalImages(page: number) {
		let totalImages: string = (this.imagesFoundset().serverSize - this.nullImages).toString();
		if (this.imagesFoundset().hasMoreRows) {
			totalImages += '+';
		}
		const arr = document.querySelector('.lb-number').textContent.split(' ');
		arr[arr.length-1] = totalImages;
		if (page === -1) {
			// eslint-disable-next-line radix
			arr[1] = (parseInt(arr[1]) - 1).toString();
		} else if (page === 1) {
			// eslint-disable-next-line radix
			arr[1] = (parseInt(arr[1]) + 1).toString();
		}
		if (document.querySelector('.lb-number').textContent.length > 0) {
			document.querySelector('.lb-number').textContent = arr.join(' ');
		}
	}

    handleClick = () => {
		const currentImage = parseInt(document.querySelector('.lb-number').textContent.split(' ')[1], 10);
		if((currentImage + this.nullImages) === this.checkNumber){
			const openAt = currentImage;
			this.imagesFoundset().loadExtraRecordsAsync(this.imageBatchSize()).then(()=>{
				document.querySelector('.lb-next').removeEventListener('click', this.handleClick);
				this.close();
				this.open(openAt);
			});
		}
		this.updateTotalImages(1);
	}

	getStyle = () => {
		const style = { };
		const maxImageWidth = this.maxImageWidth();
        if (maxImageWidth) {
			if (maxImageWidth === -1) {
				style['maxWidth'] = 'none';
			} else {
				style['maxWidth'] = maxImageWidth + 'px';
			}
		}
		const maxImageHeight = this.maxImageHeight();
        if (maxImageHeight) {
			if (maxImageHeight === -1) {
				style['height'] = 'auto';
			} else {
				style['maxHeight'] = maxImageHeight + 'px';
			}
		}
		return style;
	}

	getCaptionStyle = () => {
		const style = { };
		const maxImageWidth = this.maxImageWidth();
        if (maxImageWidth) {
			if (maxImageWidth === -1) {
				style['maxWidth'] = 'none';
			} else {
				style['maxWidth'] = maxImageWidth + 'px';
			}
		}
		return style;
	}

    close(): void {
        // close lightbox programmatically
        this._lightbox.close();
    }

    showLightbox(index: number): void {
        this.open(index >= 0 ? index : 0);
    }

    refresh(): void {
        this.svyOnInit();
    }

    setHeight() {
        if (!this.servoyApi.isInAbsoluteLayout()) {
            const responsiveHeight = this.responsiveHeight();
            if (responsiveHeight) {
                this.elementRef.nativeElement.style.height = responsiveHeight + 'px';
            } else {
                this.elementRef.nativeElement.style.height = '100%';
            }
        }
    }

    private createImages = () => {
        this.images = [];
        const imagesFoundset = this.imagesFoundset();
        const imagesDataset = this.imagesDataset();
        if (imagesFoundset) {
			if (this.imageBatchSize() > 5 && imagesFoundset.serverSize > imagesFoundset.viewPort.size && this.imageBatchSize() > imagesFoundset.viewPort.size){
				imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize() - 5);
			}
			this.nullImages = 0;
            for (const row of imagesFoundset.viewPort.rows) {
                const image = {
                    src: row.image && row.image.url ? row.image.url : null,
                    caption: row.caption ? row.caption : null,
                    thumb: row.thumbnail && row.thumbnail.url ? row.thumbnail.url : null,
                    imageId: row.imageId
                };

                if (!row.image) this.nullImages += 1;

                //check if using url strings instead of media/blob
                image.src = typeof row.image == 'string' ? row.image : image.src;
                image.thumb = typeof row.thumbnail == 'string' ? row.thumbnail : image.thumb;

                if (!image.src) continue;
                this.images.push(image);
            }
            this.checkNumber = this.images.length + this.nullImages - 1;
        } else if (imagesDataset?.length) {
            for (const { imageUrl, caption, thumbnailUrl, id } of imagesDataset) {
                this.images.push({
                    src: imageUrl ?? null,
                    caption: caption ?? null,
                    thumb: thumbnailUrl ?? null,
                    imageId: id ?? null
                });
            }
        }
    };
}

export class Image extends BaseCustomObject {
    public imageUrl: string;
    public caption: string;
    public thumbnailUrl: string;
    public id: string;
}
