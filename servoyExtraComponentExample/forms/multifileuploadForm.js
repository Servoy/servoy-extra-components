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
	// TODO Auto-generated method stub

}
