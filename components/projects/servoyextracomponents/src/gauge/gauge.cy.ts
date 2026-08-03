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
    servoyApi = signal<ServoyApi>(undefined as any);

    animationOptions = signal<any>(undefined as any);
    borderOptions = signal<any>(undefined as any);
    colorOptions = signal<any>(undefined as any);
    fontOptions = signal<any>(undefined as any);
    gaugeType = signal<string>(undefined as any);
    highlights = signal<any[]>(undefined as any);
    linearGaugeOptions = signal<any>(undefined as any);
    maxValue = signal<number>(undefined as any);
    minValue = signal<number>(undefined as any);
    needleOptions = signal<any>(undefined as any);
    radialGaugeOptions = signal<any>(undefined as any);
    ticks = signal<any>(undefined as any);
    title = signal<any>(undefined as any);
    units = signal<string>(undefined as any);
    value = signal<number>(undefined as any);
    valueBoxOptions = signal<any>(undefined as any);

    @ViewChild('element') element!: ServoyExtraGauge;
}

const defaultValues: Record<string, any> = {
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