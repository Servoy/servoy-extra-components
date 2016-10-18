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
    	   *  */
    	  
    		// private methods
			var getNodeByIndexPath;
			var getNodeById;
			var getPathToNode;
			var clearGroups;
			var clearSelectedIndex;
			var createJSEvent;
			var getSelectedIndexPath;
			var getSelectedNode;
			var setSelectedIndex;
			var storeSelectedIndex;

			// scope vars
			$scope.selectedIndex = { };// old the selected index of each level
			
	    	$animate.enabled($element, true);

			
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
	    		  $scope.selectedIndex = { 1: 0 }
	    	  }

			// init navigation
			if ($scope.model.defaultExpanded) { // expand the first node at startup
				$scope.selectedIndex[1] = 0;
			}

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
					}
				});

			/** Select the main Item */
			$scope.selectItem = function(level, index, item, event) {
				
				// prevent selection if item is disabled
				if (item.enabled == false) {
					return;
				}

				if ($scope.handlers.onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
					$scope.handlers.onMenuItemSelected(item, event).then(function(result) {
							if (result == true) {
								setSelectedIndex(level, index);
							}
						}, function(err) { // Error: "Oops something went wrong"
							// TODO use logging instead
							console.log(err);
						});
				} else {
					setSelectedIndex(level, index);
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
				
				return $scope.api.setSelectedByIndexPath(path, mustExecuteOnSelectNode);
			}

			$scope.api.setSelectedByIndexPath = function(path, mustExecuteOnSelectNode) {

				// search node in tree
				var node = getNodeByIndexPath(path, $scope.model.menu);
				if (node) {
					if (mustExecuteOnSelectNode && $scope.handlers.onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
						// TODO create an event
						var event = createJSEvent();
						$scope.handlers.onMenuItemSelected(node, event).then(function(result) {
								if (result == true) {
									setSelectedPath(path);
								}
								// TODO if selection is blocked should not return true ?
							}, function(err) { // Error: "Oops something went wrong"
								// TODO use logging instead
								console.log(err);
							});
					} else {
						setSelectedPath(path);
					}
					return true;
				} else { // returns false if node does not exists
					return false;
				}

				// change the selectedIndex
				function setSelectedPath(indexPath) {
					var selectedIndex = { }
					for (var i = 0; i < indexPath.length; i++) {
						selectedIndex[i + 1] = indexPath[i];
					}
					$scope.selectedIndex = selectedIndex;
					storeSelectedIndex();
				}
			}

			$scope.api.setMenuItemsById = function(id, subtree) {
				var tree = $scope.model.menu;
				var node = getNodeById(id, tree);
				if (node) {
					node.menuItems = subtree;
					$scope.svyServoyapi.apply("menu");
					return true;
				}
				return false;
			}

			$scope.api.setMenuItemsByIndexPath = function(path, subtree) {
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
			 * Clears all sub-nodes at level
			 *
			 * @param {Number} level level deep 1-based
			 *  */
			$scope.api.clearMenuItems = function(level) {
				if (level === 1) {	// if level is one remove the root
					$scope.model.menu = [];
				} else { // remove all subnodes at level
					var nodes = $scope.model.menu;
					clearGroups(level, nodes, 2);
				}
				
				// clear indexes at deeper level
				clearSelectedIndex(level - 1);
				storeSelectedIndex();
				
				$scope.svyServoyapi.apply("menu");
				console.log($scope.model.menu);
				console.log($scope.selectedIndex);
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
			 * Remove all the nodes where level = deep
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
			 * Returns the selected node up-to level
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
			 * @param {Array<Number>} index value
			 *
			 * */
			setSelectedIndex = function(level, index) {
				if (!$scope.selectedIndex) $scope.selectedIndex = { }
				var levels = $scope.selectedIndex;
				
				clearSelectedIndex(level);

				// set level index
				if (levels[level] == index) {	// collapse the selected menu
					delete levels[level];
				} else {
					levels[level] = index; // change selection at level (x)
				}

				console.log(levels);
				storeSelectedIndex();
			}

			storeSelectedIndex = function() {
				$scope.model.selectedIndex = JSON.stringify($scope.selectedIndex);
				$scope.svyServoyapi.apply("selectedIndex");
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