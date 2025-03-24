var getNodeLevel;
var getPathToNode;
var getParentNode;
var getParentNodeByIndexPath;
var getNodeByIndexPath;
var getSelectedIndexPath;
var clearGroups;

/**
 * Init the menu setting the root menuItems.
 *
 * @public
 * @param {Array<{id: String|Number ,
					text: String=,
					styleClass: String=,
					iconStyleClass: String=,
					enabled: Boolean=,
					data: Object=,
					menuItems: Array=,
					isDivider : Boolean=}>} menuItems is an array of MenuItem objects. 
					Each MenuItem object should set the required properties 'id', which uniquely identifies the menuItem object in menu, and 'text' property.
					The MenuItem may contain the optional properties 'styleClass', 'iconStyleClass', 'data', 'enabled', 'menuItems', 'isDivider'
 *
 * @example var menu = [{
  id: 1,
  text: "Sample Item #1",
  styleClass : "sn-large",
  iconStyleClass:  "glyphicon glyphicon-search",
  data: { description: "This is sample information that can be added to a menuItem" },
  menuItems: [{
		id: 5,
		text: "Sub Item #1"
		}, {
		id: 6,
		text: "Sub Item #2"
  }]
  }, {
  id: 2,
  text: "Sample Item #2"
  },{
  isDivider: true
  },{
  id: 3,
  text: "Sample Item #3",
  enabled: false
  }];
  elements.sideNavigation.setRootMenuItems(menu);
 * */
$scope.api.setRootMenuItems = function(menuItems) {
	$scope.model.menu = menuItems;
	menuItems = $scope.model.menu;
}

/**
 * Returns the root menu object
 * @public
 *
 * @return {Array<CustomType<servoyextra-sidenav.MenuItem>>}
 * */
$scope.api.getRootMenuItems = function() {
	var menuItems = $scope.model.menu;
	return menuItems;
}

/**
 * Returns the menuItem object
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>}
 * */
$scope.api.getMenuItem = function(menuItemId) {
	return getNodeById(menuItemId, $scope.model.menu);
}

/**
 * Returns the parent menuItem object of the menu item with id menuItemId
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>}
 * */
$scope.api.getParentMenuItem = function(menuItemId) {
	/** @type {CustomType<servoyextra-sidenav.MenuItem>} */
	var parent = getParentNode(menuItemId, $scope.model.menu);
	return parent;
}

/**
 * Enable or disable the menuItem
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId
 * @param {Boolean} enabled
 *
 * @return {Boolean}
 * */
$scope.api.setMenuItemEnabled = function(menuItemId, enabled) {
	var node = getNodeById(menuItemId, $scope.model.menu);
	if (node) {
		node.enabled = enabled;
		return true;
	}
	return false;
}

/**
 * Add a menu item. The menu is added as sub Menu Item if a menuItemId is provided, otherwise is added in root.
 * If index is provided the menu is added at the specified index position, otherwise is added as last element.
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {MenuItem} menuItem 
 * @param {String|Number} [menuItemId] add the item as subMenuItem of the menuItemId. Default add the menuItem as root.
 * @param {Number} [index]	0-based. The index at which to insert the item. Index value should not be greater then number of sibelings. Default is at the end.
 * 
 * @example<pre> var menuItem = {
  id: 100,
  text: "Sample Item #1",
  styleClass : "nav-large nav-primary",
  iconStyleClass:  "glyphicon glyphicon-search",
  data: { description: "This is sample information that can be added to a menuItem" },
  menuItems: [{
		id: 101,
		text: "Sub Item #1"
		}, {
		id: 102,
		text: "Sub Item #2"}]
  };
  elements.sideNavigation.addMenuItem(menuItem, 1, 0);</pre>
 * 
 * @return {Boolean}
 * */
