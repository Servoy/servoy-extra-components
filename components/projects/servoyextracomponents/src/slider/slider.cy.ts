import { Component, ViewChild } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraSlider } from './slider';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@Component({
    template: `<servoyextra-slider
                [servoyApi]="servoyApi"
                [onDataChangeMethodID]="onDataChangeMethodID"
                [onDataChangeHigh]="onDataChangeHigh"
                [onSlideEnd]="onSlideEnd"
                [onSlideStart]="onSlideStart"
                [autoHideLimitLabels]="autoHideLimitLabels"
                [ceil]="ceil"
                [dataChangeOnSlideEnd]="dataChangeOnSlideEnd"
                [dataProvider]="dataProvider"
                (dataProviderChange)="dataProviderChange($event)"
                [dataProviderHigh]="dataProviderHigh"
                (dataProviderHighChange)="dataProviderHighChange($event)"
                [draggableRange]="draggableRange"
                [draggableRangeOnly]="draggableRangeOnly"
                [enabled]="enabled"
                [enforceRange]="enforceRange"
                [enforceStep]="enforceStep"
                [floor]="floor"
                [formattingFunction]="formattingFunction"
                [getLegendFunction]="getLegendFunction"
                [hideLimitLabels]="hideLimitLabels"
                [hidePointerLabels]="hidePointerLabels"
                [logScale]="logScale"
                [maxLimit]="maxLimit"
                [maxRange]="maxRange"
                [minLimit]="minLimit"
                [minRange]="minRange"
                [noSwitching]="noSwitching"
                [numberFormat]="numberFormat"
                [pointerColorFunction]="pointerColorFunction"
                [precision]="precision"
                [pushRange]="pushRange"
                [rightToLeft]="rightToLeft"
                [selectionBarColorFunction]="selectionBarColorFunction"
                [selectionBarGradient]="selectionBarGradient"
                [showOuterSelectionBars]="showOuterSelectionBars"
                [showSelectionBar]="showSelectionBar"
                [showSelectionBarEnd]="showSelectionBarEnd"
                [showTicks]="showTicks"
                [showTicksValues]="showTicksValues"
                [step]="step"
                [stepsArray]="stepsArray"
                [stepsValueList]="stepsValueList"
                [styleClass]="styleClass"
                [tickColorFunction]="tickColorFunction"
                [ticksArray]="ticksArray"
                [ticksInterval]="ticksInterval"
                [ticksTooltipFunction]="ticksTooltipFunction"
                [ticksValuesInterval]="ticksValuesInterval"
                [ticksValuesTooltipFunction]="ticksValuesTooltipFunction"
                [vertical]="vertical"
                #element>
                </servoyextra-slider>`,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    onDataChangeMethodID: (value: number) => void;
    onDataChangeHigh: (value: number) => void;
    onSlideEnd: (value: number) => void;
    onSlideStart: (value: number) => void;

    autoHideLimitLabels: boolean;
    ceil: number;
    dataChangeOnSlideEnd: boolean;
    dataProvider: any;
    dataProviderChange: (value: number) => {};
    dataProviderHigh: any;
    dataProviderHighChange: (value: number) => {};
    draggableRange: boolean;
    draggableRangeOnly: boolean;
    enabled: boolean;
    enforceRange: boolean;
    enforceStep: boolean;
    floor: number;
    formattingFunction: any;
    getLegendFunction: any;
    hideLimitLabels: boolean;
    hidePointerLabels: boolean;
    logScale: boolean;
    maxLimit: number;
    maxRange: number;
    minLimit: number;
    minRange: number;
    noSwitching: boolean;
    numberFormat: string;
    pointerColorFunction: any;
    precision: number;
    pushRange: boolean;
    rightToLeft: boolean;
    selectionBarColorFunction: any;
    selectionBarGradient: { from: string, to: string };
    showOuterSelectionBars: boolean;
    showSelectionBar: boolean;
    showSelectionBarEnd: boolean;
    showTicks: boolean;
    showTicksValues: boolean;
    step: number;
    stepsArray: number[];
    stepsValueList: any[];
    styleClass: string;
    tickColorFunction: any;
    ticksArray: number[];
    ticksInterval: number;
    ticksTooltipFunction: any;
    ticksValuesInterval: number;
    ticksValuesTooltipFunction: any;
    vertical: boolean;

    @ViewChild('element') element: ServoyExtraSlider;
}

describe('ServoyExtraSlider', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraSlider],
        imports: [ServoyPublicTestingModule, FormsModule, NgxSliderModule]
    }

    beforeEach(() => {
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            autoHideLimitLabels: false,
            ceil: 20,
            dataChangeOnSlideEnd: true,
            dataProvider: 5,
            draggableRange: false,
            draggableRangeOnly: false,
            enabled: true,
            enforceRange: false,
            enforceStep: false,
            floor: 0,
            hideLimitLabels: false,
            hidePointerLabels: false,
            logScale: false,
            maxLimit: 10,
            minLimit: 0,
            noSwitching: false,
            precision: 0,
            pushRange: false,
            rightToLeft: false,
            showOuterSelectionBars: false,
            showSelectionBar: false,
            showSelectionBarEnd: false,
            showTicks: false,
            showTicksValues: false,
            step: 1,
            ticksValuesInterval: 0,
            vertical: false,
        };
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-slider').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });


    it('show a style class', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-slider-container').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass = 'mystyleclass';
                wrapper.fixture.detectChanges();
                cy.get('.svy-slider-container').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        config.componentProperties.styleClass = 'sidenav-test';
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.svy-slider-container').should('have.class', 'sidenav-test').then(() => {
                wrapper.component.styleClass = 'classA classB';
                wrapper.fixture.detectChanges();
                cy.get('.svy-slider-container').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should handle slide event', () => {
        const onSlideStart = cy.stub();
        config.componentProperties.onSlideStart = onSlideStart;
        const onSlideEnd = cy.stub();
        config.componentProperties.onSlideEnd = onSlideEnd;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.ngx-slider-pointer-min').trigger('mousedown').then(() => {
                cy.wrap(onSlideStart).should('be.called');
            });
            cy.get('.ngx-slider-pointer-min').trigger('mousemove', { clientX: 500, clientY: 100 }).trigger('mouseup', { force: true }).then(() => {
                cy.wrap(onSlideEnd).should('be.called');
            });
        });
    });

    it('should emit dataProviderChange event on slide', () => {
        const dataProviderChange = cy.stub();
        config.componentProperties.dataProviderChange = dataProviderChange;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('.ngx-slider-pointer-min').trigger('mousedown').trigger('mousemove', { clientY: 100, clientX: 100 }).trigger('mouseup', { force: true }).then(() => {
                cy.wrap(dataProviderChange).should('have.been.called');
            });
        });
    });

    it('should not emit dataProviderChange event on dataprovider change', () => {
        const dataProviderChange = cy.stub();
        config.componentProperties.dataProviderChange = dataProviderChange;
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('span.ngx-slider-model-value').should('have.text', '5').then(() => {
                wrapper.component.dataProvider = 7;
                wrapper.fixture.detectChanges();
                expect(dataProviderChange).not.to.have.been.called;
            });
        });
    });

    it('should show floor and ceil', () => {
        config.componentProperties.floor = 1;
        config.componentProperties.ceil = 8;
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('span.ngx-slider-floor').should('have.text', '1');
            cy.get('span.ngx-slider-ceil').should('have.text', '8');
        });
    });

    it('should show/hide ticks', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.ngx-slider-tick').should('not.exist').then(() => {
                wrapper.component.showTicks = true;
                wrapper.fixture.detectChanges();
                cy.get('.ngx-slider-tick').should('exist');
            });
        });
    });

    it('should handle disabled state', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('.ngx-slider').should('not.have.attr', 'disabled').then(() => {
                wrapper.component.enabled = false;
                wrapper.fixture.detectChanges();
                cy.get('.ngx-slider').should('have.attr', 'disabled');
            });
        });
    });
});