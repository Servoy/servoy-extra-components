angular.module('servoyextraSidenav',['servoy', 'ngAnimate']).directive('servoyextraSidenav',  ["$animate", function($animate) {  
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
			var getAllNodesToNodeId;
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
			$scope.selectedIndex = { }; 	// hold the id of the selected nodes, per level
			$scope.expandedIndex = { }; 	// hold the id of the expanded nodes, per level
			
			// sample menu for developer
			if ($scope.svyServoyapi.isInDesigner()) {
	    		  $scope.model.menu = [{
	    		  	id: 1,
					text: "Sample Item #1",
					menuItems: [{
						id: 5,
						text: "Sub Item #1"
					},{
						id: 6,
						text: "Sub Item #2"
					}]
	    		  },{
	    		  	id: 2,
					text: "Sample Item #2"
	    		  },{
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
						console.log($scope.model.selectedIndex);
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
				console.log("select " + level + ' - ' + item.id)
				
				if (event) { 	// 
					event.stopPropagation();
				} else {	// 
					event = createJSEvent();
				}

				// prevent selection if item is disabled
				if (isDisabled(item.id)) {
					return false;
				}

				if (preventHandler!=true && $scope.handlers.onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
					$scope.handlers.onMenuItemSelected(item, event).then(function(result) {
							if (result == true) {
								setSelectedIndex(level, index, item);
								$scope.expandItem(level, index, item, event);	// TODO add collapsed argument
							}
						}, function(err) { // Error: "Oops something went wrong"
							// TODO use logging instead
							console.log(err);
						});
				} else {
					setSelectedIndex(level, index, item);
					$scope.expandItem(level, index, item, event);
				}
				return true;
			}
			
			/** 
			 * @param {Number} level
			 * @param {Number} index
			 * @param {Object} item
			 * @param {Object} [event]
			 * @param {Object} [preventHandler]
			 * 
			 * Select the main Item */
			$scope.expandItem = function(level, index, item, event, preventHandler) {
				console.log("expand " + level + ' - ' + item.id);
				
				if (event) { 	// 
					event.stopPropagation();
				} else {	// 
					event = createJSEvent();
				}
				
				// prevent selection if item is disabled
				if (isDisabled(item.id)) {
					return false;
				}
				
				if ($scope.expandedIndex[level] !== item.id) {	// expand the item

					// if is expanded
					if (preventHandler!=true && $scope.handlers.onMenuItemExpanded) { // change selection only if onMenuItemSelected allows it
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
				} else {	// collapse the item
				
					if (preventHandler!=true && $scope.handlers.onMenuItemCollapsed) { // change selection only if onMenuItemSelected allows it
						$scope.handlers.onMenuItemCollapsed(item, event).then(function(result) {
								// if (result == true) {
									clearExpandedIndex(level-1);
								// }
							}, function(err) { // Error: "Oops something went wrong"
								// TODO use logging instead
								console.log(err);
							});
					} else {
						clearExpandedIndex(level-1);
					}
				}
			}

			/****************************************************************
			 * API
			 **************************************************************/
			
			$scope.api.getSelectedMenuItem = function(level) {
				var levelPath = getSelectedIndexPath(level);
				var node = getNodeByIndexPath(levelPath, $scope.model.menu);
				console.log(node)
				return node;
			}

			// TODO fixme mustExecuteOnSelectNode not executed
			/**
			 * @param {Object} id
			 * @param {Number} level
			 * @param {Boolean} mustExecuteOnSelectNode
			 * 
			 * Should allow selection by index path as an API ?
			 *  */
			$scope.api.setSelectedById = function(id, level, mustExecuteOnSelectNode) {
				var nodes;
				var levelPath = [];

				// if level is provided search only in the selected node
				if (level && level > 1) {	// search in selected node only
					levelPath = getSelectedIndexPath(level - 1);
					var node = getNodeByIndexPath(levelPath, $scope.model.menu);	// retrieve the selected node at level
					if (node) nodes = node.menuItems;
				} else if (level === 1) {	// search in root
					// FIXME it searches in the whole tree
					nodes = $scope.model.menu;
				} else {
					nodes = $scope.model.menu;
				}

				// search path to node
				var path = levelPath;
				var subPath = getPathToNode(id, nodes, 'id');
				if (subPath) { 	// not found in the selected node
					path = levelPath.concat(subPath);
				} else {
					return false;
				}
				
				// TODO fix me, force the selection if item is already in selection path
				// do nothing if the item is already selected
				if ($scope.selectedIndex && $scope.selectedIndex[path.length] == id && !$scope.selectedIndex[path.length + 1]) {
					return true;
				} else {
					// search the node
					if (!node) {
						node = getNodeByIndexPath(path, $scope.model.menu);
					}
				
					// select the item
					var preventHandler = mustExecuteOnSelectNode == true ? false : true;
					return $scope.selectItem(path.length, path[path.length-1], node, null, preventHandler);
				}
			}

			/**
			 * @param {Array<Number>} path
			 * @param {Boolean} mustExecuteOnSelectNode
			 * 
			 * Should allow selection by index path as an API ?
			 *  */
			$scope.api.setSelectedByIndexPath = function(path, mustExecuteOnSelectNode) {
				
				// search node in tree
				var node = getNodeByIndexPath(path, $scope.model.menu);
				var preventHandler = mustExecuteOnSelectNode == true ? false : true;
				$scope.selectItem(path.length, path[path.length-1], node, null, preventHandler);
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

			/***********************************************************************************
			 * Private Methoods
			 ***********************************************************************************/

			/**
			 * Returns the subtree at the Given path
			 *
			 * @param {Number} nodeId
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
					} else {	// is the root
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
			
			/**
			 * Returns all anchestors of node
			 *
			 * @param {Object} nodeId
			 * @return Array
			 * */
			getAllNodesToNodeId = function (nodeId) {
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
			 * Returns all anchestors of node
			 *
			 * @param {Object} nodeId
			 * @return Array
			 * */
			getNodeAnchestors = function(nodeId) {
				var anchestors = getAllNodesToNodeId(nodeId);
				anchestors.pop();
				return anchestors;
			}

			/**
			 * Returns the selected node up-to level
			 * TODO check me
			 * @deprecated 
			 *
			 * @param {Number} [level] 1-based
			 * @return Object
			 * */
			getSelectedNode = function(level) {
				var path = getSelectedIndexPath(level);
				return getNodeByIndexPath(path, $scope.model.menu);
			}

			/**
			 * Returns the selected index path up-to level
			 * @deprecated can't find selected node by index anymore
			 *
			 * @param {Number} [level] 1-based
			 * @return {Array<Number>}
			 * */
			getSelectedIndexPath = function(level) {
				var levels = $scope.selectedIndex;
				var path = [];
				for (var i = 0; i < level; i++) {
					path[i] = levels[i+1] ? levels[i+1] : 0;
				}
//				for (var lvl in levels) {
//					if (!level || lvl <= level) {
//						path[lvl] = levels[lvl];
//					}
//				}

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
					if (newSelectedIndex[i+1] != anchestors[i].id) {
						newSelectedIndex[i+1] = anchestors[i].id;
					}
				}

				// TODO select all parents as well
				// set level index
				if (levels[level] == item.id) {	// collapse the selected menu
					// TODO allow unselect !?
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
			clearSelectedIndex = function (level) {
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
					if (newExpandedIndex[i+1] != anchestors[i].id) {
						newExpandedIndex[i+1] = anchestors[i].id;
					}
				}

				// TODO select all parents as well
				// expand node index
				if (levels[level] != item.id) {	// collapse the selected menu
					newExpandedIndex[level] = item.id;
				}
				$scope.expandedIndex = newExpandedIndex;

				console.log(levels);
				storeExpandedIndex();
			}
			
			storeExpandedIndex = function() {
				$scope.model.expandedIndex = JSON.stringify($scope.expandedIndex);
				$scope.svyServoyapi.apply("expandedIndex");
			}
			
			/**
			 * Delete all indexes from level
			 *  */
			clearExpandedIndex = function (level) {
				var levels = $scope.expandedIndex;
				// reset all sub levels
				for (var lvl in levels) {
					if (lvl > level) { // reset the next levels
						delete levels[lvl];
					}
				}
			}
			
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
			
			isNodeSelected = function (nodeId) {
				var levels = $scope.selectedIndex;
				for (var level in levels) {
					if (levels[level] == nodeId) {
						return true;
					}
				}
				return false;
			}
			
			isNodeExpanded = function (nodeId) {
				var levels = $scope.expandedIndex;
				for (var level in levels) {
					if (levels[level] == nodeId) {
						return true;
					}
				}
				return false;
			}
			
			/**
			 * Create a JSEvent
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
      link: function($scope, $element, $attrs) {
    	  
      },
      templateUrl: 'servoyextra/sidenav/sidenav.html'
    };
  }])