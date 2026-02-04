/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraImageLabel } from './imagelabel';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';

@Component({
    template: `<servoyextra-imagelabel 
                [servoyApi]="servoyApi()"
                [onActionMethodID]="onActionMethodID"   
                [onRightClickMethodID]="onRightClickMethodID"
                [centerImage]="centerImage()"
                [enabled]="enabled()"
                [media]="media()"
                [styleClass]="styleClass()"
                [tabSeq]="tabSeq()"
                #element>
                </servoyextra-imagelabel>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onActionMethodID = () => { };
    onRightClickMethodID = () => { };

    centerImage = signal<boolean>(undefined);
    enabled = signal<boolean>(undefined);
    media = signal<any>(undefined);
    styleClass = signal<string>(undefined);
    tabSeq = signal<number>(undefined);

    @ViewChild('element') element: ServoyExtraImageLabel;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    styleClass: undefined,
    enabled: true,
    centerImage: true,
    media: undefined,
    tabSeq: undefined,
    onActionMethodID: undefined,
    onRightClickMethodID: undefined
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
    declarations: [ServoyExtraImageLabel],
    imports: [ServoyPublicTestingModule, FormsModule]
};

describe('ServoyExtraImageLabel', () => {

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        defaultValues.styleClass = 'imagelabel-test';
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.imagelabel-test').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-imagelabel').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.svy-extra-imagelabel').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-imagelabel').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('.svy-extra-imagelabel').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should set centerImage class when centerImage is true', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-imagelabel').should('have.class', 'svy-extra-imagelabel-center').then(() => {
                wrapper.component.centerImage.set(false);
                cy.get('.svy-extra-imagelabel').should('not.have.class', 'svy-extra-imagelabel-center');
            });
        });
    });

    it('should handle enabled state', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-imagelabel').should('not.have.attr', 'disabled').then(() => {
                wrapper.component.enabled.set(false);
                cy.get('.svy-extra-imagelabel').should('have.attr', 'disabled');
            });
        });
    });

    it('should handle media changes', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-imagelabel').should('exist').then(() => {
                wrapper.component.media.set('https://picsum.photos/200/300');
                cy.get('img').should('exist').then(() => {
                    cy.get('img').should('have.attr', 'src', 'https://picsum.photos/200/300');
                });
            });
        });
    });

    it('should handle click events', () => {
        const onActionMethodID = cy.stub();
        defaultValues.onActionMethodID = onActionMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.svy-extra-imagelabel')
                .should('exist')
                .wait(1000)
                .click({ force: true })
                .then(() => {
                    cy.wrap(onActionMethodID).should('be.called');
                });
        });
    });

    it('should handle right-click events', () => {
        defaultValues.media = 'https://picsum.photos/200/300';
        const onRightClickMethodID = cy.stub();
        defaultValues.onRightClickMethodID = onRightClickMethodID;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
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