import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, ChangeDetectorRef, SimpleChanges, Renderer2, ChangeDetectionStrategy, ViewChild, ElementRef} from '@angular/core';

import { BaseCustomObject, ServoyBaseComponent } from '@servoy/public';

@Component( {
    selector: 'servoyextra-splitpane',
    templateUrl: './splitpane.html',
    changeDetection: ChangeDetectionStrategy.OnPush
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

    @ContentChild( TemplateRef, {static: true} ) templateRef: TemplateRef<any>;

    @ViewChild('element', { static: true }) elementRef: ElementRef;

    containerStyle = {
        width: '100%',
        height: '100%'
    };


    private leftTab: Pane;
    private rightTab: Pane;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef) {
        super(renderer, cdRef);
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
                            array.filter((element: string) => element !== '').forEach(
                                (element: string) => this.elementRef.nativeElement.classList.remove(element)
                            );
                        }
                        if (change.currentValue) {
                            const array = change.currentValue.trim().split(' ');
                            array.filter((element: string) => element !== '').forEach(
                                (element: string) => this.elementRef.nativeElement.classList.add(element)
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
}

class Pane extends BaseCustomObject {
	containsFormId: string;
	relationName: string;
}
