import { PointerType, ChangeContext, LabelType, Options } from '@angular-slider/ngx-slider';
import { Component, SimpleChanges, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy, input, output, EventEmitter } from '@angular/core';
import { Format, ServoyBaseComponent } from '@servoy/public'

import { FormattingService } from '@servoy/public';

@Component({
    selector: 'servoyextra-slider',
    templateUrl: './slider.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ServoyExtraSlider extends ServoyBaseComponent<HTMLDivElement> {

    readonly onDataChangeMethodID = input<any>(undefined);
    readonly onDataChangeHigh = input<any>(undefined);
    readonly onSlideStart = input<any>(undefined);
    readonly onSlideEnd = input<any>(undefined);
    readonly onTick = input<any>(undefined);

    readonly dataProvider = input<any>(undefined);
    readonly dataProviderHigh = input<any>(undefined);
    readonly numberFormat = input<any>(undefined);
    readonly dataChangeOnSlideEnd = input<any>(undefined);
    readonly ceil = input<any>(undefined);
    readonly floor = input<any>(undefined);
    readonly enabled = input<any>(undefined);
    readonly step = input<any>(undefined);
    readonly precision = input<any>(undefined);
    readonly minLimit = input<any>(undefined);
    readonly maxLimit = input<any>(undefined);
    readonly minRange = input<any>(undefined);
    readonly maxRange = input<any>(undefined);
    readonly enforceStep = input<any>(undefined);
    readonly enforceRange = input<any>(undefined);
    readonly pushRange = input<any>(undefined);
    readonly rightToLeft = input<any>(undefined);
    readonly noSwitching = input<any>(undefined);
    readonly draggableRange = input<any>(undefined);
    readonly draggableRangeOnly = input<any>(undefined);
    readonly showSelectionBar = input<any>(undefined);
    readonly showSelectionBarEnd = input<any>(undefined);
    readonly selectionBarGradient = input<any>(undefined);
    readonly showOuterSelectionBars = input<any>(undefined);
    readonly showTicks = input<any>(undefined);
    readonly showTicksValues = input<any>(undefined);
    readonly ticksInterval = input<any>(undefined);
    readonly ticksValuesInterval = input<any>(undefined);
    readonly hidePointerLabels = input<any>(undefined);
    readonly hideLimitLabels = input<any>(undefined);
    readonly autoHideLimitLabels = input<any>(undefined);
    readonly vertical = input<any>(undefined);
    readonly logScale = input<any>(undefined);
    readonly formattingFunction = input<any>(undefined);
    readonly selectionBarColorFunction = input<any>(undefined);
    readonly getLegendFunction = input<any>(undefined);
    readonly tickColorFunction = input<any>(undefined);
    readonly ticksTooltipFunction = input<any>(undefined);
    readonly ticksValuesTooltipFunction = input<any>(undefined);
    readonly pointerColorFunction = input<any>(undefined);
    readonly stepsValueList = input<any>(undefined);
    readonly styleClass = input<any>(undefined);

    readonly dataProviderChange = output<any>();
    readonly dataProviderHighChange = output<any>();
    manualRefresh: EventEmitter<void> = new EventEmitter<void>();

    formattingFunctionParsed: any;

    options: Options = {
        translate: (value: number, label: LabelType) => this.formatValue(value, label)
    };

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private formatService: FormattingService) {
        super(renderer, cdRef);
    }

    ngOnInit() {
        super.ngOnInit();
        // these options must be initialized otherwise dataprovider is not displayed in ui
        this.setNewOptions('ceil', this.ceilValue(this.ceil()));
        this.setNewOptions('floor', this.floor());
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case 'enabled':
                        this.setNewOptions('disabled', !change.currentValue);
                        break;
                    case 'floor':
                        this.setNewOptions('floor', change.currentValue);
                        break;
                    case 'ceil':
                        this.setNewOptions('ceil', this.ceilValue(change.currentValue));
                        break;
                    case 'step':
                        this.setNewOptions('step', change.currentValue);
                        break;
                    case 'precision':
                        if (change.currentValue >= 1 && change.currentValue <= 100) {
                            this.setNewOptions('precisionLimit', change.currentValue);
                        }
                        break;
                    case 'minLimit':
                        this.setNewOptions('minLimit', change.currentValue);
                        break;
                    case 'maxLimit':
                        this.setNewOptions('maxLimit', change.currentValue);
                        break;
                    case 'minRange':
                        this.setNewOptions('minRange', change.currentValue);
                        break;
                    case 'maxRange':
                        this.setNewOptions('maxRange', change.currentValue);
                        break;
                    case 'enforceStep':
                        this.setNewOptions('enforceStep', change.currentValue);
                        break;
                    case 'enforceRange':
                        this.setNewOptions('enforceRange', change.currentValue);
                        break;
                    case 'pushRange':
                        this.setNewOptions('pushRange', change.currentValue);
                        break;
                    case 'rightToLeft':
                        this.setNewOptions('rightToLeft', change.currentValue);
                        break;
                    case 'noSwitching':
                        this.setNewOptions('noSwitching', change.currentValue);
                        break;
                    case 'draggableRange':
                        this.setNewOptions('draggableRange', change.currentValue);
                        break;
                    case 'draggableRangeOnly':
                        this.setNewOptions('draggableRangeOnly', change.currentValue);
                        break;
                    case 'showSelectionBar':
                        this.setNewOptions('showSelectionBar', change.currentValue);
                        break;
                    case 'showSelectionBarEnd':
                        this.setNewOptions('showSelectionBarEnd', change.currentValue);
                        break;
                    case 'selectionBarGradient':
                        this.setNewOptions('selectionBarGradient', change.currentValue);
                        break;
                    case 'showOuterSelectionBars':
                        this.setNewOptions('showOuterSelectionBars', change.currentValue);
                        break;
                    case 'ticksInterval':
                        this.setNewOptions('tickStep', change.currentValue);
                        break;
                    case 'showTicks':
                        this.setNewOptions('showTicks', change.currentValue);
                        break;    
                    case 'showTicksValues':
                        this.setNewOptions('showTicksValues', change.currentValue);
                        break;
                    case 'ticksValuesInterval':
                        this.setNewOptions('tickValueStep', change.currentValue);
                        break;    
                    case 'hidePointerLabels':
                        this.setNewOptions('hidePointerLabels', change.currentValue);
                        break;
                    case 'hideLimitLabels':
                        this.setNewOptions('hideLimitLabels', change.currentValue);
                        break;
                    case 'autoHideLimitLabels':
                        this.setNewOptions('autoHideLimitLabels', change.currentValue);
                        break;
                    case 'vertical':
                        this.setNewOptions('vertical', change.currentValue);
                        break;
                    case 'logScale':
                        this.setNewOptions('logScale', change.currentValue);
                        break;
                    case 'formattingFunction':
                        this.formattingFunctionParsed = change.currentValue;
                        break;
                    case 'selectionBarColorFunction':
                        this.setNewOptions('getSelectionBarColor', change.currentValue);
                        break;
                    case 'getLegendFunction':
                        this.setNewOptions('getLegend', change.currentValue);
                        break;
                    case 'tickColorFunction':
                        this.setNewOptions('getTickColor', change.currentValue);
                        break;
                    case 'ticksTooltipFunction':
                        this.setNewOptions('ticksTooltip', change.currentValue);
                        break;
                    case 'ticksValuesTooltipFunction':
                        this.setNewOptions('ticksValuesTooltip', change.currentValue);
                        break;
                    case 'pointerColorFunction':
                        this.setNewOptions('getPointerColor', change.currentValue);
                        break;
                    case 'stepsValueList':
                        if (change.currentValue) {
                            const stepsArray = [];
                            for (const item of change.currentValue) {
                                if (item.realValue == item.displayValue) {
                                    //no "legend"                                       
                                    stepsArray.push({ value: item.realValue });
                                } else {
                                    stepsArray.push({ value: item.realValue, legend: item.displayValue });
                                }
                            }
                            this.setNewOptions('stepsArray', stepsArray);
                        }
                        break;
                    case 'styleClass':
                        if (change.previousValue) {
                            const array = change.previousValue.trim().split(' ');
                            array.filter((element: string) => element !== '').forEach((element: string) => this.renderer.removeClass(this.getNativeElement(), element));
                        }
                        if (change.currentValue) {
                            const array = change.currentValue.trim().split(' ');
                            array.filter((element: string) => element !== '').forEach((element: string) => this.renderer.addClass(this.getNativeElement(), element));
                        }
                        break;
                }
            }
        }
        super.svyOnChanges(changes);
		
    }

    setNewOptions(propertyName: string, propertyValue: any): void {
        const newOptions: Options = Object.assign({}, this.options);
        (newOptions as any)[propertyName] = propertyValue;
        this.options = newOptions;
    }

    formatValue(value: number, label: LabelType): string {
        if (this.formattingFunctionParsed && typeof this.formattingFunctionParsed === 'function') {
            return this.formattingFunctionParsed(value, label);
        }
        const numberFormat = this.numberFormat();
        if (numberFormat && numberFormat.type === 'NUMBER') {
            const format = new Format();
            format.display = numberFormat;
            format.type = 'NUMBER';
            return this.formatService.format(value, format, false);
        }
        return value.toString();
    }

    onUserChangeStart(changeContext: ChangeContext) {
        const onSlideStart = this.onSlideStart();
        if (onSlideStart) {
            onSlideStart(null, changeContext.value, changeContext.highValue, changeContext.pointerType == PointerType.Min ? 'value' : 'high');
        }
    }

    onUserChange(changeContext: ChangeContext) {
        const onTick = this.onTick();
        if (onTick) {
            onTick(changeContext.value, changeContext.highValue, changeContext.pointerType == PointerType.Min ? 'value' : 'high', this.rightToLeft());
        }
        if (!this.dataChangeOnSlideEnd()) {
            this.dataProviderChange.emit(changeContext.value);
            this.dataProviderHighChange.emit(changeContext.highValue);
        }
    }

    onUserChangeEnd(changeContext: ChangeContext) {
        this.dataProviderChange.emit(changeContext.value);
        this.dataProviderHighChange.emit(changeContext.highValue);
        const onSlideEnd = this.onSlideEnd();
        if (onSlideEnd) {
            onSlideEnd(null, changeContext.value, changeContext.highValue, changeContext.pointerType == PointerType.Min ? 'value' : 'high');
        }
    }

    ceilValue(ceil: number) {
        if (ceil >= 0) {
            return ceil;
        } else if (this.dataProviderHigh() >= 0) {
            return this.dataProviderHigh();
        } else if (this.dataProvider() >= 0) {
            return this.dataProvider();
        }
        return 100;
    }

    public refresh() {
        this.manualRefresh.emit();
    }

    public onDataChangeCallback(_event: any, _returnval: any) {
        /* noop */
    }

    public onDataChangeCallbackHigh(_event: any, _returnval: any) {
        /* noop */
    }

}

