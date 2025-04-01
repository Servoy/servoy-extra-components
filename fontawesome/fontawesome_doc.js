/**
 * DEPRECATED: Set the 'imageStyleClass' property of the Label or DataLabel from the Boostrap Components package.
 */

/**
 * Example 'fas fa-search' <br/>If you want to use Font Awesome classes you need to enable the Font Awesome service from the Servoy Package Manager. 
 */
var faclass;

/**
 * Flag indicating whether the component is enabled.
 */
var enabled;

/**
 * CSS style classes applied to the component.
 */
var styleclass;

/**
 * The dimensions (width and height) of the component.
 */
var size;

/**
 * Tooltip text displayed when hovering over the component.
 */
var toolTipText;

/**
 * Flag indicating whether the component is visible.
 */
var visible;

/**
 * Alignment setting for the component. Possible values: "center", "center-horizontally", "center-vertically".
 */
var alignment;


var handlers = {
    /**
   * Called when the component is activated.
   *
   * @param {JSEvent} event The event object associated with the action.
   */
  onActionMethodID: function() {},
  
  /**
   * Called when the component is double-clicked.
   *
   * @param {JSEvent} event The event object associated with the double-click.
   */
  onDoubleClickMethodID: function() {},
  
  /**
   * Called when the component is right-clicked.
   *
   * @param {JSEvent} event The event object associated with the right-click.
   */
  onRightClickMethodID: function() {}
};

