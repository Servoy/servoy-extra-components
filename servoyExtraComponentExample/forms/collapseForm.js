/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D2FE7158-A7FB-471A-A496-30096E3946C4"}
 */
var visibleDP = 'Visible data provider';

/**
 * @param {JSEvent} event
 * @param {CustomType<servoyextra-collapse.card>} card
 * @param {CustomType<servoyextra-collapse.collapsible>} collapsible
 * @param {Number} cardIndex
 * @param {Number} collapsibleIndex
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"C26F2BF2-A0A9-4200-AC7A-742D815665F4"}
 */
function onCardClicked(event, card, collapsible, cardIndex, collapsibleIndex, dataTarget) {
	if (card) elements.label_cardClicked.text = "Card " + card.cardId + " from " + collapsible.collapsibleId + " clicked!";
}

/**
 * @param {JSEvent} event
 * @param {CustomType<servoyextra-collapse.collapsible>} collapsible
 * @param {Number} collapsibleIndex
 *
 * @properties={typeid:24,uuid:"1DC662A8-0D65-4443-946D-3BABB1C53E7D"}
 */
function onCollapsibleHidden(event, collapsible, collapsibleIndex) {
	elements.label_collapsible.text = collapsible.collapsibleId + " hidden!";
}

/**
 * @param {JSEvent} event
 * @param {CustomType<servoyextra-collapse.collapsible>} collapsible
 * @param {Number} collapsibleIndex
 *
 * @properties={typeid:24,uuid:"722167FA-C8E9-465E-B6DB-83F2CB823AB5"}
 */
function onCollapsibleShown(event, collapsible, collapsibleIndex) {
	elements.label_collapsible.text = collapsible.collapsibleId + " shown!";
}

/**
 * @param {JSEvent} event
 * @param {CustomType<servoyextra-collapse.collapsible>} collapsible
 * @param {Number} collapsibleIndex
 * @param {String} dataTarget
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"8A1AE2C9-8982-4854-B746-D854EF7909BB"}
 */
function onHeaderClicked(event, collapsible, collapsibleIndex, dataTarget) {
	elements.label_header.text = "Header clicked " + collapsible.headerHtml;
	return true;
}

/**
 * @param {JSEvent} event
 * @param {CustomType<servoyextra-collapse.collapsible>} collapsible
 * @param {Number} collapsibleIndex
 * @param {String} dataTarget
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"0AEE98D0-4EED-43F2-A9C4-E28C011740EF"}
 */
function onHeaderDoubleClicked(event, collapsible, collapsibleIndex, dataTarget) {
	elements.label_header.text = "Header double clicked " + collapsible.headerHtml;
	return true;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"6BC706A2-CDB0-466D-B749-0399D2BEECC9"}
 */
function onCreateCollapsible(event) {
	elements.collapse_7.createCollapsible("Created collapsible!", "id1");
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8D7F88A4-EFEC-4F64-B3B9-9ADC1DB8BF0D"}
 */
function onCreateCard(event) {
	var card = elements.collapse_7.createCard("This is the title of the card", "cardid1");
	card.contentHtml = '<span class="label-blue-gradient">content html of cardid1 created</span>';
	var collapsible  = elements.collapse_7.getCollapsibleById('collapsible 2');
	collapsible.cards = [card];
	
	elements.label_cardClicked.text = 'added card to collapsible '
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"48986B82-343A-45AE-BE10-56BE06C8C078"}
 */
function onGetCard(event) {
	elements.label_cardClicked.text = 'get card: index [1,0]: ' + elements.collapse_7.getCard(1, 0).cardId;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E5FB0704-1F7C-4B80-8FEF-C916A3BD6C0D"}
 */
function onGetCardByID(event) {
	elements.label_cardClicked.text = 'Get card by Id: ' + elements.collapse_7.getCardById('card 1');

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0E622868-0583-477D-9349-0E3537567FDA"}
 */
function onGetCollapsible(event) {
	elements.label_collapsible.text = elements.collapse_7.getCollapsible(2).headerHtml;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CF342D68-A0B3-4958-AD1C-26DC2088E7D6"}
 */
function onAddCollapsible(event) {
	var collapsible = elements.collapse_7.createCollapsible("Created collapsible!", "id1");
	collapsible.form = forms.formForCollapse1;
	collapsible.iconLocation = 'LEFT';

	elements.collapse_7.addCollapsible(collapsible);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"6A3CB04A-D4C6-4959-82DC-A406EE19CAAA"}
 */
function onGetCollapsibleByID(event) {
	elements.label_collapsible.text = 'Get collapsible by id: ' + elements.collapse_7.getCollapsibleById('collapsible 3').collapsibleId;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C238294E-8A15-49F7-B99B-DF995BFF7F22"}
 */
function onRemoveCollapsibleByID(event) {
	elements.collapse_7.removeCollapsibleById('collapsible 3');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"6FD03E9E-3D7F-430F-B692-12D14107819F"}
 */
function onRemoveAllCollapsibles(event) {
	elements.collapse_7.removeAllCollapsibles();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F7DD9948-6E52-4B40-871C-02E529BD76BB"}
 */
function onIsCollapsed(event) {
	elements.label_collapsible.text = 'colapsible 3 is collapsed: ' + elements.collapse_7.isCollapsed(2);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3367360F-93D4-41BE-AB61-8076DA40446E"}
 */
function onSetCollapsibles(event) {

	var collapsible1 = elements.collapse_7.createCollapsible("Created collapsible 1!", "idCol1");
	collapsible1.collapsibleHtml = '<span class="label-blue-gradient">This is collapsiblehtml for Created collapsible 1. Testing set collapsible</span>';
	var collapsible2 = elements.collapse_7.createCollapsible("Created collapsible 2!", "idCol2");
	collapsible2.form = forms.formForCollapse2;

	elements.collapse_7.setCollapsibles([collapsible1, collapsible2]);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9CBEBD2E-02A7-49C2-9F9B-BC1F3EA6472B"}
 */
function onToggle(event) {
	elements.collapse_7.toggle(2);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"79E13854-94D3-452D-97A5-6F86C8B0F819"}
 */
function onShow(event) {
	elements.collapse_7.show(1);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"6296DB4C-4D04-4EA6-9334-1DBC50C315AE"}
 */
function onHide(event) {
	elements.collapse_7.hide(1);
}
