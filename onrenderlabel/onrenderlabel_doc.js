/**
 * Servoy Extra Component for rendering a label with dynamic styling based on expressions.
 * 
 * DEPRECATED: Use DataLabel from the Bootstrap Components package.
 */

/**
 * Specifies the source of data to be shown on the label.
 */
var dataProviderID;

/**
 * Indicates if tag formatting is applied to the displayed data.
 */
var displaysTags;

/**
 * Determines whether the label responds to user interaction.
 */
var enabled;

/**
 * Defines the way the label's data is formatted for display.
 */
var format;

/**
 * Sets the position where the label is rendered.
 */
var location;

/**
 * Sets the dimensions of the label.
 */
var size;

/**
 * Provides a custom CSS class for styling the label.
 */
var styleClass;

/**
 * Evaluates an expression to dynamically assign CSS classes.
 */
var styleClassExpression;

/**
 * Displays a tooltip when hovering over the label.
 */
var toolTipText;

/**
 * Controls the label's visibility on the interface.
 */
var visible;

var handlers = {
    /**
     * Called when the label is activated via a click.
     * @param {JSEvent} event The event object containing details of the click action (e.g., source and coordinates).
     */
    onActionMethodID: function() {},

    /**
     * Called when the label is double-clicked.
     * @param {JSEvent} event The event object containing details of the double-click (e.g., click count and target element).
     */
    onDoubleClickMethodID: function() {},

    /**
     * Called when the label is right-clicked.
     * @param {JSEvent} event The event object containing details of the right-click (e.g., mouse position and context).
     */
    onRightClickMethodID: function() {}
};