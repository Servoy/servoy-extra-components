/**
 * A Servoy Extra Component that groups one or more text fields, allowing for combined data input and validation.
 */

/**
 * Bound data provider identifier for the text field group value.
 */
var dataProviderID;

/**
 * Flag indicating whether the text field group is enabled for user interaction.
 */
var enabled;

/**
 * Format string used to display and parse the text field group value.
 */
var format;

/**
 * CSS style classes applied to the icon associated with the text field group.
 */
var faclass;

/**
 * Specifies the type of input for the text field group (for example, "text" or "password").
 */
var inputType;

/**
 * Specifies the validation to apply to the input (for example, "none" or "email").
 */
var inputValidation;

/**
 * Message displayed when an invalid email address is entered.
 */
var invalidEmailMessage;

/**
 * Flag indicating whether the text field group is read-only.
 */
var readOnly;

/**
 * Placeholder text displayed when the text field group is empty.
 */
var placeholderText;

/**
 * CSS style classes applied to the text field group component.
 */
var styleClass;

/**
 * Tab sequence order for keyboard navigation.
 */
var tabSeq;

/**
 * Flag indicating whether the text field group is visible.
 */
var visible;


var handlers = {
    /**
     * Called when the text field group triggers an action.
     *
     * @param {JSEvent} event The event object containing details about the action event.
     */
    onActionMethodID: function() {},

    /**
     * Called when the value of the text field group changes.
     *
     * @param {dataproviderType} oldValue The previous value from the data provider.
     * @param {dataproviderType} newValue The new value to be set.
     * @param {JSEvent} event The event object associated with the data change.
     * 
     * @return {Boolean} True if the new value is accepted, false otherwise.
     */
    onDataChangeMethodID: function() {},

    /**
     * Called when the text field group gains focus.
     *
     * @param {JSEvent} event The event object containing details about the focus gained event.
     */
    onFocusGainedMethodID: function() {},

    /**
     * Called when the text field group loses focus.
     *
     * @param {JSEvent} event The event object containing details about the focus lost event.
     */
    onFocusLostMethodID: function() {},

    /**
     * Called when the text field group is right-clicked.
     *
     * @param {JSEvent} event The event object containing details about the right-click event.
     */
    onRightClickMethodID: function() {}
};

/**
 * Request the focus to this field.
 * 
 * @example %%prefix%%%%elementName%%.requestFocus();
 * 
 * @param {Boolean} [mustExecuteOnFocusGainedMethod] If false will not execute the onFocusGained method; the default value is true
 */
function requestFocus(mustExecuteOnFocusGainedMethod) {
}

/**
 * Checks whether the current input is a valid email address or if the input is empty.
 * 
 * @return {boolean} Returns true if the input is valid (i.e., it is a valid email address or the input is empty); otherwise, false.
 */
function isValid() {
}