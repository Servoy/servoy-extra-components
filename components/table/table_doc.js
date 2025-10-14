/**
 * A component that displays a data grid with customizable columns, pagination, sorting, and incremental scrolling.
 */

/**
 * An array holding the column definitions for the table.
 */
var columns;

/**
 * The current page number in a paginated view.
 */
var currentPage;

/**
 * The foundset (dataset) that provides the table data.
 */
var foundset;

/**
 * Number of rows per page, 0 means infinite scrolling mode.
 */
var pageSize;

/**
 * CSS style classes applied to the table.
 */
var styleClass;

/**
 * CSS style classes applied to sorted columns.
 */
var sortStyleClass;

/**
 * CSS style classes applied to the selected row.
 */
var selectionClass;

/**
 * Data provider used to determine the CSS style class for each row.
 */
var rowStyleClassDataprovider;

/**
 * Tab sequence order for keyboard navigation.
 */
var tabSeq;

/**
 * Flag indicating whether the table is visible.
 */
var visible;

/**
 * Flag indicating whether columns can be resized.
 */
var enableColumnResize;

/**
 * Flag indicating whether sorting is enabled.
 */
var enableSort;

/**
 * Height of the table, set only in responsive forms.
 */
var responsiveHeight;

/**
 * When is set, the height is defined by the number of rows; if the calculated height exceeds 'responsiveHeight', then the later will be used as height.
 */
var responsiveDynamicHeight;

/**
 * Minimum height for each row.
 */
var minRowHeight;

/**
 * CSS class for indicating an ascending sort.
 */
var sortupClass;

/**
 * CSS class for indicating a descending sort.
 */
var sortdownClass;

/**
 * The index of the column used for sorting.
 */
var sortColumnIndex;

/**
 * The current sort direction (e.g. "asc", "desc").
 */
var sortDirection;

/**
 * Settings for incremental scrolling, see github wiki for more details.
 */
var performanceSettings;

/**
 * Enable/Disable key bindings.
 */
var keyCodeSettings;

/**
 * By default horizontal scrollbar is shown as needed. Setting to NEVER will always hide it.
 */
var horizontalScrollbar;

/**
 * Flag to enable the mobile view for the table.
 */
var enableMobileView;


var handlers = {
    /**
     * Called when the viewport of the table changes.
     *
     * @param {Number} start The starting index of the visible rows.
     * @param {Number} end The ending index of the visible rows.
     */
    onViewPortChanged: function() {},

    /**
     * Called when the mouse is clicked on a row/cell (foundset and column indexes are given) or when the ENTER key is used (then only the selected foundset index is given).
     * Use the record to exactly match what the user clicked on.
     *
     * @param {Number} foundsetindex The index of the clicked row in the foundset.
     * @param {Number} [columnindex] The index of the clicked column.
     * @param {JSRecord} [record] The record corresponding to the clicked row.
     * @param {JSEvent} [event] The event object associated with the click.
     * @param {String} [columnid] The identifier of the clicked column.
     */
    onCellClick: function() {},

    /**
     * Called when the mouse is double clicked on a row/cell (foundset and column indexes are given)
     *
     * @param {Number} foundsetindex The index of the double-clicked row in the foundset.
     * @param {Number} [columnindex] The index of the double-clicked column.
     * @param {JSRecord} [record] The record corresponding to the double-clicked row.
     * @param {JSEvent} [event] The event object associated with the double-click.
     * @param {String} [columnid] The identifier of the double-clicked column.
     */
    onCellDoubleClick: function() {},

    /**
     * Called when the right mouse button is clicked on a row/cell (foundset and column indexes are given).
     * Use the record to exactly match what the user clicked on.
     *
     * @param {Number} foundsetindex The index of the row where the right-click occurred.
     * @param {Number} [columnindex] The index of the clicked column.
     * @param {JSRecord} [record] The record corresponding to the right-clicked row.
     * @param {JSEvent} [event] The event object associated with the right-click.
     * @param {String} [columnid] The identifier of the clicked column.
     */
    onCellRightClick: function() {},

    /**
     * Called when a header is clicked.
     *
     * @param {Number} columnindex The index of the clicked column.
     * @param {String} sortdirection The desired sort direction.
     * @param {JSEvent} [event] The event object associated with the click.
     * @param {String} [columnid] The identifier of the clicked column.
     * 
     * @return {String} The resulting sort class.
     */
    onHeaderClick: function() {},


    /**
     * Called when a header is right-clicked.
     *
     * @param {Number} columnindex The index of the clicked column.
     * @param {String} sortdirection The desired sort direction.
     * @param {JSEvent} [event] The event object associated with the click.
     * @param {String} [columnid] The identifier of the clicked column.
     * 
     * @return {String} The resulting sort class.
     */
    onHeaderRightClick: function() {},

    /**
     * Called when a column is resized.
     *
     * @param {JSEvent} [event] The event object associated with the resize.
     */
    onColumnResize: function() {},

    /**
     * Called when the table gains focus.
     *
     * @param {JSEvent} event The event object associated with the focus gain.
     */
    onFocusGainedMethodID: function() {},

    /**
     * Called when the table loses focus.
     *
     * @param {JSEvent} event The event object associated with the focus loss.
     */
    onFocusLostMethodID: function() {}
};

