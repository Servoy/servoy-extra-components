angular.module('servoyextraSidenav',['servoy']).directive('servoyextraSidenav', function() {  
    return {
      restrict: 'E',
      scope: {
    	  model: '=svyModel',
    	  api: "=svyApi",
    	  svyServoyapi: "=",
    	  handlers: "=svyHandlers"
      },
      controller: function($scope, $element, $attrs) {
    	  
    		// private methods
			var getNodeByIndexPath;
			var getNodeById;
			var getPathToNode;
			var clearGroups;
			var createJSEvent;
			var getSelectedIndexPath;
			var getSelectedNode;
			var setSelectedIndex;
			var storeSelectedIndex;

			// scope vars
			$scope.selectedIndex = { };// old the selected index of each level

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

				if ($scope.handlers.onSelectedNode) { // change selection only if onSelectedNode allows it
					$scope.handlers.onSelectedNode(item, event).then(function(result) {
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

			$scope.api.setSelectedById = function(groupCode, level, mustExecuteOnSelectNode) {
				var groups;
				var levelPath = [];

				// if level is provided search only in the selected node
				if (level) {
					levelPath = getSelectedIndexPath(level - 1);
					var node = getNodeByIndexPath(levelPath, $scope.model.menu);
					if (node) groups = node.menuItems;
				} else {
					groups = $scope.model.menu;
				}

				// search path to node
				var path = levelPath;
				var subPath = getPathToNode(groupCode, groups, 'id');
				if (subPath) { 	// not found in the selected node
					path = levelPath.concat(subPath);
				} else {
					return false;
				}
				
				return $scope.api.setSelectedByIndexPath(path);
			}

			$scope.api.setSelectedByIndexPath = function(path, mustExecuteOnSelectNode) {

				// search node in tree
				var node = getNodeByIndexPath(path, $scope.model.menu);
				if (node) {
					if (mustExecuteOnSelectNode && $scope.handlers.onSelectedNode) { // change selection only if onSelectedNode allows it
						// TODO create an event
						var event = createJSEvent();
						$scope.handlers.onSelectedNode(node, event).then(function(result) {
								if (result == true) {
									setSelectedPath(path);
								}
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
			 * Clears all groups at level
			 *
			 * @param {Number} level level deep 1-based
			 *  */
			$scope.api.clearGroups = function(level) {
				var groups = $scope.model.menu;
				clearGroups(level, groups, 1);
				$scope.svyServoyapi.apply("tree");
			}

			/***********************************************************************************
			 * Private Methoods
			 ***********************************************************************************/

			/**
			 * Returns the subtree at the Given path
			 *
			 * @param {Number} nodeId
			 * @param {Array} groups
			 *
			 * @return {Object}
			 * */
			getNodeById = function(nodeId, groups) {
				if (groups) {
					for (var i = 0; i < groups.length; i++) { // search in each subtree
						var subTree = groups[i];
						if (subTree.GroupCode === nodeId) { // find the node
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
			 * @param {Array} groups
			 *
			 * @return {Object}
			 * */
			getNodeByIndexPath = function(path, groups) {
				if (groups) {
					if (path && path.length === 1) {
						return groups[path[0]];
					} else {
						var subPathIndex = path[0];
						var subtree = groups[subPathIndex].Groups;
						return getNodeByIndexPath(path.slice(1, path.length), subtree);
					}
				}
				return null;
			}

			/**
			 * Retuns the path to the given node
			 *
			 * @param {Object} idOrNode
			 * @param {Array} groups
			 * @param {String} [key] search the node by key value. Default 'GroupCode'.
			 *
			 * @return {Array} */
			getPathToNode = function(idOrNode, groups, key) {
				if (!key) key = 'id';
				var nodeId = idOrNode[key] ? idOrNode[key] : idOrNode;

				if (groups) { // for each node in groups
					for (var i = 0; i < groups.length; i++) { // search in each subtree
						var subTree = groups[i];
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
			 * Remove all the groups where level = deep
			 *  */
			clearGroups = function(level, groups, deep) {
				if (groups) {
					for (var i = 0; i < groups.length; i++) { // go one level deeper
						var subTree = groups[i];
						if (level === deep) { // delete all subgroups
							delete subTree.menuItems;
						}
						clearGroups(level, subTree.menuItems, deep + 1);
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
				
				// reset all sub levels
				for (var lvl in levels) {
					if (lvl > level) { // reset the next levels
						delete levels[lvl];
					}
				}

				// set level index
				if (levels[level] === index) {	// collapse the selected menu
					delete levels[level];
				} else {
					levels[level] = index; // change selection at level (x)
				}

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
      templateUrl: 'servoyextra/sidenav/sidenav.html'
    };
  })