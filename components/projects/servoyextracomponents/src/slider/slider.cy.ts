import { Component, ViewChild, signal } from '@angular/core';
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
                [autoHideLimitLabels]="autoHideLimitLabels()"
                [ceil]="ceil()"
                [dataChangeOnSlideEnd]="dataChangeOnSlideEnd()"
                [dataProvider]="dataProvider()"
                (dataProviderChange)="dataProviderChange($event)"
                [dataProviderHigh]="dataProviderHigh()"
                (dataProviderHighChange)="dataProviderHighChange($event)"
                [draggableRange]="draggableRange()"
                [draggableRangeOnly]="draggableRangeOnly()"
                [enabled]="enabled()"
                [enforceRange]="enforceRange()"
                [enforceStep]="enforceStep()"
                [floor]="floor()"
                [formattingFunction]="formattingFunction()"
                [getLegendFunction]="getLegendFunction()"
                [hideLimitLabels]="hideLimitLabels()"
                [hidePointerLabels]="hidePointerLabels()"
                [logScale]="logScale()"
                [maxLimit]="maxLimit()"
                [maxRange]="maxRange()"
                [minLimit]="minLimit()"
                [minRange]="minRange()"
                [noSwitching]="noSwitching()"
                [numberFormat]="numberFormat()"
                [pointerColorFunction]="pointerColorFunction()"
                [precision]="precision()"
                [pushRange]="pushRange()"
                [rightToLeft]="rightToLeft()"
                [selectionBarColorFunction]="selectionBarColorFunction()"
                [selectionBarGradient]="selectionBarGradient()"
                [showOuterSelectionBars]="showOuterSelectionBars()"
                [showSelectionBar]="showSelectionBar()"
                [showSelectionBarEnd]="showSelectionBarEnd()"
                [showTicks]="showTicks()"
                [showTicksValues]="showTicksValues()"
                [step]="step()"
                [stepsArray]="stepsArray()"
                [stepsValueList]="stepsValueList()"
                [styleClass]="styleClass()"
                [tickColorFunction]="tickColorFunction()"
                [ticksArray]="ticksArray()"
                [ticksInterval]="ticksInterval()"
                [ticksTooltipFunction]="ticksTooltipFunction()"
                [ticksValuesInterval]="ticksValuesInterval()"
                [ticksValuesTooltipFunction]="ticksValuesTooltipFunction()"
                [vertical]="vertical()"
                #element>
                </servoyextra-slider>`,
    standalone: false
})
class WrapperComponent {
    servoyApi!: ServoyApi;

    onDataChangeMethodID!: (value: number) => void;
    onDataChangeHigh!: (value: number) => void;
    onSlideEnd!: (value: number) => void;
    onSlideStart!: (value: number) => void;

    autoHideLimitLabels = signal<boolean>(undefined as any);
    ceil = signal<number>(undefined as any);
    dataChangeOnSlideEnd = signal<boolean>(undefined as any);
    dataProvider = signal<any>(undefined as any);
    dataProviderChange!: (value: number) => void;
    dataProviderHigh = signal<any>(undefined as any);
    dataProviderHighChange!: (value: number) => void;
    draggableRange = signal<boolean>(undefined as any);
    draggableRangeOnly = signal<boolean>(undefined as any);
    enabled = signal<boolean>(undefined as any);
    enforceRange = signal<boolean>(undefined as any);
    enforceStep = signal<boolean>(undefined as any);
    floor = signal<number>(undefined as any);
    formattingFunction = signal<any>(undefined as any);
    getLegendFunction = signal<any>(undefined as any);
    hideLimitLabels = signal<boolean>(undefined as any);
    hidePointerLabels = signal<boolean>(undefined as any);
    logScale = signal<boolean>(undefined as any);
    maxLimit = signal<number>(undefined as any);
    maxRange = signal<number>(undefined as any);
    minLimit = signal<number>(undefined as any);
    minRange = signal<number>(undefined as any);
    noSwitching = signal<boolean>(undefined as any);
    numberFormat = signal<string>(undefined as any);
    pointerColorFunction = signal<any>(undefined as any);
    precision = signal<number>(undefined as any);
    pushRange = signal<boolean>(undefined as any);
    rightToLeft = signal<boolean>(undefined as any);
    selectionBarColorFunction = signal<any>(undefined as any);
    selectionBarGradient = signal<{ from: string, to: string }>(undefined as any);
    showOuterSelectionBars = signal<boolean>(undefined as any);
    showSelectionBar = signal<boolean>(undefined as any);
    showSelectionBarEnd = signal<boolean>(undefined as any);
    showTicks = signal<boolean>(undefined as any);
    showTicksValues = signal<boolean>(undefined as any);
    step = signal<number>(undefined as any);
    stepsArray = signal<number[]>(undefined as any);
    stepsValueList = signal<any[]>(undefined as any);
    styleClass = signal<string>(undefined as any);
    tickColorFunction = signal<any>(undefined as any);
    ticksArray = signal<number[]>(undefined as any);
    ticksInterval = signal<number>(undefined as any);
    ticksTooltipFunction = signal<any>(undefined as any);
    ticksValuesInterval = signal<number>(undefined as any);
    ticksValuesTooltipFunction = signal<any>(undefined as any);
    vertical = signal<boolean>(undefined as any);

    @ViewChild('element') element!: ServoyExtraSlider;
}

const defaultValues: Record<string, any> = {
    servoyApi: new ServoyApiTesting(),
    autoHideLimitLabels: false,
    ceil: 20,
    dataChangeOnSlideEnd: true,
    dataProvider: 5,
    dataProviderChange: () => { },
    dataProviderHigh: undefined,
    dataProviderHighChange: () => { },
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
    onDataChangeMethodID: () => { },
    onDataChangeHigh: () => { },
    onSlideEnd: () => { },
    onSlideStart: () => { }
};

function applyDefaultProps(wrapper: any) {
    for (const key in defaultValues) {
        if (wrapper.component.hasOwnProperty(key) && typeof wrapper.component[key] === 'function') {
            wrapper.component[key].set((defaultValues as any)[key]);
        }
        else {
            wrapper.component[key] = (defaultValues as any)[key];
        }
    }
}

const configWrapper: MountConfig<WrapperComponent> = {
    declarations: [ServoyExtraSlider],
    imports: [ServoyPublicTestingModule, FormsModule, NgxSliderModule]
};

describe('ServoyExtraSlider', () => {

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-slider').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });


    it('show a style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.svy-slider-container').should('not.have.class', 'mystyleclass').then(() => {
                wrapper.component.styleClass.set('mystyleclass');
                cy.get('.svy-slider-container').should('have.class', 'mystyleclass');
            });
        });
    });

    it('show more then 1 style class', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            wrapper.component.styleClass.set('sidenav-test');
            applyDefaultProps(wrapper);
            cy.get('.svy-slider-container').should('have.class', 'sidenav-test').then(() => {
                wrapper.component.styleClass.set('classA classB');
                cy.get('.svy-slider-container').should('have.class', 'classA').should('have.class', 'classB');
            });
        });
    });

    it('should handle slide event', () => {
        const onSlideStart = cy.stub();
        const onSlideEnd = cy.stub();
        defaultValues.onSlideStart = onSlideStart;
        defaultValues.onSlideEnd = onSlideEnd;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.ngx-slider-pointer-min').trigger('pointerdown').then(() => {
                cy.wrap(onSlideStart).should('be.called');
            });
            cy.get('.ngx-slider-pointer-min').trigger('pointermove', { clientX: 500, clientY: 100 }).trigger('pointerup', { force: true }).then(() => {
                cy.wrap(onSlideEnd).should('be.called');
            });
        });
    });

    it('should emit dataProviderChange event on slide', () => {
        const dataProviderChange = cy.stub();
        defaultValues.dataProviderChange = dataProviderChange;
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('.ngx-slider-pointer-min').trigger('pointerdown').trigger('pointermove', { clientY: 100, clientX: 100 }).trigger('pointerup', { force: true }).then(() => {
                cy.wrap(dataProviderChange).should('have.been.called');
            });
        });
    });

    it('should not emit dataProviderChange event on dataprovider change', () => {
        const dataProviderChange = cy.stub();
        defaultValues.dataProviderChange = dataProviderChange;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('span.ngx-slider-model-value').should('have.text', '5').then(() => {
                wrapper.component.dataProvider.set(7);
                expect(dataProviderChange).not.to.have.been.called;
            });
        });
    });

    it('should show floor and ceil', () => {
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            wrapper.component.floor.set(1);
            wrapper.component.ceil.set(8);
            cy.get('span.ngx-slider-floor').should('have.text', '1');
            cy.get('span.ngx-slider-ceil').should('have.text', '8');
        });
    });

    it('should show/hide ticks', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.ngx-slider-tick').should('not.exist').then(() => {
                wrapper.component.showTicks.set(true);
                cy.get('.ngx-slider-tick').should('exist');
            });
        });
    });

    it('should handle disabled state', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('.ngx-slider').should('not.have.attr', 'disabled').then(() => {
                wrapper.component.enabled.set(false);
                cy.get('.ngx-slider').should('have.attr', 'disabled');
            });
        });
    });

    it('should show two pointers in range mode when dataProviderHigh is set', () => {
        defaultValues.dataProviderHigh = 15;
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            // range mode: both min and max pointers exist
            cy.get('.ngx-slider-pointer-min').should('exist');
            cy.get('.ngx-slider-pointer-max').should('exist');
        });
    });
});