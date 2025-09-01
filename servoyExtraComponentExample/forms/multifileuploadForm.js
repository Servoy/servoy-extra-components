/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8CF04965-64FC-40A2-B5F5-6FBD76F80E1C"}
 */
var styleClassDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FBDE1112-8ACB-40E7-968F-2493BAE63FB4"}
 */
var noteDP = 'This is the note';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"5A428FA7-A755-4B13-B02F-9D11A0590D77"}
 */
var languageDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F2BAAB7E-1426-4803-A816-F9445E110943",variableType:8}
 */
var minNumberOfFilesDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"4013579F-1D39-4FF0-8138-BEB4D39EBC70",variableType:8}
 */
var maxNumberOfFilesDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"12308701-EE04-46E9-BC10-25710826F53D",variableType:8}
 */
var maxFileSizeDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9868E267-5C84-4388-8A97-6DF2311676C4"}
 */
var allowedFileTypesDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"42D6A256-8D4D-4EC0-8F83-410909C854F0",variableType:-4}
 */
var inLineDP = true;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"896D77C9-CDB2-4792-B8AE-670D9C2B5B00",variableType:-4}
 */
var visibleDP = true;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"F6257E73-32D3-4B2D-B964-6AFA00E4A165",variableType:-4}
 */
var allowMultipleUploadsDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A3874734-3D0B-45E1-9A35-066CB26B55CA"}
 */
var fileId = null;

/**
 * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileToAdd
 * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} files
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"3F9D243D-872E-401A-9424-C384D1E6C8C4"}
 */
function onBeforeFileAdded(fileToAdd, files, event) {
	elements.label_beforeFileAdded.text += "----" + fileToAdd.name;
	return true;
}

/**
 * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileAdded
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5C4E5D0F-BAC1-4078-AFAA-F2EBE54823C4"}
 */
function onFileAdded(fileAdded, event) {

	elements.label_fileAddedRemoved.text += "-----" + fileAdded.name;
}

/**
 * @param {JSUpload} jsUpload
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0986537B-265B-4736-85BB-B0F36CA39353"}
 */
function onFileUploaded(jsUpload, event) {
	elements.label_fileUploaded.text += " --- " + jsUpload.getName();
}

/**
 * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileRemoved
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"983133E0-250F-4B7A-AE37-C39DC5E480D5"}
 */
function onFileRemoved(fileRemoved, event) {
	elements.label_fileAddedRemoved.text = "On file REMOVED. File: " + fileRemoved.name;
}

/**
 * @properties={typeid:24,uuid:"95BE7735-9997-4B41-9D8D-BC96ADFD4B73"}
 */
function onModalClosed() {
	elements.label_modelOpenClose.text = "On model closed";
}

/**
 * @properties={typeid:24,uuid:"9D8D7EAB-7772-451D-86E0-8A726E4569A5"}
 */
function onModalOpened() {
	elements.label_modelOpenClose.text = "On model opened"
}

/**
 * @param {CustomType<servoyextra-multifileupload.uploadFile>} file
 * @param {String} error
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F3F4CE75-A2FF-45FC-A53B-B7C6B05F8106"}
 */
function onRestrictionFailed(file, error, event) {
	elements.label_restrictionFailed.text = 'on restriction failed: ' + file.name + ' - ' + error;
}

/**
 * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} successfulFiles
 * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} failedFiles
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C110EC50-7FEE-41D8-B0D3-620C93A3C3E8"}
 */