$scope.api.addMenuItem = function(menuItem, menuItemId, index) {
	var nodes;

	// find the nodes
	if (menuItemId) { // add to node
		var node = getNodeById(menuItemId, $scope.model.menu);
		if (node) {
			if (!node.menuItems) node.menuItems = [];
			nodes = node.menuItems;
		} else {
			// TODO can i add some log here !?
			// cannot find node with menuItemId
			return false;
		}
	} else { // add to root
		if (!$scope.model.menu) $scope.model.menu = [];
		nodes = $scope.model.menu;
	}

	if (nodes) {
		if (typeof (index) === 'number' && index >= 0 && index <= nodes.length) {
			// insert in a proper position
			var newNodes = nodes.splice(0, index).concat([menuItem]).concat(nodes);
			if (node) {	 // add to node
				node.menuItems = newNodes;
			} else {	// add to root
				$scope.model.menu = newNodes;
			}
		} else if (index === null || index === undefined) {
			nodes.push(menuItem);
		} else {
			// invalid index
			// TODO how to handle this exception ?
			throw "invalid argument index " + index;
		}
		return true;
	} else {
		return false;
	}
}

/**
 * Remove the menu item and all it's subMenuItems from the tree.
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {Boolean}
 * */
$scope.api.removeMenuItem = function(menuItemId) {
	var nodes;
	var index;

	// find path to node;
	var pathIndex = getPathToNode(menuItemId, $scope.model.menu);
	if (pathIndex && pathIndex.length) {
		index = pathIndex.pop();

		// find parent node and index;
		if (pathIndex.length === 0) { // item is in root
			nodes = $scope.model.menu;
			$scope.model.menu = nodes.slice(0, index).concat(nodes.slice(index + 1, nodes.length));
		} else if (pathIndex && pathIndex.length > 0) { // find the parent element
			var parentNode = getNodeByIndexPath(pathIndex, $scope.model.menu);
			if (parentNode) {
				nodes = parentNode.menuItems;
				parentNode.menuItems = nodes.slice(0, index).concat(nodes.slice(index + 1, nodes.length));
			}
		} else { // parent not found
			console.log("debug: this should not happen");
			return false;
		}
		return true;
	}
	return false;
}

/**
* Returns the sub menu items of the menu item with id 'menuItemId'
* @public
*
* @param {String|Number} menuItemId
* @return {Array<CustomType<servoyextra-sidenav.MenuItem>>} 
*/
$scope.api.getSubMenuItems = function(menuItemId) {
	/** @type {Array<CustomType<servoyextra-sidenav.MenuItem>>} */
	var menuItems;
	var tree = $scope.model.menu;
	var node = getNodeById(menuItemId, tree);
	if (node) {
		menuItems = node.menuItems;
	}
	return menuItems;
}

/**
 * Set the menuItems as sub menu items of the menu item with id 'menuItemId'
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId
 * @param {Array<{id: String|Number, 
 * 			text: String=,
 * 			styleClass: String=,
 * 			iconStyleClass: String=,
 * 			enabled: Boolean=,
 * 			data: Object=,
 *			menuItems: Array=,
 *			isDivider : Boolean=}>} menuItems  is an array of MenuItem objects. 
 *									Each MenuItem object should set the required properties 'id', which uniquely identifies the menuItem object in menu, and 'text' property. 
 *									The MenuItem may contain the optional properties 'styleClass', 'iconStyleClass', 'data', 'enabled', 'menuItems', 'isDivider'.
 *
 * @example <pre>var menuItems = [{
  id: 10,
  text: "Sample Item #1",
  styleClass : "sn-large",
  iconStyleClass:  "glyphicon glyphicon-search",
  data: { description: "This is sample information that can be added to a menuItem" },
  menuItems: [{
		id: 12,
		text: "Sub Item #1"
		}
  }]
  }, {
  id: 11,
  text: "Sample Item #2"
  },{
  isDivider: true
  }];
  elements.sideNavigation.setSubMenuItems(menuItems);</pre>
 *
 * @return {Boolean}
 * */
$scope.api.setSubMenuItems = function(menuItemId, menuItems) {
	var tree = $scope.model.menu;
	var node = getNodeById(menuItemId, tree);
	if (node) {
		node.menuItems = menuItems;
		return true;
	}
	return false;
}

/**
 * Remove all the sub menu items of the menu item with id 'menuItemId'
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {Boolean}
 * */
