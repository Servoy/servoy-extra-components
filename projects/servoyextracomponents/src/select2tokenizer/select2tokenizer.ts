import { Component, Renderer2, SimpleChanges, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Select2Option, Select2UpdateEvent, Select2, Select2RemoveEvent } from 'ng-select2-component';
import { ServoyBaseComponent, IValuelist, Format } from '@servoy/public';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'servoyextra-select2tokenizer',
    templateUrl: './select2tokenizer.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServoyExtraSelect2Tokenizer extends ServoyBaseComponent<HTMLDivElement> {

    @ViewChild(Select2) select2: Select2;

    @Input() onDataChangeMethodID: (e: Event, data?: any) => void;
    @Input() onFocusGainedMethodID: (e: Event, data?: any) => void;
    @Input() onFocusLostMethodID: (e: Event, data?: any) => void;

    @Input() placeholderText: string;
    @Input() readOnly: boolean;
    @Input() valuelistID: IValuelist;
    @Input() styleClass: string;
    @Input() tabSeq: number;
    @Input() toolTipText: string;
    @Input() dataProviderID: any;
    @Input() enabled: boolean;
    @Input() editable: boolean;
    @Input() noMatchesFoundText: string;
    @Input() maximumSelectionSize: number;
    @Input() openOnUnselect: boolean;
    @Input() closeOnSelect: boolean;
    @Input() clearSearchTextOnSelect: boolean;
    @Input() selectOnClose: boolean;
    @Input() allowNewEntries: boolean;
    @Input() size: { width: number; height: number };
    @Input() format: Format;

    @Output() dataProviderIDChange = new EventEmitter();

    tabIndex: number;

    data: Select2Option[] = [];
    filteredDataProviderId: Array<any>;
    listPosition: 'above' | 'below' | 'auto' = 'auto';
    mustExecuteOnFocus = true;

    userChangedValue = false;

    constructor(renderer: Renderer2, cdRef: ChangeDetectorRef, @Inject(DOCUMENT) private doc: Document) {
        super(renderer, cdRef);
    }

    @HostListener('keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            // stop propagation when using list form component (to not break the selection)
            event.stopPropagation();
        }
    }

    svyOnInit() {
        super.svyOnInit();
        //this.setData(); it is already done in svyOnChanges
        this.attachFocusListeners(this.getNativeElement());
    }

    attachFocusListeners(nativeElement: HTMLDivElement) {
        if (this.onFocusGainedMethodID) {
            this.select2.focus.subscribe(() => {
                if (this.mustExecuteOnFocus !== false) {
                    this.onFocusGainedMethodID(new CustomEvent('focus'));
                }
                this.mustExecuteOnFocus = true;
            });
            /* used for triggering a focus gained when the component is not editable
             * fix for SVYX-210 */
            this.renderer.listen(nativeElement, 'focusin', (e) => {
                if (!this.isEditable()) {
                    this.onFocusGainedMethodID(e);
                }
            });
        }
        if (this.onFocusLostMethodID) {
            this.select2.close.subscribe(() => {
                this.onFocusLostMethodID(new CustomEvent('close'));
            });

            /* used for triggering a focus lost when the component is not editable
             * fix for SVYX-210 */
            this.renderer.listen(nativeElement, 'focusout', (e) => {
                if (!this.isEditable()) {
                    this.onFocusLostMethodID(e);
                }
            });
        }
    }

    requestFocus(mustExecuteOnFocusGainedMethod: boolean) {
        this.mustExecuteOnFocus = mustExecuteOnFocusGainedMethod;
        this.getNativeElement().focus();
        this.select2.toggleOpenAndClose();
    }

    isEnabled() {
        return this.enabled === true && this.isEditable();
    }

    isEditable() {
        return this.readOnly === false && this.editable === true;
    }

    setData() {
        if (this.valuelistID) {
            const options: Select2Option[] = [];
            for (const value of this.valuelistID) {
                if (value.realValue === null || value.realValue === '') {
                    continue;
                }
                options.push({
                    value: value.realValue,
                    label: value.displayValue
                });
            }
            this.data = options;
            if (this.filteredDataProviderId && this.filteredDataProviderId.length) {
                for (let i = 0; this.filteredDataProviderId && i < this.filteredDataProviderId.length; i++) {
                    const realValue = this.filteredDataProviderId[i];
                    this.checkDataList(realValue);
                }
            }
        }
    }

    onDataChangeCallback(event: any, returnval: any) {
        const stringValue = (typeof returnval === 'string' || returnval instanceof String);
        if (returnval === false || stringValue) {
            //this.renderer.removeClass( this.select2, 'ng-valid' );
            this.renderer.addClass(this.elementRef.nativeElement, 'ng-invalid');
        } else {
            this.renderer.removeClass(this.elementRef.nativeElement, 'ng-invalid');
            //this.renderer.addClass( this.select2, 'ng-valid' );
        }
    }

    updateValue(event: Select2UpdateEvent<any>) {
		setTimeout(()=>{
			if (!this.userChangedValue) return;

        	if (!this.compareArrays(this.filteredDataProviderId, event.value)) {
            	if (event.value.length > 0) {
                	if (event.value.length > 1 && this.isTypeString()) {
                    	this.filteredDataProviderId = event.value;
                    	this.dataProviderID = event.value.join('\n');
                	} else if (event.value.length === 1 || this.isTypeNumber() || this.isTypeBoolean()) {
                    	this.filteredDataProviderId[0] = event.value[event.value.length - 1];
                    	this.dataProviderID = this.filteredDataProviderId[0];
                	} else {
                    	console.log('Warning dataProviderID typeof ' + typeof this.dataProviderID + ' not allowed');
                	}
            	} else {
                	this.dataProviderID = null;
            	}
            	this.dataProviderIDChange.emit(this.dataProviderID);
            	if (this.closeOnSelect && event.component.isOpen) {
                	event.component.toggleOpenAndClose();
 	           	}
            	if (this.clearSearchTextOnSelect && !this.closeOnSelect && event.component.isOpen) {
                	const searchText = this.getNativeChild().querySelector('input');
                	if (searchText) {
                    	searchText.value = '';
                    	searchText.dispatchEvent(new KeyboardEvent('keyup'));
                	}
            	}
        	}
		});
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes['valuelistID']) {
            this.setData();
        }
        if (changes['dataProviderID']) {
            this.filteredDataProviderId = this.dataProviderID ? (this.isTypeString() ? this.dataProviderID.split('\n') : [this.dataProviderID]) : [];
            this.setData();
        }
        if (changes['size']) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'height', this.size.height);
        }
        super.svyOnChanges(changes);
    }

    checkDataList(realValue: any) {
        if (!this.data.some(option => realValue === option.value)) {
            const option: Select2Option = {
                value: realValue,
                label: realValue // should we do here just an empty string or really the realvalue..
            };
            this.data.push(option);
            this.valuelistID.getDisplayValue(realValue).subscribe((val) => {
                if (val) {
                    option.label = val;
                    this.cdRef.detectChanges();
                }
            });
        }
    }

    removedOption(event: Select2RemoveEvent<any>) {
		this.userChangedValue = true;
        if (this.openOnUnselect && !event.component.isOpen) {
            event.component.toggleOpenAndClose();
        }
    }

    listClosed(event: Select2) {
		this.userChangedValue = false;
        if (this.selectOnClose) {
            const highlightItem = this.getNativeChild().querySelector('.select2-results__option--highlighted');
            if (highlightItem) {
                const displayValue = highlightItem.textContent;
                let found = false;
                let realValue: any;
                for (let i = 0; i < this.valuelistID.length; i++) {
                    if (this.valuelistID[i].displayValue === displayValue) {
                        // set value
                        found = true;
                        realValue = this.valuelistID[i].realValue;
                        break;
                    }
                }
                if (found && this.filteredDataProviderId.indexOf(realValue) < 0) {
                    event.select({
                        value: realValue,
                        label: realValue
                    });
                }
            }
        }
        if (!this.allowNewEntries && !this.hasKeyListenerAttribute()) {
			const searchBox = this.doc.querySelector('.select2-search__field');
			if (searchBox) {
				searchBox.removeEventListener('keydown', this.handleSearch);
			}
		}
    }

    handleSearch = (event: KeyboardEvent) => {
		const input = event.target as HTMLInputElement;
		const value = input.value;
		if (value) {
			this.valuelistID.filterList('%' + value);
			this.setData();
		}
	}

    listOpened(event: Select2) {
		this.userChangedValue = true;
        if (this.allowNewEntries || this.hasKeyListenerAttribute()) {
            setTimeout(() => {
                const inputTextfield = this.doc.querySelector('.select2-search__field') as HTMLInputElement;
                if (inputTextfield) {
                    const init = inputTextfield.getAttribute('svy-typing-init');
                    if (!init){
                        inputTextfield.setAttribute('svy-typing-init', 'true');
                        let prevValue: string;
                        inputTextfield.addEventListener('keyup', (ev: KeyboardEvent) => {
							if (this.allowNewEntries) {
								const newValue = inputTextfield.value;
                            	if (prevValue != newValue) {
                                	const option: Select2Option = {
                                    	value: newValue,
                                    	label: newValue
                                	};
                                	if (prevValue) {
                                    	if (newValue != '' && !this.data.some(item => item.value == newValue)) {
                                        	this.data[0] = option;
                                    	} else {
                                        	this.data.shift();
                                    	}
                                	} else {
                                    	this.data.unshift(option);
                                	}
                                	prevValue = newValue;
                                }
							}
							const keyupEvent = new CustomEvent('keyup', {
								bubbles: true,
								detail: ev
							});
							this.getNativeChild().dispatchEvent(keyupEvent);
                        });
                    }
                }
            }, 300);
        } else {
			setTimeout(() => {
				const searchBox = this.doc.querySelector('.select2-search__field');
				if (searchBox) {
					searchBox.addEventListener('keyup', this.handleSearch);
				}
			}, 50);
		}
    }

    hasKeyListenerAttribute() {
		return Object.keys(this.servoyAttributes).includes('keylistener');
	}

    setTabIndex(tabIndex: number) {
        this.tabIndex = tabIndex;
    }

    /**
     * Compares 2 arrays
     *
     * @param arr1
     * @param arr2
     */
    private compareArrays(arr1: any, arr2: any) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
        if (arr1.length !== arr2.length) return false;
        for (let i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] + '' !== arr2[i] + '') {
                return false;
            }
        }
        return true;
    }

    private isTypeString() {
        return this.format.type === "TEXT";
    }

    private isTypeNumber() {
        return this.format.type === "INTEGER";
    }

    private isTypeBoolean() {
        return typeof this.dataProviderID === 'boolean';
    }
}