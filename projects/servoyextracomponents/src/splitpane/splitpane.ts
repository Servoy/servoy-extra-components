import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, ChangeDetectorRef, SimpleChanges, Renderer2, ChangeDetectionStrategy, HostListener} from '@angular/core';

import { BaseCustomObject, ServoyBaseComponent } from '@servoy/public';

@Component( {
    selector: 'servoyextra-splitpane',
    templateUrl: './splitpane.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
} )
export class ServoyExtraSplitpane extends ServoyBaseComponent<HTMLDivElement> {

    @Input() onChangeMethodID;

    @Input() enabled: boolean;
    @Input() readOnly: boolean;
    @Input() styleClass: string;
    @Input() splitType: number;
    @Input() tabSeq: number;
    @Input() pane1: Pane;
    @Input() pane2: Pane;

    @Input() divLocation: number;
    @Output() divLocationChange = new EventEmitter();
    @Input() divSize: number;
    @Input() pane1MinSize: number;
    @Input() pane2MinSize: number;
    @Input() resizeWeight: number;
    @Input() responsiveHeight: number;
	
	previousValue: number = -1;
	resizeTimeout: ReturnType<typeof setTimeout> = null;

    @ContentChild( TemplateRef, {static: true} ) templateRef: TemplateRef<any>;

    containerStyle = {
        width: '100%',
        height: '100%'
    };


    private leftTab: Pane;
    private rightTab: Pane;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef) {
        super(renderer, cdRef);
    }
	
	resizeCalc = () => {
		const elementWidth = this.getInternalWidth();
		const elementHeight = this.getInternalHeight();
		let delta  = 0;
		if(this.splitType === 1) {
			this.previousValue === -1 && (this.previousValue = elementHeight);
			delta = elementHeight - this.previousValue;
		} else if (this.splitType === 0) {
			this.previousValue === -1 && (this.previousValue = elementWidth);
			delta = elementWidth - this.previousValue;
		}
		
		if (delta !== 0) {
			let newLocation = this.divLocation;
			(newLocation > 0 && newLocation < 1) && (newLocation = this.splitType === 1 ? (this.divLocation * this.previousValue) : (this.divLocation * this.previousValue));
			newLocation += Math.round(delta * this.resizeWeight);
			this.divLocationChange.emit(newLocation);
		}
									
		this.splitType === 1 && (this.previousValue = elementHeight); 
		this.splitType === 0 && (this.previousValue = elementWidth); 
	}
	
	@HostListener('window:resize')
	onResize() {
		if (this.resizeTimeout) {
			clearTimeout(this.resizeTimeout);
		}
		this.resizeTimeout = setTimeout(this.resizeCalc, 50);
	}
	
    svyOnInit() {
        if (this.resizeWeight === undefined) this.resizeWeight = 0;
        if (this.pane1MinSize === undefined) this.pane1MinSize = 30;
        if (this.pane2MinSize === undefined) this.pane2MinSize = 30;
        if (this.divSize === undefined) this.divSize = 5;
        if (!this.servoyApi.isInAbsoluteLayout()) {
            this.containerStyle['min-height'] = this.responsiveHeight + 'px';
            this.containerStyle['position'] = 'relative';
        }
		this.resizeCalc();
        super.svyOnInit();
    }

    svyOnChanges(changes: SimpleChanges) {
		if(changes['pane1'] || changes['pane2']) {
			this.leftTab = this.tabSwitch(this.leftTab, this.pane1?this.pane1:null);
            this.rightTab = this.tabSwitch(this.rightTab, this.pane2?this.pane2:null);
		}
        super.svyOnChanges(changes);
        if (changes) {
            for (const property of Object.keys(changes)) {
                const change = changes[property];
                switch (property) {
                    case 'styleClass':
                        if (change.previousValue) {
                            const array = change.previousValue.trim().split(' ');
                            array.filter((elementStyleClass: string) => elementStyleClass !== '').forEach(
                                (elementStyleClass: string) => this.renderer.removeClass(this.getNativeElement(), elementStyleClass)
                            );
                        }
                        if (change.currentValue) {
                            const array = change.currentValue.trim().split(' ');
                            array.filter((elementStyleClass: string) => elementStyleClass !== '').forEach(
                                (elementStyleClass: string) => this.renderer.addClass(this.getNativeElement(), elementStyleClass)
                            );
                        }
                    break;
                }
            }            
        }
    }

    onChange( location ) {
        this.divLocation = location;
        this.divLocationChange.emit(this.divLocation);
        if (this.onChangeMethodID) this.onChangeMethodID(-1, new Event('change'));
    }

    getRightTab() {
        return this.rightTab?this.rightTab.containsFormId:null;
    }

    getLeftTab() {
        return this.leftTab?this.leftTab.containsFormId:null;
    }

    private tabSwitch(oldTab: Pane,newTab: Pane): Pane {
        if (oldTab && oldTab.containsFormId && newTab && newTab.containsFormId) {
            const promise = this.servoyApi.hideForm(oldTab.containsFormId,oldTab.relationName,null,newTab.containsFormId,newTab.relationName);
            promise.then((ok) => {
                if (!ok) {
                    // a splitpane can't block the hide so show should be called
                    this.servoyApi.formWillShow(newTab.containsFormId,newTab.relationName).
                        finally( () => this.cdRef.detectChanges());
                }
            });
        } else if (oldTab && oldTab.containsFormId) {
            this.servoyApi.hideForm(oldTab.containsFormId,oldTab.relationName);
        } else if (newTab && newTab.containsFormId) {
            this.servoyApi.formWillShow(newTab.containsFormId,newTab.relationName).
                        finally( () => this.cdRef.detectChanges());
        }
        return newTab;
    }
    
    private getInternalHeight() {
		return this.elementRef.nativeElement.getBoundingClientRect().height;
	}
	
	private getInternalWidth() {
		return this.elementRef.nativeElement.getBoundingClientRect().width;
	}
}

class Pane extends BaseCustomObject {
	containsFormId: string;
	relationName: string;
}
