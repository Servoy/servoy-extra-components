/*
 * Servoy Extra Component for displaying list form components with integrated foundset and contained form.
 * DEPRECATED: Use servoycore-listformcomponent component instead
 */

/**
 * Reference to the foundset used for data binding.
 */
var foundset;

/**
 * The form to be displayed within the list form component.
 */
var containedForm;

/**
 * Layout style of the list form, e.g., 'cardview' or 'listview'.
 */
var pageLayout;

/**
 * Responsive page size setting for adjusting the component's layout.
 */
var responsivePageSize;

/**
 * Custom CSS class for styling the list form component.
 */
var styleClass;

/**
 * CSS class for styling the selection state within the list form component.
 */
var selectionClass;

var handlers = {
    /**
     * Called after the foundset selection changes.
     * 
     * @param {JSEvent} event The event object.
     */
    onSelectionChanged: function() {}
};
