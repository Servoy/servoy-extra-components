var columns;

var currentPage;

/**
 * Number of rows per page, 0 means infinite scrolling mode.
 */
var pageSize;

var styleClass;

var tabSeq;

/**
 * Height of the table, set only in responsive forms.
 */
var responsiveHeight;

/**
 * When is set, the height is defined by the number of rows; if the calculated height exceeds 'responsiveHeight', then the later will be used as height.
 */
var responsiveDynamicHeight;

var minRowHeight;

var sortColumnIndex;

var sortDirection;

var lastSelectionFirstElement;

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



var handlers = {
    /**
     * @param {Number} start
     * @param {Number} end
     */
    onViewPortChanged: function() {},

    /**
     * Called when the mouse is clicked on a row/cell (foundset and column indexes are given) or when the ENTER key is used (then only the selected foundset index is given).
     * Use the record to exactly match what the user clicked on.
     * 
     * @param {Number} foundsetindex
     * @param {Number} [columnindex]
     * @param {JSRecord} [record]
     * @param {JSEvent} [event]
     * @param {String} [columnid]
     */
    onCellClick: function() {},

    /**
     * Called when the mouse is double clicked on a row/cell (foundset and column indexes are given)
     * 
     * @param {Number} foundsetindex
     * @param {Number} [columnindex]
     * @param {JSRecord} [record]
     * @param {JSEvent} [event]
     * @param {String} [columnid]
     */
    onCellDoubleClick: function() {},

    /**
     * Called when the right mouse button is clicked on a row/cell (foundset and column indexes are given).
     * Use the record to exactly match what the user clicked on.
     * 
     * @param {Number} foundsetindex
     * @param {Number} [columnindex]
     * @param {JSRecord} [record]
     * @param {JSEvent} [event]
     * @param {String} [columnid]
     */
    onCellRightClick: function() {},

    /**
     * @param {Number} columnindex
     * @param {String} sortdirection
     * @param {JSEvent} [event]
     * @param {String} [columnid]
     * @returns {String}
     */
    onHeaderClick: function() {},

    /**
     * @param {Number} columnindex
     * @param {String} sortdirection
     * @param {JSEvent} [event]
     * @param {String} [columnid]
     * @returns {String}
     */
    onHeaderRightClick: function() {},

    /**
     * @param {JSEvent} [event]
     */
    onColumnResize: function() {},

    /**
     * @param {JSEvent} event
     */
    onFocusGainedMethodID: function() {},

    /**
     * @param {JSEvent} event
     */
    onFocusLostMethodID: function() {}
};

/**
 * Request the focus to the table html element.
 * @example %%prefix%%%%elementName%%.requestFocus();
 * @param {Boolean} [mustExecuteOnFocusGainedMethod] If false will not execute the onFocusGained method; the default value is true
 */
function requestFocus(mustExecuteOnFocusGainedMethod) {
}

/**
 * Gets the start and end positions of the visible area in the viewport.
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
 * @param {Number} columnIndex The index of the column to set as selected.
 */
function setSelectedHeader() {
}

/**
 * Determines the CSS class for the sorting indicator of a given column.
 * 
 * @param {Number} columnIndex The index of the column for which to retrieve the sort class.
 * @return {String} The CSS class representing the sort direction (ascending, descending, or hidden) for the specified column.
 */
function getSortClass() {
}