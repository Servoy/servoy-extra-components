var dataProviderID;

var enabled;

var format;

var faclass;

var inputType;

var inputValidation;

var invalidEmailMessage;

var readOnly;

var placeholderText;

var styleClass;

var tabSeq;

var visible;


var handlers = {
    /**
     * @param {JSEvent} event
     */
    onActionMethodID: function() {},

    /**
     * @param {${dataproviderType}} oldValue
     * @param {${dataproviderType}} newValue
     * @param {JSEvent} event
     *
     * @returns {Boolean}
     */
    onDataChangeMethodID: function() {},

    /**
     * @param {JSEvent} event
     */
    onFocusGainedMethodID: function() {},

    /**
     * @param {JSEvent} event
     */
    onFocusLostMethodID: function() {},

    /**
     * @param {JSEvent} event
     */
    onRightClickMethodID: function() {}
};

/**
 * Request the focus to this field.
 * @example %%prefix%%%%elementName%%.requestFocus();
 * @param {Boolean} [mustExecuteOnFocusGainedMethod] If false will not execute the onFocusGained method; the default value is true
 */
function requestFocus(mustExecuteOnFocusGainedMethod) {
}

/**
 * Checks whether the current input is a valid email address or if the input is empty.
 * @return {boolean} Returns true if the input is valid (i.e., it is a valid email address or the input is empty); otherwise, false.
 */
function isValid() {
}