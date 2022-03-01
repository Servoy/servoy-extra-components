import { ChangeDetectorRef, Component, ElementRef, Input, Output, Renderer2, SimpleChanges, ViewChild, HostListener } from '@angular/core';
import { ServoyBaseComponent } from '@servoy/public';
import { BaseGauge } from './lib/base-gauge';
import { RadialGauge } from './lib/radial-gauge';

@Component({
    selector: 'servoyextra-gauge',
    templateUrl: './gauge.html'
})
export class ServoyExtraGauge extends ServoyBaseComponent<HTMLDivElement> {
    @Input() gaugeType: string;
    @Input() minValue = 0;
    @Input() maxValue = 100;
    @Input() value: number;
    @Input() units: string;

    @Input() animationOptions;
    @Input() highlights;
    @Input() ticks;

    @Input() colorOptions;
    @Input() valueBoxOptions;
    @Input() needleOptions;
    @Input() borderOptions;
    @Input() fontOptions;

    @Input() radialGaugeOptions;
    @Input() linearGaugeOptions;

    @Input() title;

    @Input() canvasGaugeOptions;

    canvasGauge;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        // responsive form in designer keeps growing so this will become an infinite cycle
        if (!this.servoyApi.isInDesigner()) {
            this.canvasGauge.update({ height: this.elementRef.nativeElement.clientHeight });
            this.canvasGauge.update({ width: this.elementRef.nativeElement.clientWidth });
            this.canvasGauge.draw();
        }
    }

    svyOnInit() {
        super.svyOnInit();
        this.onResize(null);
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                switch (property) {
                    case 'gaugeType':
                        this.refreshGauge();
                        break;
                }
            }
        }
    }

    onGaugeReady(gaugeCanvas) {
        this.canvasGauge = gaugeCanvas;
    }

    refreshGauge() {
        this.canvasGaugeOptions = {
            minValue: this.minValue,
            maxValue: this.maxValue,
            width: this.elementRef.nativeElement.clientWidth,
            height: this.elementRef.nativeElement.clientHeight,
            value: (this.value == null || this.value == undefined) ? 0 : this.value
        };

        if (this.units) this.canvasGaugeOptions['units'] = this.units;
        const titleText = this.getTitleText();
        if (titleText) this.canvasGaugeOptions['title'] = titleText;
        if (this.animationOptions) Object.assign(this.canvasGaugeOptions, this.animationOptions);
        if (this.highlights) {
            this.ticks = this.ticks || {};
            this.ticks.highlights = this.highlights;
        }
        if (this.ticks) {
            Object.assign(this.canvasGaugeOptions, this.ticks);
        }
        if (this.colorOptions) Object.assign(this.canvasGaugeOptions, this.colorOptions);
        if (this.valueBoxOptions) Object.assign(this.canvasGaugeOptions, this.valueBoxOptions);
        if (this.needleOptions) Object.assign(this.canvasGaugeOptions, this.needleOptions);
        if (this.borderOptions) Object.assign(this.canvasGaugeOptions, this.borderOptions);
        if (this.fontOptions) Object.assign(this.canvasGaugeOptions, this.fontOptions);

        if (this.gaugeType == "radial") {
            if (this.radialGaugeOptions) Object.assign(this.canvasGaugeOptions, this.radialGaugeOptions);
        } else if (this.gaugeType == "linear") {
            if (this.linearGaugeOptions) Object.assign(this.canvasGaugeOptions, this.linearGaugeOptions);
        }
    }

    getTitleText(): string {
        let result = null;

        if (this.title) {
            result = ((this.title.dataProviderID == null) ? this.title.text : this.title.dataProviderID);
        }

        return result;
    }
}
