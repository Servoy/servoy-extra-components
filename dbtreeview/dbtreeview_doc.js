/**
 * Refresh the tree display.
 *
 * @example
 * %%elementName%%.refresh()
 *
 */
function refresh() {
}

/**
 * Returns expand state of a node.
 *
 * @example
 * var expanded = %%elementName%%.isNodeExpanded([22])
 *
 * @param pk array of each level id
 * 
 * @return {boolean}
 */
function isNodeExpanded(pk) {
}

/**
 * Sets expand state of a node.
 *
 * @example
 * %%elementName%%.setExpandNode([22],true)
 *
 * @param pk array of each level id
 * @param state expand state
 * 
 */
function setExpandNode(pk, state) {
}
    
/**
 * Returns path of the selected node.
 *
 * @example
 * var selection = %%elementName%%.getSelectionPath()
 *
 * @return {Array}
 */
function getSelectionPath() {
}
  
function updateCheckBoxValuesForTree(datasource, pks, state) {}

/**
* Add foundset to the list of foundsets used to create the tree's root nodes. 
* 
* @example
* %%elementName%%.addRoots(foundset);
* 
* @param foundSet
*/
function addRoots(foundset) {
}

/**
* Clears all foundset roots of the tree.
* 
* @example
* %%elementName%%.removeAllRoots();
* 
*/
function removeAllRoots() {
}

function getCheckBoxValues(datasource) {
}

function updateCheckBoxValues(datasource, pks, state) {
}

/**
* Set dataprovider for the text displayed from a datasource foundset. 
* 
* @example
* %%elementName%%.setTextDataprovider(databaseManager.getDataSource('example_data', 'categories'),'categoryname');
* 
* @param datasource 
* @param textdataprovider dataprovider of the displayed text
*/
function setTextDataprovider(datasource, textdataprovider) {
}

/**
* Set relation for displaying a datasource foundset. 
* 
* @example
* %%elementName%%.setNRelationName(databaseManager.getDataSource('example_data', 'categories'),'companies_to_categories');
* 
* @param datasource 
* @param nrelationname relation name
*/
function setNRelationName(datasource, nrelationname) {
}   

/**
* Set relation for displaying a datasource foundset. 
* 
* @example
* %%elementName%%.setNRelationName(databaseManager.getDataSource('example_data', 'categories'),'companies_to_categories');
* 
* @param datasource 
* @param nrelationname relation name
*/
function setHasCheckBoxDataprovider(datasource, hascheckboxdataprovider) {
}   

/**
* Set the nodes whose checkbox will automatically autoselect children.
* 
* @example
* %%elementName%%.setCheckBoxAutoselectsChildren(databaseManager.getDataSource('example_data', 'categories'),false);
* 
* @param datasource 
* @param autoselect
*/
function setCheckBoxAutoselectsChildren(datasource, autoselect) {
}

/**
* Set callback info for a datasource foundset display. 
* 
* @example
* %%elementName%%.setCallBackInfo(databaseManager.getDataSource('example_data', 'categories'),'myfunction','arg');
* 
* @param datasource 
* @param callbackfunction callback function name
* @param param
*/
function setCallBackInfo(datasource, callbackfunction, param) {
}   

/**
* Set dataprovider for the checkbox displayed for a datasource foundset. 
* 
* @example
* %%elementName%%.setCheckBoxValueDataprovider(databaseManager.getDataSource('example_data', 'categories'),'enabled');
* 
* @param datasource 
* @param checkboxvaluedataprovider dataprovider of the displayed checkbox
*/
function setCheckBoxValueDataprovider(datasource, checkboxvaluedataprovider) {
}   

/**
* Set callback info for a datasource foundset checkbox display. 
* 
* @example
* %%elementName%%.setMethodToCallOnCheckBoxChange(databaseManager.getDataSource('example_data', 'categories'),'myfunction','arg');
* 
* @param datasource 
* @param callbackfunction callback function name
* @param param
*/
function setMethodToCallOnCheckBoxChange(datasource, callbackfunction, param) {
}

