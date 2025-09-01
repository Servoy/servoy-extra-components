/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9D684D6B-5A4C-453D-8616-F40BBB3FB4D0"}
 */
var tooltipTextDP = "This is the tooltip text of the spinner";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1A000727-1D42-4A81-A2AC-D19113B23DC9"}
 */
var textDP = "This is the text of the spinner";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E0585C4D-2A26-4EE7-9FD9-6583DF1564C5"}
 */
var styleClassDP = "spinner-lg";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"059BA900-5804-4FB8-961E-107E26C710A3"}
 */
var placeholderTextDP = "This is the placeholder text of the spinner";

/**
 * @properties={typeid:35,uuid:"2D9337BB-EF9C-4A08-8EFB-404929DAB71E",variableType:-4}
 */
var visibleDP = true;

/**
 * @properties={typeid:35,uuid:"B7DD2665-A377-453A-8A38-77F7F1F39987",variableType:-4}
 */
var enabledDP = true;

/**
 * @properties={typeid:35,uuid:"005E32CC-101C-416E-A4EE-E32E1337C12B",variableType:-4}
 */
var editableDP = true;

/**
 * @properties={typeid:35,uuid:"00615FEE-A71F-4F87-B883-A8C1C27B54EC",variableType:-4}
 */
var displayTagsDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8BBBB4C1-8DE7-4F34-8EC0-26846EE5BDF4"}
 */
var spinnerDP = "This is the spinner DP";

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"74B1B31D-0FE2-4791-815E-C757D9760913"}
 */
function onFocusGained(event) {
	elements.label_12.text = "Focus gained for spinner."
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4F4DD16A-76DC-4510-A4C0-A1DFB55F9447"}
 */
function onFocusLost(event) {
	elements.label_12.text = "Focus lost for spinner."
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"2A28FA29-BE07-4544-8A56-AC652A40BE88"}
 */
function onDataChange(oldValue, newValue, event) {
	elements.label_1.text = 'Old value: ' + oldValue + ' new value: ' + newValue;
	return true
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"33486815-CAC3-41F6-96E5-BE6EBA8445D6"}
 */
function onRightClick(event) {
	elements.label_13.text = "Spinner on right click"
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3D1E5056-7B3E-43DE-AE4C-811622385D2F"}
 */
function onAction(event) {
	elements.label_13.text = "Spinner on action"
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8E9D5A75-673F-47CE-97FD-B7143F1CA98E"}
 */
function onRequestFocusTrue(event) {
	elements.spinner_11.requestFocus(true);
	elements.label_1.text = "request focus true";
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"A335B306-6410-4251-9BED-9EA3E884CD55"}
 */
function onRequestFocusFalse(event) {
	elements.spinner_11.requestFocus(false);
	elements.label_1.text = "request focus false";
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"C6F59779-E9C9-49E0-B7A1-22CDBDCF88CA"}
 */
function onAction_displayTags(event, dataTarget) {
	var displaysTags = !elements.spinner_11.displaysTags;
	elements.spinner_11.displaysTags = displaysTags;
	displayTagsDP = displaysTags;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"9B59573A-A91D-443B-86D3-FE4FCD19673E"}
 */
function onAction_editable(event, dataTarget) {
	var editable = !elements.spinner_11.editable;
	elements.spinner_11.editable = editable;
	editableDP = editable;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"A260289C-E525-423C-BC47-F813B3ED537A"}
 */
function onAction_enabled(event, dataTarget) {
	var enabled = !elements.spinner_11.enabled
	elements.spinner_11.enabled = enabled;
	enabledDP = enabled
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"0060FF2D-66E5-487F-A35B-BB31EC3CAAC7"}
 */
function onAction_visible(event, dataTarget) {
	var visible = !elements.spinner_11.visible
	elements.spinner_11.visible = visible;
	visibleDP = visible
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
 * @properties={typeid:24,uuid:"FCDCEE8D-B779-40F3-B2FD-8C46B028A943"}
 */
function onDataChange_placeholderText(oldValue, newValue, event) {
	// TODO Auto-generated method stub
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
 * @properties={typeid:24,uuid:"F779053E-D99C-41AE-B1D0-0FC7CC21BDCC"}
 */
function onDataChange_styleClass(oldValue, newValue, event) {
	elements.spinner_11.styleClass = styleClassDP;
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
 * @properties={typeid:24,uuid:"8B5E5E1E-C5A5-4C71-906A-88D539B2E341"}
 */
function onDataChange_text(oldValue, newValue, event) {
	// TODO Auto-generated method stub
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
 * @properties={typeid:24,uuid:"6936F60C-DE5A-4781-B267-90A03D31BC5F"}
 */
function onDataChange_tooltipText(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true
}
