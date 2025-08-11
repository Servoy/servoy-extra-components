/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraYoutubeVideoEmbedder } from './youtubevideoembedder';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-youtubevideoembedder 
                [servoyApi]="servoyApi"
                [allowFullScreen]="allowFullScreen"
                [autoPlay]="autoPlay"
                [dataProviderID]="dataProviderID"
                [embeddedVideoURL]="embeddedVideoURL"
                [modestBranding]="modestBranding"
                [showControls]="showControls"
                [showRelatedVideosAtEnd]="showRelatedVideosAtEnd"
                [styleClass] = "styleClass"
                [tabSeq] = "tabSeq"
                [videoHeight]="videoHeight"
                [videoWidth]="videoWidth"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                #element>
                </servoyextra-youtubevideoembedder>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    allowFullScreen: boolean;
    autoPlay: boolean;
    dataProviderID: any;
    embeddedVideoURL: string;
    modestBranding: boolean;
    showControls: boolean;
    showRelatedVideosAtEnd: boolean;
    styleClass: string;
    tabSeq: number;
    videoHeight: number;
    videoWidth: number;

    dataProviderIDChange = (newData: any) => { };

    @ViewChild('element') element: ServoyExtraYoutubeVideoEmbedder;
}

describe('ServoyExtraYoutubeVideoEmbedder', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraYoutubeVideoEmbedder],
        imports: [ServoyPublicTestingModule, FormsModule]
    }

    beforeEach(() => {
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            styleClass: 'youtube-test',
            tabSeq: 0,
            allowFullScreen: false,
            autoPlay: false,
            embeddedVideoURL: 'https://www.youtube.com/embed/2xYLTfDQJLw',
            showControls: true,
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.youtube-test').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-youtubevideoembedder iframe').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('servoyextra-youtubevideoembedder iframe').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-youtubevideoembedder iframe').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('servoyextra-youtubevideoembedder iframe').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should not emit dataProviderIDChange event dataprovider change', () => {
        const dataProviderIDChange = cy.stub();
        config.componentProperties.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', '2xYLTfDQJLw').then(() => {
                wrapper.component.dataProviderID = 'https://www.youtube.com/embed/5MJEK-5LPS8';
                wrapper.fixture.detectChanges();
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', '5MJEK-5LPS8');
            });
        });
    });

    it('should auto play the video', () => {
        config.componentProperties.autoPlay = true;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', 'autoplay=1');
        });
    });

    it('should hide Controls', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('not.contain', 'controls=0').then(() => {
                wrapper.component.showControls = false;
                wrapper.fixture.detectChanges();
                cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', 'controls=0');
            });
        });
    });

    it('should show fullscreen', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-youtubevideoembedder').should('have.attr', 'ng-reflect-allow-full-screen', 'false').then(() => {
                wrapper.component.allowFullScreen = true;
                wrapper.fixture.detectChanges();
                cy.get('servoyextra-youtubevideoembedder').should('have.attr', 'ng-reflect-allow-full-screen', 'true');
            });
        });
    });

});