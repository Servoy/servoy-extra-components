var dataProviderID;

var format;

var valuelistID;

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

var readOnly;

var maximumSelectionSize;

var valueSeparator;



var handlers = {
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
    onFocusLostMethodID: function() {}
};

/**
 * Request the focus to this field.
 * @example %%prefix%%%%elementName%%.requestFocus();
 * @param {Boolean} [mustExecuteOnFocusGainedMethod] If false will not execute the onFocusGained method; the default value is true
 */
function requestFocus(mustExecuteOnFocusGainedMethod) {
}