function onUploadComplete(successfulFiles, failedFiles, event) {
	elements.label_uploadComplete.text = 'upload complete: ';
	application.output(successfulFiles);
	application.output(failedFiles);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0FCA8AC2-6745-48BB-B68E-B0D532EE4F77"}
 */
function onReset(event) {
	elements.multifileupload_21.reset();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"80AED0F5-1E05-47E5-B9B3-10561FEA9552"}
 */
function onInitialize(event) {
	elements.multifileupload_21.initialize();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B0202300-DD6F-46DD-B426-42216B199BBB"}
 */
function onOpenModel(event) {
	elements.multifileupload_21.openModal();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7A7A3C1F-AE04-4EE4-90CC-5367255164A0"}
 */
function onCloseModel(event) {
	elements.multifileupload_21.closeModal();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"86460380-9D50-4DA8-ABF4-955E171BE1A3"}
 */
function onUpload(event) {
	elements.multifileupload_21.upload();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2725298D-7420-4B8A-B830-586155A3BB22"}
 */
function onRetryAll(event) {
	elements.multifileupload_21.retryAll();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"463BBFEF-9FDF-4258-8223-9D7B5666D47A"}
 */
function onCancelAll(event) {
	elements.multifileupload_21.cancelAll();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"ED758EB9-BFAE-47D4-9CA2-631EBF8C4FB4"}
 */
function onRetryUpload(event) {
	elements.multifileupload_21.retryUpload(fileId);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DD5B3AB6-EE9C-4029-B6CA-C041097A4FF8"}
 */
function onInfo(event) {
	elements.multifileupload_21.info('This is the info!', 'info', 5000);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1EB0278B-1645-4DC1-90DC-DC7F1D95F0BC"}
 */
function onGetFiles(event) {
	var files = elements.multifileupload_21.getFiles();
	var filesString = files.map(item => item.id).join(' --- ');
	elements.label_apiMethods.text = filesString;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"AC5DB16E-49E8-4DCA-99A7-D4368C125811"}
 */
function onGetFile(event) {
	elements.multifileupload_21.getFile(fileId);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2C8EC604-53B6-4078-860A-991998816EA8"}
 */
function onRemoveFile(event) {
	elements.multifileupload_21.removeFile(fileId);
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"23A27F31-B9B5-4446-BE8A-68B5BC310502"}
 */
function onAction_allowMultipleUploads(event, dataTarget) {
	// TODO Auto-generated method stub

}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"E540D0E7-FC4D-454A-AB4D-45B3FA5EC1D3"}
 */
function onAction_autoProceed(event, dataTarget) {
	// TODO Auto-generated method stub

}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"EE8FCE5E-AF7F-48D1-9694-BBA109E8BE50"}
 */
function onAction_closeAfterFinish(event, dataTarget) {
	// TODO Auto-generated method stub

}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"E235DC3E-B905-4954-9234-1FC3B83E1D1B"}
 */
function onAction_disableStatusBar(event, dataTarget) {
	// TODO Auto-generated method stub

}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"983343D9-B83B-4505-9EEF-2F859C4F3843"}
 */
function onAction_hideUploadButton(event, dataTarget) {
	// TODO Auto-generated method stub

}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"AD57138C-8ACC-410A-8788-130B4E90158C"}
 */
function onAction_inLine(event, dataTarget) {
	// TODO Auto-generated method stub

}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"CB9FF61D-A3C5-482A-846C-6F81C4DB45FE"}
 */
function onAction_visible(event, dataTarget) {
	// TODO Auto-generated method stub

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
 * @properties={typeid:24,uuid:"96182B69-FCE2-478B-AF5A-21F10D97DEAE"}
 */
function onDataChange_allowedFileTypes(oldValue, newValue, event) {
	var arr = allowedFileTypesDP.trim().split(/\s+/);
	elements.multifileupload_21.restrictions.allowedFileTypes = arr;
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
 * @properties={typeid:24,uuid:"EF0626CE-8872-479A-A9D5-D5CD4B54DD01"}
 */
function onDataChange_maxFileSize(oldValue, newValue, event) {
	elements.multifileupload_21.restrictions.maxFileSize = maxFileSizeDP;
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
 * @properties={typeid:24,uuid:"D0011594-99CB-4853-BA44-83DA658D4EDC"}
 */
function onDataChange_maxNumberOfFiles(oldValue, newValue, event) {
	elements.multifileupload_21.restrictions.maxNumberOfFiles = maxNumberOfFilesDP;
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
 * @properties={typeid:24,uuid:"98227F3E-F3F5-4166-AA44-D88900046D4F"}
 */
function onDataChange_minNumberOfFiles(oldValue, newValue, event) {
	elements.multifileupload_21.restrictions.minNumberOfFiles = minNumberOfFilesDP;
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
 * @properties={typeid:24,uuid:"9C280D1E-49A5-4451-83C2-18707E951F10"}
 */
function onDataChange_language(oldValue, newValue, event) {
	elements.multifileupload_21.language = languageDP;
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
 * @properties={typeid:24,uuid:"9899525B-4F09-4BA4-BCA5-3057777C55AA"}
 */
function onDataChange_note(oldValue, newValue, event) {
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
 * @properties={typeid:24,uuid:"12A02293-DAB8-41E3-9FB6-EF57E17F386E"}
 */
function onDataChange_styleClass(oldValue, newValue, event) {
	elements.multifileupload_21.styleClass = styleClassDP;
	return true
}
