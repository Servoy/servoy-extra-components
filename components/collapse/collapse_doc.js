/*
 * A Collapse Component that groups multiple collapsible panels.
 */

/**
 * An array of collapsible objects contained in this component.
 */
var collapsibles;

/**
 * Determines whether the collapse component behaves in accordion mode (only one panel open at a time).
 */
var accordionMode;

/**
 * An array of indices representing which collapsibles are currently expanded.
 */
var expandedIndices;

/**
 * CSS style classes applied to the collapse component container.
 */
var styleClass;

/**
 * Tab sequence order for keyboard navigation.
 */
var tabSeq;

/**
 * Flag indicating whether the collapse component is visible.
 */
var visible;

var handlers = {
    /**
     * Called when a collapsible is shown.
     *
     * @param {JSEvent} event The event object associated with the show event.
     * @param {CustomType<servoyextra-collapse.collapsible>} collapsible The collapsible that was shown.
     * @param {Number} collapsibleIndex The index of the shown collapsible.
     */
    onCollapsibleShown: function() {},

    /**
     * Called when a collapsible is hidden.
     *
     * @param {JSEvent} event The event object associated with the hide event.
     * @param {CustomType<servoyextra-collapse.collapsible>} collapsible The collapsible that was hidden.
     * @param {Number} collapsibleIndex The index of the hidden collapsible.
     */
    onCollapsibleHidden: function() {},

    /**
     * Called when a header of a collapsible is clicked.
     *
     * @param {JSEvent} event The event object associated with the header click.
     * @param {CustomType<servoyextra-collapse.collapsible>} collapsible The collapsible whose header was clicked.
     * @param {Number} collapsibleIndex The index of the collapsible.
     * @param {String} dataTarget The data target identifier for the header.
     * 
     * @return {Boolean} True if the click is handled, false otherwise.
     */
    onHeaderClicked: function() {},

    /**
     * Called when a card within a collapsible is clicked.
     *
     * @param {JSEvent} event The event object associated with the card click.
     * @param {CustomType<servoyextra-collapse.card>} card The card that was clicked.
     * @param {CustomType<servoyextra-collapse.collapsible>} collapsible The collapsible containing the card.
     * @param {Number} cardIndex The index of the clicked card.
     * @param {Number} collapsibleIndex The index of the collapsible.
     * @param {String} dataTarget The data target identifier for the card.
     */
    onCardClicked: function() {},

    /**
     * Called when a header of a collapsible is double-clicked.
     *
     * @param {JSEvent} event The event object associated with the header double-click.
     * @param {CustomType<servoyextra-collapse.collapsible>} collapsible The collapsible whose header was double-clicked.
     * @param {Number} collapsibleIndex The index of the collapsible.
     * @param {String} dataTarget The data target identifier for the header.
     * 
     * @return {Boolean} True if the double-click is handled, false otherwise.
     */
    onHeaderDoubleClicked: function() {}
};

/**
 * Toggles the collapsible at the given index (or the first/only one, if no index is given)
 * 
 * @param {Number} [index] the index of the collapsible to toggle
 */
function toggle(index) {
}

/**
 * Shows the collapsible at the given index (or the first/only one, if no index is given)
 * 
 * @param {Number} [index] The index of the collapsible to show
 */
function show(index) {}


/**
 * Hides the collapsible at the given index (or the first/only one, if no index is given)
 * 
 * @param {Number} [index] tTe index of the collapsible to hide
 */
function hide(index) {
}


/**
 * Creates a new collapsible that can be added to the Collapse component using <code>addCollapsible</code> / <code>setCollapsibles</code>
 * 
 * @param {String} [headerHtml] The HTML content to be used as the header of the collapsible.
 * @param {String} [collapsibleId] The unique identifier for the collapsible.
 * 
 * @return {CustomType<servoyextra-collapse.collapsible>} Returns a newly created collapsible object with the specified header and ID.
 */
function createCollapsible(headerHtml, collapsibleId) {
}

/**
 * Creates a new card that can be added to any collapsible's cards array
 * 
 * @param {String} [textOrHtml] The text or HTML content to be displayed inside the card.
 * @param {String} [cardId] The unique identifier for the card. If not provided, an ID may be generated automatically.
 * @param {String} [styleClass] A custom style class to apply to the card for styling purposes.
 * 
 * @return {CustomType<servoyextra-collapse.card>} Returns a newly created card object with the specified content, ID, and style class.
 */
function createCard(textOrHtml, cardId, styleClass) {
}

/**
 * Adds a new collapsible to the list of collapsibles of this Collapse component
 * 
 * @param {CustomType<servoyextra-collapse.collapsible>} collapsible The collapsible object to be added to the Collapse component.
 * @param {Number} [index] The 0-based index at which to insert the new collapsible. If not provided, the collapsible is added at the end.
 */
function addCollapsible(collapsible, index) {
}

