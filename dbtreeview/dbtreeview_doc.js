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
 * @param {Foundsetref} root The foundset reference to be added as a root node in the tree structure.
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
* @param {String} datasource The datasource identifier, representing the foundset for which the text dataprovider is being set.
* @param {String} textdataprovider The dataprovider that specifies the text to be displayed for each node in the tree.
*/
function setTextDataprovider(datasource, textdataprovider) {
}

/**
* Set relation for displaying a datasource foundset. 
* 
* @example
* %%elementName%%.setNRelationName(databaseManager.getDataSource('example_data', 'categories'),'companies_to_categories');
* 
 * @param {String} datasource The datasource identifier, representing the foundset to be displayed using the specified relation.
 * @param {String} nrelationname The name of the relation used to link the datasource with its child nodes.
*/
function setNRelationName(datasource, nrelationname) {
}   

/**
* Set relation for displaying a datasource foundset. 
* 
* @example
* %%elementName%%.setNRelationName(databaseManager.getDataSource('example_data', 'categories'),'companies_to_categories');
* 
* @param {String} datasource The datasource identifier, representing the foundset for which the checkbox dataprovider is being set.
* @param {String} hascheckboxdataprovider Relation name
*/
function setHasCheckBoxDataprovider(datasource, hascheckboxdataprovider) {
}   

/**
* Set the nodes whose checkbox will automatically autoselect children.
* 
* @example
* %%elementName%%.setCheckBoxAutoselectsChildren(databaseManager.getDataSource('example_data', 'categories'),false);
* 
 * @param {String} datasource The datasource identifier, representing the foundset for which the checkbox behavior is set.
 * @param {Boolean} autoselect A boolean value indicating whether the checkboxes should automatically select or deselect child nodes when a parent node is selected.
*/
function setCheckBoxAutoselectsChildren(datasource, autoselect) {
}

/**
* Set callback info for a datasource foundset display. 
* 
* @example
* %%elementName%%.setCallBackInfo(databaseManager.getDataSource('example_data', 'categories'),'myfunction','arg');
* 
* @param {String} datasource The datasource identifier, representing the foundset to be displayed.
* @param {Function} callbackfunction Callback function name
* @param {String} param The parameter to pass to the callback function when it is invoked.
*/
function setCallBackInfo(datasource, callbackfunction, param) {
}   

/**
* Set dataprovider for the checkbox displayed for a datasource foundset. 
* 
* @example
* %%elementName%%.setCheckBoxValueDataprovider(databaseManager.getDataSource('example_data', 'categories'),'enabled');
* 
* @param {String} datasource The datasource identifier, representing the foundset for which the checkbox value dataprovider is being set.
* @param {String} checkboxvaluedataprovider Dataprovider of the displayed checkbox
*/
function setCheckBoxValueDataprovider(datasource, checkboxvaluedataprovider) {
}   

/**
* Set callback info for a datasource foundset checkbox display. 
* 
* @example
* %%elementName%%.setMethodToCallOnCheckBoxChange(databaseManager.getDataSource('example_data', 'categories'),'myfunction','arg');
* 
* @param {String} datasource The datasource identifier, representing the foundset for which the checkbox change callback is being set.
* @param {Function} callbackfunction Callback function name
* @param {String} param A parameter to be passed to the callback function when the checkbox state changes.
*/
function setMethodToCallOnCheckBoxChange(datasource, callbackfunction, param) {
}

/**
* Set dataprovider for the tooltip text displayed for a datasource foundset. 
* 
* @example
* %%elementName%%.setToolTipTextDataprovider(databaseManager.getDataSource('example_data', 'categories'),'tooltip');
* 
 * @param {String} datasource The datasource identifier, representing the foundset for which the tooltip text dataprovider is being set.
 * @param {String} tooltiptextdataprovider Dataprovider of the displayed checkbox
*/
function setToolTipTextDataprovider(datasource, tooltiptextdataprovider) {
}   

/**
* Set dataprovider for the image displayed in tree node for a datasource foundset. 
* 
* @example
* %%elementName%%.setImageURLDataprovider(databaseManager.getDataSource('example_data', 'categories'),'mymedia');
* 
 * @param {String} datasource The datasource identifier, representing the foundset for which the image dataprovider is being set.
 * @param {String} imageurldataprovider The dataprovider that specifies the URL or path to the image displayed in the tree node.
*/
function setImageURLDataprovider(datasource, imageurldataprovider) {
}   

/**
* Set the dataprovider name to retrieve column name and sort order for the child nodes. The provided data must be a string of form : column_name_used_for_sort sort_order(asc or desc)
* 
* @example
* %%elementName%%.setChildSortDataprovider(databaseManager.getDataSource('example_data', 'companies'),'company_sort');
* 
* @param {String} datasource The datasource identifier, representing the foundset for which the child nodes' sort dataprovider is being set.
* @param {String} childsortdataprovider Dataprovider of the sort text
*/
function setChildSortDataprovider(datasource, childsortdataprovider) {
}   

/**
* Set callback info for a datasource foundset doubleclick event. 
* 
* @example
* %%elementName%%.setMethodToCallOnDoubleClick(databaseManager.getDataSource('example_data', 'categories'),'myfunction','arg');
* 
* @param {String} datasource The datasource identifier, representing the foundset for which the double-click callback is being set.
* @param {Function} callbackfunction The name of the function to be invoked when a double-click event occurs on a node.
* @param {String} param A parameter to be passed to the callback function during invocation.
*/
function setMethodToCallOnDoubleClick(datasource, callbackfunction, param) {
}   

