/*import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraLightboxGallery, Image } from './lightboxgallery';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-lightboxgallery
                [servoyApi]="servoyApi"
                [albumLabel]="albumLabel"
                [buttonStyleClass]="buttonStyleClass"
                [buttonText]="buttonText"
                [enabled]="enabled"
                [fadeDuration]="fadeDuration"
                [fitImagesInViewport]="fitImagesInViewport"
                [galleryVisible]="galleryVisible"
                [hoverButtonIcon]="hoverButtonIcon"
                [imageBatchSize]="imageBatchSize"
                [imageFadeDuration]="imageFadeDuration"
                [imagesDataset]="imagesDataset"
                [imagesFoundset]="imagesFoundset"
                [maxImageHeight]="maxImageHeight"
                [maxImageWidth]="maxImageWidth"
                [positionFromTop]="positionFromTop"
                [resizeDuration]="resizeDuration"
                [responsiveHeight]="responsiveHeight"
                [showCaptionInGallery]="showCaptionInGallery"
                [showImageNumberLabel]="showImageNumberLabel"
                [wrapAround]="wrapAround"
                (onHoverButtonClicked)="onHoverButtonClicked($event, $event.imageId)"
                #element>
                </servoyextra-lightboxgallery>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;
    
    onHoverButtonClicked: (e: Event, imageId: string) => void;
    
    albumLabel: string;
    buttonStyleClass: string;
    buttonText: string;
    enabled: boolean;
    fadeDuration: number;
    fitImagesInViewport: boolean;
    galleryVisible: boolean;
    hoverButtonIcon: string;
    imageBatchSize: number;
    imageFadeDuration: number;
    imagesDataset: Image[];
    imagesFoundset: any;
    maxImageHeight: number;
    maxImageWidth: number;
    positionFromTop: number;
    resizeDuration: number;
    responsiveHeight: number;
    showCaptionInGallery: boolean;
    showImageNumberLabel: boolean;
    wrapAround: boolean;
    
    @ViewChild('element') element: ServoyExtraLightboxGallery;
}

describe('ServoyExtraLightboxGallery', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraLightboxGallery],
        imports: [ServoyPublicTestingModule, FormsModule]
    };

    beforeEach(() => {
        const images = [];
        const image1 = new Image();
        image1.imageUrl = 'https://picsum.photos/id/1';
        image1.thumbnailUrl = 'https://picsum.photos/id/1';
        image1.caption = 'Image 1';
        image1.id = '1';
        images.push(image1);

        const image2 = new Image();
        image2.imageUrl = 'https://picsum.photos/id/2';
        image2.thumbnailUrl = 'https://picsum.photos/id/2';
        image2.caption = 'Image 2';
        image2.id = '2';
        images.push(image2);

        config.componentProperties = {
            servoyApi: servoyApiSpy,
            enabled: true,
            maxImageWidth: 800,
            maxImageHeight: 600,
            albumLabel: 'Image %1 of %2',
            fadeDuration: 500,
            fitImagesInViewport: true,
            imageFadeDuration: 500,
            positionFromTop: 50,
            resizeDuration: 500,
            wrapAround: true,
            galleryVisible: true,
            showCaptionInGallery: true,
            showImageNumberLabel: true,
            hoverButtonIcon: 'fa fa-search',
            buttonText: 'View',
            buttonStyleClass: 'btn-primary',
            imageBatchSize: 10,
            responsiveHeight: 400,
            imagesDataset: images
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-lightboxgallery').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });
});*/