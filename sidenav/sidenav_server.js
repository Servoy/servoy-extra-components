var getNodeById;
var getPathToNode;
var getParentNode;
var getParentNodeByIndexPath;
var getNodeByIndexPath;
var clearGroups;

/** 
 * Set the root menuItems
 * @public
 * 
 * @param {Array<Object>} menuItems
 * 
 * */
$scope.api.setRootMenuItems = function(menuItems) {
	$scope.model.menu = menuItems;
	menuItems = $scope.model.menu
}

/** 
 * Returns the menuItem object
 * @public
 * 
 * @param {Object} menuItemId
 * 
 * @return {Object}
 * */
$scope.api.getMenuItem = function(menuItemId) {
	return getNodeById(menuItemId, $scope.model.menu);
}

/** 
 * Enable or disable the menuItem
 * Return false if menuItemId cannot be found.
 * @public
 * 
 * @param {Object} menuItemId
 * @param {Boolean} enabled
 * 
 * @return {Object}
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
 * @param {Object} menuItem
 * @param {Object} [menuItemId] add the item as subMenuItem of the menuItemId
 * @param {Number} [index]	0-based. if specified add the menuItem at the given position. Index value should not be greater then number of sibelings.
 * 
 * @return {Boolean}
 * */
$scope.api.addMenuItem = function (menuItem, menuItemId, index) {
	var nodes;
	
	// find the nodes
	if (menuItemId) {	// add to node
		var node = getNodeById(menuItemId, $scope.model.menu);
		if (node) {
			if (!node.menuItems) node.menuItems = [];
			nodes = node.menuItems;
		}
	} else {	// add to root
		if (!$scope.model.menu) $scope.model.menu = [];
		nodes = $scope.model.menu;
	}
	
	if (nodes) {
		if (typeof(index) === 'number' && index >= 0 && index <= nodes.length) {
			// insert in a proper position
			node.menuItems = nodes.splice(0,index).concat([menuItem]).concat(nodes);
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
 * @param {Object} menuItemId 
 * 
 * @return {Boolean}
 * */
$scope.api.removeMenuItem = function (menuItemId) {
	var nodes;
	var index;
	
	// find path to node;
	var pathIndex = getPathToNode(menuItemId, $scope.model.menu);
	if (pathIndex && pathIndex.length) {
		index = pathIndex.pop();
		
		// find parent node and index;
		if (pathIndex.length === 0) {	// item is in root
			nodes = $scope.model.menu;
			$scope.model.menu = nodes.slice(0, index).concat(nodes.slice(index + 1, nodes.length));
		} else if (pathIndex && pathIndex.length > 0) {		// find the parent element
			var parentNode = getNodeByIndexPath(pathIndex, $scope.model.menu);
			if (parentNode) {
				nodes = parentNode.menuItems;
				parentNode.menuItems = nodes.slice(0, index).concat(nodes.slice(index + 1, nodes.length));
			}
		}  else {	// parent not found
			console.log("debug: this should not happen");
			return false;
		}
		return true;
	}
	return false;
}

/** 
 * Set the menuItems as sub menu items of the menu item with id 'menuItemId'
 * Return false if menuItemId cannot be found.
 * @public
 * 
 * @param {Object} menuItemId
 * @param {Array<Object>} menuItems 
 * 
 * @return {Boolean}
 * */
$scope.api.setSubMenuItems = function(menuItemId, menuItems) {
	var tree = $scope.model.menu;
	var node = getNodeById(id, tree);
	if (node) {
		node.menuItems = subtree;
		return true;
	}
	return false;
}

/** 
 * Remove all the sub menu items of the menu item with id 'menuItemId'
 * Return false if menuItemId cannot be found.
 * @public
 * 
 * @param {Object} menuItemId
 * 
 * @return {Boolean}
 * */
$scope.api.removeSubMenuItems = function (menuItemId) {
	var node = getNodeById(menuItemId, $scope.model.menu);
	if (node) {
		delete node.menuItems;
		return true;
	}
	return false;
}

/**
 * Clears all sub-nodes at level.
 * If depth is equal to 1 all roots will be removed.
 * @public 
 *
 * @param {Number} depth 1-based
 *  */
$scope.api.removeAllMenuItemsAtDepth = function(depth) {
	if (depth === 1) {	// if level is one remove the root
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
 * @param {Object} menuItemId
 * @param {Array} nodes
 *
 * @return {Object} */
getNodeById = function(menuItemId, nodes) {
	if (nodes) {
		for (var i = 0; i < nodes.length; i++) { // search in each subtree
			var subTree = nodes[i];
			if (subTree.id == menuItemId) { // find the node
				return subTree;
			}
			var node = getNodeById(menuItemId, subTree.menuItems);
			if (node) {
				return node;
			}
		}
	}
	return null;
}

/**
 * Returns the subtree at the Given path
 * Cost O(1) scan depth
 * @private 
 *
 * @param {Array<Number>} path
 * @param {Array} nodes
 *
 * @return {Object}
 * */
getNodeByIndexPath = function(path, nodes) {
	if (nodes) {
		if (path && path.length === 1) {
			return nodes[path[0]];
		} else if (path && path.length) {
			var subPathIndex = path[0];
			var subtree = nodes[subPathIndex].menuItems;
			return getNodeByIndexPath(path.slice(1, path.length), subtree);
		} else {	// is the root
			return nodes;
		}
	}
	return null;
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
 * @param {Object} menuItemId
 * @param {Array} nodes
 *
 * @return {Array} */
getParentNode = function (menuItemId, nodes) {
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
 * @return {Array} */
getParentNodeByIndexPath = function (indexPath, nodes) {
	if (indexPath && indexPath.length > 1) {
		return getNodeByIndexPath(indexPath.slice(0,indexPath.length-1), nodes);
	}  
	return null;
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
