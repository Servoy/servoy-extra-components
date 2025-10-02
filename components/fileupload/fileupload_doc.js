/**
 * A Servoy Extra Component that allows users to upload files.
 * It supports multi-file uploads, displays file names, shows upload progress,
 * and provides customizable texts for various upload statuses.
 */

/**
 * Bound data provider identifier for the file data.
 */
var dataProviderID;

/**
 * Flag indicating whether display tags are enabled for the component.
 */
var displaysTags;

/**
 * Flag indicating whether the file upload component is enabled for user interaction.
 */
var enabled;

/**
 * The position of the component on the form.
 */
var location;

/**
 * Dimensions (width and height) of the file upload component.
 */
var size;

/**
 * Html accept attribute - defines accepted files to be uploaded. Default is all files.
 */
var accept;

/**
 * CSS style classes applied to the file upload component.
 */
var styleClass;

/**
 * Expression that returns additional CSS style classes for the component.
 */
var styleClassExpression;

/**
 * CSS style class for the upload icon.
 */
var iconStyleClass;

/**
 * CSS style class for the success icon displayed after a successful upload.
 */
var successIconStyleClass;

/**
 * Flag indicating whether the file name is displayed after upload.
 */
var showFileName;

/**
 * Flag indicating whether the upload progress is displayed.
 */
var showProgress;

/**
 * The max file size allowed for upload in bytes. Default is no limit.
 */
var maxFileSize;

/**
 * Flag indicating whether multiple file uploads are allowed.
 */
var multiFileUpload;

/**
 * Tooltip text displayed when hovering over the file upload component.
 */
var toolTipText;

/**
 * Text displayed to prompt the user to upload a file.
 */
var uploadText;

/**
 * Text displayed during the file upload progress.
 */
var uploadProgressText;

/**
 * Text displayed when the file is successfully uploaded.
 */
var uploadSuccessText;

/**
 * Text displayed when the file upload is canceled.
 */
var uploadCancelText;

/**
 * Text displayed when file drag and drop is not supported by the browser.
 */
var uploadNotSupportedText;

/**
 * Text displayed when the file type is not supported for upload.
 */
var uploadNotSupportedFileText;

/**
 * The result of an upload will be displayed for this amount of time (in milliseconds) before being cleared. After the timeout expires, the upload component will revert to it's initial display state. If set to -1, it will not automatically clear the upload result.
 */
var resultDisplayTimeout;

/**
 * Flag indicating whether the file upload component is visible.
 */
var visible;


var handlers = {
    /**
     * Called when the file upload data changes.
     *
     * @param {dataproviderType} oldValue The previous file data value.
     * @param {dataproviderType} newValue The new file data value.
     * @param {JSEvent} event The event object associated with the data change.
     * 
     * @return {Boolean} True if the new value is accepted, false otherwise.
     */
    onDataChangeMethodID: function() {},

    /**
     * Called when a file is successfully uploaded.
     *
     * @param {JSUpload} jsUpload The upload object containing details about the uploaded file.
     */
    onFileUploadedMethodID: function() {},

    /**
     * Called when the file transfer process is finished.
     *
     * @param {JSEvent} event The event object associated with the file transfer completion.
     */
    onFileTransferFinishedMethodID: function() {}
};
