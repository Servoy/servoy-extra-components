/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraYoutubeVideoEmbedder } from './youtubevideoembedder';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-youtubevideoembedder 
                [servoyApi]="servoyApi()"
                [allowFullScreen]="allowFullScreen()"
                [autoPlay]="autoPlay()"
                [dataProviderID]="dataProviderID()"
                [embeddedVideoURL]="embeddedVideoURL()"
                [modestBranding]="modestBranding()"
                [showControls]="showControls()"
                [showRelatedVideosAtEnd]="showRelatedVideosAtEnd()"
                [styleClass] = "styleClass()"
                [tabSeq] = "tabSeq()"
                [videoHeight]="videoHeight()"
                [videoWidth]="videoWidth()"
                (dataProviderIDChange)="dataProviderIDChange($event)"
                #element>
                </servoyextra-youtubevideoembedder>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined as any);

    allowFullScreen = signal<boolean>(undefined as any);
    autoPlay = signal<boolean>(undefined as any);
    dataProviderID = signal<any>(undefined as any);
    embeddedVideoURL = signal<string>(undefined as any);
    modestBranding = signal<boolean>(undefined as any);
    showControls = signal<boolean>(undefined as any);
    showRelatedVideosAtEnd = signal<boolean>(undefined as any);
    styleClass = signal<string>(undefined as any);
    tabSeq = signal<number>(undefined as any);
    videoHeight = signal<number>(undefined as any);
    videoWidth = signal<number>(undefined as any);

    dataProviderIDChange = () => { };

    @ViewChild('element') element!: ServoyExtraYoutubeVideoEmbedder;
}

const defaultValues: Record<string, any> = {
    styleClass: 'youtube-test',
    tabSeq: 0,
    allowFullScreen: false,
    autoPlay: false,
    embeddedVideoURL: 'https://www.youtube.com/embed/2xYLTfDQJLw',
    showControls: true,
    dataProviderID: null as any,
    modestBranding: false,
    showRelatedVideosAtEnd: false,
    videoHeight: 0,
    videoWidth: 0,
    servoyApi: new ServoyApiTesting(),
    dataProviderIDChange: () => { }
};

function applyDefaultProps(wrapper: any) {
    for (const key in defaultValues) {
        if (wrapper.component[key] && typeof wrapper.component[key].set === 'function') {
            wrapper.component[key].set((defaultValues as any)[key]);
        }
        else {
            wrapper.component[key] = (defaultValues as any)[key];
        }
    }
}

const configWrapper: MountConfig<WrapperComponent> = {
    declarations: [ServoyExtraYoutubeVideoEmbedder],
    imports: [ServoyPublicTestingModule, FormsModule]
};

describe('ServoyExtraYoutubeVideoEmbedder', () => {
    beforeEach(() => {
        defaultValues.styleClass = 'youtube-test';
        defaultValues.tabSeq = 0;
        defaultValues.allowFullScreen = false;
        defaultValues.autoPlay = false;
        defaultValues.embeddedVideoURL = 'https://www.youtube.com/embed/2xYLTfDQJLw';
        defaultValues.showControls = true;
        defaultValues.dataProviderIDChange = () => { };
    });

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.youtube-test').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-youtubevideoembedder iframe').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('servoyextra-youtubevideoembedder iframe').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-youtubevideoembedder iframe').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('servoyextra-youtubevideoembedder iframe').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should not emit dataProviderIDChange event dataprovider change', () => {
        const dataProviderIDChange = cy.stub();
        defaultValues.dataProviderIDChange = dataProviderIDChange;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', '2xYLTfDQJLw').then(() => {
                wrapper.component.dataProviderID.set('https://www.youtube.com/embed/5MJEK-5LPS8');
                expect(dataProviderIDChange).not.to.have.been.called;
                cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', '5MJEK-5LPS8');
            });
        });
    });

    it('should auto play the video', () => {
        defaultValues.autoPlay = true;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', 'autoplay=1');
        });
    });

    it('should hide Controls', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('not.contain', 'controls=0').then(() => {
                wrapper.component.showControls.set(false);
                cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', 'controls=0');
            });
        });
    });

    it('should show fullscreen', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('contain', 'fs=0').then(() => {
                wrapper.component.allowFullScreen.set(true);
                cy.get('servoyextra-youtubevideoembedder iframe').invoke('attr', 'src').should('not.contain', 'fs=0');
            });
        });
    });

});