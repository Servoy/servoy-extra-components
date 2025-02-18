import { Component, Renderer2, SimpleChanges, ChangeDetectorRef, ViewChild, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Select2Option, Select2UpdateEvent, Select2, Select2RemoveEvent } from 'ng-select2-component';
import { ServoyBaseComponent, IValuelist, Format } from '@servoy/public';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'servoyextra-select2tokenizer',
    templateUrl: './select2tokenizer.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
    @Input() format: Format;
    @Input() cssPosition: { width: number; height: number };
    @Input() containSearchText: boolean;

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
            this.select2.open.subscribe(() => {
                if (this.mustExecuteOnFocus !== false) {
                    this.onFocusGainedMethodID(new CustomEvent('open'));
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
		if (!this.userChangedValue) return;

        if (!this.compareArrays(this.filteredDataProviderId, event.value)) {
            if (event.value.length > 0) {
                if (event.value.length > 1 && this.isTypeString()) {
                    this.filteredDataProviderId = event.value;
                    this.dataProviderID = event.value.join('\n');
                } else if (event.value.length === 1 || this.isTypeNumber() || this.isTypeBoolean()) {
                    this.filteredDataProviderId = event.value;
                    this.dataProviderID = this.filteredDataProviderId[0];
                } else {
                    console.log('Warning dataProviderID typeof ' + typeof this.dataProviderID + ' not allowed');
                }
            } else {
				this.filteredDataProviderId = [];
                this.dataProviderID = null;
            }
            this.dataProviderIDChange.emit(this.dataProviderID);
            // todo if this was a deselect, should we not check this and don't go into the if below?
            // i guess this could be a deselect to nothing but also a select to a 1 less value... (but selection is still more then 0)
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
    }

    svyOnChanges(changes: SimpleChanges) {
        if (changes['valuelistID']) {
            this.setData();
        }
        if (changes['dataProviderID']) {
			this.setFilteredDataProviderId();
			this.setData();
		}
        if (changes['cssPosition']) {
			const currentValue = changes['cssPosition'].currentValue;
			const listContainer = this.doc.querySelector('.cdk-overlay-pane') as HTMLElement;
			if (currentValue && listContainer) {
				listContainer.style.minWidth = currentValue.width;
			}
		}
        super.svyOnChanges(changes);
    }
    
    setFilteredDataProviderId() {
		if (!this.dataProviderID) {
			this.filteredDataProviderId = [];
		} else {
			this.filteredDataProviderId = this.isTypeString() && typeof this.dataProviderID === 'string' ? this.dataProviderID.split('\n') : [this.dataProviderID];
			if (this.valuelistID.length && typeof this.valuelistID[this.valuelistID.length-1].realValue === 'number') {
				this.filteredDataProviderId.forEach((item,index) => {
					!isNaN(item) && (this.filteredDataProviderId[index] = Number(item));
				});
			}
		}
	}

    checkDataList(realValue: any) {
        if (!this.data.some(option => realValue === option.value)) {
            const option: Select2Option = {
                value: realValue,
                label: `${realValue}` // should we do here just an empty string or really the realvalue..
                // label should be a string, otherwise the library will throw an error when it tries to do a ".replace" on this label
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

    removedOption(event: any) {
		this.userChangedValue = true;
        this.updateValue(event);
        if (this.openOnUnselect && !event.component.isOpen) {
            event.component.toggleOpenAndClose();
        }
    }

    listClosed(event: Select2) {
		this.userChangedValue = false;
		this.resetSearch();
        if (this.selectOnClose) {
            const highlightItem = this.doc.querySelector('.select2-results__option--highlighted');
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
                    this.userChangedValue = true;
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
    
    resetSearch = () => {
		this.valuelistID.filterList('');
		this.setData();
	}

    handleSearch = (event: KeyboardEvent) => {
		const input = event.target as HTMLInputElement;
		const value = input.value;
		if (value) {
			if (this.containSearchText) {
				this.valuelistID.filterList('%' + value);
			} else {
				this.valuelistID.filterList(value);
			}
			this.setData();			
		} else {
			this.resetSearch();
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
		return this.servoyAttributes ? Object.keys(this.servoyAttributes).includes('keylistener') : false;
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