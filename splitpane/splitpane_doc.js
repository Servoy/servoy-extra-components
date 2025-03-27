/**
 * A component that provides a split pane container for displaying two forms side by side or one on top of the other.
 */

/**
 * Sets the initial splitter div location, between 0 and 1 is a percentange, more than 1 is a value in pixels.
 */
var divLocation;

/**
 * Size of the splitter div - in pixels.
 */
var divSize;

/**
 * Flag indicating whether the split pane is enabled for user interaction.
 */
var enabled;

/**
 * Minimum size (in pixels) allowed for the left or top pane.
 */
var pane1MinSize;

/**
 * Minimum size (in pixels) allowed for the right or bottom pane.
 */
var pane2MinSize;

/**
 * Flag indicating whether the split pane is read-only.
 */
var readOnly;

/**
 * Specifies how extra space is distributed between the two panes. A value of 0 means the right/bottom pane gets all extra space; 1 means the left/top pane gets it.
 */
var resizeWeight;

/**
 * CSS style classes applied to the split pane component.
 */
var styleClass;

/**
 * Determines the split type. Typically, 0 represents horizontal splitting and 1 represents vertical splitting.
 */
var splitType;

/**
 * Tab sequence order for keyboard navigation.
 */
var tabSeq;

/**
 * An array of pane objects. (Deprecated: use pane1 and pane2 instead.)
 */
var panes;

/**
 * The left or top pane object.
 */
var pane1;

/**
 * The right or bottom pane object.
 */
var pane2;

/**
 * Flag indicating whether the split pane is visible.
 */
var visible;

/**
 * Minimum height of the splitpane, set only in responsive forms.
 */
var responsiveHeight;


var handlers = {
    /**
     * Called when the split pane changes (for example, when the divider is moved).
     *
     * @param {Number} previousIndex The previous index or position of the divider.
     * @param {JSEvent} event The event object associated with the change.
     */
    onChangeMethodID: function() {}
};

/**
 * Gets the resize weight, which specifies how to distribute extra space when the size of the split pane changes.
 * A value of 0, the default, indicates the right/bottom component gets all the extra space (the left/top component acts fixed),
 * where as a value of 1 specifies the left/top component gets all the extra space (the right/bottom component acts fixed).
 * Specifically, the left/top component gets (weight * diff) extra space and the right/bottom component gets (1 - weight) * diff extra space
 * @example var resizeWeight = %%prefix%%%%elementName%%.resizeWeight
 * 
 * @return {Number} The resize weight value, indicating how the extra space is distributed between the left/top and right/bottom components of the split pane.
 */
function getResizeWeight() {
}

/**
 * Sets the resize weight, which specifies how to distribute extra space when the size of the split pane changes.
 * A value of 0, the default, indicates the right/bottom component gets all the extra space (the left/top component acts fixed),
 * where as a value of 1 specifies the left/top component gets all the extra space (the right/bottom component acts fixed).
 * Specifically, the left/top component gets (weight * diff) extra space and the right/bottom component gets (1 - weight) * diff extra space
 * @example %%prefix%%%%elementName%%.resizeWeight = 10;
 * 
 * @param {Number} resizeWeight The weight value (between 0 and 1) specifying how to distribute extra space between the left/top and right/bottom components of the split pane.
 */
function setResizeWeight(resizeW) {
}

/**
 * Gets left form minimum size in pixels.
 * @example var left = %%prefix%%%%elementName%%.leftFormMinSize
 * 
 * @return {Number} The minimum size in pixels for the left form panel.
 */
function getLeftFormMinSize() {
}

/**
 * Sets left form minimum size in pixels.
 * @example %%prefix%%%%elementName%%.leftFormMinSize = 100;
 * 
 * @param {Number} minSize The minimum size in pixels for the left form panel.
 */
function setLeftFormMinSize(minSize) {
}

/**
 * Gets right form minimum size in pixels.
 * @example var right = %%prefix%%%%elementName%%.rightFormMinSize
 * 
 * @return {Number} The minimum size in pixels for the right form panel.
 */
function getRightFormMinSize() {
}

/**
 * Sets right form minimum size in pixels.
 * @example %%prefix%%%%elementName%%.rightFormMinSize = 100;
 * 
 * @param {Number} minSize The minimum size in pixels for the right form panel.
 */
function setRightFormMinSize(minSize) {
}

/**
 * Gets the divider size in pixels.
 * @example var dividerSize = %%prefix%%%%elementName%%.dividerSize
 * @return {Number} The size in pixels
 */
function getDividerSize() {
}

/**
 * Sets divider size in pixels.
 * @example %%prefix%%%%elementName%%.dividerSize = 10;
 * 
 * @param {Number} size The size of the divider in pixels.
 */
function setDividerSize(size) {
}
/**
 * Gets the divider location in pixels.
 * @example var dividerSize = %%prefix%%%%elementName%%.dividerSize
 * @return {Number} The size in pixels
 */
function getDividerLocation() {
}

/**
 * Gets the divider location in percentage when the component is visible.
 * @example var divRelativeLocation = %%prefix%%%%elementName%%.getRelativeDividerLocation()
 * @return {Number} The location in percentage
 */
function getRelativeDividerLocation() {
}

/**
 * Sets divider location. If location is less then 1 then the location will be considered at (location * 100) percent of the split pane from left, otherwise it will represent the pixels from left.
 * @example %%prefix%%%%elementName%%.dividerLocation = 0.75;
 * %%prefix%%%%elementName%%.dividerLocation = 100;
 * 
 * @param {Number} location The location of the divider.
 */
function setDividerLocation(location) {
}

/**
 * Set a relationless or related form as left panel.
 * @example %%prefix%%%%elementName%%.setLeftForm(forms.orders);
 * @param {Object} form The specified form or form name you wish to add as left panel
 * @param {Object} [relation] The relation object used to link the left panel form to the main datasource, or null for a relationless form.
 * @return {Boolean} Value indicating if pane was successfully added
 */
function setLeftForm(form, relation) {
}

/**
 * Set a relationless or related form as right panel.
 * @example %%prefix%%%%elementName%%.setRightForm(forms.orders);
 * @param {Object} form The specified form or form name you wish to add as right panel
 * @param {Object} [relation] The relation object used to link the right panel form to the main datasource, or null for a relationless form.
 * @return {Boolean} value indicating if pane was successfully added
 */
function setRightForm(form, relation) {
}

/**
 * Returns the left form of the split pane.
 * @example var leftForm = %%prefix%%%%elementName%%.getLeftForm();
 * @return {FormScope} left form of the split pane
 */
function getLeftForm() {
}

/**
 * Returns the right form of the split pane.
 * @example var rightForm = %%prefix%%%%elementName%%.getRightForm();
 * @return {FormScope} right form of the split pane
 */
function getRightForm() {
}


var svy_types = {

    /**
     * Represents a pane within the split pane.
     */
    pane: {
        /**
         * The form contained in this pane.
         */
        containsFormId: null,

        /**
         * The relation name used to link the pane's form to the main datasource.
         */
        relationName: null,
    }
}