$scope.api.removeSubMenuItems = function(menuItemId) {
	var node = getNodeById(menuItemId, $scope.model.menu);
	if (node) {
		delete node.menuItems;
		return true;
	}
	return false;
}

/**
 * Remove all the menu items. If depth is specified removes all the menu items at depth.
 * If depth is equal to 1 all roots will be removed. Default depth is 1.
 * 
 * @public
 * 
 * @example 
 * <pre>
 * // clear the whole menu removing all nodes. 
 * elements.sidenav.clearMenuItems();
 * 
 * // clear menu at depth 2 removes the sub menu items of each root menu.
 * elements.sidenav.clearMenuItems(2);
 * </pre>
 *
 * @param {Number} [depth] 1-based. Default 1.
 *  */
$scope.api.clearMenuItems = function(depth) {
	if (!depth) depth = 1;
	if (depth === 1) { // if level is one remove the root
		$scope.model.menu = [];
	} else { // remove all subnodes at level
		var nodes = $scope.model.menu;
		clearGroups(depth, nodes, 2);
	}

	// TODO call update menu items
	// clear indexes at deeper level
	// clearSelectedIndex(level - 1);
	// storeSelectedIndex();
	// $scope.svyServoyapi.apply("menu");
}

/**
 * Search the node into the given node.
 * Cost: O(n) full scan
 * @private
 *
 * @param {String|Number} menuItemId
 * @param {Array} nodes
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>} 
 * */
function getNodeById(menuItemId, nodes) {
	/** @type {CustomType<servoyextra-sidenav.MenuItem>} */
	var node;
	/** @type {CustomType<servoyextra-sidenav.MenuItem>} */
	var subNode;
	if (nodes) {
		for (var i = 0; i < nodes.length; i++) { // search in each subtree

			subNode = nodes[i];
			if (subNode.id == menuItemId) { // find the node
				return subNode;
			}
			node = getNodeById(menuItemId, subNode.menuItems);
			if (node) {
				return node;
			}
		}
	}
	return node;
}

/**
 * Returns the subtree at the Given path
 * Cost O(1) scan depth
 * @private
 *
 * @param {Array<Number>} path
 * @param {Array} nodes
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>}
 * */
getNodeByIndexPath = function(path, nodes) {

	/** @type {CustomType<servoyextra-sidenav.MenuItem>} */
	var node = null;
	if (nodes) {
		if (path && path.length === 1) {
			node = nodes[path[0]];
		} else if (path && path.length) {
			var subPathIndex = path[0];
			var subtree = nodes[subPathIndex].menuItems;
			node = getNodeByIndexPath(path.slice(1, path.length), subtree);
		} else { // is the root
			node = nodes;
		}
	}
	return node;
}

/**
 * Retuns the path to the given node
 * @private
 *
 * @param {Object} idOrNode
 * @param {Array} nodes
 * @param {String} [key] search the node by key value. Default 'id'.
 *
 * @return {Array<Number>} */
getPathToNode = function(idOrNode, nodes, key) {
	if (!key) key = 'id';
	var menuItemId = idOrNode[key] ? idOrNode[key] : idOrNode;

	if (nodes) { // for each node in nodes
		for (var i = 0; i < nodes.length; i++) { // search in each subtree
			var subTree = nodes[i];
			if (subTree[key] == menuItemId) { // find the node
				return [i];
			}
			var path = getPathToNode(menuItemId, subTree.menuItems, key);
			if (path) {
				return [i].concat(path);
			}
		}
	}
	return null;
}

/**
 * Retuns the path to the given node
 * @private
 *
 * @param {String|Number} menuItemId
 * @param {Array} nodes
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>} */
getParentNode = function(menuItemId, nodes) {
	var indexPath = getPathToNode(menuItemId, nodes);
	if (indexPath && indexPath.length > 1) {
		indexPath.pop();
		return getNodeByIndexPath(indexPath, nodes)
	}
	return null;
}

/**
 * Retuns the parent node
 * @private
 *
 * @param {Array<Number>} indexPath
 * @param {Array} nodes
 *
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>} 
 * */
