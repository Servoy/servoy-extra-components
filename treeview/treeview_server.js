/**
 * Sets the tree data
 * @param jsDataSet the JSDataSet used for the tree model
 * @example
 * 	var treeviewDataSet = databaseManager.createEmptyDataSet( 0,  ['id', 'pid', 'treeColumn', 'icon']);
 * 
 *	treeviewDataSet.addRow([1,		null,	'Main group',	'media:///group.png']);
 *	treeviewDataSet.addRow([2,		null,	'Second group',	'media:///group.png']);
 *	treeviewDataSet.addRow([3,		2,		'Subgroup',		'media:///group.png']);
 *	treeviewDataSet.addRow([4,		3,		'Mark',			'media:///user.png']);
 *	treeviewDataSet.addRow([5,		3,		'George',		'media:///user.png']);
 *
 *	%%prefix%%%%elementName%%.setDataSet(treeviewDataSet);
 *
 *  // Render tree as a table by providing any additional 'column*' in the DataSet; additional columns must be prefixed with 'column'; e.g. columnone, columntwo...
 *	var tableTreeviewDataSet = databaseManager.createEmptyDataSet( 0, ['id', 'pid', 'treeColumn', 'icon', 'column1', 'column2']);
 *
 *	tableTreeviewDataSet.addRow([null, null, 'Group', null, 'Description', 'Extra info']);	// header
 *	tableTreeviewDataSet.addRow([1, null, 'Main group', 'media:///group.png', 'This is my the Main Group', 'Has (0) child']);
 *	tableTreeviewDataSet.addRow([2, null, 'Second group', 'media:///group.png', 'This is my the Second Group', 'Has (1) child']);
 *	tableTreeviewDataSet.addRow([3, 2, 'Subgroup', 'media:///group.png', 'This is my the Subgroup Group', 'Has (2) children']);
 *	tableTreeviewDataSet.addRow([4, 3, 'Mark', 'media:///user.png', 'This is leaf Mark', 'Has (0) child']);
 *	tableTreeviewDataSet.addRow([5, 3, 'George', 'media:///user.png', 'This is leaf George', 'Has (0) child']);
 *
 *	%%prefix%%%%elementName%%.setDataSet(tableTreeviewDataSet);
 *
 */
$scope.api.setDataSet = function(jsDataSet) {
	$scope.model.jsDataSet = null; // make sure the jsDataSet is seen as changed (even if the same instance is passed in)
	$scope.model.jsDataSet = jsDataSet;
}