import { Component, ViewChild, signal } from '@angular/core';
import { ServoyApi, ServoyApiTesting, ServoyPublicTestingModule } from '@servoy/public';
import { ServoyExtraGauge } from './gauge';
import { MountConfig } from 'cypress/angular';
import { FormsModule } from '@angular/forms';
import { LinearGauge } from './lib/linear-gauge';
import { RadialGauge } from './lib/radial-gauge';
import { BaseGauge } from './lib/base-gauge';

@Component({
    template: `
        <servoyextra-gauge
            [servoyApi]="servoyApi()"
            [animationOptions]="animationOptions()"
            [borderOptions]="borderOptions()"
            [colorOptions]="colorOptions()"
            [fontOptions]="fontOptions()"
            [gaugeType]="gaugeType()"
            [highlights]="highlights()"
            [linearGaugeOptions]="linearGaugeOptions()"
            [maxValue]="maxValue()"
            [minValue]="minValue()"
            [needleOptions]="needleOptions()"
            [radialGaugeOptions]="radialGaugeOptions()"
            [ticks]="ticks()"
            [title]="title()"
            [units]="units()"
            [value]="value()"
            [valueBoxOptions]="valueBoxOptions()"
            #element>
        </servoyextra-gauge>
    `,
    standalone: false
})
class WrapperComponent {
    servoyApi = signal<ServoyApi>(undefined);

    animationOptions = signal<any>(undefined);
    borderOptions = signal<any>(undefined);
    colorOptions = signal<any>(undefined);
    fontOptions = signal<any>(undefined);
    gaugeType = signal<string>(undefined);
    highlights = signal<any[]>(undefined);
    linearGaugeOptions = signal<any>(undefined);
    maxValue = signal<number>(undefined);
    minValue = signal<number>(undefined);
    needleOptions = signal<any>(undefined);
    radialGaugeOptions = signal<any>(undefined);
    ticks = signal<any>(undefined);
    title = signal<any>(undefined);
    units = signal<string>(undefined);
    value = signal<number>(undefined);
    valueBoxOptions = signal<any>(undefined);

    @ViewChild('element') element: ServoyExtraGauge;
}

const defaultValues = {
    servoyApi: new ServoyApiTesting(),
    gaugeType: 'radial',
    minValue: 0,
    maxValue: 100,
    value: 50,
    units: 'km/h',
    title: { text: 'Speed' },
    animationOptions: undefined,
    borderOptions: undefined,
    colorOptions: undefined,
    fontOptions: undefined,
    highlights: undefined,
    linearGaugeOptions: undefined,
    needleOptions: undefined,
    radialGaugeOptions: undefined,
    ticks: undefined,
    valueBoxOptions: undefined
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
    declarations: [ServoyExtraGauge, LinearGauge, RadialGauge],
    imports: [ServoyPublicTestingModule, FormsModule, BaseGauge],
};

describe('ServoyExtraGauge', () => {

    it('should mount and register the component', () => {
        const servoyApiSpy = defaultValues.servoyApi;
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, configWrapper).then((wrapper) => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-gauge').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should handle gauge type change', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.gaugeType.set('linear');
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.gaugeType()).should('eq', 'linear');
            });
        });
    });

    it('should update value', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.value.set(75);
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.value()).should('eq', 75);
            });
        });
    });

    it('should handle min/max values', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.minValue.set(-50);
                wrapper.component.maxValue.set(150);
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.minValue()).should('eq', -50);
                cy.wrap(wrapper.component.element.maxValue()).should('eq', 150);
            });
        });
    });

    it('should update units', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.units.set('mph');
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.units()).should('eq', 'mph');
            });
        });
    });

    it('should handle title changes', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.title.set({ text: 'New Title' });
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.title().text).should('eq', 'New Title');
            });
        });
    });

    it('should handle highlights configuration', () => {
        cy.mount(WrapperComponent, configWrapper).then(wrapper => {
            applyDefaultProps(wrapper);
            const highlights = [
                { from: 0, to: 30, color: 'green' },
                { from: 30, to: 70, color: 'yellow' },
                { from: 70, to: 100, color: 'red' }
            ];
            wrapper.component.highlights.set(highlights);
            wrapper.fixture.detectChanges();
            cy.wrap(wrapper.component.element.highlights()).should('deep.equal', highlights);
        });
    });
});