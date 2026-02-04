import { Component, ViewChild, ViewEncapsulation, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraLightboxGallery, Image } from './lightboxgallery';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { LightboxModule } from '@servoy/ngx-lightbox';

@Component({
    template: `<servoyextra-lightboxgallery
                [servoyApi]="servoyApi()"
                [albumLabel]="albumLabel()"
                [buttonStyleClass]="buttonStyleClass()"
                [buttonText]="buttonText()"
                [enabled]="enabled()"
                [fadeDuration]="fadeDuration()"
                [fitImagesInViewport]="fitImagesInViewport()"
                [galleryVisible]="galleryVisible()"
                [hoverButtonIcon]="hoverButtonIcon()"
                [imageBatchSize]="imageBatchSize()"
                [imageFadeDuration]="imageFadeDuration()"
                [imagesDataset]="imagesDataset()"
                [imagesFoundset]="imagesFoundset()"
                [maxImageHeight]="maxImageHeight()"
                [maxImageWidth]="maxImageWidth()"
                [positionFromTop]="positionFromTop()"
                [resizeDuration]="resizeDuration()"
                [responsiveHeight]="responsiveHeight()"
                [showCaptionInGallery]="showCaptionInGallery()"
                [showImageNumberLabel]="showImageNumberLabel()"
                [wrapAround]="wrapAround()"
                [onHoverButtonClicked]="onHoverButtonClicked"
                #element>
                </servoyextra-lightboxgallery>`,
    styleUrls: ['../../../../node_modules/@servoy/ngx-lightbox/lightbox.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onHoverButtonClicked = () => { };

    albumLabel = signal<string>(undefined);
    buttonStyleClass = signal<string>(undefined);
    buttonText = signal<string>(undefined);
    enabled = signal<boolean>(undefined);
    fadeDuration = signal<number>(undefined);
    fitImagesInViewport = signal<boolean>(undefined);
    galleryVisible = signal<boolean>(undefined);
    hoverButtonIcon = signal<string>(undefined);
    imageBatchSize = signal<number>(undefined);
    imageFadeDuration = signal<number>(undefined);
    imagesDataset = signal<Image[]>(undefined);
    imagesFoundset = signal<any>(undefined);
    maxImageHeight = signal<number>(undefined);
    maxImageWidth = signal<number>(undefined);
    positionFromTop = signal<number>(undefined);
    resizeDuration = signal<number>(undefined);
    responsiveHeight = signal<number>(undefined);
    showCaptionInGallery = signal<boolean>(undefined);
    showImageNumberLabel = signal<boolean>(undefined);
    wrapAround = signal<boolean>(undefined);

    @ViewChild('element') element: ServoyExtraLightboxGallery;
}

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

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
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
    imagesDataset: images,
    onHoverButtonClicked: undefined
};

function applyDefaultProps(wrapper) {
    for (const key in defaultValues) {
        if (wrapper.component[key] && typeof wrapper.component[key].set === 'function') {
            wrapper.component[key].set(defaultValues[key]);
        }
        else {
            wrapper.component[key] = defaultValues[key];
        }
    }
}

const configWrapper: MountConfig<WrapperComponent> = {
    declarations: [ServoyExtraLightboxGallery],
    imports: [ServoyPublicTestingModule, FormsModule, LightboxModule]
};

describe('ServoyExtraLightboxGallery', () => {

    beforeEach(() => {
        cy.viewport(800, 800);
    });

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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
        cy.on('uncaught:exception', (err) => {
            if (err.message.includes('NG0100') || err.message.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
                return false;
            }
            return false;
        });
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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
                });
            });
        });
    });

    it('should button be visible and clicking on the button should open the lightbox', () => {
        cy.on('uncaught:exception', (err) => {
            if (err.message.includes('NG0100') || err.message.includes('ExpressionChangedAfterItHasBeenCheckedError')) {
                return false;
            }
            return false;
        });
        defaultValues.galleryVisible = false;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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
                    cy.get('.lb-close').click({ force: true }).then(() => { cy.get('#image').should('not.exist'); });
                });
            });
        });
    });

    it('should handle onHoverButtonClicked', () => {
        const onHoverButtonClicked = cy.stub();
        defaultValues.onHoverButtonClicked = onHoverButtonClicked;
        defaultValues.galleryVisible = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.svyextra-lightboxgallery-image-container')
                .should('exist')
                .first()
                .trigger('mouseenter')
                .then(() => {
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
});