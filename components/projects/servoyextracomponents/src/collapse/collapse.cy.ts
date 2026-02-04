/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraCollapse, Collapsible } from './collapse';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
    template: `<servoyextra-collapse 
                [servoyApi]="servoyApi()"
                [onCardClicked]="onCardClicked"
                [onCollapsibleHidden]="onCollapsibleHidden"
                [onCollapsibleShown]="onCollapsibleShown"
                [onHeaderClicked]="onHeaderClicked"
                [onHeaderDoubleClicked]="onHeaderDoubleClicked"
                [accordionMode]="accordionMode()"
                [collapsibles]="collapsibles()"
                [expandedIndices]="expandedIndices()"
                [styleClass]="styleClass()"
                [tabSeq]="tabSeq()"
                #element>
                </servoyextra-collapse>`,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    onCardClicked = () => { };
    onCollapsibleHidden = () => { };
    onCollapsibleShown = () => { };
    onHeaderClicked = () => { };
    onHeaderDoubleClicked = () => { };

    accordionMode = signal<boolean>(undefined);
    collapsibles = signal<Collapsible[]>(undefined);
    expandedIndices = signal<number[]>(undefined);
    styleClass = signal<string>(undefined);
    tabSeq = signal<number>(undefined);

    @ViewChild('element') element: ServoyExtraCollapse;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    accordionMode: true,
    collapsibles: [] as Collapsible[],
    expandedIndices: undefined,
    styleClass: undefined,
    tabSeq: undefined,
    onCardClicked: undefined,
    onCollapsibleHidden: undefined,
    onCollapsibleShown: undefined,
    onHeaderClicked: undefined,
    onHeaderDoubleClicked: undefined
};

function createDefaultCollapsibles(): Collapsible[] {
    const collapsibles = [
        new Collapsible(),
        new Collapsible()
    ];

    collapsibles[0].collapsibleId = '1';
    collapsibles[0].isCollapsed = false;
    collapsibles[0].headerHtml = 'Header 1';
    collapsibles[0].headerStyleClass = 'header-class';
    collapsibles[0].bodyStyleClass = 'body-class';
    collapsibles[0].collapsibleHtml = 'Content 1';
    collapsibles[0].form = 'form1';
    collapsibles[0].relationName = 'relation1';
    collapsibles[0].cards = [];
    collapsibles[0].styleClass = 'card-class';
    collapsibles[0].collapsedIconName = 'collapsed-icon';
    collapsibles[0].expandedIconName = 'expanded-icon';
    collapsibles[0].iconLocation = 'RIGHT';
    collapsibles[0].minResponsiveHeight = 100;
    collapsibles[0].maxResponsiveHeight = 200;

    collapsibles[1].collapsibleId = '2';
    collapsibles[1].isCollapsed = true;
    collapsibles[1].headerHtml = 'Header 2';
    collapsibles[1].headerStyleClass = 'header-class';
    collapsibles[1].bodyStyleClass = 'body-class';
    collapsibles[1].collapsibleHtml = 'Content 2';
    collapsibles[1].form = 'form2';
    collapsibles[1].relationName = 'relation2';
    collapsibles[1].cards = [];
    collapsibles[1].styleClass = 'card-class';
    collapsibles[1].collapsedIconName = 'collapsed-icon';
    collapsibles[1].expandedIconName = 'expanded-icon';
    collapsibles[1].iconLocation = 'RIGHT';
    collapsibles[1].minResponsiveHeight = 100;
    collapsibles[1].maxResponsiveHeight = 200;

    return collapsibles;
}

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
    declarations: [ServoyExtraCollapse],
    imports: [ServoyPublicTestingModule, FormsModule, NgbCollapse]
};

describe('ServoyExtraCollapse', () => {
    beforeEach(() => {
        defaultValues.collapsibles = createDefaultCollapsibles();
    });

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.svy-collapse').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-collapse').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.svy-collapse').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        defaultValues.styleClass = 'mystyleclass';
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-collapse').should('have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('.svy-collapse').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('accordion mode enabled', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('div').contains('Content 1').should('exist');
            cy.get('div').contains('Content 2').should('not.exist');
            cy.get('div').contains('Header 2').click().then(() => {
                cy.get('div').contains('Content 1').should('not.exist');
                cy.get('div').contains('Content 2').should('exist');
            });
        });
    });

    it('accordion mode disabled', () => {
        defaultValues.accordionMode = false;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('div').contains('Content 1').should('exist');
            cy.get('div').contains('Content 2').should('not.exist');
            cy.get('div').contains('Header 2').click().then(() => {
                cy.get('div').contains('Content 1').should('exist');
                cy.get('div').contains('Content 2').should('exist');
            });
        });
    });

    it('should handle card click event', () => {
        const onCardClicked = cy.stub();
        defaultValues.onCardClicked = onCardClicked;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('div').contains('Content 1').click().then(() => {
                cy.wrap(onCardClicked).should('be.called');
            });
        });
    });

    it('should handle collapse hidden event', () => {
        const onCollapsibleHidden = cy.stub();
        defaultValues.onCollapsibleHidden = onCollapsibleHidden;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('div').contains('Header 1').click().then(() => {
                cy.wrap(onCollapsibleHidden).should('be.called');
            });
        });
    });

    it('should handle collapse shown event', () => {
        const onCollapsibleShown = cy.stub();
        defaultValues.onCollapsibleShown = onCollapsibleShown;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('div').contains('Header 2').click().then(() => {
                cy.wrap(onCollapsibleShown).should('be.called');
            });
        });
    });

    it('should handle header click event', () => {
        const onHeaderClicked = cy.stub().returns(Promise.resolve(true));
        defaultValues.onHeaderClicked = onHeaderClicked;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('div').contains('Header 1').click().then(() => {
                cy.wrap(onHeaderClicked).should('be.called');
            });
        });
    });

    it('should handle header dblclick event', () => {
        const onHeaderDoubleClicked = cy.stub().returns(Promise.resolve(true));
        defaultValues.onHeaderDoubleClicked = onHeaderDoubleClicked;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('div').contains('Header 1').dblclick().then(() => {
                cy.wrap(onHeaderDoubleClicked).should('be.called');
            });
        });
    });
});