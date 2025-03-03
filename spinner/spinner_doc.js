var dataProviderID;

var displaysTags;

var findmode;

var styleClass;

var tabSeq;

/**
 * Minimum height of the spinner, set only in responsive forms.
 */
var responsiveHeight;



var handlers = {
    /**
     * @param {JSEvent} event
     */
    onActionMethodID: function() {},

    /**
     * @param {${dataproviderType}} oldValue
     * @param {${dataproviderType}} newValue
     * @param {JSEvent} event
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