/**
 * Adds a new card to the list of cards of this collapsibleId
 * 
 * @param {CustomType<servoyextra-collapse.card>} card the card to add to the collapsible
 * @param {String} collapsibleId the ID of the collapsible to add the card
 * @param {Number} [index] the index to insert the new card at
 */
function addCard(card, collapsibleId, index) {
}

/**
 * Sets all collapsibles of this Collapse component
 * 
  * @param {Array<CustomType<servoyextra-collapse.collapsible>>} collapsibles An array of collapsible objects to set as the complete list of collapsibles for the Collapse component.
 */
function setCollapsibles(collapsibles) {
}

/**
 * Returns the card with the given ID
 * @param {String} cardId The unique identifier of the card to retrieve.
 * 
 * @return {CustomType<servoyextra-collapse.card>} Returns the card object with the specified ID, or `null` if the card is not found.
 */
function getCardById(cardId) {
}

/**
 * Returns the card with the given index
 * @param {Number} cardIndex the index of the card to get (0 based)
 * @param {Number} [collapsibleIndex] if not given, the first collapsible is used
 * 
 * @return {CustomType<servoyextra-collapse.card>} the card or null when not found
 */
function getCard(cardIndex, collapsibleIndex) {
}

/**
 * Returns the collapsible with the given index (0 based)
 * 
 * @param {Number} index if not given, the first collapsible is used
 * 
 * @return {CustomType<servoyextra-collapse.collapsible>} the collapsible or null when not found
 */
function getCollapsible(index) {
}

/**
 * Returns whether the collapsible at the given index (or the first one if no index is provided) is collapsed
 * 
 * @param {Number} [index] The 0-based index of the collapsible to check. If omitted, the method checks the first collapsible.
 * 
 * @return {Boolean} Returns `true` if the specified collapsible (or the first one by default) is collapsed, otherwise `false`.
 */
function isCollapsed(index) {
}

/**
 * Returns the collapsible with the given ID
 * @param {String} [collapsibleId] if not given, the first collapsible is used
 * 
 * @return {CustomType<servoyextra-collapse.collapsible>} the card or null when not found
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
 * Remove the collapsible with the given index (the index is 0 based) or the first collapsible if no index is given. If the collapsible was showing a form, it will hide that form as well.
 * @param {Number} [index] the index of the collapsible to remove; if not given, the first collapsible is used
 * 
 * @return {Boolean} true if the collapsible at the give index (or 0 if not given) was removed; false if index is out of bounds or if the form shown by this collapsible denied hide.
 */
function removeCollapsibleAt(index) {
}

/**
 * Removes all collapsibles. It will also hide the forms that are showing on any of the collpsibles.
 *
 * If one of the collapsibles has a form showing that denies hide, the removeAllCollapsibles operation will stop and return false. In this case, all collapsibles that had forms and were hidden so far will still be in the collapsible array but they will be 'collapsed'.
 * 
 * @return {Boolean} `true` if all collapsibles were removed successfully; `false` if one of the collapsibles had a form which denied hide.
 */
function removeAllCollapsibles() {
}


var svy_types = {

    /**
     * Represents a card within a collapsible.
     */
    card: {
        /**
         * Unique identifier for the card.
         */
        cardId: null,

        /**
         * HTML content displayed inside the card.
         */
        contentHtml: null,

        /**
         * Optional form associated with the card.
         */
        form: null,

        /**
         * Minimum responsive height for the card.
         */
        minResponsiveHeight: null,

        /**
         * Maximum responsive height for the card.
         */
        maxResponsiveHeight: null,

        /**
         * CSS style classes applied to the card.
         */
        styleClass: null,
    },

    /**
     * Represents a collapsible element within the Collapse component.
     */
    collapsible: {
        /**
         * Unique identifier for the collapsible.
         */
        collapsibleId: null,

        /**
         * HTML content for the header of the collapsible.
         */
        headerHtml: null,

        /**
         * CSS style classes applied to the collapsible header.
         */
        headerStyleClass: null,

        /**
         * CSS style classes applied to the collapsible body.
         */
        bodyStyleClass: null,

        /**
         * HTML content for the collapsible body.
         */
        collapsibleHtml: null,

        /**
         * Optional form to be displayed within the collapsible.
         */
        form: null,

        /**
         * Relation name used to associate the collapsible with data.
         */
        relationName: null,

        /**
         * An array of card objects contained within the collapsible.
         */
        cards: null,

        /**
         * CSS style classes applied to the collapsible container.
         */
        styleClass: null,

        /**
         * Icon name displayed when the collapsible is collapsed.
         */
        collapsedIconName: null,

        /**
         * Icon name displayed when the collapsible is expanded.
         */
        expandedIconName: null,

        /**
         * Location of the icon relative to the header (e.g. LEFT, RIGHT, HIDDEN).
         */
        iconLocation: null,

        /**
         * Minimum responsive height for the collapsible.
         */
        minResponsiveHeight: null,

        /**
         * Maximum responsive height for the collapsible.
         */
        maxResponsiveHeight: null,
    }
}
