/**
 * Toggles the collapsible at the given index (or the first/only one, if no index is given)
 * 
 * @param {Number} index the index of the collapsible to toggle
 */
function toggle(index) {
}

/**
 * Shows the collapsible at the given index (or the first/only one, if no index is given)
 * 
 * @param {Number} index the index of the collapsible to show
 */
function show(index) {}


/**
 * Hides the collapsible at the given index (or the first/only one, if no index is given)
 * 
 * @param {Number} index the index of the collapsible to hide
 */
function hide(index) {
}


/**
 * Creates a new collapsible that can be added to the Collapse component using <code>addCollapsible</code> / <code>setCollapsibles</code>
 * 
 * @param {String} [headerHtml]
 * @param {String} [collapsibleId]
 * 
 * @return {svy-collapse.collapsible}
 */
function createCollapsible(headerHtml, collapsibleId) {
}

/**
 * Creates a new card that can be added to any collapsible's cards array
 * 
 * @param {String} [textOrHtml]
 * @param {String} [cardId]
 * @param {String} [styleClass]
 * @return {svy-collapse.card}
 */
function createCard(textOrHtml, cardId, styleClass) {
}

/**
 * Adds a new collapsible to the list of collapsibles of this Collapse component
 * 
 * @param {svy-collapse.collapsible} collapsible
 * @param {Number} [index] the index to insert the new collapsible at
 */
function addCollapsible(collapsible, index) {
}

/**
 * Sets all collapsibles of this Collapse component
 * 
 * @param {Array<svy-collapse.collapsible>} collapsibles
 */
function setCollapsibles(collapsibles) {
}

/**
 * Returns the card with the given ID
 * @param {String} cardId
 * @return {svy-collapse.card} the card or null when not found
 */
function getCardById(cardId) {
}

/**
 * Returns the card with the given index
 * @param {Number} cardIndex the index of the card to get (0 based)
 * @param {Number} [collapsibleIndex] if not given, the first collapsible is used
 * 
 * @return {svy-collapse.card} the card or null when not found
 */
function getCard(cardIndex, collapsibleIndex) {
}

/**
 * Returns the collapsible with the given index (0 based)
 * @param {Number} [collapsibleIndex] if not given, the first collapsible is used
 * 
 * @return {svy-collapse.card} the card or null when not found
 */
function getCollapsible(collapsibleIndex) {
}

/**
 * Returns whether the collapsible at the given index (or the first one if no index is provided) is collapsed
 * @param {Number} [collapsibleIndex]
 * 
 * @return {Boolean}
 */
function isCollapsed(collapsibleIndex) {
}

/**
 * Returns the collapsible with the given ID
 * @param {String} [collapsibleId] if not given, the first collapsible is used
 * 
 * @return {svy-collapse.card} the card or null when not found
 */
function getCollapsibleById(collapsibleId) {
}

/**
 * Removes the collapsible with the given ID. If the collapsible was showing a form, it will hide that form as well.
 * @param {String} collapsibleId the id of the collapsible to remove.
 * 
 * @return {Boolean} true if the collapsible with the given id was removed; false if collapsibleId is not given, not found or if the form shown by this collapsible denied hide.
 */
function removeCollapsibleById(collapsibleId) {
}

/**
 * Remove the collapsible with the given index (the index is 0 based) or the first collapsible if no collapsibleIndex is given. If the collapsible was showing a form, it will hide that form as well.
 * @param {Number} [collapsibleIndex] the index of the collapsible to remove; if not given, the first collapsible is used
 * 
 * @return {Boolean} true if the collapsible at the give index (or 0 if not given) was removed; false if collapsibleIndex is out of bounds or if the form shown by this collapsible denied hide.
 */
function removeCollapsibleAt(collapsibleIndex) {
}

/**
 * Removes all collapsibles. It will also hide the forms that are showing on any of the collpsibles.
 *
 * If one of the collapsibles has a form showing that denies hide, the removeAllCollapsibles operation will stop and return false. In this case, all collapsibles that had forms and were hidden so far will still be in the collapsible array but they will be 'collapsed'.
 * 
 * @return {Boolean} true if all collapsibles were removed successfully; false if one of the collapsibles had a form which denied hide.
 */
function removeAllCollapsibles() {
}
