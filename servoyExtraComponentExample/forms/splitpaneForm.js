/**
 * @properties={typeid:35,uuid:"B0F36237-C448-4A38-8FAA-9AB8BCC992F5",variableType:-4}
 */
var visibleDP = true;

/**
 * @properties={typeid:35,uuid:"8F3CE6C0-F0BF-4734-BB22-81AFBB4B63A3",variableType:-4}
 */
var enabledDP = true;

/**
 * @param {Number} previousIndex
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"469B48DD-EDA1-4032-BCE1-F9862DACA376"}
 */
function onChange(previousIndex, event) {
	elements.label_onchange.text = "On change previous index: " + previousIndex;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"564D269F-7A97-42D7-A8AE-31384A554A12"}
 */
function onGetDividerLocation(event) {
	elements.label_1.text = elements.splitpane_5.getDividerLocation();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1C041004-6C1A-4409-BFA1-F740A679D2B3"}
 */
function onGetRelativeDividerLocation(event) {
	elements.label_1.text = elements.splitpane_5.getRelativeDividerLocation();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5512F86D-5514-4820-AD16-BB1BB45A02FB"}
 */
function onGetDividerSize(event) {
	elements.label_1.text = elements.splitpane_5.getDividerSize();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F55EC629-DDE7-45C2-AA07-3031EBCC5C25"}
 */
function onGetLeftForm(event) {
	var form = elements.splitpane_5.getLeftForm();
	elements.label_1.text = form;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7E3E273A-ED48-4F43-83F1-C1704ED5E3D0"}
 */
function onGetLeftFormMinSize(event) {
	elements.label_1.text = elements.splitpane_5.getLeftFormMinSize();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4553F47D-B3E7-4DA6-8F54-09E052E9C710"}
 */
function onGetResizeWeight(event) {
	elements.label_1.text = elements.splitpane_5.getResizeWeight();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2A41D0D8-8F06-426C-A0CB-4778B8E3215B"}
 */
function onGetRightForm(event) {
	elements.label_1.text = elements.splitpane_5.getRightForm();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C8FC89AA-77A2-413F-BB23-3F77B2DB7CB7"}
 */
function onGetRightFormMinSize(event) {
	elements.label_1.text = elements.splitpane_5.getRightFormMinSize();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9A608F37-31FE-47B3-9C94-CB850D7D689F"}
 */
function onSetDividerLocation(event) {
	elements.splitpane_5.setDividerLocation(6);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2A7D79CE-22F6-4362-99A8-B604EC90FFF0"}
 */
function onSetDividerSize(event) {
	elements.splitpane_5.setDividerSize(150);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D2EB9031-1BE1-434D-A49B-110CE580388A"}
 */
function onSetLeftForm(event) {
	elements.label_2.text = 'Set left form: ' + elements.splitpane_5.setLeftForm('formForSplitPaneLeftForm', 'employees_to_orders');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"38939826-BE61-46C0-862E-B99FB6ED53F7"}
 */
function onSetLeftFormMinSize(event) {
	elements.splitpane_5.setLeftFormMinSize(50);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8EFDE4A1-5FC0-43E6-B43A-808AE10A0D7C"}
 */
function onSetResizeWeight(event) {
	elements.splitpane_5.setResizeWeight(5);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C7A4880E-8E11-4BD9-ACCC-41E90ADA9F0C"}
 */
function onSetRightForm(event) {
	elements.label_2.text = 'Set right form: ' + elements.splitpane_5.setRightForm('formForSplitPaneRightForm', 'employees_to_orders');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8FED5327-A63F-400D-A12B-AD413D78330A"}
 */
function onSetRightFormMinSize(event) {
	elements.splitpane_5.setRightFormMinSize(60);
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"642B1FFD-191F-49C5-A64B-B7B9D661EC51"}
 */
function onAction_enabled(event, dataTarget) {
	elements.splitpane_5.enabled = !elements.splitpane_5.enabled;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"8F592965-B5B6-43B6-A78A-6642A600E3E2"}
 */
function onAction_readOnly(event, dataTarget) {
	elements.splitpane_5.readOnly = !elements.splitpane_5.readOnly;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"B31CC30E-BC51-4B16-AC07-DCC0A27AB255"}
 */
function onAction_visible(event, dataTarget) {
	elements.splitpane_5.visible = !elements.splitpane_5.visible;
}
