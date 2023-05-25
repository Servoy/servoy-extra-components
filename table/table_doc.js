/**
 * Request the focus to the table html element.
 * @example %%prefix%%%%elementName%%.requestFocus();
 * @param mustExecuteOnFocusGainedMethod (optional) if false will not execute the onFocusGained method; the default value is true
 */
function requestFocus(mustExecuteOnFocusGainedMethod) {
}

function getViewPortPosition(){            
}

function setSelectedHeader(columnIndex) {
}
/**
 * Gets the number of columns
 * 
 * @example
 *	%%prefix%%%%elementName%%.getColumnsCount()
 */ 
function getColumnsCount() {
}

/**
 * Gets the column at index. Index is 0 based.
 * 
 * @param index index between 0 and columns length -1
 * 
 * @example
 *	%%prefix%%%%elementName%%.getColumn()
 *	
 * @return {column}
 */ 
function getColumn(index) {
}

/**
 * Adds new column at specified index. Index is 0 based.
 * 
 * @param dataproviderid dataprovider of the column
 * @param index index between 0 and columns length
 * 
 * @example
 *	var column = %%prefix%%%%elementName%%.newColumn('dataproviderid')
 *
 *	@return {column}
 */
function newColumn(dataproviderid,index) {
}

/**
 * Removes column from specified index. Index is 0 based.
 *
 * @example
 * %%prefix%%%%elementName%%.removeColumn(0)
 *
 * @param index index between 0 and columns length -1
 * 
 * @return {boolean}
 */
function removeColumn(index) {
}

/**
 * Removes all columns.
 *
 * @example
 * %%prefix%%%%elementName%%.removeAllColumns()
 *
 * @return {boolean}
 */
function removeAllColumns() {
}