getParentNodeByIndexPath = function(indexPath, nodes) {
	if (indexPath && indexPath.length > 1) {
		return getNodeByIndexPath(indexPath.slice(0, indexPath.length - 1), nodes);
	}
	return null;
}

/**
 * @private 
 * Returns all anchestors of node
 *
 * @param {String|Number} nodeId
 * @return Array
 * */
getNodeLevel = function(nodeId) {
	var path = getPathToNode(nodeId, $scope.model.menu);
	if (path) {
		return path.length;
	} else {
		return null;
	}
}

/**
 * Remove all the nodes where level = deep
 * @private
 *
 * @param {Number} level
 * @param {Array} nodes
 * @param {Number} deep
 *
 *  */
clearGroups = function(level, nodes, deep) {
	if (nodes) {
		for (var i = 0; i < nodes.length; i++) { // go one level deeper
			var subTree = nodes[i];
			if (level === deep) { // delete all subgroups
				delete subTree.menuItems;
			}
			clearGroups(level, subTree.menuItems, deep + 1);
		}
	}
}

/**
 * @private
 * Returns the selected index path up-to level
 * can't find selected node by index anymore
 *
 * @param {Number} [level] 1-based
 * @return {Array<Number>}
 * */
getSelectedIndexPath = function(level) {
	var selectedNode = getSelectedNode(level);
	var path = getPathToNode(selectedNode.id, $scope.model.menu);
	return path;
}

/**`
 * @private
 * Returns the selected node up-to level
 *
 * @param {Number} [level] 1-based
 * @return {CustomType<servoyextra-sidenav.MenuItem>}
 * */
function getSelectedNode(level) {
	var levels = $scope.model.selectedIndex ? JSON.parse($scope.model.selectedIndex) : {};
	var maxLevel = -1;

	// get the node at deeper level
	for (var lvl in levels) {
		if (lvl > maxLevel && (!level || lvl <= level)) {
			maxLevel = lvl;
		}
	}

	var nodeId = levels[maxLevel];
	return getNodeById(nodeId, $scope.model.menu);
}

/**
 * Server Side API
 *
 * Returns the selected menuItem.
 * @public
 *
 * @param {Number} [level] if level is provided search for the selected menu item at level.
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>}
 * */
$scope.api.getSelectedMenuItem = function(level) {
	// TODO if level is greater then selected level, what should return ?
	return getSelectedNode(level);
}

/**
 * Server Side API
 *
 * Select the menu item with the given id.
 * If level is provided search is optimized since it will search only within the descendant of the selected menuItem at level.
 * For example if a root menuItem is selected and level is equal 2 search only in the subMenuItems of the selected root.
 * Return false if menuItemId cannot be found or is disabled.
 * @public
 *
 * @param {String|Number} id
 * @param {Boolean} [mustExecuteOnMenuItemSelect] Force the onMenuItemSelect to be executed. Default false.
 * @param {Boolean} [mustExecuteOnMenuItemExpand] Force the onMenuItemExpand to be executed. Default false.
 * @param {Number} [level] reduce the search to the selected menuItem at level, if any menuItem is selected at level.
 *
 * @return {Boolean}
 *
 *  */
$scope.api.setSelectedMenuItem = function(id, mustExecuteOnMenuItemSelect, mustExecuteOnMenuItemExpand, level) {

	var nodes;
	var levelPath = [];

	// if level is provided search only in the selected node
	if (level && level > 1) { // search in selected node only
		levelPath = getSelectedIndexPath(level - 1);
		var parentNode = getNodeByIndexPath(levelPath, $scope.model.menu); // retrieve the selected node at level
		if (parentNode) nodes = parentNode.menuItems;
	} else if (level === 1) { // search in root
		// FIXME it searches in the whole tree
		nodes = $scope.model.menu;
	} else {
		nodes = $scope.model.menu;
	}

	// search path to node
	var path = levelPath;
	var subPath = getPathToNode(id, nodes, 'id');
	if (subPath) { // not found in the selected node
		path = levelPath.concat(subPath);
	} else {
		return false;
	}

	// do nothing if the item is already selected
	var selectedIndex = $scope.model.selectedIndex ? JSON.parse($scope.model.selectedIndex) : {};
	if (isNodeSelected(id, path.length) && !selectedIndex[path.length + 1]) {
		return true;
	} else {
		// search the node
		var node = getNodeByIndexPath(subPath, nodes);

		// select the item
		var preventSelectHandler = mustExecuteOnMenuItemSelect == true ? false : true;
		var preventExpandHandler = mustExecuteOnMenuItemExpand == true ? false : true;
		return selectItem(path.length, path[path.length - 1], node, null, preventSelectHandler, preventExpandHandler);
	}
}

