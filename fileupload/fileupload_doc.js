/* servoyextra-fileupload */

var dataProviderID;

var displaysTags;

/**
 * Html accept attribute - defines accepted files to be uploaded. Default is all files.
 */
var accept;

var styleClass;

var styleClassExpression;

var iconStyleClass;

var successIconStyleClass;

/**
 * Delay before displaying the upload result - in milliseconds
 */
var resultDisplayTimeout;



var handlers = {
    /**
     * @param {${dataproviderType}} oldValue
     * @param {${dataproviderType}} newValue
     * @param {JSEvent} event
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
