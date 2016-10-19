var getNodeById;
var getPathToNode;
var getParentNode;
var getParentNodeByIndexPath;
var getNodeByIndexPath;

$scope.api.setMenuItems = function(menuItems) {
	$scope.model.menu = menuItems;
	menuItems = $scope.model.menu
}

$scope.api.getMenuItemById = function(nodeId) {
	return getNodeById(nodeId, $scope.model.menu);
}

$scope.api.setMenuItemEnabled = function(nodeId, enabled) {
	var node = getNodeById(nodeId, $scope.model.menu);
	if (node) {
		node.enabled = enabled;
		return true;
	}
	return false;
}

$scope.api.addMenuItem = function (menuItem, nodeId, index) {
	var nodes;
	
	// find the nodes
	if (nodeId) {	// add to node
		var node = getNodeById(nodeId, $scope.model.menu);
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
			throw "invalid argument index " + index;
		}
		return true;
	} else {
		return false;
	}
}

$scope.api.removeMenuItem = function (nodeId) {
	var nodes;
	var index;
	
	// find path to node;
	var pathIndex = getPathToNode(nodeId, $scope.model.menu);
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

$scope.api.removeMenuItems = function (nodeId) {
	var node = getNodeById(nodeId, $scope.model.menu);
	if (node) {
		delete node.menuItems;
		return true;
	}
	return false;
}

/**
 * Retuns the path to the given node
 *
 * @param {Object} nodeId
 * @param {Array} nodes
 *
 * @return {Object} */
getNodeById = function(nodeId, nodes) {
	if (nodes) {
		for (var i = 0; i < nodes.length; i++) { // search in each subtree
			var subTree = nodes[i];
			if (subTree.id == nodeId) { // find the node
				return subTree;
			}
			var node = getNodeById(nodeId, subTree.menuItems);
			if (node) {
				return node;
			}
		}
	}
	return null;
}

/**
 * Returns the subtree at the Given path
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
 *
 * @param {Object} idOrNode
 * @param {Array} nodes
 * @param {String} [key] search the node by key value. Default 'id'.
 *
 * @return {Array<Number>} */
getPathToNode = function(idOrNode, nodes, key) {
	if (!key) key = 'id';
	var nodeId = idOrNode[key] ? idOrNode[key] : idOrNode;

	if (nodes) { // for each node in nodes
		for (var i = 0; i < nodes.length; i++) { // search in each subtree
			var subTree = nodes[i];
			if (subTree[key] == nodeId) { // find the node
				return [i];
			}
			var path = getPathToNode(nodeId, subTree.menuItems, key);
			if (path) {
				return [i].concat(path);
			}
		}
	}
	return null;
}

/**
 * Retuns the path to the given node
 *
 * @param {Object} nodeId
 * @param {Array} nodes
 *
 * @return {Array} */
getParentNode = function (nodeId, nodes) {
	var indexPath = getPathToNode(nodeId, nodes);
	if (indexPath && indexPath.length > 1) {
		indexPath.pop();
		return getNodeByIndexPath(indexPath, nodes)
	} 
	return null;
}

/**
 * Retuns the parent node
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
