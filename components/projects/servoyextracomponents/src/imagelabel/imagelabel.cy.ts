/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraImageLabel } from './imagelabel';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-imagelabel 
                [servoyApi]="servoyApi"
                [onActionMethodID]="onActionMethodID"   
                [onRightClickMethodID]="onRightClickMethodID"
                [centerImage]="centerImage"
                [enabled]="enabled"
                [media]="media"
                [styleClass]="styleClass"
                [tabSeq]="tabSeq"
                #element>
                </servoyextra-imagelabel>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onActionMethodID: (e: Event, data?: unknown) => void;
    onRightClickMethodID: (e: Event, data?: unknown) => void;

    centerImage: boolean;
    enabled: boolean;
    media: any;
    styleClass: string;
    tabSeq: number;

    @ViewChild('element') element: ServoyExtraImageLabel;
}

describe('ServoyExtraImageLabel', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraImageLabel],
        imports: [ServoyPublicTestingModule, FormsModule]
    }

    beforeEach(() => {
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            styleClass: 'imagelabel-test',
            enabled: true,
            centerImage: true,
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.imagelabel-test').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-imagelabel').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-imagelabel').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-imagelabel').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-imagelabel').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should set centerImage class when centerImage is true', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-imagelabel').should('have.class', 'svy-extra-imagelabel-center').then(() => {
                wrapper.component.centerImage = false;
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-imagelabel').should('not.have.class', 'svy-extra-imagelabel-center');
            });
        });
    });

    it('should handle enabled state', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-imagelabel').should('not.have.attr', 'disabled').then(() => {
                wrapper.component.enabled = false;
                wrapper.fixture.detectChanges();
                cy.get('.svy-extra-imagelabel').should('have.attr', 'disabled');
            });
        });
    });

    it('should handle media changes', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-extra-imagelabel').should('exist').then(() => {
                wrapper.component.media = 'https://picsum.photos/200/300';
                wrapper.fixture.detectChanges();
                cy.get('img').should('exist').then(() => {
                    cy.get('img').should('have.attr', 'src', 'https://picsum.photos/200/300');
                });
            });
        });
    });

    it('should handle click events', () => {
        const onActionMethodID = cy.stub();
        config.componentProperties.onActionMethodID = onActionMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-extra-imagelabel')
                .should('exist')
                .click({ force: true })
                .then(() => {
                    cy.wrap(onActionMethodID).should('be.called');
                });
        });
    });

    it('should handle right-click events', () => {
        config.componentProperties.media = 'https://picsum.photos/200/300';
        const onRightClickMethodID = cy.stub();
        config.componentProperties.onRightClickMethodID = onRightClickMethodID;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.svy-extra-imagelabel')
                .should('be.visible')
                .should('have.attr', 'src', 'https://picsum.photos/200/300')
                .wait(1000)
                .trigger('contextmenu', { force: true })
                .then(() => {
                    cy.wrap(onRightClickMethodID).should('be.called');
                });
        });
    });
});