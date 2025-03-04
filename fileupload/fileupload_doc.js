/* servoyextra-fileupload */

var dataProviderID;

var displaysTags;

var enabled;

var location;

var size;

/**
 * Html accept attribute - defines accepted files to be uploaded. Default is all files.
 */
var accept;

var styleClass;

var styleClassExpression;

var iconStyleClass;

var successIconStyleClass;

var showFileName;

var showProgress;

var multiFileUpload;

var toolTipText;

var uploadText;

var uploadProgressText;

var uploadSuccessText;

var uploadCancelText;

var uploadNotSupportedText;

var uploadNotSupportedFileText;

/**
 * Delay before displaying the upload result - in milliseconds
 */
var resultDisplayTimeout;

var visible;


var handlers = {
    /**
     * @param {${dataproviderType}} oldValue
     * @param {${dataproviderType}} newValue
     * @param {JSEvent} event
     *
     * @returns {Boolean}
     */
    onDataChangeMethodID: function() {},

    /**
     * @param {JSUpload} jsUpload
     */
    onFileUploadedMethodID: function() {},

    /**
     * @param {JSEvent} event
     */
    onFileTransferFinishedMethodID: function() {}
};
