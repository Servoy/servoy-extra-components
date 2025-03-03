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
