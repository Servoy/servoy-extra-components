import { Component, Renderer2, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy, Input, TemplateRef, Inject, ContentChild, Output, EventEmitter } from '@angular/core';
import { BaseCustomObject, ServoyBaseComponent } from '@servoy/public';
import { ServoyPublicService } from '@servoy/public';
import { DOCUMENT } from '@angular/common';

@Component({
	selector: 'servoyextra-collapse',
	templateUrl: './collapse.html',
	styleUrls: ['./svy-collapse.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ServoyExtraCollapse extends ServoyBaseComponent<HTMLDivElement>{

	//model
	@Input() styleClass: string;
	@Input() tabSeq: number;
	@Input() collapsibles: Collapsible[];
	@Output() collapsiblesChange = new EventEmitter();
	@Input() accordionMode: boolean;
	@Input() expandedIndices: number[];

	//handlers
	@Input() onCollapsibleShown: (event: Event, collapsible: Collapsible, collapsibleIndex: number) => void;
	@Input() onCollapsibleHidden: (event: Event, collapsible: Collapsible, collapsibleIndex: number) => void;
	@Input() onHeaderClicked: (event: Event, collapsible: Collapsible, collapsibleIndex: number, dataTarget: string) => Promise<boolean>;
	@Input() onHeaderDoubleClicked: (event: Event, collapsible: Collapsible, collapsibleIndex: number, dataTarget: string) => Promise<boolean>;
	@Input() onCardClicked: (event: Event, card: Card, collapsible: Collapsible, cardIndex: number, collapsibleIndex: number, dataTarget: string) => void;


	@ContentChild(TemplateRef, { static: true })
	templateRef: TemplateRef<any>;

	preventSingleClick = false;
	timer: any;
	delay: Number;

	constructor(
		renderer: Renderer2,
		cdRef: ChangeDetectorRef,
		@Inject(DOCUMENT) private document: Document,
		private servoyPublic: ServoyPublicService) {
		super(renderer, cdRef);
	}

	svyOnInit() {
		super.svyOnInit();
		//get form states and fix possible accordionMode misconfiguration
		let openedCollapseFound = false;
		if (this.collapsibles) {
			for (let x = 0; x < this.collapsibles.length; x++) {
				const collapsible = this.collapsibles[x];

				if (this.expandedIndices && this.expandedIndices.indexOf(x) !== -1) {
					//should be expanded
					if (!this.accordionMode || !openedCollapseFound) {
						//when not in accordionMode or no collapse is yet expanded
						collapsible.isCollapsed = false;
						openedCollapseFound = true;
					} else {
						collapsible.isCollapsed = true;
					}
				}
				if (collapsible.form) {
					this.getFormState(collapsible.form, collapsible, !collapsible.isCollapsed);
				}
			}
		}
	}

	svyOnChanges(changes: SimpleChanges) {
		super.svyOnChanges(changes);
		if (this.collapsibles) {
			for (const collapsible of this.collapsibles) {
				if (collapsible.form) {
					this.getFormState(collapsible.form, collapsible, !collapsible.isCollapsed);
				}
				if (collapsible.cards) {
					for (const card of collapsible.cards) {
						if (card.form) {
							this.getFormState(card.form, card, !collapsible.isCollapsed);
						}
					}
				}
			}
		}
	}

	toggle(index: number) {
		if (!index) {
			index = 0;
		}
		const collapsible = this.getCollapsible(index);
		this.setCollapsedState(index, !collapsible.isCollapsed);
	}

	show(index: number) {
		if (!index) {
			index = 0;
		}
		this.setCollapsedState(index, false);
	}

	hide(index: number) {
		if (!index) {
			index = 0;
		}
		this.setCollapsedState(index, true);
	}

	/**
	 * onClick handler setting the collapsible state and possibly calling handlers
	 */
	onClick(e: Event) {
		this.preventSingleClick = false;
		this.timer = setTimeout(() => {
			if (!this.preventSingleClick) {
				e.stopPropagation();
				e.preventDefault();

				this.handleHeaderClickEvent(e, this.onHeaderClicked);
			}
		}, 300);
	}

	onDoubleClick(e: Event) {
		e.stopPropagation();
		e.preventDefault();

		this.preventSingleClick = true;
		clearTimeout(this.timer);

		this.handleHeaderClickEvent(e, this.onHeaderDoubleClicked);
	}
	
	handleHeaderClickEvent(e: Event, handlerFunction: (e: Event, collapsible: Collapsible, collapsibleIndex: number, dataTarget: string) => Promise<boolean>) {
		const collapsibleIndex = parseInt((e.target as Element).closest('.svy-collapse-collapsible').getAttribute('id').split('-')[1], 10);
		const collapsible = this.collapsibles[collapsibleIndex];
		const previousState = collapsible.isCollapsed;

		if (handlerFunction) {

			const dataTarget = (e.target as HTMLElement).closest('[data-target]');
			handlerFunction(e, collapsible, collapsibleIndex, dataTarget ? dataTarget.getAttribute('data-target') : null)
				.then((result) => {
					if (result !== false) {
						const collapsibleElement = this.getCollapsible(collapsibleIndex);
						this.setCollapsedState(collapsibleIndex, !previousState);
						if (!collapsibleElement.form && !collapsibleElement.cards) {
							this.cdRef.detectChanges();
						}
						this.closeOrOpenCollapsiblesAfterClick(e, collapsibleIndex, collapsible, previousState);
					}
				});
		} else {
			this.closeOrOpenCollapsiblesAfterClick(e, collapsibleIndex, collapsible, previousState);
		}
	}
	
	closeOrOpenCollapsiblesAfterClick(e: Event, collapsibleIndex: number, collapsible: Collapsible, previousState: boolean) {
		const [closedCollapsible, closedIndex] = this.setCollapsedState(collapsibleIndex, !previousState);
			if (closedCollapsible !== null && closedIndex !== null && this.onCollapsibleHidden) {
				// this block only executes when there was a close due to accordion mode.
				this.onCollapsibleHidden(e, closedCollapsible, closedIndex);
			}
			if (previousState === true && this.onCollapsibleShown) {
				this.onCollapsibleShown(e, collapsible, collapsibleIndex);
			} else if (previousState !== true && this.onCollapsibleHidden) {
				this.onCollapsibleHidden(e, collapsible, collapsibleIndex);
			}
	}

	onCardClick(e: Event, cardIndex: number, collapsibleIndex: number) {
		if (this.onCardClicked) {
			const collapsible = this.getCollapsible(collapsibleIndex);
			const dataTarget = this.getCollapsibleElement(collapsibleIndex, 'header');

			if (collapsible.cards && collapsible.cards[cardIndex]) {
				this.onCardClicked(e, collapsible.cards[cardIndex], collapsible, cardIndex, collapsibleIndex, dataTarget ? dataTarget.getAttribute('data-target') : null);
			} else {
				//collasible html only
				this.onCardClicked(e, null, collapsible, cardIndex, collapsibleIndex, dataTarget ? dataTarget.getAttribute('data-target') : null);
			}
		}
	}

	getFormIfVisible(collapse: Collapsible) {
		if (collapse && collapse.form && !collapse.isCollapsed) {
			return collapse.form;
		} else {
			return '';
		}
	}

	getCardFormIfVisible(collapse: Collapsible, card: Card) {
		if (collapse && card.form && !collapse.isCollapsed) {
			return card.form;
		} else {
			return '';
		}
	}

	getFormStyle(formToGet: string) {
		if (formToGet && this.servoyPublic) {
			const formCache = this.servoyPublic.getFormCacheByName(formToGet);
			if (formCache) {
				const style = {};
				if (formCache.absolute === true) {
					style['height'] = formCache.size.height + 'px';
				} else if (!formCache.absolute) {
					//responsive layout; possibly add min- and/or max-height
					if (formCache.size != null) {
						style['min-height'] = formCache.size.height + 'px;';
						style['max-height'] = formCache.size.height + 'px;';
					}
				}
				return style;
			}
		}
		return null;
	}

	isTrustedHTML(): boolean {
		if (this.servoyApi.trustAsHtml()) {
			return true;
		}
		return false;
	}

	private notifyChange(index: number) {
		this.collapsibles[index].getStateHolder().getChangedKeys().add('isCollapsed');
		this.collapsibles[index].getStateHolder().notifyChangeListener();
		this.collapsiblesChange.emit(this.collapsibles);
	}

	/**
	 * Sets the collapsed state of the collapsible with the given index
	 */
	private setCollapsedState(index: number, state: boolean) {
		const collapsibleToChange = this.getCollapsible(index);
		var accordionClosedCollapsible = [null, null];
		if (this.accordionMode && state === false) {
			//collapsible is being expanded and we are in accordionMode
			for (let i = 0; i < this.collapsibles.length; i++) {
				const otherCollapse = this.getCollapsible(i);
				//if another collapsible is open, close that
				if (i !== index && !otherCollapse.isCollapsed) {
					otherCollapse.isCollapsed = true;
					this.collapse(i, true);  //$NON-NLS-1$
					if (otherCollapse.form) {
						//a form needs to be hidden
						this.servoyApi.hideForm(otherCollapse.form, otherCollapse.relationName);
						this.notifyChange(index);
					} else if (otherCollapse.cards) {
						//maybe cards have forms to hide
						this.toggleCardVisibility(otherCollapse.cards, true);
						this.notifyChange(index);
					}
					accordionClosedCollapsible = [otherCollapse, i];
				}
			}
		}
		//toggle form visibility
		if (collapsibleToChange.form) {
			if (state === false) {
				this.servoyApi.formWillShow(collapsibleToChange.form, collapsibleToChange.relationName).then(() => {
					this.collapsibles[index].isCollapsed = state;
					this.cdRef.detectChanges();
					this.notifyChange(index);
				});
			} else if (state === true) {
				this.servoyApi.hideForm(collapsibleToChange.form, collapsibleToChange.relationName).then(() => {
					this.collapsibles[index].isCollapsed = state;
					this.cdRef.detectChanges();
					this.notifyChange(index);
				});
			}
		} else if (collapsibleToChange.cards) {
			//toggle form visibility on cards
			this.toggleCardVisibility(collapsibleToChange.cards, state).then(() => {
				this.collapsibles[index].isCollapsed = state;
				this.cdRef.detectChanges();
				this.notifyChange(index);
			});
		} else {
			this.collapsibles[index].isCollapsed = state;
			this.notifyChange(index);
		}
		return accordionClosedCollapsible;
	}

	/**
	 * Returns the collapsible at the given index
	 * return {{form: String, cards: Array}}
	 */
	private getCollapsible(index: number) {
		return this.collapsibles[index];
	}

	/**
	 * param {Array<{form: String}>} cardsArray
	 * param {String} state
	 * Shows/Hides forms when a card containing a form becomes visible / not visible
	 */
	private toggleCardVisibility(cardsArray: Card[], state: boolean) {
		return Promise.all(cardsArray.map((card) => {
			this.toggleFormVisibility(card, state);
		}));
	}

	private toggleFormVisibility(card: Card, state: boolean) {
		if (card.form) {
			if (state === false) {
				return this.servoyApi.formWillShow(card.form);
			} else {
				return this.servoyApi.hideForm(card.form);
			}
		} else {
			return true;
		}
	}

	/**
	 * Calls collapse method for the collapsible with the given index
	 */
	private collapse(index: number, state: boolean) {
		//set collapse state
		this.getCollapsibleElement(index, 'collapsible').isCollapse = state;
	}

	/**
	 * Returns the element containing the suffix (collapsible or header)
	 */
	private getCollapsibleElement(index: number, suffix: string): any {
		if (!(index >= 0)) {
			index = 0;
		}
		const myElem = this.document.getElementById(this.servoyApi.getMarkupId() + '-' + index + '-' + suffix); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$;
		return myElem;
	}

	/**
	 * Loads a form's absoluteLayout property and its properties to be able to obtain the design size
	 */
	private getFormState(form: string, collapsibleOrCard: Collapsible | Card, formWillShow: boolean) {
		if (formWillShow) {
			this.servoyApi.formWillShow(form, ('relationName' in collapsibleOrCard) ? collapsibleOrCard.relationName : null).then(() => {
				const formCache = this.servoyPublic.getFormCacheByName(form);
				if (formCache && formCache.absolute) {
					collapsibleOrCard.minResponsiveHeight = formCache.size.height;
					collapsibleOrCard.maxResponsiveHeight = formCache.size.height;
				}
			});
		}
	}
}

export class Collapsible extends BaseCustomObject {
	collapsibleId: string;
	isCollapsed: boolean;
	headerHtml: string;
	headerStyleClass: string;
	bodyStyleClass: string;
	collapsibleHtml: string;
	form: string;
	relationName: string;
	cards: Card[];
	styleClass: string;
	collapsedIconName: string;
	expandedIconName: string;
	iconLocation: string;
	minResponsiveHeight: number;
	maxResponsiveHeight: number;
}

export class Card extends BaseCustomObject {
	cardId: string;
	contentHtml: string;
	form: string;
	minResponsiveHeight: number;
	maxResponsiveHeight: number;
	styleClass: string;
}
