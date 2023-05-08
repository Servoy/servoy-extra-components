import { Component, SimpleChanges, Input, Renderer2, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Format, ServoyBaseComponent } from '@servoy/public'

import { Options, ChangeContext, LabelType } from '@angular-slider/ngx-slider';
import { FormattingService } from '@servoy/public';

@Component({
	selector: 'servoyextra-slider',
	templateUrl: './slider.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraSlider extends ServoyBaseComponent<HTMLDivElement> {

	@Input() onDataChangeMethodID;
	@Input() onDataChangeHigh;
	@Input() onSlideStart;
	@Input() onSlideEnd;

	@Input() dataProvider;
	@Input() dataProviderHigh;
	@Input() numberFormat;
	@Input() dataChangeOnSlideEnd;
	@Input() ceil;
	@Input() floor;
	@Input() enabled;
	@Input() step;
	@Input() precision;
	@Input() minLimit;
	@Input() maxLimit;
	@Input() minRange;
	@Input() maxRange;
	@Input() enforceStep;
	@Input() enforceRange;
	@Input() pushRange;
	@Input() rightToLeft;
	@Input() noSwitching;
	@Input() draggableRange;
	@Input() draggableRangeOnly;
	@Input() showSelectionBar;
	@Input() showSelectionBarEnd;
	@Input() selectionBarGradient;
	@Input() showOuterSelectionBars;
	@Input() showTicks;
	@Input() showTicksValues;
	@Input() hidePointerLabels;
	@Input() hideLimitLabels;
	@Input() autoHideLimitLabels;
	@Input() vertical;
	@Input() logScale;
	@Input() formattingFunction;
	@Input() selectionBarColorFunction;
	@Input() getLegendFunction;
	@Input() tickColorFunction;
	@Input() ticksTooltipFunction;
	@Input() ticksValuesTooltipFunction;
	@Input() pointerColorFunction;
	@Input() stepsValueList;
	@Input() styleClass;

	@Output() dataProviderChange = new EventEmitter();
	@Output() dataProviderHighChange = new EventEmitter();
	manualRefresh: EventEmitter<void> = new EventEmitter<void>();

	formattingFunctionParsed: any;

	options: Options = {
		translate: this.formatValue
	};

	constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, private formatService: FormattingService) {
		super(renderer, cdRef);
	}

	ngOnInit() {
		super.ngOnInit();
		// these options must be initialized otherwise dataprovider is not displayed in ui
		this.setNewOptions('ceil', this.ceil ? this.ceil : 100);
		this.setNewOptions('floor', this.floor);
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
						this.setNewOptions('ceil', change.currentValue ? change.currentValue : 100);
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
					case 'showTicks':
						this.setNewOptions('showTicks', change.currentValue);
						break;
					case 'showTicksValues':
						this.setNewOptions('showTicksValues', change.currentValue);
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
						this.setNewOptions('getSelectionBarColor', change.currentValue );
						break;
					case 'getLegendFunction':
						this.setNewOptions('getLegend', change.currentValue );
						break;
					case 'tickColorFunction':
						this.setNewOptions('getTickColor', change.currentValue );
						break;
					case 'ticksTooltipFunction':
						this.setNewOptions('ticksTooltip', change.currentValue );
						break;
					case 'ticksValuesTooltipFunction':
						this.setNewOptions('ticksValuesTooltip', change.currentValue );
						break;
					case 'pointerColorFunction':
						this.setNewOptions('getPointerColor', change.currentValue );
						break;
					case 'stepsValueList':
						if (change.currentValue) {
							let stepsArray = [];
							for (let vl = 0; vl < change.currentValue.length; vl++) {
								/** @type {{displayValue: String, realValue: Object}} */
								let item = change.currentValue[vl];
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

	setNewOptions(propertyName: any, propertyValue: any): void {
		// Due to change detection rules in Angular, we need to re-create the options object to apply the change
		const newOptions: Options = Object.assign({}, this.options);
		newOptions[propertyName] = propertyValue;
		this.options = newOptions;
	}

	formatValue(value: number, label: LabelType): string {
		if (this.formattingFunctionParsed) {
			return this.formattingFunctionParsed(value, label);
		}
		if (this.numberFormat) {
			const format = new Format();
			format.display = this.numberFormat;
			format.type = 'NUMBER';
			return this.formatService.format(value, format, false);
		}
		return value.toString();
	}

	onUserChangeStart(changeContext: ChangeContext) {
		if (this.onSlideStart) {
			this.onSlideStart(null, changeContext.value, changeContext.highValue, changeContext.pointerType);
		}
	}

	onUserChangeEnd(changeContext: ChangeContext) {
		this.dataProviderChange.emit(changeContext.value);
		this.dataProviderHighChange.emit(changeContext.highValue);
		if (this.onSlideEnd) {
			this.onSlideEnd(null, changeContext.value, changeContext.highValue, changeContext.pointerType);
		}
	}

	public refresh() {
		this.manualRefresh.emit();
	}
}

