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
