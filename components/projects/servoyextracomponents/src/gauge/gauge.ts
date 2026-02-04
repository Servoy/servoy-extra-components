import { ChangeDetectorRef, Component, ElementRef, Output, Renderer2, SimpleChanges, ViewChild, HostListener, input, signal } from '@angular/core';
import { ServoyBaseComponent } from '@servoy/public';
import { BaseGauge } from './lib/base-gauge';
import { RadialGauge } from './lib/radial-gauge';

@Component({
    selector: 'servoyextra-gauge',
    templateUrl: './gauge.html',
    standalone: false
})
export class ServoyExtraGauge extends ServoyBaseComponent<HTMLDivElement> {
    readonly gaugeType = input<string>(undefined);
    readonly minValue = input(0);
    readonly maxValue = input(100);
    readonly value = input<number>(undefined);
    readonly units = input<string>(undefined);

    readonly animationOptions = input(undefined);
    readonly highlights = input(undefined);
    readonly ticks = input(undefined);

    readonly colorOptions = input(undefined);
    readonly valueBoxOptions = input(undefined);
    readonly needleOptions = input(undefined);
    readonly borderOptions = input(undefined);
    readonly fontOptions = input(undefined);

    readonly radialGaugeOptions = input(undefined);
    readonly linearGaugeOptions = input(undefined);

    readonly title = input(undefined);

    readonly canvasGaugeOptions = input(undefined);
    
    _canvasGaugeOptions = signal(undefined);

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
        this._canvasGaugeOptions.set(this.canvasGaugeOptions() || {});
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                switch (property) {
                    case 'canvasGaugeOptions':
                        this._canvasGaugeOptions.set(this.canvasGaugeOptions() || {});
                        this.refreshGauge();
                        break;
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
        const value = this.value();
        this._canvasGaugeOptions.set({
            minValue: this.minValue(),
            maxValue: this.maxValue(),
            width: this.elementRef.nativeElement.clientWidth,
            height: this.elementRef.nativeElement.clientHeight,
            value: (value == null || value == undefined) ? 0 : value
        });

        const units = this.units();
        const canvasGaugeOptions = this._canvasGaugeOptions();
        if (units) canvasGaugeOptions['units'] = units;
        const titleText = this.getTitleText();
        if (titleText) canvasGaugeOptions['title'] = titleText;
        const animationOptions = this.animationOptions();
        if (animationOptions) Object.assign(canvasGaugeOptions, animationOptions);
        const highlights = this.highlights();
        let ticks = this.ticks();
        if (highlights) {
            ticks = this.ticks() || {};
            ticks.highlights = highlights;
        }
        if (ticks) {
            Object.assign(canvasGaugeOptions, ticks);
        }
        const colorOptions = this.colorOptions();
        if (colorOptions) Object.assign(canvasGaugeOptions, colorOptions);
        const valueBoxOptions = this.valueBoxOptions();
        if (valueBoxOptions) Object.assign(canvasGaugeOptions, valueBoxOptions);
        const needleOptions = this.needleOptions();
        if (needleOptions) Object.assign(canvasGaugeOptions, needleOptions);
        const borderOptions = this.borderOptions();
        if (borderOptions) Object.assign(canvasGaugeOptions, borderOptions);
        const fontOptions = this.fontOptions();
        if (fontOptions) Object.assign(canvasGaugeOptions, fontOptions);

        const gaugeType = this.gaugeType();
        if (gaugeType == "radial") {
            const radialGaugeOptions = this.radialGaugeOptions();
            if (radialGaugeOptions) Object.assign(canvasGaugeOptions, radialGaugeOptions);
        } else if (gaugeType == "linear") {
            const linearGaugeOptions = this.linearGaugeOptions();
            if (linearGaugeOptions) Object.assign(canvasGaugeOptions, linearGaugeOptions);
        }
    }

    getTitleText(): string {
        let result = null;

        const title = this.title();
        if (title) {
            result = ((title.dataProviderID == null) ? title.text : title.dataProviderID);
        }

        return result;
    }
}
