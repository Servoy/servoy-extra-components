/*
 * A component that provides a spinner input for numeric values.
 */

/**
 * Bound data provider identifier for the spinner value.
 */
var dataProviderID;

/**
 * Indicates whether display tags are enabled.
 */
var displaysTags;

/**
 * Indicates whether the spinner is editable.
 */
var editable;

/**
 * Indicates whether the spinner is enabled for user interaction.
 */
var enabled;

/**
 * Format string used to display and parse the spinner value.
 */
var format;

/**
 * Placeholder text displayed when no value is present.
 */
var placeholderText;

/**
 * Indicates whether the spinner is read-only.
 */
var readOnly;

/**
 * CSS style classes applied to the spinner component.
 */
var styleClass;

/**
 * Dimensions (width and height) of the spinner component.
 */
var size;

/**
 * Tab sequence order for keyboard navigation.
 */
var tabSeq;

/**
 * The text displayed by the spinner.
 */
var text;

/**
 * Tooltip text displayed when hovering over the spinner.
 */
var toolTipText;

/**
 * Identifier for the value list used by the spinner.
 */
var valuelistID;

/**
 * Indicates whether the spinner is visible.
 */
var visible;

/**
 * Minimum height of the spinner, set only in responsive forms.
 */
var responsiveHeight;


var handlers = {
    /**
     * Fired when the spinner action is triggered.
     *
     * @param {JSEvent} event The event object containing details about the action event.
     */
    onActionMethodID: function() {},

    /**
     * Fired when the spinner value changes.
     *
     * @param {dataproviderType} oldValue The previous value from the data provider.
     * @param {dataproviderType} newValue The new value to be set in the data provider.
     * @param {JSEvent} event The event object associated with the data change.
     * 
     * @return {Boolean} True if the new value is accepted, false otherwise.
     */
    onDataChangeMethodID: function() {},

    /**
     * Fired when the spinner gains focus.
     *
     * @param {JSEvent} event The event object containing details about the focus gained event.
     */
    onFocusGainedMethodID: function() {},

    /**
     * Fired when the spinner loses focus.
     *
     * @param {JSEvent} event The event object containing details about the focus lost event.
     */
    onFocusLostMethodID: function() {},

    /**
     * Fired when the spinner is right-clicked.
     *
     * @param {JSEvent} event The event object containing details about the right-click event.
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

