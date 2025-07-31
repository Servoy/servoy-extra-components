/**
 * A Servoy Extra Component that provides a rich HTML editing area.
 */

/**
 * Bound data provider identifier for the HTML content.
 */
var dataProviderID;

/**
 * Flag indicating whether HTML tags should be displayed.
 */
var displaysTags;

/**
 * Flag indicating whether the HTML area is editable.
 */
var editable;

/**
 * Flag indicating whether the HTML area is enabled for user interaction.
 */
var enabled;

/**
 * Placeholder text displayed when no HTML content is present.
 */
var placeholderText;

/**
 * Flag indicating whether the HTML area is read-only.
 */
var readOnly;

/**
 * Configuration for the scrollbars in the HTML area.
 */
var scrollbars;

/**
 * CSS style classes applied to the HTML area component.
 */
var styleClass;

/**
 * Tab sequence order for keyboard navigation.
 */
var tabSeq;

/**
 * The HTML content displayed in the editor.
 */
var text;

/**
 * Tooltip text displayed when hovering over the HTML area.
 */
var toolTipText;

/**
 * Flag indicating whether the HTML area is visible.
 */
var visible;

/**
 * Min height of the html editor, set only in responsive forms.
 */
var responsiveHeight;


var handlers = {
    /**
     * Fired when an action is triggered in the HTML area.
     *
     * @param {JSEvent} event The event object containing details about the action event.
     */
    onActionMethodID: function() {},


    /**
     * Fired when the HTML content changes.
     *
     * @param {dataproviderType} oldValue The previous HTML content.
     * @param {dataproviderType} newValue The new HTML content.
     * @param {JSEvent} event The event object associated with the data change.
     * 
     * @return {Boolean} True if the new content is accepted, false otherwise.
     */
    onDataChangeMethodID: function() {},

    /**
     * Fired when the HTML area gains focus.
     *
     * @param {JSEvent} event The event object containing details about the focus gained event.
     */
    onFocusGainedMethodID: function() {},

    /**
     * Fired when the HTML area loses focus.
     *
     * @param {JSEvent} event The event object containing details about the focus lost event.
     */
    onFocusLostMethodID: function() {},

    /**
     * Fired when the HTML area is right-clicked.
     *
     * @param {JSEvent} event The event object containing details about the right-click event.
     */
    onRightClickMethodID: function() {}
};


/**
 * Sets the scroll location of an element. It takes as input the X (horizontal) and Y (vertical) coordinates - starting from the TOP LEFT side of the screen - only for an element where the height of the element is greater than the height of element content<br/>
 * NOTE: getScrollX() can be used with getScrollY() to return the current scroll location of an element; then use the X and Y coordinates with the setScroll function to set a new scroll location.<br/><br/> 
 * For Example:
 * <pre>
 * //returns the X and Y coordinates
 * var x = forms.company.elements.myarea.getScrollX();
 * var y = forms.company.elements.myarea.getScrollY();
 * //sets the new location
 * forms.company.elements.myarea.setScroll(x+10,y+10);
 * </pre>
 * @example
 * %%prefix%%%%elementName%%.setScroll(200,200);
 *
 * @param {Number} x The X coordinate of the htmlarea scroll location in pixels
 * @param {Number} y The Y coordinate of the htmlarea scroll location in pixels
 */
function setScroll(x, y) {
}

/**
  * Returns the x scroll location of specified element - only for an element where height of element is less than the height of element content.<br/>
  * NOTE: getScrollX() can be used with getScrollY() to set the scroll location of an element using the setScroll function.<br/><br/>
  * For Example:
  * <pre>
  * //returns the X and Y scroll coordinates
  * var x = forms.company.elements.myarea.getScrollX();
  * var y = forms.company.elements.myarea.getScrollY(); 
  * //sets the new scroll location
  * forms.company.elements.myarea.setScroll(x+10,y+10);
  * </pre>
  * @example
  * var x = %%prefix%%%%elementName%%.getScrollX();
  * 
  * @return {Number} The x scroll location in pixels.
  */
function getScrollX() {
}

/**
   * Returns the y scroll location of specified element - only for an element where height of element is less than the height of element content.<br/>
   * NOTE: getScrollY() can be used with getScrollX() to set the scroll location of an element using the setScroll function.<br/><br/>
   * For Example:
   * <pre>
   * //returns the X and Y scroll coordinates
   * var x = forms.company.elements.myarea.getScrollX();
   * var y = forms.company.elements.myarea.getScrollY();
   * //sets the new scroll location
   * forms.company.elements.myarea.setScroll(x+10,y+10);
   * </pre>
   * @example
   * var y = %%prefix%%%%elementName%%.getScrollY(); 
   * @return {Number} The y scroll location in pixels.
   */
function getScrollY() {
}

/**
 * Replaces the selected text; if no text has been selected, the replaced value will be inserted at the last cursor position.
 * @example %%prefix%%%%elementName%%.replaceSelectedText('John');
 * @param {String} selectedText The replacement text
 * 
 * @return {String} The new content after replace.
 */
function replaceSelectedText (){
}
/**
 * Selects all the contents of the Html Area.
 * @example %%prefix%%%%elementName%%.selectAll();
 */
function selectAll () {
}

 /**
 * Returns the currently selected text in the specified Html Area. 
 * @example var my_text = %%prefix%%%%elementName%%.getSelectedText();
 * @return {String} The selected text in the Html Area.
 */
function getSelectedText() {
}

/**
 * Gets the plain text for the formatted Html Area.
 * @example var my_text = %%prefix%%%%elementName%%.getAsPlainText();
 * 
 * @return {String} The plain text
 */
function getAsPlainText() {
}

/**
* Set the focus to this Html Area.
* @example %%prefix%%%%elementName%%.requestFocus();
* @param {Boolean} [mustExecuteOnFocusGainedMethod] If false will not execute the onFocusGained method; the default value is true[0m
*/
function requestFocus(mustExecuteOnFocusGainedMethod) {
}

/**
 * Adds a shortcut key to the HTML area. The shortcut key can be a combination of keys such as Ctrl, Alt, Shift, etc.
 * @example %%prefix%%%%elementName%%.addShortCut('F9', callbackFunction);
 * @param {String} shortCut The shortcut key combination to be added (e.g., 'F9').
 * @param {Function} callback The function to be executed when the shortcut key is pressed.
 */
function addShortCut(shortCut, callback) {
}