/**
* Set dataprovider for the tooltip text displayed for a datasource foundset. 
* 
* @example
* %%elementName%%.setToolTipTextDataprovider(databaseManager.getDataSource('example_data', 'categories'),'tooltip');
* 
* @param datasource 
* @param tooltiptextdataprovider dataprovider of the displayed checkbox
*/
function setToolTipTextDataprovider(datasource, tooltiptextdataprovider) {
}   

/**
* Set dataprovider for the image displayed in tree node for a datasource foundset. 
* 
* @example
* %%elementName%%.setImageURLDataprovider(databaseManager.getDataSource('example_data', 'categories'),'mymedia');
* 
* @param datasource 
* @param imageurldataprovider dataprovider of the node image
*/
function setImageURLDataprovider(datasource, imageurldataprovider) {
}   

/**
* Set the dataprovider name to retrieve column name and sort order for the child nodes. The provided data must be a string of form : column_name_used_for_sort sort_order(asc or desc)
* 
* @example
* %%elementName%%.setChildSortDataprovider(databaseManager.getDataSource('example_data', 'companies'),'company_sort');
* 
* @param datasource 
* @param childsortdataprovider dataprovider of the sort text
*/
function setChildSortDataprovider(datasource, childsortdataprovider) {
}   

/**
* Set callback info for a datasource foundset doubleclick event. 
* 
* @example
* %%elementName%%.setMethodToCallOnDoubleClick(databaseManager.getDataSource('example_data', 'categories'),'myfunction','arg');
* 
* @param datasource 
* @param callbackfunction callback function name
* @param param
*/
function setMethodToCallOnDoubleClick(datasource, callbackfunction, param) {
}   

/**
* Set callback info for a datasource foundset right click event. 
* 
* @example
* %%elementName%%.setMethodToCallOnRightClick(databaseManager.getDataSource('example_data', 'categories'),'myfunction','arg');
* 
* @param datasource 
* @param callbackfunction callback function name
* @param param
*/
function setMethodToCallOnRightClick(datasource, callbackfunction, param) {
}

/**
 * Sets selection node of the tree.
 *
 * @example
 * %%elementName%%.setSelectionPath([22])
 *
 * @param pkarray array of each level id
 */
function setSelectionPath(pkarray) {
}

/**
* Returns expand state of a node.
*
* @example
* var expanded = %%elementName%%.isNodeExpanded([22])
*
* @param pkarray array of each level id
* 
* @return {boolean}
*/
function isNodeExpanded(pkarray) {
}

/**
* Sets expand state of a node.
*
* @example
* %%elementName%%.setExpandNode([22],true)
*
* @param pkarray array of each level id
* @param state expand state
* 
*/
function setExpandNode(pkarray, state) {
}

function getSelectionPath() {
}

/**
 * Sets expanded state for a tree level. Expanding the tree may cause performance issues.
 *
 * @example
 * %%elementName%%.setNodeLevelVisible(2,true)
 *
 * @param level level in tree
 * @param state expanded state
 */
function setNodeLevelVisible(level, state) {
}

/**
 * Create relation info object used to set multiple child relations for a tree node
 * 
 * @param label 
 * @param nRelationName 
 * @return {relationInfo}
 */
function createRelationInfo(label, nRelationName) {
}

/**
 * Set n-relation infos (array of RelationInfo objects created using tree.createRelationInfo() for having multiple child relations for one node)
 * 
 * @param datasource 
 * @param relationInfos 
 */
function setNRelationInfos(datasource, relationInfos) {
}

/**
* Set intial checked checkboxes for a datasource foundset when no checkboxdataprovider is used 
* 
* @example
* %%elementName%%.setInitialCheckBoxValues(databaseManager.getDataSource('example_data', 'categories'),["1", "3", "5"]);
* 
* @param datasource 
* @param checkboxValues array of pks that should have the checkbox checked
*/
function setInitialCheckBoxValues(datasource, initialCheckboxValues) {
}

/**
* Set the nodes that should have checkbox for a datasource when no hascheckboxdataprovider is used
* 
* @example
* %%elementName%%.setHasCheckBoxValue(databaseManager.getDataSource('example_data', 'categories'),["1", "3", "5"]);
* 
* @param datasource 
* @param hasCheckboxValue array of pks that should have checkbox
*/
function setHasCheckBoxValue(datasource, hasCheckboxValue) {
}
