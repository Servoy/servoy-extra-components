angular.module('servoyextraSidenav', ['servoy', 'ngAnimate']).directive('servoyextraSidenav', ['$animate', '$sabloConstants', '$sabloApplication', '$log', '$q', function($animate, $sabloConstants, $sabloApplication, $log, $q) {
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
				 * API CHANGES
				 * addMenuItem returns the index.
				 * removeAllMenuItemsAtDepth -> clearMenuItems(level)
				 *
				 *
				 *  */

				/**
				 * TODO
				 * searchBox
				 * unselect menuItem
				 * call onMenuItemCollapse when another node is expanded
				 * addDivider
				 * clearSelection
				 * mediaIcon
				 * autogenerate IDs
				 *
				 * HTML text
				 * Addition to the text (badge) HTML
				 *
				 * FIXME
				 * Scan nodes to report duplicate ID.
				 * Possible Conflicts with Node Edit.
				 * 		Remove a selected/expanded node, node with same ID is added again before selection is changed.
				 * 			Force refresh Index when node is collapsed.
				 *
				 * isSelected
				 * getParent
				 * getItems
				 *
				 *  */

				/*
				 * Selection nodes are stored in hash object where 'level' = 'node.id'
				 * Expanded nodes are stored in hash object where 'level' = 'node.id'
				 *
				 * Selection triggers node expand
				 * Expanding a node does not trigger a selection
				 *
				 * Selection can be cancelled if onMenuItemSelected returns false
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
				var getDOMElementByID;
				
				/**
				 * @typedef {{id: String|Number ,
				 * text: String=,
				 * styleClass: String=,
				 * iconStyleClass: String=,
				 * enabled: Boolean=,
				 * data: Object=,
				 * menuItems: Array=,
				 * isDivider : Boolean=}}
				 *
				 * @SuppressWarnings("unused")
				 * */
				var NavMenuItem;

				// scope vars
				$scope.selectedIndex = { }; // hold the id of the selected nodes, per level
				$scope.expandedIndex = { }; // hold the id of the expanded nodes, per level

				// true during on mouseHover. Used only with slideAnimation 'collapse-menu'
				$scope.mouseHover;

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

				/**
				 * @param {Number} level
				 * @param {Number} index
				 * @param {servoyextra-sidenav.MenuItem} item
				 * @param {Object} [event]
				 * @param {Object} [preventSelectHandler]
				 * @param {Object} [preventExpandHandler]
				 *
				 * Select the main Item */
				$scope.selectItem = function(level, index, item, event, preventSelectHandler, preventExpandHandler) {
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

					if (preventSelectHandler != true && $scope.handlers.onMenuItemSelected) { // change selection only if onMenuItemSelected allows it
						$scope.handlers.onMenuItemSelected(item.id, event).then(function(result) {
								if (result !== false) {
									confirmSelection();
								}
							}, function(err) { // Error: "Oops something went wrong"
								// TODO use logging instead
								$log.error(err);
							});
					} else {
						confirmSelection();
					}
					return true;

					function confirmSelection() {
						setSelectedIndex(level, index, item);

						// expand the item
						if (item.menuItems) { // expand the node if not leaf
							$scope.expandItem(level, index, item, event, preventExpandHandler); // TODO add collapsed argument
						} else { // expand the parent node if is a leaf
							var parentNode = getParentNode(item.id);
							if (parentNode) {
								$scope.expandItem(level - 1, null, parentNode, event, preventExpandHandler);
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
				 * @param {servoyextra-sidenav.MenuItem} item
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
						return true;
					}

					// prevent selection if item is disabled
					if (isDisabled(item.id)) {
						return false;
					}

					// if is expanded
					if (preventHandler != true && $scope.handlers.onMenuItemExpanded) { // change selection only if onMenuItemSelected allows it
						$scope.handlers.onMenuItemExpanded(item.id, event).then(function(result) {
								// if (result == true) {
								setExpandedIndex(level, index, item);
								// }
							}, function(err) { // Error: "Oops something went wrong"
								// TODO use logging instead
								$log.error(err);
							});
					} else {
						setExpandedIndex(level, index, item);
					}

					return true;
				}

				/**
				 * @param {Number} level
				 * @param {Number} index
				 * @param {servoyextra-sidenav.MenuItem} item
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
						return true;
					}

					// prevent selection if item is disabled
					if (isDisabled(item.id)) {
						return false;
					}

					// call handler onMenuItemCollapsed
					if (preventHandler != true && $scope.handlers.onMenuItemCollapsed) {
						$scope.handlers.onMenuItemCollapsed(item.id, event).then(function(result) {
								// if (result == true) {
								clearExpandedIndex(level - 1);
								storeExpandedIndex();
								// }
							}, function(err) { // Error: "Oops something went wrong"
								// TODO use logging instead
								$log.error(err);
							});
					} else {
						clearExpandedIndex(level - 1);
						storeExpandedIndex();
					}

					return true;
				}

				/****************************************************************
				 * API
				 **************************************************************/
				
				/**
				 * @deprecated use setSelectedMenuItem(id, false, false) instead.
				 * 
				 * Client Side API
				 *
				 * Select the menu item with the given id.
				 * 
				 * This function doesn't wait for a return value; 
				 * use setSelectedMenuItem if you want to know if the menu item can be select successfully
				 * @public
				 *
				 * @param {String|Number} id
				 *
				 *  */
				$scope.api.setSelectedMenuItemAsync = function(id) {
					$scope.api.setSelectedMenuItemSync(id, false, false);
				}

				/**
				 * Client Side API
				 *
				 * @param {Array<Number>} path
				 * @param {Boolean} mustExecuteOnSelectNode
				 * @deprecated
				 *
				 * Should allow selection by index path as an API ?
				 *  */
				$scope.setSelectedByIndexPath = function(path, mustExecuteOnSelectNode) {

					// search node in tree
					var node = getNodeByIndexPath(path, $scope.model.menu);
					var preventSelectHandler = mustExecuteOnSelectNode == true ? false : true;
					$scope.selectItem(path.length, path[path.length - 1], node, null, preventSelectHandler);
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
				 * Client Side API
				 *
				 * @deprecated
				 * */
				$scope.setSubMenuItemsByIndexPath = function(path, subtree) {
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
				 * Client Side API
				 *
				 * Returns true if the menuItem is expanded.
				 * @public
				 *
				 * @param {String|Number} menuItemId
				 *
				 * @return {Boolean}
				 *  */
				$scope.api.isMenuItemExpanded = function(menuItemId) {
					return isNodeExpanded(menuItemId);
				}

				/**
				 * Client Side API
				 *
				 * Returns true if the menuItem and all it's ancestors are enabled. <br/>
				 * Return false if menuItemId cannot be found.
				 * <i>NOTE: The method returns false if any ancestor of the menuItem is not enabled; if the property enabled of the menuItem is set to true, but has a parent with the enabled property set to false, then isMenuItemEnabled returns false. </i><br/>
				 * @public
				 *
				 * @param {String|Number} menuItemId
				 *
				 * @return {Boolean}
				 *  */
				$scope.api.isMenuItemEnabled = function(menuItemId) {
					var disabled = isDisabled(menuItemId);
					if (disabled === null) {
						return false
					} else {
						return !disabled;
					}
				}

				/**
				 * Retrieves the screen location of a specific menu item. Returns the location as point (object with x and y properties).
				 * 
				 * @param {object} nodeId the node to retrieve location for.
				 * @return {point} the location of the menu item.
				 */
				$scope.api.getLocation = function(nodeId)
				{
					var domElement = getDOMElementByID(nodeId);
					if (domElement)
					{
						var position = domElement.offset();
						return {x: position.left, y: position.top};
					}
					return null;
				}
				
				/**
				 * Retrieves the size of a specific menu item. Returns the size as dimension (object with width and height properties).
				 * 
				 * @param {object} nodeId the node to retrieve size for.
				 * @return {dimension} the size of the menu item.
				 */
				$scope.api.getSize = function(nodeId)
				{
					var domElement = getDOMElementByID(nodeId);
					if (domElement)
					{
						return {width: domElement.width(), height: domElement.height()};
					}
					return null;
				}
				
				/***********************************************************************************
				 * Private Methoods
				 ***********************************************************************************/

				/**
				 * Returns the subtree at the Given path
				 *
				 * @param {String|Number} nodeId
				 * @param {Array} nodes
				 *
				 * @return {servoyextra-sidenav.MenuItem}
				 * */
				getNodeById = function(nodeId, nodes) {
					if (nodes) {
						for (var i = 0; i < nodes.length; i++) { // search in each subtree
							/** @type {servoyextra-sidenav.MenuItem} */
							var subTree = nodes[i];
							// TODO use type equality or not ?
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
				 * @return {servoyextra-sidenav.MenuItem}
				 * */
				getNodeByIndexPath = function(path, nodes) {
					/** @type {servoyextra-sidenav.MenuItem} */
					var node = null;
					if (nodes) {
						if (path && path.length === 1) {
							node = nodes[path[0]];
						} else if (path && path.length) {
							var subPathIndex = path[0];
							var subtree = nodes[subPathIndex].menuItems;
							node = getNodeByIndexPath(path.slice(1, path.length), subtree);
						} else { // is the root
							$log.warn("there is no path")
							node = nodes;
						}
					}
					return node;
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
				 * @param {String|Number} nodeId
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
				 * @param {String|Number} nodeId
				 * @return Array
				 * */
				getNodeAnchestors = function(nodeId) {
					var anchestors = getAllNodesToNodeId(nodeId);
					anchestors.pop();
					return anchestors;
				}

				/**
				 * Returns the parent node
				 *
				 * @param {String|Number} nodeId
				 * @return {servoyextra-sidenav.MenuItem}
				 * */
				getParentNode = function(nodeId) {
					var anchestors = getNodeAnchestors(nodeId);
					if (anchestors && anchestors.length) {
						return anchestors[anchestors.length - 1];
					}
				}

				/**
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
				 * Returns the selected node up-to level
				 *
				 * @param {Number} [level] 1-based
				 * @return {servoyextra-sidenav.MenuItem}
				 * */
				getSelectedNode = function(level) {
					var levels = $scope.selectedIndex;
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
				 * @param {servoyextra-sidenav.MenuItem} item
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
				 * @param {servoyextra-sidenav.MenuItem} item the expanded node
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
				 * @param {String|Number} nodeId
				 * @return {Boolean}
				 *  */
				isDisabled = function(nodeId) {
					// check if menu itself is disable
					if ($scope.model.enabled == false) {
						return true;
					}

					// TODO refactor: use getNodeAnchestors
					var indexPath = getPathToNode(nodeId, $scope.model.menu);
					var tree = $scope.model.menu;
					/** @type {servoyextra-sidenav.MenuItem} */
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

				/**
				 * Check if node is selected
				 *
				 * @param {String|Number} nodeId
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
					var element = $element;
					var offset = element.offset();
					var x = offset.left;
					var y = offset.top;

					var event = document.createEvent("MouseEvents");
					event.initMouseEvent("click", false, true, window, 1, x, y, x, y, false, false, false, false, 0, null);
					return event;
				},
				
				getDOMElementByID = function(nodeId)
				{
					var indexPath = getPathToNode(nodeId, $scope.model.menu);
					if (indexPath)
					{
						var foundElement = $element;
						for (var i=0;i<indexPath.length;i++)
						{
							var foundElement = foundElement.find("ul.sn-level-"+(i+1));
							foundElement = $(foundElement.children()[i]);
						}
						return foundElement;
					}	
					return null;
				}
			},
			link: function($scope, $element, $attrs) {

				var className = null;
				var svyextracontainer = $element.find(".svy-extra-sidenav");
				var sidenav = $element.find(".svy-sidenav");
				var sidenavHeader = $element.find(".svy-sidenav-header");
				var tablesspanel = $element.find('.svy-sidenav-tablesspanel');
				var nav = $element.find("nav");

				// prevent animation at page refresh
				if ($scope.model.open === false) {
					sidenav.addClass('svy-slide-out');
					svyextracontainer.addClass('svy-slide-out');
				}

				Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
						configurable: true,
						value: function(property, value) {
							switch (property) {
							case "enabled":
								if (value) {
									nav.removeAttr("disabled");
									nav.removeClass("svy-sidenav-disabled");
								} else {
									nav.attr("disabled", "disabled");
									nav.addClass("svy-sidenav-disabled");
								}
								break;
							case "open":
								animateMenuHover($scope.model.open);
								animateSlideMenu(value);
								setTimeout(function() {
									var event;
									if (typeof(Event) === 'function') {
										event = new Event('resize');
									} else {
										event = document.createEvent('Event');
										event.initEvent('resize', true, true);
									}
									window.dispatchEvent(event); //fix issue with resize
								}, 500);
								break;
							case "styleClass":
								if (className) sidenav.removeClass(className);
								className = value;
								if (className) sidenav.addClass(className);
								break;
							case "containedForm":
								if (value) {
									svyextracontainer.addClass("has-panel");
								} else {
									svyextracontainer.removeClass("has-panel");
								}
							case "sidenavWidth":
							case "height":
								updateSidenavStyle();
								break;
							case "selectedIndex":
								$scope.selectedIndex = value ? JSON.parse(value) : { };
								break;
							case "expandedIndex": 
								$scope.expandedIndex = value ? JSON.parse(value) : { };
								break;
							}

						}
					});
				var destroyListenerUnreg = $scope.$on("$destroy", function() {
						unbindOnHover();
						destroyListenerUnreg();
						delete $scope.model[$sabloConstants.modelChangeNotifier];
					});
				// data can already be here, if so call the modelChange function so that it is initialized correctly.
				var modelChangFunction = $scope.model[$sabloConstants.modelChangeNotifier];
				for (key in $scope.model) {
					modelChangFunction(key, $scope.model[key]);
				}

				/**
				 * Update the sidenav style
				 *  */
				function updateSidenavStyle() {
					var cssStyle = new Object();

					var width = getSidenavWidth();
					if (width) {
						// TODO set fixed width
						cssStyle.width = width + "px";
					}

					// check height
					var height = getResponsiveHeight();
					if (height) {
						// TODO should be min height or height ? minHeight allow overflow visible, while height prevents the sidenav to grow
						cssStyle.minHeight = height + "px";
						/*cssStyle["overflow-x"] = "auto";*/
					}

					sidenav.css(cssStyle);

				}

				/**
				 * Update the container style
				 * @deprecated
				 *  */
				function updateContainerStyle() {

					return;

					var cssStyle = new Object();

					if ($scope.model.containedForm) {
						// check height
						var height = getResponsiveHeight();
						// TODO should be max height !?
						cssStyle.minHeight = height + "px";
					} else {
						cssStyle.display = "none";
					}

					tablesspanel.css(cssStyle);
				}

				/** Default menu side */
				var slidePositionClass;
				switch ($scope.model.slidePosition) {
				case "right":
					slidePositionClass = "svy-sidenav-right";
					break;
				case "static":
					slidePositionClass = "svy-sidenav-static";
					break;
				case "left":
				// default cascade
				default:
					slidePositionClass = "svy-sidenav-left";
					break;
				}
				sidenav.addClass(slidePositionClass);
				tablesspanel.addClass(slidePositionClass);

				/** Default menu collapsible behavior */
				var slideBehaviorClass;
				switch ($scope.model.slideAnimation) {
				case "collapse-menu":
				case "collapse-menu-nohover":
					slideBehaviorClass = "nav-collapse-menu";
					break;
				case "slide-menu":
				// default cascade
				default:
					slideBehaviorClass = "nav-slide-menu";
					break;
				}
				sidenav.addClass(slideBehaviorClass);

				/** Default toggle position */
				var togglePositionClass;
				switch ($scope.model.togglePosition) {
				case "side-toggle":
					togglePositionClass = "nav-side-toggle";
					break;
				case "hide-toggle":
					togglePositionClass = "nav-hide-toggle";
					break;
				case "fixed-toggle":
				// default cascade
				default:
					togglePositionClass = "nav-fixed-toggle";
					break;
				}
				sidenav.addClass(togglePositionClass);

				switch ($scope.model.scrollbarPosition) {
				case "left":
					break;
				case "right":
					sidenav.attr("dir", "rtl");
					break;
				default:
					break;
				}

				/**
				 * @public
				 * Check if the menu has a slide animation
				 *  */
				function hasSlideMenuAnimation() {
					return $scope.model.slideAnimation === "slide-menu";
				}

				// animate slide menu
				$scope.slideMenu = function(event) {

					// toggle the menu
					var wasOpen = $scope.model.open;
					$scope.model.open = $scope.model.open === false ? true : false;

					animateMenuHover($scope.model.open);
					animateSlideMenu($scope.model.open);
					$scope.svyServoyapi.apply("open");

					// event on menu open
					if ($scope.handlers.onOpenToggled && wasOpen != $scope.model.open) {
						$scope.handlers.onOpenToggled(event);
					}
					
					// trigger a window resize since form may have changed
					// TODO trigger it also after the onHover ?
					// TODO trigger only if there is a containedForm ?
					// TODO expose a setting for triggerWindow resize ?
					if ($scope.model.slidePosition != 'static') {
						setTimeout(function() {
								$(window).resize();
							}, 450);
					}
				}

				var animateSlideMenuTimeout;

				/**
				 * Toggle menu open/close animation
				 * @public
				 * */
				function animateSlideMenu(open) {
					if ($scope.model.slidePosition && $scope.model.slidePosition != 'static') {
						var iconOpen = sidenavHeader.find('.svy-sidenav-action-open');
						if (open) { // open the menu when hovering

							// remove all hover animation
							sidenav.removeClass('svy-hover-animate svy-hover-remove svy-hover-add svy-hover');
							if (sidenav.hasClass('svy-slide-out')) {

								$animate.removeClass(svyextracontainer, 'svy-slide-out');
								$animate.removeClass(sidenav, 'svy-slide-out');

								// used to slide in the panel if. Use only if menu slides
								if (hasSlideMenuAnimation()) {
									svyextracontainer.addClass('svy-slide-out-remove-delay');

									// stop remove animation clearing previous timeout
									if (animateSlideMenuTimeout) {
										clearTimeout(animateSlideMenuTimeout);
										animateSlideMenuTimeout = undefined;
									}

									requestAnimationFrame(function() {
										$log.debug('Timeout add delay');

										// complete hover animation
										animateSlideMenuTimeout = setTimeout(function() {
												$log.debug('Timeout remove delay');
												svyextracontainer.removeClass('svy-slide-out-remove-delay');
											}, 450);

									});
								}

							}
							iconOpen.removeClass($scope.model.iconCloseStyleClass);
							iconOpen.addClass($scope.model.iconOpenStyleClass);
						} else {
							if (!svyextracontainer.hasClass('svy-slide-out')) {
								$animate.addClass(sidenav, 'svy-slide-out');
								$animate.addClass(svyextracontainer, 'svy-slide-out');
							}
							iconOpen.removeClass($scope.model.iconOpenStyleClass);
							iconOpen.addClass($scope.model.iconCloseStyleClass);
						}
					} else {
						$scope.model.open = true;
						$scope.svyServoyapi.apply("open");
					}
				}

				/**
				 * Cannot use angular animate at mouse enter/leave. Simulate animate using onmouseenter/onmouseleave
				 * Toggle menu hover animation
				 *
				 * @public
				 * */
				function animateMenuHover(open) {
					if (open === false) { // add listener when menu closed, use a delay
						setTimeout(function() {
								bindOnHover();
							}, 300);
					} else { // remove listener when open
						unbindOnHover();
					}
				}

				/**
				 * Bind hover event
				 * @public
				 * */
				function bindOnHover() {

					// register on mouse hover
					if ($scope.model.slideAnimation === 'collapse-menu') {
						nav.mouseenter(onMouseEnter);
						sidenav.mouseleave(onMouseLeave);
					}

					var mouseEnterTimeout;
					var mouseLeaveTimeout;

					/**
					 * @private
					 * */
					function onMouseEnter(e) {
						// only if the menu is collapsed, use the mouseover
						if ($scope.model.slideAnimation === 'collapse-menu') {

							// stop remove animation clearing previous timeout
							if (mouseLeaveTimeout) {
								$log.debug('Clear Timeout Remove ');
								sidenav.removeClass('svy-hover-remove');
								clearTimeout(mouseLeaveTimeout);
								mouseLeaveTimeout = undefined;
							}

							$scope.mouseHover = true; // TODO remove mouseHover

							// to start animation add svy-hover-add to start animation and remove at next repaint
							sidenav.addClass('svy-hover svy-hover-add svy-hover-animate');
							requestAnimationFrame(function() {
								$log.debug('Timeout add');
								sidenav.removeClass('svy-hover-add');

								// complete hover animation
								mouseEnterTimeout = setTimeout(function() {
										$log.debug('Timeout add animate');
										sidenav.removeClass('svy-hover-animate');
									}, 450);

							});

						}
					}

					/**
					 * @private
					 * */
					function onMouseLeave(e) {
						// only if the menu is collapsed, use the mouseover
						if ($scope.model.slideAnimation === 'collapse-menu') {

							// stop add animation
							if (mouseEnterTimeout) {
								$log.debug('Clear Timeout Add');
								sidenav.removeClass('svy-hover-add');
								clearTimeout(mouseEnterTimeout);
								mouseEnterTimeout = undefined;
							}

							// start hover remove animation
							$scope.mouseHover = false;
							sidenav.addClass('svy-hover-animate svy-hover-remove ');
							sidenav.removeClass('svy-hover');

							// complete hover animation
							mouseLeaveTimeout = setTimeout(function() {
									$log.debug('Timeout remove');
									sidenav.removeClass('svy-hover-animate svy-hover-remove ');
								}, 450);
						}
					}

				}

				/**
				 * Unbind hover event
				 * @public
				 * */
				function unbindOnHover() {
					$scope.mouseHover = false;
					sidenav.off('mouseenter mouseleave');
					nav.off('mouseenter mouseleave');
				}

				/**
				 * Check if is a responsiveForm
				 *
				 * @public
				 *  */
				function isResponsiveForm() {
					return ! ($scope.$parent.absoluteLayout === true);
				}

				/****************************************************************************************
				 *
				 * Tabless Panel
				 *
				 * *************************************************************************************/

				var realContainedForm;
				var formWillShowCalled;

				function setRealContainedForm (formname, relationname) {
					if ($scope.model.visible) {
						if (formWillShowCalled != formname && formname) {
							formWillShowCalled = formname;
							if ($scope.model.waitForData) {
								$q.when($scope.svyServoyapi.formWillShow(formname, relationname)).then(function() {
									realContainedForm = formname;
								});
							} else {
								$scope.svyServoyapi.formWillShow(formname, relationname);
								realContainedForm = formname;
							}
						}
					} else {
						// panel is not visible; don't ask server to show child form as that would generate an exception on server
						realContainedForm = formWillShowCalled = undefined;
					}
				}

				$scope.getActiveTabUrl = function() {
					if (realContainedForm) {
						return $scope.svyServoyapi.getFormUrl(realContainedForm)
					}
					setRealContainedForm($scope.model.containedForm, $scope.model.relationName);

					return "";
				}

				setRealContainedForm($scope.model.containedForm, $scope.model.relationName);

				$scope.$watch("model.containedForm", function(newValue,oldValue) {
					if (newValue !== oldValue)
					{
						if (oldValue) {
							formWillShowCalled = newValue;
							$scope.svyServoyapi.hideForm(oldValue,null,null,newValue,$scope.model.relationName,null).then(function(ok) {
								realContainedForm = $scope.model.containedForm;
							})
						}
						else if (newValue) {
							setRealContainedForm(newValue, $scope.model.relationName);
						}
					}	
				});

				$scope.$watch("model.visible", function(newValue,oldValue) {
					if ($scope.model.containedForm && newValue !== oldValue)
					{
						formWillShowCalled = realContainedForm = undefined;
						if (newValue)
						{
							setRealContainedForm($scope.model.containedForm, $scope.model.relationName);
						}
						else
						{
							$scope.svyServoyapi.hideForm($scope.model.containedForm);
						}	
					}	
				});

				$scope.getContainerStyle = function() {
					var height = getResponsiveHeight();
					var width = getSidenavWidth();
					var cssStyle = {
						"position": "relative",
						"min-height": height + "px"
					}
					switch ($scope.model.slidePosition) {
					case "left":
						cssStyle.marginLeft = width + "px";
						break;
					case "right":
						cssStyle.marginRight = width + "px";
					default:
						break;
					}

					return cssStyle;
					// TODO return margin-left
					// updateSidenavStyle();
				}

				function getResponsiveHeight() {
					var height = 0;
					if (isResponsiveForm()) {
						if ($scope.model.responsiveHeight) {
							height = $scope.model.responsiveHeight;
						} else if ($scope.model.containedForm && $sabloApplication.hasFormStateWithData($scope.model.containedForm)) {
							// for absolute form default height is design height, for responsive form default height is 0
							var formState = $sabloApplication.getFormStateEvenIfNotYetResolved($scope.model.containedForm);
							if (formState && formState.absoluteLayout) {
								height = formState.properties.designSize.height;
							}
						}
					}
					return height;
				}

				function getSidenavWidth() {
					if ($scope.model.sidenavWidth) {
						// if value is set and there is a responsiveForm or a containedForm. Note should react also if containeForm is set later
						if (isResponsiveForm() || $scope.model.containedForm) {
							return $scope.model.sidenavWidth;
						}
					}
					return 0;
				}

			},
			templateUrl: 'servoyextra/sidenav/sidenav.html'
		};
	}])