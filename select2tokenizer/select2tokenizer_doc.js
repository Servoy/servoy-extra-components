/**
 * A Servoy Extra Component that provides a tokenized select input field with auto-complete and multi-selection capabilities.
 */

/**
 * Bound data provider identifier for the tokenized select input value.
 */
var dataProviderID;

/**
 * Identifier for the value list providing available options.
 */
var valuelistID;

/**
 * Configuration for the value list.
 */
var valuelistConfig;

/**
 * Flag indicating whether the component is visible.
 */
var visible;

/**
 * When true, new entries can be added that are not present in the value list.
 */
var allowNewEntries;

/**
 * When true, the dropdown closes after an option is selected.
 */
var closeOnSelect;

/**
 * When true, an option is automatically selected when the dropdown is closed.
 */
var selectOnClose;

/**
 * When true, the dropdown opens automatically when an item is unselected.
 */
var openOnUnselect;

/**
 * When true, the search text is cleared after an option is selected.
 */
var clearSearchTextOnSelect;

/**
 * When true, only options containing the search text are displayed.
 */
var containSearchText;

/**
 * Text displayed when no matching options are found.
 */
var noMatchesFoundText;

/**
 * Text displayed while searching for options.
 */
var searchingText;

/**
 * Tab sequence order for keyboard navigation.
 */
var tabSeq;

/**
 * Placeholder text displayed when no option is selected.
 */
var placeholderText;

/**
 * Tooltip text displayed when hovering over the component.
 */
var toolTipText;

/**
 * CSS style classes applied to the component.
 */
var styleClass;

/**
 * Flag indicating whether the component is enabled for user interaction.
 */
var enabled;

/**
 * Flag indicating whether the component is read-only.
 */
var readOnly;

/**
 * Flag indicating whether the component is editable.
 */
var editable;

/**
 * Maximum number of options that can be selected.
 */
var maximumSelectionSize;

/**
 * Dimensions (width and height) of the component.
 */
var size;

/**
 * Position of the component on the form.
 */
var location;


var handlers = {
    /**
     * Called when the value changes.
     *
     * @param {dataproviderType} oldValue The previous value from the data provider.
     * @param {dataproviderType} newValue The new value to be set.
     * @param {JSEvent} event The event object associated with the data change.
     * 
     * @return {Boolean} True if the new value is accepted, false otherwise.
     */
    onDataChangeMethodID: function() {},

    /**
     * Called when the component gains focus.
     *
     * @param {JSEvent} event The event object containing details about the focus gained event.
     */
    onFocusGainedMethodID: function() {},

    /**
     * Called when the component loses focus.
     *
     * @param {JSEvent} event The event object containing details about the focus lost event.
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

