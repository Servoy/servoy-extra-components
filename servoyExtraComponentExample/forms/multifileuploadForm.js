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