/**
 * Server Side API
 *
 * Force the menuItem to be expanded or collapsed.
 * Return false if menuItemId cannot be found or is disabled.
 * @public
 *
 * @param {String|Number} menuItemId
 * @param {Boolean} expanded force the menuItem to expand if true, is collapsed otherwise
 * @param {Boolean} [mustExecuteOnMenuItemExpand] Force the onMenuItemExpand to be executed. Default false.
 *
 * @return {Boolean}
 *  */
$scope.api.setMenuItemExpanded = function(menuItemId, expanded, mustExecuteOnMenuItemExpand) {
	var node = getNodeById(menuItemId, $scope.model.menu);

	if (!node) {
		return false;
	}

	// expandItem/collapsItem requires node level
	var level = getNodeLevel(menuItemId);
	var preventHandler = mustExecuteOnMenuItemExpand == true ? false : true;

	if (expanded) {
		return expandItem(level, null, node, null, preventHandler);
	} else {
		return collapseItem(level, null, node, null, preventHandler);
	}

}

/**
 * @private 
 * @param {Number} level
 * @param {Number} index
 * @param {CustomType<servoyextra-sidenav.MenuItem>} item
 * @param {Object} [event]
 * @param {Object} [preventHandler]
 * 
 * Expand the item */
function expandItem(level, index, item, event, preventHandler) {

	// check if node is already collapsed
	if (isNodeExpanded(item.id, level)) {
		return true;
	}

	// prevent selection if item is disabled
	if (isDisabled(item.id)) {
		return false;
	}

	// create a dummy jsevent
	if (!event) {
		event = createJSEvent();
	}

	// if is expanded
	if (preventHandler != true && $scope.handlers.onMenuItemExpanded) { // change selection only if onMenuItemSelected allows it
		try {
			$scope.handlers.onMenuItemExpanded(item.id, event);
		} catch (err) {
			console.log(err);
		}
	}
	setExpandedIndex(level, index, item);


	return true;
}

/**
 * @private 
 * @param {Number} level
 * @param {Number} index
 * @param {CustomType<servoyextra-sidenav.MenuItem>} item
 * @param {Object} [event]
 * @param {Object} [preventHandler]
 *
 * Collapse the Item */
function collapseItem(level, index, item, event, preventHandler) {

	// check if node is already collapsed
	if (!isNodeExpanded(item.id, level)) {
		return true;
	}

	// prevent selection if item is disabled
	if (isDisabled(item.id)) {
		return false;
	}

	if (!event) { //
		event = createJSEvent();
	}

	// call handler onMenuItemCollapsed
	if (preventHandler != true && $scope.handlers.onMenuItemCollapsed) {
		try {
			$scope.handlers.onMenuItemCollapsed(item.id, event);
		} catch (err) {
			console.log(err);
		}
	}
	clearExpandedIndex(level - 1);

	return true;
}

/**
 * @private 
 * Set the index at level
 *
 * @param {Number} [level] 1-based target level
 * @param {Number} index value
 * @param {CustomType<servoyextra-sidenav.MenuItem>} item the expanded node
 *
 * */
