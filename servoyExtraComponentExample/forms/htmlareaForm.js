/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"C3D034C5-4363-4BF4-A600-D873969C31B1"}
 */
var textboxDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AD539E66-54FE-4634-B82B-BEEC4D4CE4EC"}
 */
var htmlAreaDP = null;

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"09785FB9-A5B9-41DB-89D4-C89E31626F87"}
 */
function onAction(event) {
	elements.label_action.text = "on action";
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F7C85916-9A90-4636-8944-8E85D6E94A5F",variableType:4}
 */
var changed = 0;

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"D8A09DB9-C3B4-4376-B4A4-B230C338202A"}
 */
function onDataChange(oldValue, newValue, event) {

	elements.label_dataChange.text = "Data changed" + changed;
	changed++;
	return true
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"862F90D9-C591-4AF2-B86F-BA569BAC1809"}
 */
function onFocusGained(event) {

	elements.label_focus.text = "Focus gained";
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5FFC4EA1-F1E6-4136-AF82-53BA4C0D8292"}
 */
function onFocusLost(event) {

	elements.label_focus.text = "Focus lost";
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D3F3F3F4-0F71-40EA-B840-B44CA5B830FB"}
 */
function onRightClick(event) {
	elements.label_action.text = "on right click";
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1A423EB0-434A-4733-AB26-D90C8615E804"}
 */
function onGetAsPlainText(event) {
	textboxDP = elements.htmlarea_9.getAsPlainText();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"EB020899-FCBC-4BEC-B23A-2E5026A218C6"}
 */
function onAddShortcut(event) {
	elements.htmlarea_9.addShortCut("F7", callback);
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7A445277-D9EF-44D2-A2B8-04066D9E589C",variableType:4}
 */
var i = 0;
/**
 * @properties={typeid:24,uuid:"44820402-8EC5-4054-B042-08BB2EB95E85"}
 */
function callback() {
	elements.label_action.text = "Shortcut pressed. Callback called" + i;
	i++;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"FC5171EA-F182-4242-A3D9-FFB9F37210AE"}
 */
function onSetScroll(event) {
	elements.label_action.text = "Scroll set";
	var x = elements.htmlarea_9.getScrollX();
	var y = elements.htmlarea_9.getScrollY();
	elements.htmlarea_9.setScroll(x + 10, y + 10);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"BA4D795E-C87F-43B0-85EF-FCB4825907E0"}
 */
function onRequestFocusTrue(event) {
	elements.htmlarea_9.requestFocus(true);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"CA595A41-466F-4313-A2E2-21F125AC3875"}
 */
function onRequestFocusFalse(event) {
	elements.htmlarea_9.requestFocus(false);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2AD82363-638B-4683-B700-D29EEA8EDCA3"}
 */
function onReplaceSelectedText(event) {
	elements.htmlarea_9.replaceSelectedText("This is the text to replace!");
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"35C5371F-CAD6-41A7-BA4D-A1699367299C"}
 */
function onGetSelectedText(event) {
	textboxDP = elements.htmlarea_9.getSelectedText();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"A6E3EFE5-9A58-4ECD-8A5C-1B687DF41002"}
 */
function onGetScrollY(event) {
	textboxDP = elements.htmlarea_9.getScrollY();	
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"745FFF80-13E3-4789-A005-6A468E1E549B"}
 */
function onGetScrollX(event) {
	textboxDP = elements.htmlarea_9.getScrollX();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D0EA4CD4-4552-42FA-9475-787593AFAEB5"}
 */
function onSelectAll(event) {
	elements.htmlarea_9.selectAll();
}
