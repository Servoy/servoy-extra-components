/**
 * By default the component will wait for an upload button to be pressed in the UI, or the upload() method to be called, before starting an upload. Setting this to autoProceed: true will start uploading automatically after the first file is selected.
 */
var autoProceed;

/**
 * Should not be used together with closeAfterFinish (so both properties to be true)
 */
var allowMultipleUploads;

/**
 * Hide the upload button. Use this if you are providing a custom upload button somewhere, and using the upload() API.
 */
var hideUploadButton;

/**
 * Whether to show upload progress and pause/resume/cancel buttons.
 */
var disableStatusBar;

var visible;

/**
 * Provide rules and conditions to limit the type and/or number of files that can be selected.
 */
var restrictions;

/**
 * When false, the component does not show on the form, but in a modal that is shown when openModal() is called. Should not be used together with closeAfterFinish (so both properties to be true)
 */
var inline;

var note;

/**
 * Whether to automatically close the modal when all current uploads are complete. If this is set, allowMultipleUploads and inline properties ahould be false.
 */
var closeAfterFinish;

/**
 * Allows to add additional sources of files (other than the user's file system)
 */
var sources;

var styleClass;

/**
 * An array of UI field objects that will be shown when a user clicks the 'edit' button on that file
 */
var metaFields;

/**
 * One of the language packs shipped. If you need to provide your own translations, use the localeStrings property.
 */
var language;

/**
 * Any number of key/value pairs to translate single strings in the component, overriding the ones provided by the language pack selected.
 */
var localeStrings;

var size;

/**
 * Width to be set in a responsive form. Can be a number (in pixels) or a percent.
 */
var responsiveWidth;

/**
 * Height (in pixels) to be set in a responsive form.
 */
var responsiveHeight;

var options;

/**
 * Look at the Uppy TUS options what you can set here like chunkSize: nrOfBytes
 */
var tusOptions;

/**
 * Look at the Uppy webcam plugin options what you can set here like showVideoSourceDropdown
 */
var webcamOptions;


var handlers = {
    /**
     * @param {JSUpload} jsUpload
     * @param {JSEvent} event
     */
    onFileUploaded: function() {},

    /**
     * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileAdded
     * @param {JSEvent} event
     */
    onFileAdded: function() {},

    /**
     * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileToAdd
     * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} files
     * @param {JSEvent} event
     *
     * @returns {Boolean}
     */
    onBeforeFileAdded: function() {},

    /**
     * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileRemoved
     * @param {JSEvent} event
     */
    onFileRemoved: function() {},

    /**
     * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} successfulFiles
     * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} failedFiles
     * @param {JSEvent} event
     */
    onUploadComplete: function() {},

    onModalOpened: function() {},

    onModalClosed: function() {},

    /**
     * @param {CustomType<servoyextra-multifileupload.uploadFile>} file
     * @param {String} error
     * @param {JSEvent} event
     */
    onRestrictionFailed: function() {}
};


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
