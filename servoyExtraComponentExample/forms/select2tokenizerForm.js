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
