/**
* Add foundset to the list of foundsets used to create the tree's root nodes. 
* 
* @example
* %%elementName%%.addRoots(foundset);
* 
* @param foundSet
*/
$scope.api.addRoots = function(root) {
	if(!$scope.model.roots) {
		$scope.model.roots = []
	}
	$scope.model.roots.push(root)
}
/**
* Clears all foundset roots of the tree.
* 
* @example
* %%elementName%%.removeAllRoots();
* 
*/
$scope.api.removeAllRoots = function() {
	if($scope.model.roots) {
		$scope.model.roots.length = 0;
	}
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
$scope.api.setTextDataprovider = function(datasource, textdataprovider) {
	$scope.getBinding(datasource).textdataprovider = textdataprovider;	   	
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
$scope.api.setNRelationName = function(datasource, nrelationname) {
	$scope.getBinding(datasource).nrelationname = nrelationname;
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
$scope.api.setHasCheckBoxDataprovider = function(datasource, hascheckboxdataprovider) {
	$scope.getBinding(datasource).hascheckboxdataprovider = hascheckboxdataprovider;
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
$scope.api.setCallBackInfo = function(datasource, callbackfunction, param) {
	$scope.getBinding(datasource).callbackinfo = {f: callbackfunction, param: param }
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
$scope.api.setCheckBoxValueDataprovider = function(datasource, checkboxvaluedataprovider) {
	$scope.getBinding(datasource).checkboxvaluedataprovider = checkboxvaluedataprovider;
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
$scope.api.setMethodToCallOnCheckBoxChange = function(datasource, callbackfunction, param) {
	$scope.getBinding(datasource).methodToCallOnCheckBoxChange = {f: callbackfunction, param: param }  		
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
$scope.api.setToolTipTextDataprovider = function(datasource, tooltiptextdataprovider) {
	$scope.getBinding(datasource).tooltiptextdataprovider = tooltiptextdataprovider;
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
$scope.api.setImageURLDataprovider = function(datasource, imageurldataprovider) {
	$scope.getBinding(datasource).imageurldataprovider = imageurldataprovider;
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
$scope.api.setChildSortDataprovider = function(datasource, childsortdataprovider) {
	$scope.getBinding(datasource).childsortdataprovider = childsortdataprovider;
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
$scope.api.setMethodToCallOnDoubleClick = function(datasource, callbackfunction, param) {
	$scope.getBinding(datasource).methodToCallOnDoubleClick = {f: callbackfunction, param: param }  		
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
$scope.api.setMethodToCallOnRightClick = function(datasource, callbackfunction, param) {
	$scope.getBinding(datasource).methodToCallOnRightClick = {f: callbackfunction, param: param }  		
}

$scope.getBinding = function(datasource) {
	if(!$scope.model.bindings) {
		$scope.model.bindings = [];
	}

	for(var i = 0; i < $scope.model.bindings.length; i++) {
		if($scope.model.bindings[i].datasource == datasource) {
			return $scope.model.bindings[i];
		}
	}
	
	var lastIdx = $scope.model.bindings.length;
	$scope.model.bindings[lastIdx] = {
			datasource: datasource
	};	
	return $scope.model.bindings[lastIdx];
}

/**
 * Sets selection node of the tree.
 *
 * @example
 * %%elementName%%.setSelectionPath([22])
 *
 * @param pk array of each level id
 */
$scope.api.setSelectionPath = function(pk) {
	$scope.model.selection = pk;
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
$scope.api.setNodeLevelVisible = function(level, state) {
	$scope.model.levelVisibility = {level: level, value: state};	
}

/**
 * Create relation info object used to set multiple child relations for a tree node
 * 
 * @param label 
 * @param nRelationName 
 * @return {relationInfo}
 */
$scope.api.createRelationInfo = function(label, nRelationName) {
	return {label: label, nRelationName: nRelationName};
}

/**
 * Set n-relation infos (array of RelationInfo objects created using tree.createRelationInfo() for having multiple child relations for one node)
 * 
 * @param datasource 
 * @param relationInfos 
 */
$scope.api.setNRelationInfos = function(datasource, relationInfos) {
	$scope.getBinding(datasource).nRelationInfos = relationInfos;
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
$scope.api.setInitialCheckBoxValues = function(datasource, initialCheckboxValues) {
	$scope.getBinding(datasource).initialCheckboxValues = initialCheckboxValues;
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
$scope.api.setHasCheckBoxValue = function(datasource, hasCheckboxValue) {
	$scope.getBinding(datasource).hasCheckboxValue = hasCheckboxValue;
}