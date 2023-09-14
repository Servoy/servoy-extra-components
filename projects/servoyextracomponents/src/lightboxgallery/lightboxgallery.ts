import { Component, ChangeDetectorRef, SimpleChanges, Renderer2, Input, ChangeDetectionStrategy } from '@angular/core';
import { ServoyBaseComponent, IFoundset } from '@servoy/public';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';

@Component({
    selector: 'servoyextra-lightboxgallery',
    templateUrl: './lightboxgallery.html',
    styleUrls: ['./lightboxgallery.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraLightboxGallery extends ServoyBaseComponent<HTMLDivElement> {

    @Input() onHoverButtonClicked: (e: Event, imageId: string) => void;

    @Input() imagesFoundset: IFoundset;
    @Input() maxImageWidth: number;
    @Input() maxImageHeight: number;
    @Input() albumLabel: string;
    @Input() fadeDuration: number;
    @Input() fitImagesInViewport: boolean;
    @Input() imageFadeDuration: number;
    @Input() positionFromTop: number;
    @Input() resizeDuration: number;
    @Input() wrapAround: boolean;
    @Input() galleryVisible: boolean;
    @Input() showCaptionInGallery: boolean;
    @Input() showImageNumberLabel: boolean;
    @Input() hoverButtonIcon: string;
    @Input() buttonText: string;
    @Input() buttonStyleClass: string;
    @Input() enabled: boolean;
    @Input() imageBatchSize: number;
    @Input() responsiveHeight: number;

    public images: Array<any> = [];

    private checkNumber: number;
    private nullImages: number;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig) {
        super(renderer, cdRef);
    }

    svyOnInit() {
        super.svyOnInit();
        this._lightboxConfig.albumLabel = this.albumLabel;
        if (this.fadeDuration) {
            this._lightboxConfig.fadeDuration = this.fadeDuration / 1000;
        }
        this._lightboxConfig.fitImageInViewPort = this.fitImagesInViewport;
        this._lightboxConfig.positionFromTop = this.positionFromTop;
        if (this.resizeDuration) {
            this._lightboxConfig.resizeDuration = this.resizeDuration / 1000;
        }
        this._lightboxConfig.wrapAround = this.wrapAround;
        this._lightboxConfig.showImageNumberLabel = this.showImageNumberLabel;
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

    onScroll() {
 		if (Math.abs(this.elementRef.nativeElement.scrollHeight - this.elementRef.nativeElement.clientHeight - this.elementRef.nativeElement.scrollTop) < 1) {
 			if (this.imagesFoundset.serverSize > this.imagesFoundset.viewPort.size) {
				 this.imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize);
			 }
 		}
	}

	loadMoreData() {
		if (this.maxImageHeight || this.maxImageWidth) {
			if (this.imagesFoundset.serverSize > this.imagesFoundset.viewPort.size) {
				if (!(this.elementRef.nativeElement.clientHeight < this.elementRef.nativeElement.scrollHeight)) {
					this.imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize);
				}
			}
		}
	}

    open(index: number): void {
        if ((this.images && this.images.length - 1 <= index) && this.imagesFoundset.serverSize > this.imagesFoundset.viewPort.size) {
			this.imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize).then(() => {
				this.open(index);
			});
		} else {
			if (this.images && this.images.length - 1 >= index) {
				// open lightbox
				this._lightbox.open(this.images, index);
        		if (this.imagesFoundset.serverSize > this.imagesFoundset.viewPort.size) {
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
		let totalImages: string = (this.imagesFoundset.serverSize - this.nullImages).toString();
		if (this.imagesFoundset.hasMoreRows) {
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
			this.imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize).then(()=>{
				document.querySelector('.lb-next').removeEventListener('click', this.handleClick);
				this.close();
				this.open(openAt);
			});
		}
		this.updateTotalImages(1);
	}

	getStyle = () => {
		const style = { };
		if (this.maxImageWidth) {
			if (this.maxImageWidth === -1) {
				style['maxWidth'] = 'none';
			} else {
				style['maxWidth'] = this.maxImageWidth + 'px';
			}
		}
		if (this.maxImageHeight) {
			if (this.maxImageHeight === -1) {
				style['height'] = 'auto';
			} else {
				style['maxHeight'] = this.maxImageHeight + 'px';
			}
		}
		return style;
	}

	getCaptionStyle = () => {
		const style = { };
		if (this.maxImageWidth) {
			if (this.maxImageWidth === -1) {
				style['maxWidth'] = 'none';
			} else {
				style['maxWidth'] = this.maxImageWidth + 'px';
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
            if (this.responsiveHeight) {
                this.elementRef.nativeElement.style.height = this.responsiveHeight + 'px';
            } else {
                this.elementRef.nativeElement.style.height = '100%';
            }
        }
    }

    private createImages = () => {
        this.images = [];
        if (this.imagesFoundset) {
			if (this.imageBatchSize > 5 && this.imagesFoundset.serverSize > this.imagesFoundset.viewPort.size && this.imageBatchSize > this.imagesFoundset.viewPort.size){
				this.imagesFoundset.loadExtraRecordsAsync(this.imageBatchSize - 5);
			}
			this.nullImages = 0;
            for (const row of this.imagesFoundset.viewPort.rows) {
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
        }

    };
}

