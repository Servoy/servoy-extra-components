/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"453E4BBE-2169-4AD7-87E1-BB641F884FEA",variableType:-4}
 */
var visibleEmailDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"24475189-A04A-4915-9392-1BC8238C243E"}
 */
var readOnlyEmailDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"956350BA-FD42-4FFC-8D17-E4052D3B55DB",variableType:-4}
 */
var enabledEmailDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"056F53AF-C78A-40FD-B101-E0F2FF586BF5",variableType:-4}
 */
var visibleDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E59E98DD-7495-4052-BE94-17883BB0B779"}
 */
var readOnlyDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1A90BAD5-9B0E-4370-9217-8D19AC706866"}
 */
var faclassEmailDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7738F788-19AE-450F-9276-CCD99EEE031F"}
 */
var invalidEmailMessageDP = "Email is invalid!";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"10983247-8B6B-4B01-867A-605B20EEA0D8"}
 */
var placeholderTextEmailDP = "Placeholder text for the email textbox group";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E3E527AB-D16F-4F71-9173-3934172A39E7"}
 */
var faclassDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"53755583-7163-470A-80D9-0477FE98E4FF"}
 */
var placeholderTextDP = "This is the placeholder text";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"338369C3-2004-41B6-8282-944A25274261"}
 */
var inputTypeDP = "text";

/**
 * @properties={typeid:35,uuid:"62DD0458-E5A6-45FB-AF23-0992B5AB1FD7",variableType:-4}
 */
var enabledDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FB32861C-001D-407C-93D5-316525B669F7"}
 */
var textfieldGroupEmailDP = null;

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
 * @param event
 *
 * @properties={typeid:24,uuid:"D6EEC6EA-2E3C-4A6A-9EBA-A7BA3C1B5D6F"}
 */
function onIsValid1(event) {
	elements.label_actions.text = elements.textboxgroup_noInputValidation.isValid();
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"698D9A1B-5BDF-41E1-958A-4176FF3DC9F8"}
 */
function onRequestFocusTrue1(event) {
	elements.textboxgroup_noInputValidation.requestFocus(true);
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"0AAE15A3-9457-4FA9-A79C-C64C634058FC"}
 */
function onRequestFocusFalse1(event) {
	elements.textboxgroup_noInputValidation.requestFocus(false);
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"10D9673E-F820-4387-99F0-AAA7177E3DE9"}
 */
function onIsValid2(event) {
	elements.label_focus.text = elements.textboxgroup_email.isValid();
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"EB06815D-A983-4476-B9D6-9416533604FA"}
 */
function onRequestFocusTrue2(event) {
	elements.textboxgroup_email.requestFocus(true);
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"0597F6EB-0A61-417A-8E56-A9912CEEF83E"}
 */
function onRequestFocusFalse2(event) {
	elements.textboxgroup_email.requestFocus(false);
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"B85D514E-CFF3-4450-9990-0E3C4636E57D"}
 */
function onAction_enabled(event, dataTarget) {
	elements.textboxgroup_noInputValidation.enabled = !elements.textboxgroup_noInputValidation.enabled;
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
 * @properties={typeid:24,uuid:"58399CC9-D46B-4BED-ADC0-9CDDEDFFD3E3"}
 */
function onDataChange_inputType(oldValue, newValue, event) {
	elements.textboxgroup_noInputValidation.inputType = inputTypeDP;
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
 * @properties={typeid:24,uuid:"F96D9D0E-0D15-4590-BCAC-E296B5A5F7A3"}
 */
function onDataChange_placeholderText(oldValue, newValue, event) {
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
 * @properties={typeid:24,uuid:"68E5F470-4F7B-4CC3-81E3-3072524DB8A5"}
 */
function onDataChange_faclass(oldValue, newValue, event) {
	elements.textboxgroup_noInputValidation.faclass = faclassDP;
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
 * @properties={typeid:24,uuid:"898DB7CD-597D-4B72-84EA-2D8CD54AF829"}
 */
function onDataChange_placeholderTextEmail(oldValue, newValue, event) {
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
 * @properties={typeid:24,uuid:"072FBBA9-589F-496A-87B2-9531729B86E0"}
 */
function onDataChange_invalidEmailMessage(oldValue, newValue, event) {
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
 * @properties={typeid:24,uuid:"A399F234-ED0E-431E-92AE-F3A7941688A4"}
 */
function onDataChange_faclassEmail(oldValue, newValue, event) {
	elements.textboxgroup_email.faclass = faclassEmailDP;
	return true
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"BA55FF0E-8E37-4884-80F8-E71418409E0D"}
 */
function onAction_readOnly(event, dataTarget) {
	elements.textboxgroup_noInputValidation.readOnly = !elements.textboxgroup_noInputValidation.readOnly;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"3BAC7EFD-651C-4120-B8AB-21CA5A23FF2C"}
 */
function onAction_visible(event, dataTarget) {
	elements.textboxgroup_noInputValidation.visible = !elements.textboxgroup_noInputValidation.visible;
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
 * @properties={typeid:24,uuid:"190659A7-111B-4C9A-A548-1E4EE5B77F40"}
 */
function onDataChange_enabledEmail(oldValue, newValue, event) {
	elements.textboxgroup_email.enabled = !elements.textboxgroup_email.enabled;
	return true
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"5A3D73B6-2ED2-43A6-BF8A-4E3C5D514A53"}
 */
function onAction_readOnlyEmail(event, dataTarget) {
	elements.textboxgroup_email.readOnly = !elements.textboxgroup_email.readOnly;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"89F6FCCE-513C-42E3-949E-726F88734CFE"}
 */
function onAction_visibleEmail(event, dataTarget) {
	elements.textboxgroup_email.visible = !elements.textboxgroup_email.visible;
}
