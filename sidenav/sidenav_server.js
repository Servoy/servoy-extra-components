var getNodeById;
var getPathToNode;

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
 * Retuns the path to the given node
 *
 * @param {Object} idOrNode
 * @param {Array} nodes
 * @param {String} [key] search the node by key value. Default 'id'.
 *
 * @return {Array} */
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

