/**
 * @properties={typeid:35,uuid:"793FB07D-4D4E-47DA-A2C0-2AAF87080884",variableType:-4}
 */
var visibleDP = true;

/**
 * @properties={typeid:35,uuid:"F7CF65C8-0AA1-4AF7-BDD2-8D19530B7C22",variableType:-4}
 */
var enabledDP = true;

/**
 * @properties={typeid:35,uuid:"4EDD69CB-6189-49D3-A858-2439A162770B",variableType:-4}
 */
var editableDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"5901A918-9D82-4EB5-9546-C4D4A6B9ED9A"}
 */
var tooltipTextDP = 'This is the tooltip text.';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"857CC88F-6672-42A7-9DF7-0CBA23B91E7E"}
 */
var textDP = 'This is the text from properties.';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3A61E16D-9A0B-47E8-BEBC-A6D39AD2C052"}
 */
var placeholderTextDP = 'This is the placeholder text.';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"679D1FC1-F1D0-4549-B11E-618A2E43386C",variableType:8}
 */
var scrollYDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F969894E-895F-43AD-8408-C3BD990D3F8E",variableType:8}
 */
var scrollXDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F8F33355-3D4E-420D-83DE-75D07F679CD6",variableType:4}
 */
var responsiveHeightDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FDB425C8-74E5-478F-AD5A-4E8AB2AA2539"}
 */
var styleClassDP = null;

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
	var x = scrollXDP ? scrollXDP : elements.htmlarea_9.getScrollX();
	var y = scrollYDP ? scrollYDP : elements.htmlarea_9.getScrollY();
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

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"21C661C4-2588-44B2-B8AA-079927506783"}
 */
function onAction_displayTags(event, dataTarget) {
	elements.htmlarea_9.displaysTags = !elements.htmlarea_9.displaysTags;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"E8BE95CB-C84B-4590-ABA6-04B7FC4441B8"}
 */
function onAction_visible(event, dataTarget) {
	var visible = !elements.htmlarea_9.visible
	elements.htmlarea_9.visible = visible;
	visibleDP = visible
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"DC2036AA-07DC-4B8B-828E-0400D0AB7152"}
 */
function onAction_enabled(event, dataTarget) {
	var enabled = !elements.htmlarea_9.enabled
	elements.htmlarea_9.enabled = enabled;
	enabledDP = enabled
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"915FDA04-6F9F-4412-A327-2972FC7EFFC4"}
 */
function onAction_editable(event, dataTarget) {
	var editable = !elements.htmlarea_9.editable;
	elements.htmlarea_9.editable = editable;
	editableDP = editable;
}

/**
 * Handle changed data, return false if the value should not be accepted.
 * JSEvent.data will contain extra information about dataproviderid, its scope and the scope id (record datasource or form/global variable scope)
 *
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"A01C244E-C3CE-4804-96E3-004D2CB31C8B"}
 */
function onDataChange_styleClass(oldValue, newValue, event) {
	elements.htmlarea_9.styleClass = styleClassDP;
	return true
}

/**
 * Handle changed data, return false if the value should not be accepted.
 * JSEvent.data will contain extra information about dataproviderid, its scope and the scope id (record datasource or form/global variable scope)
 *
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"D84730C9-9121-46CB-A00F-068DBEF9C95A"}
 */
function onDataChange_responsiveHeight(oldValue, newValue, event) {
	elements.htmlarea_9.responsiveHeight = responsiveHeightDP;
	return true
}
