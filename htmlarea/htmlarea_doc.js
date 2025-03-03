var dataProviderID;

var displaysTags;

var findmode;

var scrollbars;

var styleClass;

var tabSeq;

/**
 * Min height of the html editor, set only in responsive forms.
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
