/**
 * Gets the resize weight, which specifies how to distribute extra space when the size of the split pane changes.
 * A value of 0, the default, indicates the right/bottom component gets all the extra space (the left/top component acts fixed),
 * where as a value of 1 specifies the left/top component gets all the extra space (the right/bottom component acts fixed).
 * Specifically, the left/top component gets (weight * diff) extra space and the right/bottom component gets (1 - weight) * diff extra space
 * @example var resizeWeight = %%prefix%%%%elementName%%.resizeWeight
 */
function getResizeWeight() {
}

/**
 * Sets the resize weight, which specifies how to distribute extra space when the size of the split pane changes.
 * A value of 0, the default, indicates the right/bottom component gets all the extra space (the left/top component acts fixed),
 * where as a value of 1 specifies the left/top component gets all the extra space (the right/bottom component acts fixed).
 * Specifically, the left/top component gets (weight * diff) extra space and the right/bottom component gets (1 - weight) * diff extra space
 * @example %%prefix%%%%elementName%%.resizeWeight = 10;
 */
function setResizeWeight(resizeW) {
}

/**
 * Gets left form minimum size in pixels.
 * @example var left = %%prefix%%%%elementName%%.leftFormMinSize
 */
function getLeftFormMinSize() {
}

/**
 * Sets left form minimum size in pixels.
 * @example %%prefix%%%%elementName%%.leftFormMinSize = 100;
 */
function setLeftFormMinSize(minSize) {
}

/**
 * Gets right form minimum size in pixels.
 * @example var right = %%prefix%%%%elementName%%.rightFormMinSize
 */
function getRightFormMinSize() {
}

/**
 * Sets right form minimum size in pixels.
 * @example %%prefix%%%%elementName%%.rightFormMinSize = 100;
 */
function setRightFormMinSize(minSize) {
}

/**
 * Gets the divider size in pixels.
 * @example var dividerSize = %%prefix%%%%elementName%%.dividerSize
 * @return the size in pixels
 */
function getDividerSize() {
}

/**
 * Sets divider size in pixels.
 * @example %%prefix%%%%elementName%%.dividerSize = 10;
 */
function setDividerSize(size) {
}
/**
 * Gets the divider location in pixels.
 * @example var dividerSize = %%prefix%%%%elementName%%.dividerSize
 * @return the size in pixels
 */
function getDividerLocation() {
}

/**
 * Sets divider location. If location is less then 1 then the location will be considered at (location * 100) percent of the split pane from left, otherwise it will represent the pixels from left.
 * @example %%prefix%%%%elementName%%.dividerLocation = 0.75;
 * %%prefix%%%%elementName%%.dividerLocation = 100;
 */
function setDividerLocation(location) {
}

/**
 * Set a relationless or related form as left panel.
 * @example %%prefix%%%%elementName%%.setLeftForm(forms.orders);
 * @param form the specified form or form name you wish to add as left panel
 * @return {Boolean} value indicating if pane was successfully added
 */
function setLeftForm(form, relation) {
}

/**
 * Set a relationless or related form as right panel.
 * @example %%prefix%%%%elementName%%.setRightForm(forms.orders);
 * @param form the specified form or form name you wish to add as right panel
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
