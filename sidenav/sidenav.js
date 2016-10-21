angular.module('servoyextraSidenav', ['servoy', 'ngAnimate']).directive('servoyextraSidenav', ["$animate", function($animate) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				api: "=svyApi",
				svyServoyapi: "=",
				handlers: "=svyHandlers"
			},
			controller: function($scope, $element, $attrs) {

				/**
				 * TODO
				 * enabled
				 * 	enable selection from API if node/parent disabled ?
				 * 	deselect item ?
				 * isDivider
				 * dynamicTree
				 * use IndexPath !? it collide with isDivider standalone element.
				 * selectedNode (should be the deeper)
				 * autoselect next level
				 * persist selection during collapse
				 * do i want to deselect an item ?
				 * edit nodes
				 * 	what happen to selection if i add an item in between
				 * 	remove a selected node
				 *
				 *
				 * DONE
				 * animate
				 * visible
				 * divider
				 * iconClass
				 *
				 *
				 * API
				 * init
				 * add/remove nodes
				 * add/remove subNodes
				 * enable nodes
				 * getNode
				 *
				 *  */

				/*
				 * Selection nodes are stored in hash object where 'level' = 'node.id'
				 * Expanded nodes are stored in hash object where 'level' = 'node.id'
				 *
				 * Selection triggers node expand
				 * Expanding a node does not trigger a selection
				 *
				 * Selection can be canceled if onMenuItemSelected returns false
				 *
				 * NOTE: what happen if a node is removed ?
				 * read all anchestor, check if node still exists
				 * I need to understand when a node is removed (server to client API !?)
				 *
				 * */

				// private methods
				var getNodeByIndexPath;
				var getNodeById;
				var getPathToNode;
				var getNodeAnchestors;
				var getParentNode;
				var getAllNodesToNodeId;
				var getNodeLevel;
				var clearSelectedIndex;
				var createJSEvent;
				var getSelectedIndexPath;
				var getSelectedNode;
				var setSelectedIndex;
				var storeSelectedIndex;
				var setExpandedIndex;
				var storeExpandedIndex;
				var clearExpandedIndex;
				var isDisabled;
				var isNodeSelected;
				var isNodeExpanded;

				// scope vars
				$scope.selectedIndex = { }; // hold the id of the selected nodes, per level
				$scope.expandedIndex = { }; // hold the id of the expanded nodes, per level

				// sample menu for developer
				if ($scope.svyServoyapi.isInDesigner()) {
					$scope.model.menu = [{
						id: 1,
						text: "Sample Item #1",
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
					}, {
						id: 3,
						text: "Sample Item #3"
					}];
					$scope.selectedIndex = { 1: 0 };
					$scope.expandedIndex = { 1: 0 };
				}

				// enable animation
				$animate.enabled($element, $scope.model.animate ? true : false);

				// init navigation
				// TODO expand first node ?
				//			if ($scope.model.defaultExpanded) { // expand the first node at startup
				//				$scope.selectedIndex[1] = 0;
				//			}

				// wait that model is syncronized with the server
				$scope.$watch("model.svyMarkupId", function(newValue, oldValue) {
						if (newValue) {
							
							// TODO restore selectedindex
							if ($scope.model.selectedIndex) {
								$scope.selectedIndex = JSON.parse($scope.model.selectedIndex);
							} else {
								// init selectedIndex
								// $scope.selectedIndex[1] = 0;
							}

							if ($scope.model.expandedIndex) {
								$scope.expandedIndex = JSON.parse($scope.model.expandedIndex);
							} else {
								// init expandedIndex
							}
						}
					});

				/**
				 * @param {Number} level
				 * @param {Number} index
				 * @param {Object} item
				 * @param {Object} [event]
				 * @param {Object} [preventHandler]
				 *
				 * Select the main Item */
				$scope.selectItem = function(level, index, item, event, preventHandler) {
//					console.log("select " + level + ' - ' + item.id)

					if (event) { //
						event.stopPropagation();
					} else { //
						event = createJSEvent();
					}

					// prevent selection if item is disabled
					if (isDisabled(item.id)) {
						return false;
					}

					if (preventHandler != true && $scope.handlers.onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
						$scope.handlers.onMenuItemSelected(item, event).then(function(result) {
								if (result == true) {
									confirmSelection();
								}
							}, function(err) { // Error: "Oops something went wrong"
								// TODO use logging instead
								console.log(err);
							});
					} else {
						confirmSelection();
					}
					return true;
					
					function confirmSelection() {
						setSelectedIndex(level, index, item);
						
						// expand the item
						if (item.menuItems) {	// expand the node if not leaf
							$scope.expandItem(level, index, item, event, preventHandler); // TODO add collapsed argument
						} else {		// expand the parent node if is a leaf
							var parentNode = getParentNode(item.id);
							if (parentNode) {
								$scope.expandItem(level-1, null, parentNode, event, preventHandler);
							}
						}
					}
				}

				/**
				 * toggle the item expand collapse
				 *  */
				$scope.toggleExpandedItem = function(level, index, item, event, preventHandler) {
					if (!isNodeExpanded(item.id, level)) { // expand the item
						$scope.expandItem(level, index, item, event, preventHandler);
					} else { // collapse the item
						$scope.collapseItem(level, index, item, event, preventHandler);
					}
				}
				
				
				/**
				 * @param {Number} level
				 * @param {Number} index
				 * @param {Object} item
				 * @param {Object} [event]
				 * @param {Object} [preventHandler]
				 *
				 * Expand the item */
				$scope.expandItem = function(level, index, item, event, preventHandler) {
//					console.log("expand " + level + ' - ' + item.id);

					if (event) { //
						event.stopPropagation();
					} else { //
						event = createJSEvent();
					}
					
					// check if node is already collapsed
					if (isNodeExpanded(item.id, level)) {
						return;
					}

					// prevent selection if item is disabled
					if (isDisabled(item.id)) {
						return;
					}

					// if is expanded
					if (preventHandler != true && $scope.handlers.onMenuItemExpanded) { // change selection only if onMenuItemSelected allows it
						$scope.handlers.onMenuItemExpanded(item, event).then(function(result) {
								// if (result == true) {
								setExpandedIndex(level, index, item);
								// }
							}, function(err) { // Error: "Oops something went wrong"
								// TODO use logging instead
								console.log(err);
							});
					} else {
						setExpandedIndex(level, index, item);
					}
				}

				/**
				 * @param {Number} level
				 * @param {Number} index
				 * @param {Object} item
				 * @param {Object} [event]
				 * @param {Object} [preventHandler]
				 *
				 * Collapse the Item */
				$scope.collapseItem = function(level, index, item, event, preventHandler) {

					if (event) { //
						event.stopPropagation();
					} else { //
						event = createJSEvent();
					}
					
					// check if node is already collapsed
					if (!isNodeExpanded(item.id, level)) {
						return;
					}

					// prevent selection if item is disabled
					if (isDisabled(item.id)) {
						return;
					}					

					// call handler onMenuItemCollapsed
					if (preventHandler != true && $scope.handlers.onMenuItemCollapsed) {
						$scope.handlers.onMenuItemCollapsed(item, event).then(function(result) {
								// if (result == true) {
								clearExpandedIndex(level - 1);
								// }
							}, function(err) { // Error: "Oops something went wrong"
								// TODO use logging instead
								console.log(err);
							});
					} else {
						clearExpandedIndex(level - 1);
					}
				}

				/****************************************************************
				 * API
				 **************************************************************/

				/** 
				 * Returns the selected menuItem.
				 * Client Side API
				 * @public
				 * 
				 * @param {Number} [level] if level is provided search for the selected menu item at level.
				 * 
				 * @return {Object}
				 * */
				$scope.api.getSelectedMenuItem = function(level) {
					return getSelectedNode(level);
				}

				/**
				 * Select the menu item with the given id.
				 * If level is provided search is optimized since it will search only within the descendant of the selected menuItem at level. 
				 * For example if a root menuItem is selected and level is equal 2 search only in the subMenuItems of the selected root.
				 * 
				 * 
				 * @param {Object} id
				 * @param {Number} [level] reduce the search to the selected menuItem at level, if any menuItem is selected at level.
				 * @param {Boolean} [mustExecuteOnMenuItemSelect] Force the onMenuItemSelect to be executed. Default false.
				 * @param {Boolean} [mustExecuteOnMenuItemExpand] Force the onMenuItemExpand to be executed. Default false.
				 * 
				 * @return {Boolean}
				 *
				 *  */
				$scope.api.setSelectedMenuItem = function(id, level, mustExecuteOnMenuItemSelect, mustExecuteOnMenuItemExpand) {
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
					if (isNodeSelected(id, path.length) && !$scope.selectedIndex[path.length + 1]) {
						return true;
					} else {
						// search the node
						var	node = getNodeByIndexPath(subPath, nodes);

						// select the item
						var preventHandler = mustExecuteOnMenuItemExpand == true ? false : true;
						return $scope.selectItem(path.length, path[path.length - 1], node, null, preventHandler);
					}
				}

				/**
				 * @param {Array<Number>} path
				 * @param {Boolean} mustExecuteOnSelectNode
				 * @deprecated 
				 *
				 * Should allow selection by index path as an API ?
				 *  */
				$scope.api.setSelectedByIndexPath = function(path, mustExecuteOnSelectNode) {

					// search node in tree
					var node = getNodeByIndexPath(path, $scope.model.menu);
					var preventHandler = mustExecuteOnSelectNode == true ? false : true;
					$scope.selectItem(path.length, path[path.length - 1], node, null, preventHandler);
					return;

					//				if (node && !isDisabled(node.id)) {	// check if node is enabled
					//					if (mustExecuteOnSelectNode && $scope.handlers.onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
					//						// TODO create an event
					//						var event = createJSEvent();
					//						$scope.handlers.onMenuItemSelected(node, event).then(function(result) {
					//								if (result == true) {
					//									setSelectedPath(path);
					//								}
					//								// TODO if selection is blocked should not return true ?
					//							}, function(err) { // Error: "Oops something went wrong"
					//								// TODO use logging instead
					//								console.log(err);
					//							});
					//					} else {
					//						setSelectedPath(path);
					//					}
					//					return true;
					//				} else { // returns false if node does not exists
					//					return false;
					//				}
					//
					//				// change the selectedIndex
					//				/**
					//				 * @param {Array} indexPath
					//				 * */
					//				function setSelectedPath(indexPath) {
					//					var allNodes = getAllNodesToNodeId(node.id);
					//					var selectedIndex = { }
					//					for (var i = 0; i < allNodes.length; i++) {
					//						selectedIndex[i + 1] = allNodes[i].id;
					//					}
					//					$scope.selectedIndex = selectedIndex;
					//					storeSelectedIndex();
					//				}
				}

				/** 
				 * @deprecated 
				 * */
				$scope.api.setSubMenuItemsByIndexPath = function(path, subtree) {
					var tree = $scope.model.menu;
					var node = getNodeByIndexPath(path, tree);
					if (node) {
						node.menuItems = subtree;
						$scope.svyServoyapi.apply("menu");
						return true;
					}
					return false;
				}
				
				/**
				 * Force the menuItem to be expanded or collapsed
				 * 
				 * 
				 * @param {Object} menuItemId
				 * @param {Boolean} expanded force the menuItem to expand if true, is collapsed otherwise
				 * @param {Boolean} [mustExecuteOnMenuItemExpand] Force the onMenuItemExpand to be executed. Default false.
				 * 
				 *  */
				$scope.api.setMenuItemExpanded = function(menuItemId, expanded, mustExecuteOnMenuItemExpand) {
					var node = getNodeById(menuItemId, $scope.model.menu);
					var level = getNodeLevel(menuItemId);
					var preventHandler = mustExecuteOnMenuItemExpand == true ? false : true;
					
					if (expanded) {
						$scope.expandItem(level, null, node, null, preventHandler);
					} else {
						$scope.collapseItem(level, null, node, null, preventHandler);
					}
				}

				/***********************************************************************************
				 * Private Methoods
				 ***********************************************************************************/

				/**
				 * Returns the subtree at the Given path
				 *
				 * @param {Object} nodeId
				 * @param {Array} nodes
				 *
				 * @return {Object}
				 * */
				getNodeById = function(nodeId, nodes) {
					if (nodes) {
						for (var i = 0; i < nodes.length; i++) { // search in each subtree
							var subTree = nodes[i];
							if (subTree.id === nodeId) { // find the node
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
						} else { // is the root
							console.log("there is no path")
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
				 * Returns all anchestors of node
				 *
				 * @param {Object} nodeId
				 * @return Array
				 * */
				getAllNodesToNodeId = function(nodeId) {
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
				 * Returns node deep 1-based
				 *
				 * @param {Object} nodeId
				 * @return Number
				 * */
				getNodeAnchestors = function(nodeId) {
					var anchestors = getAllNodesToNodeId(nodeId);
					anchestors.pop();
					return anchestors;
				}
				
				/**
				 * Returns the parent node
				 *
				 * @param {Object} nodeId
				 * @return Object
				 * */
				getParentNode = function(nodeId) {
					var anchestors = getNodeAnchestors(nodeId);
					if (anchestors && anchestors.length) {
						return anchestors[anchestors.length -1];
					}
				}
				
				/**
				 * Returns all anchestors of node
				 *
				 * @param {Object} nodeId
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
				 * Returns the selected node up-to level
				 *
				 * @param {Number} [level] 1-based
				 * @return Object
				 * */
				getSelectedNode = function(level) {
					var levels = $scope.selectedIndex;
					var maxLevel = -1;
					
					// get the node at deeper level
					for (var lvl in levels) {
						if (lvl > maxLevel && lvl <= level) {
							maxLevel = lvl;
						}
					}
					
					var nodeId = levels[maxLevel];
					return getNodeById(nodeId, $scope.model.menu);
				}

				/**
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

				/**
				 * Set the index at level
				 *
				 * @param {Number} [level] 1-based target level
				 * @param {Number} index value
				 * @param {Object} item
				 *
				 * */
				setSelectedIndex = function(level, index, item) {
					if (!$scope.selectedIndex) $scope.selectedIndex = { }
					var levels = $scope.selectedIndex;

					// clear level below selection
					clearSelectedIndex(level);

					//				// update levels above selection, all anchestors
					var newSelectedIndex = { }
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
					$scope.selectedIndex = newSelectedIndex;

					console.log(levels);
					storeSelectedIndex();
				}

				storeSelectedIndex = function() {
					$scope.model.selectedIndex = JSON.stringify($scope.selectedIndex);
					$scope.svyServoyapi.apply("selectedIndex");
				}

				/**
				 * Delete all indexes from level
				 *  */
				clearSelectedIndex = function(level) {
					var levels = $scope.selectedIndex;
					// reset all sub levels
					for (var lvl in levels) {
						if (lvl > level) { // reset the next levels
							delete levels[lvl];
						}
					}
				}

				/**
				 * Set the index at level
				 *
				 * @param {Number} [level] 1-based target level
				 * @param {Number} index value
				 * @param {Object} item the expanded node
				 *
				 * */
				setExpandedIndex = function(level, index, item) {
					if (!$scope.expandedIndex) $scope.expandedIndex = { }
					var levels = $scope.expandedIndex;

					// clear sub levels
					clearExpandedIndex(level);

					// expand all anchestors
					var newExpandedIndex = { }
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
					$scope.expandedIndex = newExpandedIndex;

					storeExpandedIndex();
				}

				storeExpandedIndex = function() {
					$scope.model.expandedIndex = JSON.stringify($scope.expandedIndex);
					$scope.svyServoyapi.apply("expandedIndex");
				}

				/**
				 * Delete all indexes from level
				 * @param {Number} level
				 *  */
				clearExpandedIndex = function(level) {
					var levels = $scope.expandedIndex;
					
					// reset all sub levels
					for (var lvl in levels) {
						if (lvl > level) { // reset the next levels
							delete levels[lvl];
						}
					}
				}

				/**
				 * Check if node and all it's anchestors are enabled.
				 * Return false
				 * 
				 * @param {Object} nodeId
				 * @return {Boolean}
				 *  */
				isDisabled = function(nodeId) {
					// TODO refactor: use getNodeAnchestors
					var indexPath = getPathToNode(nodeId, $scope.model.menu);
					var tree = $scope.model.menu;
					var node;
					for (var i = 0; i < indexPath.length; i++) {
						node = tree[indexPath[i]];
						if (node.enabled == false) {
							return true;
						}
						tree = node.menuItems;
					}
					return false;
				}

				/**
				 * Check if node is selected
				 * 
				 * @param {Object} nodeId
				 * @param {Number} [level] 1-based search in the givenLevel
				 * @return {Boolean}
				 *  */
				isNodeSelected = function(nodeId, level) {
					var levels = $scope.selectedIndex;
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
				 * Check if node is expanded
				 * 
				 * @param {Object} nodeId
				 * @param {Number} [level] 1-based search in the givenLevel
				 * @return {Boolean}
				 *  */
				isNodeExpanded = function(nodeId, level) {
					var levels = $scope.expandedIndex;
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
				 * Create a JSEvent
				 * 
				 * @return {JSEvent}
				 * */
				createJSEvent = function() {
					var element = $("#" + $scope.model.svyMarkupId);
					var offset = element.offset();
					var x = offset.left;
					var y = offset.top;

					var event = document.createEvent("MouseEvents");
					event.initMouseEvent("click", false, true, window, 1, x, y, x, y);
					return event;
				}
			},
			link: function($scope, $element, $attrs) { },
			templateUrl: 'servoyextra/sidenav/sidenav.html'
		};
	}])