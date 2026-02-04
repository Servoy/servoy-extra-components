import { Component, TemplateRef, ChangeDetectorRef, SimpleChanges, Renderer2, ChangeDetectionStrategy, HostListener, input, output, contentChild, signal } from '@angular/core';

import { BaseCustomObject, ServoyBaseComponent } from '@servoy/public';

@Component( {
    selector: 'servoyextra-splitpane',
    templateUrl: './splitpane.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
} )
export class ServoyExtraSplitpane extends ServoyBaseComponent<HTMLDivElement> {

    readonly onChangeMethodID = input(undefined);

    readonly enabled = input<boolean>(undefined);
    readonly readOnly = input<boolean>(undefined);
    readonly styleClass = input<string>(undefined);
    readonly splitType = input<number>(undefined);
    readonly tabSeq = input<number>(undefined);
    readonly pane1 = input<Pane>(undefined);
    readonly pane2 = input<Pane>(undefined);

    readonly divLocation = input<number>(undefined);
    readonly divLocationChange = output<number>();
    readonly divSize = input<number>(5);
    readonly pane1MinSize = input<number>(30);
    readonly pane2MinSize = input<number>(30);
    readonly resizeWeight = input<number>(0);
    readonly responsiveHeight = input<number>(undefined);
    
    _divLocation = signal<number>(undefined);
	
	previousValue: number = -1;
	resizeTimeout: ReturnType<typeof setTimeout> = null;

    readonly templateRef = contentChild(TemplateRef);

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
		const splitType = this.splitType();
        if (splitType === 1) {
			this.previousValue === -1 && (this.previousValue = elementHeight);
			delta = elementHeight - this.previousValue;
		} else if (splitType === 0) {
			this.previousValue === -1 && (this.previousValue = elementWidth);
			delta = elementWidth - this.previousValue;
		}
		
		if (delta !== 0) {
			let newLocation = this._divLocation();
			(newLocation > 0 && newLocation < 1) && (newLocation = splitType === 1 ? (this._divLocation() * this.previousValue) : (this._divLocation() * this.previousValue));
			newLocation += Math.round(delta * this.resizeWeight());
			this.divLocationChange.emit(newLocation);
		}
									
		splitType === 1 && (this.previousValue = elementHeight); 
		splitType === 0 && (this.previousValue = elementWidth); 
	}
	
	@HostListener('window:resize')
	onResize() {
		if (this.resizeTimeout) {
			clearTimeout(this.resizeTimeout);
		}
		this.resizeTimeout = setTimeout(this.resizeCalc, 50);
	}
	
    svyOnInit() {
        this._divLocation.set(this.divLocation());
        if (!this.servoyApi.isInAbsoluteLayout()) {
            this.containerStyle['min-height'] = this.responsiveHeight() + 'px';
            this.containerStyle['position'] = 'relative';
        }
		this.resizeCalc();
        super.svyOnInit();
    }

    svyOnChanges(changes: SimpleChanges) {
		if(changes['pane1'] || changes['pane2']) {
			this.leftTab = this.pane1();
            this.rightTab = this.pane2();
		}
        super.svyOnChanges(changes);
        if (changes) {
            if (changes['divLocation']) this._divLocation.set(this.divLocation());
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
        this._divLocation.set(location);
        this.divLocationChange.emit(this._divLocation());
        const onChangeMethodID = this.onChangeMethodID();
        if (onChangeMethodID) onChangeMethodID(-1, new Event('change'));
    }

    getRightTab() {
        return this.rightTab?this.rightTab.containsFormId:null;
    }

    getLeftTab() {
        return this.leftTab?this.leftTab.containsFormId:null;
    }

    private getInternalHeight() {
		return this.elementRef.nativeElement.getBoundingClientRect().height;
	}
	
	private getInternalWidth() {
		return this.elementRef.nativeElement.getBoundingClientRect().width;
	}
}

export class Pane extends BaseCustomObject {
	containsFormId: string;
	relationName: string;
}
