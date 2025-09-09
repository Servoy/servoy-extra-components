/**
 * @properties={typeid:35,uuid:"CC12C452-D729-4E74-903A-AA9226694545",variableType:-4}
 */
var overlayMode = true;

/**
 * @properties={typeid:35,uuid:"AC2B7D7E-C011-4F6A-8408-9ED72A3189B8",variableType:-4}
 */
var openOnUnselect = true;

/**
 * @properties={typeid:35,uuid:"6187F3A1-FA6F-4C68-837B-F431990A1019",variableType:-4}
 */
var closeOnSelect = true;

/**
 * @properties={typeid:35,uuid:"91CE5C1F-7427-4287-8C01-C5618EEC41D2",variableType:-4}
 */
var visibleDP = true;

/**
 * @properties={typeid:35,uuid:"FD00D63B-2B8E-472F-9C47-D2DCCD6BE572",variableType:-4}
 */
var enabledDP = true;

/**
 * @properties={typeid:35,uuid:"77B564D7-983A-4D6E-A1AE-190377825E30",variableType:-4}
 */
var editableDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"959F92C8-4C96-479A-ADF1-B67B022BE239"}
 */
var styleClassDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2F75857F-8BCE-4917-8085-53AF76CB29CA",variableType:8}
 */
var maximumSelectionSizeDP = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"145EF176-4BEA-46C0-B47E-FCAF81B0C619"}
 */
var valueSeparatorDP = ',';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D74231BF-6BA6-4BD9-8D55-DAFE3A583237"}
 */
var tooltipTextDP = 'Tooltip for select 2';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"709EBC69-9BE0-4F81-A09D-54C1B772BB5A"}
 */
var searchingTextDP = 'Searching..........';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2EE87EF1-A4D4-4B81-A26B-162FED4F4C1F"}
 */
var placeholderTextDP = 'Placeholder text';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"188E58B3-9181-4A9D-9A16-74D5F450E78B"}
 */
var noMatchesFoundTextDP = 'No matches found';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"ACDE4FA6-A36C-4C20-86B7-F1A19F07FFF8"}
 */
var selectDP = "This is the DP";

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"4AAEEBE8-C24E-44F9-95F9-420EA31A4024"}
 */
function onDataChange(oldValue, newValue, event) {
	elements.label_ondatachange.text = "Old value: " + oldValue + " newValue: " + newValue;
	return true
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4E7411E4-C686-4CB4-A85E-B472F25CBC77"}
 */
function onFocusGained(event) {
	elements.label_focus.text = "Select 2 focus gained"
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"666AEE1A-9161-4EBB-B0D3-A531B004DC51"}
 */
function onFocusLost(event) {
	elements.label_focus.text = "Select 2 focus lost"
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9E7FD6F6-DC13-47A4-B24B-BAF107105F77"}
 */
function onRequestFocusTrue(event) {
	elements.select2tokenizer_1.requestFocus(true);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"BC0E86E2-5007-49FE-8771-8A944600A9A8"}
 */
function onRequestFocusFalse(event) {
	elements.select2tokenizer_1.requestFocus(false);
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"093E05CB-C09F-4E97-9354-F9F6E83E08F5"}
 */
function onAction_allowNewEntries(event, dataTarget) {
	elements.select2tokenizer_1.allowNewEntries = !elements.select2tokenizer_1.allowNewEntries;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"96EF432C-957D-4C87-A4D9-84754F35E023"}
 */
function onAction_closeOnSelect(event, dataTarget) {
	elements.select2tokenizer_1.closeOnSelect = !elements.select2tokenizer_1.closeOnSelect;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"7C8C85FF-EE0E-4481-B07D-AB03DD8DC993"}
 */
function onAction_clearSearchTextOnSelect(event, dataTarget) {
	elements.select2tokenizer_1.clearSearchTextOnSelect = !elements.select2tokenizer_1.clearSearchTextOnSelect;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"99EF469A-67BD-4E29-A6F8-2D6BED305F85"}
 */
function onAction_containSearchText(event, dataTarget) {
	elements.select2tokenizer_1.containSearchText = !elements.select2tokenizer_1.containSearchText;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"47E0AFB9-46EE-45B8-ADD4-38C0F98BEB29"}
 */
function onAction_openOnUnselect(event, dataTarget) {
	elements.select2tokenizer_1.openOnUnselect = !elements.select2tokenizer_1.openOnUnselect;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"2D6219E4-A091-4C8E-84E4-E616FE1CC997"}
 */
function onAction_overlayMode(event, dataTarget) {
	elements.select2tokenizer_1.overlayMode = !elements.select2tokenizer_1.overlayMode;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"2BD29C29-7124-4193-AE4A-388054B6BD0B"}
 */
function onAction_editable(event, dataTarget) {
	elements.select2tokenizer_1.editable = !elements.select2tokenizer_1.editable;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"288D69B3-0E23-4CD9-9710-0B2F802B2133"}
 */
function onAction_enabled(event, dataTarget) {
	elements.select2tokenizer_1.enabled = !elements.select2tokenizer_1.enabled;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"28C08AD5-8CE4-4A81-84D1-7BC2D9C62B2A"}
 */
function onAction_visible(event, dataTarget) {
	elements.select2tokenizer_1.visible = !elements.select2tokenizer_1.visible;
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
 * @properties={typeid:24,uuid:"E9D07BAC-FD66-4369-BD7C-4E2DCBC54883"}
 */
function onDataChange_maximumSelectionSize(oldValue, newValue, event) {
	elements.select2tokenizer_1.maximumSelectionSize = maximumSelectionSizeDP;
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
 * @properties={typeid:24,uuid:"8FA4A012-0BE2-4AFF-8D4D-F1F47DB04806"}
 */
function onDataChange_valueSeparator(oldValue, newValue, event) {
	elements.select2tokenizer_1.valueSeparator = valueSeparatorDP;
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
 * @properties={typeid:24,uuid:"B75F2FC7-380A-4C51-BF43-F6FBD4346E1D"}
 */
function onDataChange_styleClass(oldValue, newValue, event) {
	elements.select2tokenizer_1.styleClass = styleClassDP
	return true
}
