/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"6DD9C17D-AB02-4846-8AA2-7CDE9722D158",variableType:-4}
 */
var showProgressDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"59C4149D-93C8-4849-ACB5-5E9C441A5CEE",variableType:-4}
 */
var showFileNameDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9AD7BEAE-258B-4330-B7AF-F8353B19FA25",variableType:-4}
 */
var visibleDP = true;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"4989005B-7DB1-4D12-87A7-148038FD4A04",variableType:-4}
 */
var displayTagsDP = true;

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"9FB6DF45-806D-456B-8F1D-B455BB419AC0",variableType:-4}
 */
var enabledDP = true;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1D662093-EFE1-4336-B38C-C60882D5581E",variableType:4}
 */
var resultDisplayTimeoutDataprovider = 2000;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"604F44AC-C65C-470C-A0DC-A921F9A57840"}
 */
var uploadSuccessTextDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"D907699C-99B5-41F8-9878-C2FBCFF5E843"}
 */
var uploadProgressTextDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"7381BAF7-7E91-4FD7-B5D3-9B0513291EDA"}
 */
var uploadNotSupportedTextDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0CEEE311-9895-4CC4-929A-438D1BCBB7E2"}
 */
var uploadNotSupportedFileTextDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"206E47A3-6A2B-4630-AA09-EC3C802964EA"}
 */
var uploadCancelTextDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1386AF1C-275F-49D8-B250-90DA8DA6B828"}
 */
var uploadTextDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"95F35E16-1D5F-4338-A676-6AF5E279C38C"}
 */
var tooltipTextDataprovider = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E657880B-D787-4F6D-B7FE-5E378C095A4A",variableType:4}
 */
var maxFileSizeDataprovider = 0;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AD37EF48-4D4C-4326-9195-00039ED353F5"}
 */
var acceptDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"05A0A54B-7BC0-4E24-BBE8-346405976F0B"}
 */
var successIconStyleClassDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"712E8D4F-38D7-48C6-A6BE-6ED1281362EB"}
 */
var iconStyleClassDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"33F16859-20E0-481B-86B0-419B7DC9474C"}
 */
var styleClassExpressionDataprovider = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8344D8E2-D338-41CF-8FC3-EC3B59C0E4BF"}
 */
var styleClassDataprovider = null;

/**
 * @properties={typeid:35,uuid:"10983378-FCD3-474C-B8C3-FB5C267BE560",variableType:-4}
 */
var fileUploadDP = null;

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"56EB9F09-31B6-45EE-8B51-C5BFE72CD48F"}
 */
