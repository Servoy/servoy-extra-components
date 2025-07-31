/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0531106D-C9FC-484B-86ED-5548DCD2137F"}
 */
var textfieldGroupDP = "This is the DP";

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"66F020AA-1ECD-43AA-BAB1-9D0671A45ECD"}
 */
function onAction(event) {
	elements.label_actions.text = "On action";
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"8138A2D0-D722-4F77-A110-4D9F9DF8F727"}
 */
function onDataChange(oldValue, newValue, event) {
	elements.label_actions.text = 'On data change from oldValue:-- ' + oldValue + ' to newValue:-- ' + newValue;
	return true;
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"EB5F1A89-D6F2-410A-B996-B7A505BF33D1"}
 */
function onFocusGained(event) {
	elements.label_focus.text = "On focus gained";
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0C0CB32E-217B-4D46-AB0D-489B36DF80B5"}
 */
function onFocusLost(event) {

	elements.label_focus.text = "On focus lost";
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"A47A9B77-1F39-4F3A-B6FF-A60A7B595F26"}
 */
function onRightClick(event) {

	elements.label_actions.text = "On right click";
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"D6EEC6EA-2E3C-4A6A-9EBA-A7BA3C1B5D6F"}
 */
function onIsValid1(event) {
	elements.label_actions.text = elements.textboxgroup_noInputValidation.isValid();
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"698D9A1B-5BDF-41E1-958A-4176FF3DC9F8"}
 */
function onRequestFocusTrue1(event) {
	elements.textboxgroup_noInputValidation.requestFocus(true);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"0AAE15A3-9457-4FA9-A79C-C64C634058FC"}
 */
function onRequestFocusFalse1(event) {
	elements.textboxgroup_noInputValidation.requestFocus(false);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event 
 *
 * @properties={typeid:24,uuid:"10D9673E-F820-4387-99F0-AAA7177E3DE9"}
 */
function onIsValid2(event) {
	elements.label_focus.text = elements.textboxgroup_email.isValid();
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"EB06815D-A983-4476-B9D6-9416533604FA"}
 */
function onRequestFocusTrue2(event) {
	elements.textboxgroup_email.requestFocus(true);
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"0597F6EB-0A61-417A-8E56-A9912CEEF83E"}
 */
function onRequestFocusFalse2(event) {
	elements.textboxgroup_email.requestFocus(false);
}

