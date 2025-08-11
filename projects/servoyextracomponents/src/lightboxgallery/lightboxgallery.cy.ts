import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraLightboxGallery, Image } from './lightboxgallery';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { LightboxModule } from '@servoy/ngx-lightbox';

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
                [onHoverButtonClicked]="onHoverButtonClicked"
                #element>
                </servoyextra-lightboxgallery>`,
                styleUrls: ['../../../../node_modules/@servoy/ngx-lightbox/lightbox.css'],
                encapsulation: ViewEncapsulation.None,
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
        imports: [ServoyPublicTestingModule, FormsModule,LightboxModule],
    };

    const images = [];
    const image1 = new Image();
    image1.imageUrl = 'https://cdn.pixabay.com/photo/2014/03/06/13/08/tester-280809_1280.jpg';
    image1.thumbnailUrl = 'https://cdn.pixabay.com/photo/2014/03/06/13/08/tester-280809_1280.jpg';
    image1.caption = 'Image 1';
    image1.id = '1';
    images.push(image1);

    const image2 = new Image();
    image2.imageUrl = 'https://cdn.pixabay.com/photo/2023/01/20/05/23/checklist-7730756_1280.jpg';
    image2.thumbnailUrl = 'https://cdn.pixabay.com/photo/2023/01/20/05/23/checklist-7730756_1280.jpg';
    image2.caption = 'Image 2';
    image2.id = '2';
    images.push(image2);

    beforeEach(() => {
    // Set a custom viewport for all tests in this describe block
        cy.viewport(800, 800); // Width, Height
        

        config.componentProperties = {
            servoyApi: servoyApiSpy,
            enabled: true,
            maxImageWidth: 200,
            maxImageHeight: 200,
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
                cy.get(':nth-child(1) > .svyextra-lightboxgallery-image-container > .svyextra-lightboxgallery-thumbnail').should('have.attr', 'src', image1.imageUrl);
                cy.get(':nth-child(2) > .svyextra-lightboxgallery-image-container > .svyextra-lightboxgallery-thumbnail').should('have.attr', 'src', image2.imageUrl);
                cy.get(':nth-child(1) > .svyextra-lightboxgallery-image-caption').should('contain', 'Image 1');
                cy.get(':nth-child(2) > .svyextra-lightboxgallery-image-caption').should('contain', 'Image 2');
            });
        });
    });

        it('click should open the image', () => {
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-lightboxgallery').should('exist').then(() => {
                cy.get(':nth-child(1) > .svyextra-lightboxgallery-image-container > .svyextra-lightboxgallery-thumbnail').click()
                cy.get('#image').should('have.attr', 'src', image1.imageUrl).then(() => {
                    cy.get('.lb-caption').should('contain', 'Image 1');
                    cy.get('.lb-number').should('contain', 'Image 1 of 2');
                    cy.get('.lb-next').click();
                    cy.get('#image').should('have.attr', 'src', image2.imageUrl);
                    cy.get('.lb-caption').should('contain', 'Image 2');
                    cy.get('.lb-number').should('contain', 'Image 2 of 2');
                    cy.get('.lb-close').click();
                     cy.get('#image').should('not.exist');
                })

            });
        });
    });
    
    it('should button be visible and clicking on the button should open the lightbox', () => {
        config.componentProperties.galleryVisible = false;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-lightboxgallery').should('exist').then(() => {
                cy.get(':nth-child(1) > .svyextra-lightboxgallery-image-container > .svyextra-lightboxgallery-thumbnail').should('not.exist');
                cy.get('.svyextra-lightboxgallery-button').should('exist').invoke('text').should('eq', ' View ');
                cy.get('.svyextra-lightboxgallery-button').click();
                cy.get('#image').should('have.attr', 'src', image1.imageUrl).then(() => {
                    cy.get('.lb-caption').should('contain', 'Image 1');
                    cy.get('.lb-number').should('contain', 'Image 1 of 2');
                    cy.get('.lb-next').click();
                    cy.get('#image').should('have.attr', 'src', image2.imageUrl);
                    cy.get('.lb-caption').should('contain', 'Image 2');
                    cy.get('.lb-number').should('contain', 'Image 2 of 2');
                    cy.get('.lb-close').click();
                    cy.get('#image').should('not.exist');
                })

            });
        });
    });

    it('should handle onHoverButtonClicked', () => {
        const onHoverButtonClicked = cy.stub();
        config.componentProperties.onHoverButtonClicked = onHoverButtonClicked;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svyextra-lightboxgallery-image-delete')
                .should('exist')
                .first()
                .click({ force: true })
                .then(() => {
                    cy.wrap(onHoverButtonClicked).should('be.called');
                });
        });
    });
});