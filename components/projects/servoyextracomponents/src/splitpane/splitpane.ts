import { Component, TemplateRef, SimpleChanges, ChangeDetectionStrategy, input, output, contentChild, signal } from '@angular/core';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { ServoyBaseComponent, ServoyPublicModule } from '@servoy/public';
import { BGSplitter } from './bg_splitter/bg_splitter.component';
import { BGPane } from './bg_splitter/bg_pane.component';

@Component( {
    selector: 'servoyextra-splitpane',
    templateUrl: './splitpane.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgStyle, NgTemplateOutlet, ServoyPublicModule, BGSplitter, BGPane],
    host: {
        '(window:resize)': 'onResize()'
    }
} )
export class ServoyExtraSplitpane extends ServoyBaseComponent<HTMLDivElement> {

    readonly onChangeMethodID = input(undefined);

    readonly enabled = input<boolean>(undefined as any);
    readonly readOnly = input<boolean>(undefined as any);
    readonly styleClass = input<string>(undefined as any);
    readonly splitType = input<number>(undefined as any);
    readonly tabSeq = input<number>(undefined as any);
    readonly pane1 = input<Pane>(undefined as any);
    readonly pane2 = input<Pane>(undefined as any);

    readonly divLocation = input<number>(undefined as any);
    readonly divLocationChange = output<number>();
    readonly divSize = input<number>(5);
    readonly pane1MinSize = input<number>(30);
    readonly pane2MinSize = input<number>(30);
    readonly resizeWeight = input<number>(0);
    readonly responsiveHeight = input<number>(undefined as any);
    
    _divLocation = signal<number | undefined>(undefined);
	
	previousValue = -1;
	resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    readonly templateRef = contentChild(TemplateRef);

    readonly containerStyle = signal({
        width: '100%',
        height: '100%'
    });


    private leftTab: Pane | undefined;
    private rightTab: Pane | undefined;

	resizeCalc = () => {
		const elementWidth = this.getInternalWidth();
		const elementHeight = this.getInternalHeight();
		let delta  = 0;
		const splitType = this.splitType();
        if (splitType === 1) {
			if (this.previousValue === -1) {
				this.previousValue = elementHeight;
			}
			delta = elementHeight - this.previousValue;
		} else if (splitType === 0) {
			if (this.previousValue === -1) {
				this.previousValue = elementWidth;
			}
			delta = elementWidth - this.previousValue;
		}
		
		if (delta !== 0) {
			let newLocation = this._divLocation();
			if (newLocation! > 0 && newLocation! < 1) {
				newLocation = splitType === 1 ? (this._divLocation()! * this.previousValue) : (this._divLocation()! * this.previousValue);
			}
			newLocation! += Math.round(delta * this.resizeWeight()!);
			this.divLocationChange.emit(newLocation!);
		}
									
		if (splitType === 1) {
			this.previousValue = elementHeight;
		}
		if (splitType === 0) {
			this.previousValue = elementWidth;
		}
	}
	
	onResize() {
		if (this.resizeTimeout) {
			clearTimeout(this.resizeTimeout);
		}
		this.resizeTimeout = setTimeout(this.resizeCalc, 50);
	}
	
    svyOnInit() {
        this._divLocation.set(this.divLocation());
        if (!this.servoyApi().isInAbsoluteLayout()) {
            this.containerStyle.update(s => ({...s, 'min-height': this.responsiveHeight() + 'px', 'position': 'relative'}));
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

    onChange( location: number ) {
        this._divLocation.set(location);
        this.divLocationChange.emit(this._divLocation()!);
        const onChangeMethodID = this.onChangeMethodID();
        if (onChangeMethodID) (onChangeMethodID as any)(-1, new Event('change'));
    }

    getRightTab() {
        return this.rightTab?this.rightTab.containsFormId:null;
    }

    getLeftTab() {
        return this.leftTab?this.leftTab.containsFormId:null;
    }

    private getInternalHeight() {
		return this.elementRef()!.nativeElement.getBoundingClientRect().height;
	}
	
	private getInternalWidth() {
		return this.elementRef()!.nativeElement.getBoundingClientRect().width;
	}
}

export interface Pane {
	containsFormId: string;
	relationName: string;
}