function setExpandedIndex(level, index, item) {
	var levels = $scope.model.expandedIndex ? JSON.parse($scope.model.expandedIndex) : {};

	// clear sub levels
	for (var lvl in levels) {
		if (lvl > level) { // reset the next levels
			delete levels[lvl];
		}
	}

	// expand all anchestors
	var newExpandedIndex = {}
	var anchestors = getNodeAnchestors(item.id);
	for (var i = 0; i < anchestors.length; i++) {
		if (newExpandedIndex[i + 1] != anchestors[i].id) {
			newExpandedIndex[i + 1] = anchestors[i].id;
		}
	}

	// TODO select all parents as well
	// expand node index
	if (levels[level] != item.id) { // collapse the selected menu
		newExpandedIndex[level] = item.id;
	}

	// apply selected index
	$scope.model.expandedIndex = JSON.stringify(newExpandedIndex);
}

/**
 * @private 
 * Delete all indexes from level
 * @param {Number} level
 *  */
function clearExpandedIndex(level) {
	var levels = $scope.model.expandedIndex ? JSON.parse($scope.model.expandedIndex) : {};

	// reset all sub levels
	for (var lvl in levels) {
		if (lvl > level) { // reset the next levels
			delete levels[lvl];
		}
	}

	// apply selected index
	$scope.model.expandedIndex = JSON.stringify(levels);
}

/**
 * @private 
 * @param {Number} level
 * @param {Number} index
 * @param {CustomType<servoyextra-sidenav.MenuItem>} item
 * @param {Object} [event]
 * @param {Object} [preventSelectHandler]
 * @param {Object} [preventExpandHandler]
 *
 * Select the main Item */
function selectItem(level, index, item, event, preventSelectHandler, preventExpandHandler) {

	// prevent selection if item is disabled
	if (isDisabled(item.id)) {
		return false;
	}

	// create a dummy jsevent
	if (!event) {
		event = createJSEvent();
	}

	if (preventSelectHandler != true && $scope.handlers.onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
		try {
			var confirm = $scope.handlers.onMenuItemSelected(item.id, event)
			if (confirm !== false) {
				confirmSelection();
			} else {
				return false;
			}
		} catch (err) {
			console.log(err);
			return false;
		}
	} else {
		confirmSelection();
	}

	function confirmSelection() {
		setSelectedIndex(level, index, item);

		// expand the item
		if (item.menuItems) { // expand the node if not leaf
			expandItem(level, index, item, event, preventExpandHandler); // TODO add collapsed argument
		} else { // expand the parent node if is a leaf
			var parentNode = getParentNode(item.id);
			if (parentNode) {
				expandItem(level - 1, null, parentNode, event, preventExpandHandler);
			}
		}
	}

	return true;
}

/**
 * @private 
 * Set the index at level
 *
 * @param {Number} [level] 1-based target level
 * @param {Number} index value
 * @param {CustomType<servoyextra-sidenav.MenuItem>} item
 *
 * */
function setSelectedIndex(level, index, item) {
	var levels = $scope.model.selectedIndex ? JSON.parse($scope.model.selectedIndex) : {};

	// clear level below selection (clearSelectedIndex)

	// reset all sub levels
	for (var lvl in levels) {
		if (lvl > level) { // reset the next levels
			delete levels[lvl];
		}
	}

	//				// update levels above selection, all anchestors
	var newSelectedIndex = {}
	var anchestors = getNodeAnchestors(item.id);
	for (var i = 0; i < anchestors.length; i++) {
		if (newSelectedIndex[i + 1] != anchestors[i].id) {
			newSelectedIndex[i + 1] = anchestors[i].id;
		}
	}

	// TODO select all parents as well
	// set level index
	if (levels[level] == item.id) { // collapse the selected menu
		// TODO allow unselect !?
		newSelectedIndex[level] = item.id;
	} else {
		newSelectedIndex[level] = item.id;
	}

	// apply selected index
	$scope.model.selectedIndex = JSON.stringify(newSelectedIndex);

}

/**
 * @private 
 * Check if node is selected
 *
 * @param {String|Number} nodeId
 * @param {Number} [level] 1-based search in the givenLevel
 * @return {Boolean}
 *  */
