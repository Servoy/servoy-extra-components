import { Component, ViewChild } from '@angular/core';
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
            [servoyApi]="servoyApi"
            [animationOptions]="animationOptions"
            [borderOptions]="borderOptions"
            [colorOptions]="colorOptions"
            [fontOptions]="fontOptions"
            [gaugeType]="gaugeType"
            [highlights]="highlights"
            [linearGaugeOptions]="linearGaugeOptions"
            [maxValue]="maxValue"
            [minValue]="minValue"
            [needleOptions]="needleOptions"
            [radialGaugeOptions]="radialGaugeOptions"
            [ticks]="ticks"
            [title]="title"
            [units]="units"
            [value]="value"
            [valueBoxOptions]="valueBoxOptions"
            #element>
        </servoyextra-gauge>
    `,
    standalone: false
})
class WrapperComponent {
    servoyApi: ServoyApi;

    animationOptions: any;
    borderOptions: any;
    colorOptions: any;
    fontOptions: any;
    gaugeType: string;
    highlights: any[];
    linearGaugeOptions: any;
    maxValue: number;
    minValue: number;
    needleOptions: any;
    radialGaugeOptions: any;
    ticks: any;
    title: any;
    units: string;
    value: number;
    valueBoxOptions: any;
    
    @ViewChild('element') element: ServoyExtraGauge;
}

describe('ServoyExtraGauge', () => {
    const servoyApiSpy = new ServoyApiTesting();

    const config: MountConfig<WrapperComponent> = {
        declarations: [ServoyExtraGauge, LinearGauge, RadialGauge],
        imports: [ServoyPublicTestingModule, FormsModule, BaseGauge],
    }

    beforeEach(() => {
        config.componentProperties = {
            servoyApi: servoyApiSpy,
            gaugeType: 'radial',
            minValue: 0,
            maxValue: 100,
            value: 50,
            units: 'km/h',
            title: { text: 'Speed' }
        }
    });

    it('should mount and register the component', () => {
        const registerComponent = cy.stub(servoyApiSpy, 'registerComponent');
        cy.mount(WrapperComponent, config).then(() => {
            cy.get('servoyextra-gauge').should('exist').then(() => {
                cy.wrap(registerComponent).should('be.called');
            });
        });
    });

    it('should handle gauge type change', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.gaugeType = 'linear';
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.gaugeType).should('eq', 'linear');
            });
        });
    });

    it('should update value', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.value = 75;
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.value).should('eq', 75);
            });
        });
    });

    it('should handle min/max values', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.minValue = -50;
                wrapper.component.maxValue = 150;
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.minValue).should('eq', -50);
                cy.wrap(wrapper.component.element.maxValue).should('eq', 150);
            });
        });
    });

    it('should update units', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.units = 'mph';
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.units).should('eq', 'mph');
            });
        });
    });

    it('should handle title changes', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            cy.get('servoyextra-gauge').should('exist').then(() => {
                wrapper.component.title = { text: 'New Title' };
                wrapper.fixture.detectChanges();
                cy.wrap(wrapper.component.element.title.text).should('eq', 'New Title');
            });
        });
    });

    it('should handle highlights configuration', () => {
        cy.mount(WrapperComponent, config).then(wrapper => {
            const highlights = [
                { from: 0, to: 30, color: 'green' },
                { from: 30, to: 70, color: 'yellow' },
                { from: 70, to: 100, color: 'red' }
            ];
            wrapper.component.highlights = highlights;
            wrapper.fixture.detectChanges();
            cy.wrap(wrapper.component.element.highlights).should('deep.equal', highlights);
        });
    });
});