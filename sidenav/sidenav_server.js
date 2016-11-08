var getNodeById;
var getPathToNode;
var getParentNode;
var getParentNodeByIndexPath;
var getNodeByIndexPath;
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
 * @return {Array<{id: String|Number,
 * 			text: String=,
 * 			styleClass: String=,
 * 			iconStyleClass: String=,
 * 			enabled: Boolean=,
 * 			data: Object=,
 * 			menuItems: Array=,
 * 			isDivider : Boolean=}>}
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
 * @return {{id: String|Number,
 * 			text: String=,
 * 			styleClass: String=,
 * 			iconStyleClass: String=,
 * 			enabled: Boolean=,
 * 			data: Object=,
 * 			menuItems: Array=,
 * 			isDivider : Boolean=}}
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
 * @return {{id: String|Number,
 * 			text: String=,
 * 			styleClass: String=,
 * 			iconStyleClass: String=,
 * 			enabled: Boolean=,
 * 			data: Object=,
 * 			menuItems: Array=,
 * 			isDivider : Boolean=}}
 * */
$scope.api.getParentMenuItem = function(menuItemId) {
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
 * @param {String|Number} menuItem.id id uniquely identifies the menuItem in the menu object. <b>Required</b>
 * @param {String} [menuItem.text] The menu text, optional, default is empty
 * @param {String} [menuItem.StyleClass] add style classes to the menuItem, optional,. Separate multiple value with a SPACE char. example 'nav-large nav-primary'.
 * @param {String} [menuItem.iconStyleClass] use style classes to display icons as Font Icons, optional. example 'glyphicon glyphicon-search'.
 * @param {Boolean} [menuItem.enabled] menuItem cannot be selected or expanded if disabled, optional. Default true.
 * @param {Object} [menuItem.data] data object can be used to add custom properties to the menuItem, optional. For example you may set the formName to be shown when the menuItem is selected { formName: "aFormName", description: "This menu item will open the given form" }
 * @param {Array} [menuItem.menuItems] an array of nested menuItems, optional.
 * @param {Boolean} [menuItem.isDivider] if true render a divider into the menu instead of a menuItem, optional. All other properties are ignored. Default false.
 * @param {String|Number} [menuItemId] add the item as subMenuItem of the menuItemId, optional. Default add the menuItem as root.
 * @param {Number} [index]	0-based. The index at which to insert the item. Optional. Index value should not be greater then number of sibelings. Default is at the end.
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
		}
	} else { // add to root
		if (!$scope.model.menu) $scope.model.menu = [];
		nodes = $scope.model.menu;
	}

	if (nodes) {
		if (typeof (index) === 'number' && index >= 0 && index <= nodes.length) {
			// insert in a proper position
			node.menuItems = nodes.splice(0, index).concat([menuItem]).concat(nodes);
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
* @return {Array<{id: String|Number, 
* 			text: String=,
* 			styleClass: String=,
* 			iconStyleClass: String=,
* 			enabled: Boolean=,
* 			data: Object=,
*			menuItems: Array=,
*			isDivider : Boolean=}>} 
*/
$scope.api.getSubMenuItems = function(menuItemId) {
	/** @type {Array<{id: String, text: String,styleClass: String=,iconStyleClass: String=,enabled: Boolean=,data: Object=,menuItems: Array=,isDivider : Boolean=}>} */
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
 * Clears all sub-nodes at level.
 * If depth is equal to 1 all roots will be removed.
 * @public
 *
 * @param {Number} depth 1-based
 *  */
$scope.api.removeAllMenuItemsAtDepth = function(depth) {
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
 * @return {{id: String|Number,
 * 			text: String=,
 * 			styleClass: String=,
 * 			iconStyleClass: String=,
 * 			enabled: Boolean=,
 * 			data: Object=,
 * 			menuItems: Array=,
 * 			isDivider : Boolean=}} */
getNodeById = function(menuItemId, nodes) {
	/** @type {{id: String, text: String,styleClass: String=,iconStyleClass: String=,enabled: Boolean=,data: Object=,menuItems: Array=,isDivider : Boolean=}} */
	var node;
	/** @type {{id: String, text: String,styleClass: String=,iconStyleClass: String=,enabled: Boolean=,data: Object=,menuItems: Array=,isDivider : Boolean=}} */
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
 * @return {{id: String|Number, 
 * 			text: String=,
 * 			styleClass: String=,
 * 			iconStyleClass: String=,
 * 			enabled: Boolean=,
 * 			data: Object=,
 * 			menuItems: Array=,
 * 			isDivider : Boolean=}}
 * */
getNodeByIndexPath = function(path, nodes) {
	
	/** @type {{id: String, text: String,styleClass: String=,iconStyleClass: String=,enabled: Boolean=,data: Object=,menuItems: Array=,isDivider : Boolean=}} */
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
 * @return {{id: String|Number,
 * 			text: String=, 
 * 			styleClass: String=, 
 * 			iconStyleClass: String=, 
 * 			enabled: Boolean=, 
 * 			data: Object=,
 * 			menuItems: Array=,
 * 			isDivider : Boolean=}} */
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
 * @return {{id: String|Number,
 * 			text: String=,
 * 			styleClass: String=,
 * 			iconStyleClass: String=,
 * 			enabled: Boolean=,
 * 			data: Object=,
 * 			menuItems: Array=,
 * 			isDivider : Boolean=}} */
getParentNodeByIndexPath = function(indexPath, nodes) {
	if (indexPath && indexPath.length > 1) {
		return getNodeByIndexPath(indexPath.slice(0, indexPath.length - 1), nodes);
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