function isNodeSelected(nodeId, level) {
	var levels = $scope.model.selectedIndex ? JSON.parse($scope.model.selectedIndex) : {};

	if (level) {
		return levels[level] == nodeId;
	} else {
		for (level in levels) {
			if (levels[level] == nodeId) {
				return true;
			}
		}
	}
	return false;
}

/**
 * @private 
 * Check if node is expanded
 *
 * @param {Object} nodeId
 * @param {Number} [level] 1-based search in the givenLevel
 * @return {Boolean}
 *  */
function isNodeExpanded(nodeId, level) {
	var levels = $scope.model.expandedIndex ? JSON.parse($scope.model.expandedIndex) : {};
	if (level) {
		return levels[level] == nodeId;
	} else {
		for (level in levels) {
			if (levels[level] == nodeId) {
				return true;
			}
		}
	}
	return false;
}

/**
 * @param {String|Number} nodeId
 * 
 * @private 
 * @return {Array}
 *  */
function getNodeAnchestors(nodeId) {
	var anchestors = getAllNodesToNodeId(nodeId);
	anchestors.pop();
	return anchestors;
}

/**
 * @private 
 * Returns all anchestors of node
 *
 * @param {String|Number} nodeId
 * @return Array
 * */
function getAllNodesToNodeId(nodeId) {
	var nodes = $scope.model.menu;
	var pathIndex = getPathToNode(nodeId, nodes);
	var anchestors = [];
	var node;

	// returns all the anchestors of node
	for (var i = 0; pathIndex && i < pathIndex.length; i++) {
		node = nodes[pathIndex[i]];
		anchestors.push(node);
		nodes = node.menuItems;
	}
	return anchestors;
}

/**
 * @private 
 * Check if node and all it's anchestors are enabled.
 * Return false
 *
 * @param {String|Number} nodeId
 * @return {Boolean}
 *  */
function isDisabled(nodeId) {
	// check if menu itself is disable
	if ($scope.model.enabled == false) {
		return true;
	}

	// TODO refactor: use getNodeAnchestors
	var indexPath = getPathToNode(nodeId, $scope.model.menu);
	var tree = $scope.model.menu;
	/** @type {CustomType<servoyextra-sidenav.MenuItem>} */
	var node;

	if (!indexPath || !indexPath.length) {
		return null;
	}

	for (var i = 0; i < indexPath.length; i++) {
		node = tree[indexPath[i]];
		if (node.enabled == false) {
			return true;
		}
		tree = node.menuItems;
	}
	return false;
}

/** @private  */
function createJSEvent() {
	var event = { type: 'event' }
	return event;
}

/**
 * @private 
 * @return {Boolean}
 *  */
$scope.api.showForm = function(formToHide, menuIDToShow) {
	var formHideIsOK = true;

	if (formToHide) {
		formHideIsOK = servoyApi.hideForm(formToHide);
	}

	if (!formHideIsOK) return false;

	var menuItem = getNodeById(menuIDToShow, $scope.model.menu);

	if (menuItem) {
		if (!servoyApi.showForm(menuItem.formName, menuItem.relationName)) {
			return false;
		}
		$scope.model.containedForm = menuItem.formName;
		$scope.model.relationName = menuItem.relationName ? menuItem.relationName : null;
		return true;
	}
	else if ($scope.model.servoyMenu) {
		menuItem = $scope.model.servoyMenu.findMenuItem(menuIDToShow);
		if (menuItem) {
			if (!servoyApi.showForm(menuItem.getExtraProperty('Sidenav', 'formName'), menuItem.getExtraProperty('Sidenav', 'relationName'))) {
				return false;
			}
			$scope.model.containedForm = menuItem.getExtraProperty('Sidenav', 'formName');
			$scope.model.relationName = menuItem.getExtraProperty('Sidenav', 'relationName');
			return true;
		}
	}

	return false;
}

$scope.setters.setContainedForm = function(form) {

	if ($scope.model.containedForm && !servoyApi.hideForm($scope.model.containedForm)) {
		return false;
	}

	if (!servoyApi.showForm(form, $scope.model.relationName)) {
		return false;
	}
	
	$scope.model.containedForm = form;
}