/**
* Set callback info for a datasource foundset right click event. 
* 
* @example
* %%elementName%%.setMethodToCallOnRightClick(databaseManager.getDataSource('example_data', 'categories'),'myfunction','arg');
* 
* @param {String} datasource The datasource identifier, representing the foundset for which the right-click callback is being set.
* @param {Function} callbackfunction Callback function name
 * @param {String} param A parameter to be passed to the callback function during invocation.
*/
function setMethodToCallOnRightClick(datasource, callbackfunction, param) {
}

/**
 * Sets selection node of the tree.
 *
 * @example
 * %%elementName%%.setSelectionPath([22])
 *
 * @param {Array<Object>} pk Array of each level id
 */
function setSelectionPath(pkarray) {
}

/**
* Returns expand state of a node.
*
* @example
* var expanded = %%elementName%%.isNodeExpanded([22])
*
* @param {Array<Object>} pk Array of each level id
* 
 * @return {Boolean} True if the specified node is expanded, false if it is collapsed.
*/
function isNodeExpanded(pkarray) {
}

/**
* Sets expand state of a node.
*
* @example
* %%elementName%%.setExpandNode([22],true)
*
* @param {Array<Object>} pk Array of each level
* @param {Boolean} state Expand state
* 
*/
function setExpandNode(pkarray, state) {
}

/**
 * Returns the path of the currently selected node in the tree. 
 *
 * @example
 * var selection = %%elementName%%.getSelectionPath();
 * // selection might be an array like: [{ id: 1, name: 'Root' }, { id: 2, name: 'Child' }]
 *
 * @return {Array<Object>} An array representing the path of the selected node in the tree. 
 */
function getSelectionPath() {
}

/**
 * Sets expanded state for a tree level. Expanding the tree may cause performance issues.
 *
 * @example
 * %%elementName%%.setNodeLevelVisible(2,true)
 *
 * @param {Number} level The level of the tree to set the expanded state for.
 * @param {Boolean} visible A boolean indicating whether the specified tree level should be expanded (true) or collapsed (false).
 */
function setNodeLevelVisible(level, state) {
}

/**
 * Create relation info object used to set multiple child relations for a tree node
 * 
 * @param {String} label The label for the relation, typically used as the display name for the tree node.
 * @param {String} nRelationName The name of the relation used to define the child relations for the tree node.
 * @return {CustomType<servoyextra-dbtreeview.relationInfo>} An object containing the relation information for setting child relations in the tree structure.
 */
function createRelationInfo(label, nRelationName) {
}

/**
 * Set n-relation infos (array of RelationInfo objects created using tree.createRelationInfo() for having multiple child relations for one node)
 * 
 * @param {String} datasource The datasource identifier, representing the foundset for which the relations are being set.
 * @param {Array<CustomType<servoyextra-dbtreeview.relationInfo>>} relationInfos An array of objects, defining multiple child relations for a single node.
 */
function setNRelationInfos(datasource, relationInfos) {
}

/**
* Set intial checked checkboxes for a datasource foundset when no checkboxdataprovider is used 
* 
* @example
* %%elementName%%.setInitialCheckBoxValues(databaseManager.getDataSource('example_data', 'categories'),["1", "3", "5"]);
* 
* @param {String} datasource The datasource identifier, representing the foundset where checkboxes are applied.
* @param {Array<String>} pks array of pks that should have the checkbox checked
*/
function setInitialCheckBoxValues(datasource, initialCheckboxValues) {
}

/**
* Set the nodes that should have checkbox for a datasource when no hascheckboxdataprovider is used
* 
* @example
* %%elementName%%.setHasCheckBoxValue(databaseManager.getDataSource('example_data', 'categories'),["1", "3", "5"]);
* 
* @param {String} datasource The datasource identifier, representing the foundset for which the checkboxes should be applied.
* @param {Array<String>} pks Array of primary keys that should have a checkbox associated with them.
*/
function setHasCheckBoxValue(datasource, hasCheckboxValue) {
}

/**
* Set callback info for specific actions. 
* 
* @example
* %%elementName%%.setActionsCallBack([[datasource, function1, arg1, element1], [datasource, function2, arg2, element2]]);
* 
* @param {Array<CustomType<servoyextra-dbtreeview.action>>} actions An array of action objects, each defining a datasource, a callback function, its arguments, and the associated tree element for which the action should be triggered.
*/
function setActionsCallBack(actions) {
}


/**
 * Update checkbox state for nodes
 *
 * @example
 * %%elementName%%.updateCheckBoxValues(databaseManager.getDataSource('example_data', 'categories'),["1", "3", "5"], true);
 *
 * @param {String} datasource The datasource identifier, representing the foundset for which the checkbox states are being updated.
 * @param {Array<String>} pks Array of primary keys of the nodes for which the checkbox state should be updated.
 * @param {Boolean} state True to check the checkbox, false to uncheck it.
 */	  
function updateCheckBoxValues(){
}

/**
 * Returns array of pk of nodes that are checked for the datasource
 *
 * @example
 * var arrayPkChecked = %%elementName%%.getCheckBoxValues(databaseManager.getDataSource('example_data', 'categories'));
 *
 * @param {String} datasource The datasource identifier, representing the foundset for which the checked nodes' primary keys are retrieved.
 * @return {Array<String>} An array of primary keys of the nodes that are checked for the specified datasource.
 */
function getCheckBoxValues () {
}