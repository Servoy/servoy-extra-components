/**
 * A Servoy Extra Component that supports multi-file upload functionality.
 */

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

/**
 * Flag indicating whether the component is visible.
 */
var visible;

/**
 * Provide rules and conditions to limit the type and/or number of files that can be selected.
 */
var restrictions;

/**
 * When false, the component does not show on the form, but in a modal that is shown when openModal() is called. Should not be used together with closeAfterFinish (so both properties to be true)
 */
var inline;

/**
 * A note associated with the component.
 */
var note;

/**
 * Whether to automatically close the modal when all current uploads are complete. If this is set, allowMultipleUploads and inline properties ahould be false.
 */
var closeAfterFinish;

/**
 * Allows to add additional sources of files (other than the user's file system)
 */
var sources;

/**
 * CSS style classes applied to the component.
 */
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

/**
 * Dimensions of the component.
 */
var size;

/**
 * Width to be set in a responsive form. Can be a number (in pixels) or a percent.
 */
var responsiveWidth;

/**
 * Height (in pixels) to be set in a responsive form.
 */
var responsiveHeight;

/**
 * A map of additional options.
 */
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
     * Fired when a file is successfully uploaded.
     *
     * @param {JSUpload} jsUpload The upload object containing details about the uploaded file
     * @param {JSEvent} event The event object associated with the upload
     */
    onFileUploaded: function() {},

    /**
     * Fired when a file is added.
     *
     * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileAdded The file object that was added
     * @param {JSEvent} event The event object associated with the addition
     */
    onFileAdded: function() {},

    
    /**
     * Called before a file is added. Return true if the file should be accepted, or false otherwise.
     *
     * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileToAdd The file object to be added
     * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} files The current array of file objects in the component
     * @param {JSEvent} event The event object associated with the file addition
     * 
     * @return {Boolean} True if the file is accepted, false otherwise
     */
    onBeforeFileAdded: function() {},

    /**
     * Fired when a file is removed from the component.
     *
     * @param {CustomType<servoyextra-multifileupload.uploadFile>} fileRemoved The file object that was removed
     * @param {JSEvent} event The event object associated with the removal
     */
    onFileRemoved: function() {},

    /**
     * Fired when all file uploads are complete.
     *
     * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} successfulFiles The array of file objects that were uploaded successfully
     * @param {Array<CustomType<servoyextra-multifileupload.uploadFile>>} failedFiles The array of file objects that failed to upload
     * @param {JSEvent} event The event object associated with the upload completion
     */
    onUploadComplete: function() {},

    /**
     * Fired when the modal window is opened.
     */
    onModalOpened: function() {},

    /**
     * Fired when the modal window is closed.
     */
    onModalClosed: function() {},

    /**
     * Called when a file fails to meet the specified restrictions.
     *
     * @param {CustomType<servoyextra-multifileupload.uploadFile>} file The file object that failed the restrictions
     * @param {String} error The error message describing why the restriction failed
     * @param {JSEvent} event The event object associated with the restriction failure
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


var svy_types = {

    /**
     * Represents the restrictions for file uploads.
     */
    uploadRestriction: {
        /**
         * The maximum allowed file size in bytes.
         */
        maxFileSize: null,

        /**
         * The maximum number of files that can be selected.
         */
        maxNumberOfFiles: null,

        /**
         * The minimum number of files that must be selected.
         */
        minNumberOfFiles: null,

        /**
         * An array of allowed file types (e.g. ['image/jpeg', 'image/png']).
         */
        allowedFileTypes: null,
    },

    /**
     * Represents a meta field used for additional file information.
     */
    metaField: {
        /**
         * Unique identifier for the meta field.
         */
        id: null,

        /**
         * The name of the meta field.
         */
        name: null,

        /**
         * Placeholder text for the meta field.
         */
        placeholder: null,
    },

    /**
     * Represents a file uploaded via the component.
     */
    uploadFile: {
        /**
         * Unique identifier for the file.
         */
        id: null,

        /**
         * The name of the file.
         */
        name: null,

        /**
         * The file extension (e.g. 'jpg', 'png').
         */
        extension: null,

        /**
         * The MIME type of the file.
         */
        type: null,

        /**
         * The size of the file in bytes.
         */
        size: null,

        /**
         * Meta data fields associated with the file.
         */
        metaFields: null,

        /**
         * The progress object representing the file upload progress.
         */
        progress: null,

        /**
         * Error message if the file upload failed.
         */
        error: null,
    },

    /**
     * Represents the progress information for a file upload.
     */
    progress: {
        /**
         * Total number of bytes to be uploaded.
         */
        bytesTotal: null,

        /**
         * Number of bytes uploaded so far.
         */
        bytesUploaded: null,

        /**
         * Upload progress percentage.
         */
        percentage: null,

        /**
         * Flag indicating whether the upload is complete.
         */
        uploadComplete: null,

        /**
         * Timestamp indicating when the upload started.
         */
        uploadStarted: null,
    }
}