function onDataChange(oldValue, newValue, event) {
	elements.label_dataChange.text = "On data change from file upload"
	return true;
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4473F782-68BB-4F98-9C81-9B555A63DADA"}
 */
function onFileTransferFinished(event) {
	elements.label_11.text = "File transfer finished";
}

/**
 * @param {JSUpload} jsUpload
 *
 * @properties={typeid:24,uuid:"D32DE22F-051C-40DD-B45C-B3ADC305EEE8"}
 */
function onFileUploaded(jsUpload) {
	elements.label_13.text = "File uploaded: " + jsUpload.getName();
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"93219D89-1C13-4246-81A5-DFDFCFFB1A9C"}
 */
function onAction_enabled(event, dataTarget) {
	var enabled = !elements.fileupload_20.enabled;
	elements.fileupload_20.enabled = enabled;
	enabledDP = enabled;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"39592EC5-ABB0-46A0-8230-73F071D63C55"}
 */
function onAction_displayTags(event, dataTarget) {
	var displayTags = !elements.fileupload_20.displaysTags;
	elements.fileupload_20.displaysTags = displayTags;
	displayTagsDP = displayTags;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"2B8A90CA-4733-403E-B754-DEEDA72A05DE"}
 */
function onAction_visible(event, dataTarget) {
	var visible = !elements.fileupload_20.visible;
	elements.fileupload_20.visible = visible;
	visibleDP = visible;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"70F9BA3E-9662-4963-AC4A-86D5C3398A72"}
 */
function onAction_multiFileupload(event, dataTarget) {
	elements.fileupload_20.multiFileUpload = !elements.fileupload_20.multiFileUpload;
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
 * @properties={typeid:24,uuid:"BADB3658-4A9E-4381-9917-D888F0A06416"}
 */
function onDataChange_maxFileSize(oldValue, newValue, event) {
	elements.fileupload_20.maxFileSize = maxFileSizeDataprovider;
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
 * @properties={typeid:24,uuid:"34D257A2-35DC-432B-83F0-3408752FE08E"}
 */
function onDataChange_accept(oldValue, newValue, event) {
	elements.fileupload_20.accept = acceptDataprovider;
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
 * @properties={typeid:24,uuid:"F3D95BFE-9DC7-4DA2-B2AB-77F7E9C4A881"}
 */
function onDataChange_styleClass(oldValue, newValue, event) {
	elements.fileupload_20.styleClass = styleClassDataprovider;
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
 * @properties={typeid:24,uuid:"11C25B59-833F-416E-9A2D-AB03F011C93B"}
 */
function onDataChange_styleClassExpression(oldValue, newValue, event) {
	elements.fileupload_20.styleClassExpression = styleClassExpressionDataprovider;
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
 * @properties={typeid:24,uuid:"08A3C7BC-883E-4198-AC39-64811552EB8B"}
 */
function onDataChange_iconStyleClass(oldValue, newValue, event) {
	elements.fileupload_20.iconStyleClass = iconStyleClassDataprovider;
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
 * @properties={typeid:24,uuid:"DF807545-7473-4DDA-804B-B04926BBD474"}
 */
function onDataChange_successIconStyleClass(oldValue, newValue, event) {
	elements.fileupload_20.successIconStyleClass = successIconStyleClassDataprovider;
	return true
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"755FC584-4019-45C1-8759-C2B1B67BA1CA"}
 */
function onAction_showFileName(event, dataTarget) {
	var showFileName = !elements.fileupload_20.showFileName
	elements.fileupload_20.showFileName = showFileName
	showFileNameDP = showFileName;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"7DE8CC93-A04A-47FC-A134-E2D0EFE0AA7A"}
 */
function onAction_showProgress(event, dataTarget) {
	var showProgress = !elements.fileupload_20.showProgress
	elements.fileupload_20.showProgress = showProgress
	showProgressDP = showProgress;
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
 * @properties={typeid:24,uuid:"E93D76C5-CEFF-4E2B-AA02-4E0DD52DB140"}
 */
function onDataChange_toottipText(oldValue, newValue, event) {
	elements.fileupload_20.toolTipText = tooltipTextDataprovider;
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
 * @properties={typeid:24,uuid:"043A0990-7EE2-4D62-B078-F3F2741B7FD9"}
 */
function onDataChange_uploadText(oldValue, newValue, event) {
	elements.fileupload_20.uploadText = uploadTextDataprovider;
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
 * @properties={typeid:24,uuid:"32B1A511-8E52-4764-9A65-45C955BD16F2"}
 */
function onDataChange_uploadCancelText(oldValue, newValue, event) {
	elements.fileupload_20.uploadCancelText = uploadCancelTextDataprovider;
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
 * @properties={typeid:24,uuid:"072EC5A6-3DF4-4C77-9B4D-6605D466F323"}
 */
function onDataChange_uploadSuccessText(oldValue, newValue, event) {
	elements.fileupload_20.uploadSuccessText = uploadSuccessTextDataprovider;
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
 * @properties={typeid:24,uuid:"1C6173E0-4F32-499A-83FD-F42F8B157615"}
 */
function onDataChange_uploadNotSupportedFileText(oldValue, newValue, event) {
	elements.fileupload_20.uploadNotSupportedFileText = uploadNotSupportedFileTextDataprovider;
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
 * @properties={typeid:24,uuid:"8C36EEC9-5081-451C-A142-F0CB4A62F74B"}
 */
function onDataChange_uploadNotSupportedText(oldValue, newValue, event) {
	elements.fileupload_20.uploadNotSupportedText = uploadNotSupportedTextDataprovider;
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
 * @properties={typeid:24,uuid:"5735E2BE-F4A2-4131-9E45-BF55B342CFCF"}
 */
function onDataChange_uploadProgressText(oldValue, newValue, event) {
	elements.fileupload_20.uploadProgressText = uploadProgressTextDataprovider;
	return true
}
