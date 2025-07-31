/**
 * @properties={typeid:35,uuid:"10983378-FCD3-474C-B8C3-FB5C267BE560",variableType:-4}
 */
var fileUploadDP= null;

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

	return false;
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
