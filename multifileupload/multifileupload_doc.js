
/**
 * Stop all uploads in progress and clear file selection, set progress to 0.
 * Basically, return things to the way they were before any user input.
 */
function reset() {
}

/**
 * Open the modal window
 */
function openModal() {
}

/**
 * Close the modal window
 */
function closeModal() {
}

/**
 * Start uploading selected files.
 */
function upload() {
}

/**
 * Cancel all uploads, reset progress and remove all files.
 */
function cancelAll() {
}				

/**
 * Retry all uploads (after an error, for example)
 */
function retryAll() {
}	

/**
 * Retry an upload (after an error, for example).
 * @param {String} fileID The unique identifier of the file to retry uploading.
 */
function retryUpload(fileID) {
}				

/**
 * Get an array of all file objects in the component
 * @return {Array<CustomType<servoyextra-multifileupload.uploadFile>>} An array of all file objects currently in the component.
 */
function getFiles() {
}

/**
 * Remove a file from the component
 * @param {String} fileID The unique identifier of the file to be removed from the component.
 */
function removeFile(fileID) {
}

/**
 * Get a specific file object by its ID
 * @param {String} fileID The unique identifier of the file to retrieve.
 * @return {CustomType<servoyextra-multifileupload.uploadFile>} The file object corresponding to the given file ID, or null if no such file exists.
 */
function getFile(fileID) {
}				

/**
 * Sets a message in state, with optional details
 * 
 * @param {Object} message String, details: String}} message
 * @param {String} [type] info, warning, success or error (defaults to info)
 * @param {Number} [duration] the duration in milliseconds (defaults to 3000)
 */
function info(message, type, duration) {
}

/**
 * (Re-)initializes the component
 */
function initialize() {
}
