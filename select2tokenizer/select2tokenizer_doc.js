var dataProviderID;

var valuelistID;

var valuelistConfig;

var visible;

var allowNewEntries;

var closeOnSelect;

var selectOnClose;

var openOnUnselect;

var clearSearchTextOnSelect;

var containSearchText;

var noMatchesFoundText;

var searchingText;

var tabSeq;

var placeholderText;

var toolTipText;

var styleClass;

var enabled;

var readOnly;

var editable;

var maximumSelectionSize;

var size;

var location;


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
     * @param {JSEvent} event
     */
    onFocusGainedMethodID: function() {},

    /**
     * @param {JSEvent} event
     */
    onFocusLostMethodID: function() {}
};

/**
 * Request the focus to this field.
 * @example %%prefix%%%%elementName%%.requestFocus();
 * @param {Boolean} [mustExecuteOnFocusGainedMethod] If false will not execute the onFocusGained method; the default value is true
 */
function requestFocus(mustExecuteOnFocusGainedMethod) {
}

