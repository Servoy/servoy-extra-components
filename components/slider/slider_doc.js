/**
 * A Servoy Extra Component that displays a slider for selecting numeric values, supporting both single and range selection.
 */

/**
 * Dimensions of the slider component (width and height).
 */
var size;

/**
 * The dataProvider for the slider value
 */
var dataProvider;

/**
 * The dataProvider for a range slider's maximum value
 */
var dataProviderHigh;

/**
 * Flag indicating whether the slider is enabled for user interaction.
 */
var enabled;

/**
 * Number of steps between each tick to display tick values at intermediate positions
 */
var ticksValuesInterval;

/**
 * Number of steps between each tick to display ticks at intermediate positions. In Titanium Client you cannot select by click values between ticks, you can only drag slider pointer to select.
 */
var ticksInterval;

/**
 * CSS style classes applied to the slider component.
 */
var styleClass;

/**
 * Set this to false to update the dataProvider(s) while the user drags the slider and not only when the user is done dragging
 */
var dataChangeOnSlideEnd;

/**
 * A Servoy number format that is used to format numbers when a formattingFunction is not provided
 */
var numberFormat;

/**
 * Can be given a function code as string that can be used to format numbers client side.
 */
var formattingFunction;

/**
 * Function code as String that returns the current color of the selection bar.
 */
var selectionBarColorFunction;

/**
 * Function provided as a String that returns the color of a tick.
 */
var tickColorFunction;

/**
 * Function provided as string that returns the tooltip content for a tick.
 */
var ticksTooltipFunction;

/**
 * Function provided as string that returns the tooltip content for a tick value.
 */
var ticksValuesTooltipFunction;

/**
 * Can be given a function code as string that can be used to display legend under ticks
 */
var getLegendFunction;

/**
 * Function provided as a String that returns the color of a tick.
 */
var pointerColorFunction;

/**
 * Flag indicating whether the slider is in read-only mode.
 */
var readOnly;

/**
 * Minimum value for a slider
 */
var floor;

/**
 * Maximum value for a slider
 */
var ceil;

/**
 * Step between each value
 */
var step;

/**
 * The precision to display values with.
 */
var precision;

/**
 * The minimum value authorized on the slider.
 */
var minLimit;

/**
 * The maximum value authorized on the slider.
 */
var maxLimit;

/**
 * The minimum range authorized on the slider.
 */
var minRange;

/**
 * The maximum range authorized on the slider.
 */
var maxRange;

/**
 * Set to true to force the value to be rounded to the step
 */
var enforceStep;

/**
 * Set to true to round the value and valueHigh to the slider range
 */
var enforceRange;

/**
 * Set to true to have a push behavior. When the min handle goes above the max, the max is moved as well
 */
var pushRange;

/**
 * Set to true to show graphs right to left.
 */
var rightToLeft;

/**
 * Set to true to prevent to user from switching the min and max handles
 */
var noSwitching;

/**
 * When set to true and using a range slider, the range can be dragged by the selection bar
 */
var draggableRange;

/**
 * Same as draggableRange but the slider range can't be changed
 */
var draggableRangeOnly;

/**
 * Set to true to always show the selection bar before the slider handle
 */
var showSelectionBar;

/**
 * Set to true to always show the selection bar after the slider handle
 */
var showSelectionBarEnd;

/**
 * Use to display the selection bar as a gradient
 */
var selectionBarGradient;

/**
 * Only for range slider. Set to true to visualize in different colour the areas on the left/right (top/bottom for vertical range slider) of selection bar between the handles
 */
var showOuterSelectionBars;

/**
 * Set to true to display a tick for each step of the slider
 */
var showTicks;

/**
 * Set to true to display a tick and the step value for each step of the slider
 */
var showTicksValues;

/**
 * Set to true to hide pointer labels
 */
var hidePointerLabels;

/**
 * Set to true to hide min / max labels
 */
var hideLimitLabels;

/**
 * Set to false to disable the auto-hiding behavior of the limit labels
 */
var autoHideLimitLabels;

/**
 * If you want to provide all the steps with display and real values, you can provide a value list to provide step values (realValues) and step labels (displayValues).
 */
var stepsValueList;

/**
 * Use to display ticks at specific positions. The array contains the index of the ticks that should be displayed.
 */
var ticksArray;

/**
 * If you want to display a slider with non linear/number steps.
 */
var stepsArray;

/**
 * Flag indicating whether the slider is visible.
 */
var visible;

/**
 * Set to true to display the slider vertically.
 */
var vertical;

/**
 * Set to true to use a logarithmic scale to display the slider
 */
var logScale;


var handlers = {
    /**
     * Called when the dataProvider value changed
     *
     * @param {dataproviderType} oldValue The previous slider value.
     * @param {dataproviderType} newValue The new slider value.
     * @param {JSEvent} event The event object associated with the data change.
     * 
     * @return {Boolean} True if the new value is accepted, false otherwise.
     */
    onDataChangeMethodID: function() {},

    /**
     * Called when the dataProviderHigh value changed
     *
     * @param {dataproviderType} oldValue The previous high slider value.
     * @param {dataproviderType} newValue The new high slider value.
     * @param {JSEvent} event The event object associated with the data change.
     * 
     * @return {Boolean} True if the new high value is accepted, false otherwise.
     */
    onDataChangeHigh: function() {},

    /**
     * Called when user starts dragging the slider
     *
     * @param {JSEvent} event The event object associated with the slide start.
     * @param {Object} value The value when the user dragged the pointer of a non-range slider or the low value in a range slider.
     * @param {Object} highValue The high value when the user dragged the pointer in a range slider.
     * @param {String} pointerType Either "value" or "high", indicating which pointer was dragged.
     */
    onSlideStart: function() {},

    /**
     * Called when user stops dragging the slider
     *
     * @param {JSEvent} event The event object associated with the slide end.
     * @param {Object} value The value when the user stopped dragging the pointer of a non-range slider or the low value in a range slider.
     * @param {Object} highValue The high value when the user stopped dragging the pointer in a range slider.
     * @param {String} pointerType Either "value" or "high", indicating which pointer was used.
     */
    onSlideEnd: function() {},
    
    /**
     * Called when user clicks on a tick or drags the slider pointer to a tick
     *
     * @param {Object} value The value when the user ticked/ dragged the pointer of a non-range slider or the low value in a range slider.
     * @param {Object} highValue The high value when the user ticked/ dragged the pointer in a range slider.
     * @param {String} pointerType Either "value" or "high", indicating which pointer was used.
     * @param {Boolean} rightToLeft true - if the slider is displayed right to left, false - if the slider is displayed left to right.
     */
    onTick: function() {}
};

/**
 * Refreshes the slider
 */
function refresh() {
}


var svy_types = {

   /**
     * Represents a gradient configuration for the slider selection bar.
     */
   gradient: {
    /**
     * The starting color of the gradient.
     */
    from: null,

    /**
     * The ending color of the gradient.
     */
    to: null,
}
}