/**
 * Request the focus to the table html element.
 * 
 * @example %%prefix%%%%elementName%%.requestFocus();
 * 
 * @param {Boolean} [mustExecuteOnFocusGainedMethod] If false will not execute the onFocusGained method; the default value is true
 */
function requestFocus(mustExecuteOnFocusGainedMethod) {
}

/**
 * Gets the start and end positions of the visible area in the viewport.
 * 
 * @return {Array<Number>} An array containing two elements: the start position and the end position of the visible area.
 */
function getViewPortPosition(){            
}

function setSelectedHeader(columnIndex) {
}
/**
 * Gets the number of columns
 * 
 * @example
 *	%%prefix%%%%elementName%%.getColumnsCount()
 *
 * @return {Number} Returns the total number of columns currently present in the table.
 */ 
function getColumnsCount() {
}

/**
 * Gets the column at index. Index is 0 based.
 * 
 * @param {Number} index index between 0 and columns length -1
 * 
 * @example
 *	%%prefix%%%%elementName%%.getColumn()
 *	
 * @return {CustomType<servoyextra-table.column>} Returns the column object at the specified index, including its properties and configurations.
 */ 
function getColumn(index) {
}

/**
 * Adds new column at specified index. Index is 0 based.
 * 
 * @param {String} dataproviderid dataprovider of the column
 * @param {Number} [index] index between 0 and columns length
 * 
 * @example
 *	var column = %%prefix%%%%elementName%%.newColumn('dataproviderid')
 *
 * @return {CustomType<servoyextra-table.column>} Returns the newly added column object.
 */
function newColumn(dataproviderid,index) {
}

/**
 * Removes column from specified index. Index is 0 based.
 *
 * @example
 * %%prefix%%%%elementName%%.removeColumn(0)
 *
 * @param {Number} index Index index between 0 and columns length -1
 * 
 * @return {boolean} Returns `true` if the column was successfully removed, otherwise `false`.
 */
function removeColumn(index) {
}

/**
 * Removes all columns.
 *
 * @example
 * %%prefix%%%%elementName%%.removeAllColumns()
 *
  * @return {Boolean} Returns `true` if all columns were successfully removed, otherwise `false`.
 */
function removeAllColumns() {
}

/**
 * Sets the selected header column by triggering a header click event for the specified column index.
 * 
 * @param {Number} columnIndex The index of the column to set as selected.
 */
function setSelectedHeader() {
}

/**
 * Determines the CSS class for the sorting indicator of a given column.
 * 
 * @param {Number} columnIndex The index of the column for which to retrieve the sort class.
 * 
 * @return {String} The CSS class representing the sort direction (ascending, descending, or hidden) for the specified column.
 */
function getSortClass() {
}

var svy_types = {

    /**
     * Represents a column in the table.
     */
    column: {
        /**
         * The dataprovider linked to this column.
         */
        dataprovider: null,

        /**
         * Format string for displaying the column's values.
         */
        format: null,

        /**
         * CSS style classes applied to the column header.
         */
        headerStyleClass: null,

        /**
         * The header text of the column.
         */
        headerText: null,

        /**
         * CSS style classes applied to the column cells.
         */
        styleClass: null,

        /**
         * Dataprovider that defines dynamic CSS classes for cells.
         */
        styleClassDataprovider: null,

        /**
         * The value list used to map column values.
         */
        valuelist: null,

        /**
         * The width of the column.
         */
        width: null,

        /**
         * The initial width of the column when first rendered.
         */
        initialWidth: null,

        /**
         * Indicates if the column should auto-resize.
         */
        autoResize: null,

        /**
         * Determines how the column value is shown (text, html, etc.).
         */
        showAs: null,

        /**
         * Used to identify the column in cell event handlers, because column index can change if columns are added/removed at runtime.
         */
        id : null,

    },

    /**
     * General settings for the table behavior.
     */
    settings: {
        /**
         * Minimum number of rows to render when loading more rows.
         */
        minBatchSizeForRenderingMoreRows: null,

        /**
         * Minimum number of rows to load when fetching additional data.
         */
        minBatchSizeForLoadingMoreRows: null,

        /**
         * Maximum number of rows to render.
         */
        maxRenderedRows: null,

        /**
         * Maximum number of rows to load.
         */
        maxLoadedRows: null,

        /**
         * Threshold factor for fast scroll rendering.
         */
        fastScrollRenderThresholdFactor: null,

        /**
         * Threshold factor for fast scroll loading.
         */
        fastScrollLoadThresholdFactor: null,
    },

    /**
     * Settings for key bindings used in table navigation.
     */
    keyCodeSettings: {
        /**
         * Enable Page Up key binding.
         */
        pageUp: null,

        /**
         * Enable Page Down key binding.
         */
        pageDown: null,

        /**
         * Enable Arrow Up key binding.
         */
        arrowUp: null,

        /**
         * Enable Arrow Down key binding.
         */
        arrowDown: null,

        /**
         * Enable Home key binding.
         */
        home: null,

        /**
         * Enable End key binding.
         */
        end: null,
        
        /**
         * Enable Enter key binding.
         */
        enter: null,
    }
}
