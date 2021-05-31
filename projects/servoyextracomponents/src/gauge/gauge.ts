import { ChangeDetectorRef, Component, Input, Renderer2 } from '@angular/core';
import { ServoyBaseComponent } from '@servoy/public';

@Component({
    selector: 'servoyextra-gauge',
    templateUrl: './gauge.html'
})
export class ServoyExtraGauge extends ServoyBaseComponent<HTMLDivElement> {
    @Input() myOptionsProperty;
    @Input() myValueProperty;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef) {
        super(renderer, cdRef);
        this.myOptionsProperty = {
            width: 150,
            height: 400,
            minValue: 0,
            maxValue: 100
        };
        this.myValueProperty = 10;
    }
}
