angular.module('servoyextraDbtreeview', ['servoyApp','foundset_manager']).directive('servoyextraDbtreeview', ['$timeout', '$window', 'foundset_manager', '$applicationService', '$q', '$utils', function($timeout, $window, foundset_manager, $applicationService, $q, $utils) {
    return {
      restrict: 'E',
      scope: {
    	  model: "=svyModel",
		  handlers: "=svyHandlers",
    	  svyServoyapi: "=",
    	  api: "=svyApi"
      },
      link: function($scope, $element, $attrs) { 
    	  if ($scope.svyServoyapi.isInDesigner()) {
    		  $element.html("<div class=\"tree_design\"></div>");
    	  }
    	  
		$scope.expandedNodes = [];
    	$scope.pendingChildrenRequests = 0;
    	$scope.pendingRefresh = false;
    	var theTree;
    	var clickTimeout;

    	var foundsetChangeWatches = {};
  
    	var treeReloadTimeout;
    	function reloadTree() {
			if(treeReloadTimeout) {
				$timeout.cancel(treeReloadTimeout);
			}
			treeReloadTimeout = $timeout(function() {
				if(theTree) {
					theTree.reload($scope.treeJSON);
				}
			}, 200);
    	}
		
		function getPKFromNodeKey(nodeKey) {
			var pkIdx = nodeKey.indexOf('_');
			return nodeKey.substring(pkIdx + 1);
		}

    	function initTree() {
      		theTree = $element.find(".dbtreeview").fancytree(
     	 	{
 				source: $scope.treeJSON,
 				selectMode: 2,
 				scrollParent: $element.find(".dbtreeview"),
 				checkbox: true,
				select: function(event, data) {
					var eventType = event.type;
					if(data.node.data.checkboxvaluedataprovider) {
						var v = data.node.selected
						if("number" == data.node.data.checkboxvaluedataprovidertype) {
							v = v ? 1 : 0;
						} else if ("string" == data.node.data.checkboxvaluedataprovidertype) {
							v = v ? 'true' : 'false'
						}
						foundset_manager.updateFoundSetRow(
								data.node.key.substring(0, data.node.key.lastIndexOf('_')),
								data.node.data._svyRowId,
								data.node.data.checkboxvaluedataprovider,
								v);
					}					
					if(data.node.data && data.node.data.methodToCallOnCheckBoxChange) {
						$window.executeInlineScript(
								data.node.data.methodToCallOnCheckBoxChange.formname,
								data.node.data.methodToCallOnCheckBoxChange.script,
								[data.node.data.methodToCallOnCheckBoxChangeParamValue]);
					}
				},
				click: function(event, data) {
					if(data.node.data && data.node.data.callbackinfo) {
		    			if(clickTimeout) {
		    				$timeout.cancel(clickTimeout);
		    			}
		    			clickTimeout = $timeout(function() {
							$window.executeInlineScript(
									data.node.data.callbackinfo.formname,
									data.node.data.callbackinfo.script,
									[data.node.data.callbackinfoParamValue]);
		    			}, 200);
					}					
				},
				dblclick: function(event, data) {
					if(data.node.data && data.node.data.methodToCallOnDoubleClick) {
		    			if(clickTimeout) {
		    				$timeout.cancel(clickTimeout);
		    				clickTimeout = null;
		    			}						
						$window.executeInlineScript(
								data.node.data.methodToCallOnDoubleClick.formname,
								data.node.data.methodToCallOnDoubleClick.script,
								[data.node.data.methodToCallOnDoubleClickParamValue]);
					}
				},
				activate: function(even, data) {
					var selectionPath;
					if($scope.model.selection) {
						selectionPath = $scope.model.selection;
						selectionPath.length = 0;
					}
					else {
						selectionPath = [];
					}

					var activeNode = data.node;
      				for(var i = 0; i < activeNode.getParentList().length; i++) {
      					var parentNode = activeNode.getParentList()[i];
      					selectionPath.push(getPKFromNodeKey(parentNode.key));
      				}
      				selectionPath.push(getPKFromNodeKey(activeNode.key));
      				$scope.model.selection = selectionPath;
				},
				lazyLoad: function(event, data){
					 var dfd = new $.Deferred();
					 data.result = dfd.promise();
					
					var nodeChildrenInfo = data.node.data.getChildren;	
	    			$scope.pendingChildrenRequests = $scope.pendingChildrenRequests + 1; 
	    				
					foundset_manager.getRelatedFoundSetHash(
							nodeChildrenInfo.foundsethash,
							nodeChildrenInfo.rowid,
							nodeChildrenInfo.relation).then(getRelatedFoundSetCallback(dfd,data.node, nodeChildrenInfo.sort, nodeChildrenInfo.level));
				},
				createNode: function(event, data){
			        bindContextMenu(data.node.span);
			    },
				init: function (event, data) {
					if ($scope.handlers.onReady) {
						$scope.handlers.onReady(event);
					}
				}
 			});
      		theTree = theTree.fancytree("getTree");
     	}
    	
		function bindContextMenu(span) {
			// Add context menu to this node:
			$(span).contextmenu(function(event) {
				// The event was bound to the <span> tag, but the node object
				// is stored in the parent <li> tag
				var node = $.ui.fancytree.getNode(event.target);
				event.preventDefault();
				if (node && node.data.methodToCallOnRightClick) {
					var jsevent = $utils.createJSEvent(event.originalEvent, 'rightClick');
					$window.executeInlineScript(node.data.methodToCallOnRightClick.formname,
						node.data.methodToCallOnRightClick.script,
						[node.data.methodToCallOnRightClickParamValue, jsevent]);
				}
			});
		}    	
    	 
    	function getIconURL(iconPath) {
    		if(iconPath && iconPath.indexOf("media://") == 0) {
    			return "resources/fs/" + $applicationService.getSolutionName() + iconPath.substring(8);
    		}
    		return iconPath;
    	}
    	
      	function getBinding(datasource) {
    		for(var i = 0; i < $scope.model.bindings.length; i++) {
    			if(datasource == $scope.model.bindings[i].datasource) {
    				return $scope.model.bindings[i];
    			}
    		}
    		return null;
    	}        	  
    	  
    	function getDataproviders(datasource, foundsetpk) {
    		var dataproviders = {}
    		var binding = getBinding(datasource);
    		
    		dataproviders[foundsetpk] = foundsetpk;
    		
    		if(binding.textdataprovider) {
    			dataproviders[binding.textdataprovider] = binding.textdataprovider;
    		}
    		if(binding.textdataprovider) {
    			dataproviders[binding.textdataprovider] = binding.textdataprovider;
    		}
    		if(binding.hascheckboxdataprovider) {
    			dataproviders[binding.hascheckboxdataprovider] = binding.hascheckboxdataprovider;
    		}
    		if(binding.checkboxvaluedataprovider) {
    			dataproviders[binding.checkboxvaluedataprovider] = binding.checkboxvaluedataprovider;
    		}
    		if(binding.tooltiptextdataprovider) {
    			dataproviders[binding.tooltiptextdataprovider] = binding.tooltiptextdataprovider;
    		}
    		if(binding.imageurldataprovider) {
    			dataproviders[binding.imageurldataprovider] = binding.imageurldataprovider;
    		}
    		if(binding.childsortdataprovider) {
    			dataproviders[binding.childsortdataprovider] = binding.childsortdataprovider;
    		}    		    		
    		if(binding.callbackinfo) {
    			dataproviders[binding.callbackinfo.param] = binding.callbackinfo.param;
    		}
    		if(binding.methodToCallOnCheckBoxChange) {
    			dataproviders[binding.methodToCallOnCheckBoxChange.param] = binding.methodToCallOnCheckBoxChange.param;
    		}    		
    		if(binding.methodToCallOnDoubleClick) {
    			dataproviders[binding.methodToCallOnDoubleClick.param] = binding.methodToCallOnDoubleClick.param;
    		}    		    		
    		if(binding.methodToCallOnRightClick) {
    			dataproviders[binding.methodToCallOnRightClick.param] = binding.methodToCallOnRightClick.param;
    		}    		    		

    		return dataproviders;
    	}

    	
    	function getRelatedFoundSetCallback(dfd ,item, sort, level) {
    		return function(rfoundsetinfo) {
    			if(rfoundsetinfo) {
					var foundsetNRelation = getBinding(rfoundsetinfo.foundsetdatasource).nrelationname;
					foundset_manager.getFoundSet(
							rfoundsetinfo.foundsethash,
							getDataproviders(rfoundsetinfo.foundsetdatasource, rfoundsetinfo.foundsetpk), sort, foundsetNRelation).then(
									function(rfoundset) {
										if(foundsetChangeWatches[rfoundsetinfo.foundsethash] != undefined) {
											foundsetChangeWatches[rfoundsetinfo.foundsethash]();
										}
										if($scope.model.autoRefresh) {
											foundsetChangeWatches[rfoundsetinfo.foundsethash] = foundset_manager.addFoundSetChangeCallback(rfoundsetinfo.foundsethash, function() {
												if(jQuery.contains(document.documentElement, $element.get(0)) && ($scope.pendingChildrenRequests < 1)) {
													refresh();
												}
											});
										}
										
										var children = getChildren(rfoundset, rfoundsetinfo.foundsethash, rfoundsetinfo.foundsetpk, getBinding(rfoundsetinfo.foundsetdatasource), level, item);
										if ((!children || children.length == 0) && (!item.data || !item.data.relationInfo))
										{
											item.folder = null
										}
										else
										{
											item.folder = true;
										}	
										if (dfd)
										{
											dfd.resolve(children);
										}
										else
										{
											item.children = children;
										}	
										
										$scope.pendingChildrenRequests = $scope.pendingChildrenRequests - 1;
									});
				}
				else {
					$scope.pendingChildrenRequests = $scope.pendingChildrenRequests - 1;
				}
			}
    	}
    	
		function isNodeSelected(node, selection) {
			if(selection && selection.length) {
				var nodePKPath = [];
				nodePKPath.unshift(getPKFromNodeKey(node.key));
				var parentNode = node.data.parentItem;
				while(parentNode) {
					nodePKPath.unshift(getPKFromNodeKey(parentNode.key));
					parentNode = parentNode.data.parentItem;
				}

				if(nodePKPath.length == selection.length) {
					for(var i = 0; i < nodePKPath.length; i++) {
						if(nodePKPath[i] != selection[i].toString()) {
							return false;
						}
					}
					return true;
				}
			}

			return false;
		}		
		
    	function getChildren(foundset, foundsethash, foundsetpk, binding, level, parentItem) {
    		var returnChildren = new Array();
    		if(foundset) {
	    		for(var i = 0; i < foundset.viewPort.rows.length; i++) {
	    			var item = {};
	    			item.key =  foundsethash + '_' + foundset.viewPort.rows[i][foundsetpk]; 
	    			item.title = foundset.viewPort.rows[i][binding.textdataprovider];
	    			if(binding.tooltiptextdataprovider) item.tooltip = foundset.viewPort.rows[i][binding.tooltiptextdataprovider];
					if(binding.imageurldataprovider) item.icon = getIconURL(foundset.viewPort.rows[i][binding.imageurldataprovider]);
					
					if(binding.checkboxvaluedataprovider) {
						item.checkbox = Boolean(foundset.viewPort.rows[i][binding.hascheckboxdataprovider]);
					}
					else if(binding.hasCheckboxValue){
						item.checkbox = binding.hasCheckboxValue.indexOf(foundset.viewPort.rows[i][foundsetpk]) != -1;
					}
					else {
						item.checkbox = Boolean(binding.initialCheckboxValues);
					}

	    			if(item.checkbox) {
						if(binding.checkboxvaluedataprovider) {
							item.selected = Boolean(foundset.viewPort.rows[i][binding.checkboxvaluedataprovider]);
						}
						else if(binding.initialCheckboxValues) {
							item.selected = binding.initialCheckboxValues.indexOf(foundset.viewPort.rows[i][foundsetpk]) != -1;
						}
	    			}
					
					var isLevelVisible = $scope.model.levelVisibility && $scope.model.levelVisibility.state && ($scope.model.levelVisibility.level == level);
					var isNodeExpanded = (level <= $scope.expandedNodes.length) && ($scope.expandedNodes[level - 1].toString() == getPKFromNodeKey(item.key));

	    			if(isLevelVisible || isNodeExpanded) {
	    				item.expanded = true;
	    			}
					
	    			item.data = {}
					item.data._svyRowId = foundset.viewPort.rows[i]._svyRowId;
					item.data.parentItem = parentItem;
					item.data.datasource = binding.datasource;
					
					if(isNodeSelected(item, $scope.model.selection)) {
						item.active = true;
					}					

	    			if(binding.checkboxvaluedataprovider) {
	    				item.data.checkboxvaluedataprovider = binding.checkboxvaluedataprovider;
	    				item.data.checkboxvaluedataprovidertype = typeof foundset.viewPort.rows[i][binding.checkboxvaluedataprovider];
	    			}
	 	
	    			if(binding.callbackinfo || binding.methodToCallOnCheckBoxChange || binding.methodToCallOnDoubleClick || binding.methodToCallOnRightClick)
	    			{
	    				if(binding.callbackinfo) {
	    					item.data.callbackinfo = binding.callbackinfo.f;
	    					item.data.callbackinfoParamValue = foundset.viewPort.rows[i][binding.callbackinfo.param];
	    				}
	    				if(binding.methodToCallOnCheckBoxChange) {
	    					item.data.methodToCallOnCheckBoxChange = binding.methodToCallOnCheckBoxChange.f;
	    					item.data.methodToCallOnCheckBoxChangeParamValue = foundset.viewPort.rows[i][binding.methodToCallOnCheckBoxChange.param];
	    				}
	    				if(binding.methodToCallOnDoubleClick) {
	    					item.data.methodToCallOnDoubleClick = binding.methodToCallOnDoubleClick.f;
	    					item.data.methodToCallOnDoubleClickParamValue = foundset.viewPort.rows[i][binding.methodToCallOnDoubleClick.param];
	    				}    				    				
	    				if(binding.methodToCallOnRightClick) {
	    					item.data.methodToCallOnRightClick = binding.methodToCallOnRightClick.f;
	    					item.data.methodToCallOnRightClickParamValue = foundset.viewPort.rows[i][binding.methodToCallOnRightClick.param];
	    				}    				    				
	    			}
	    			
	    			returnChildren.push(item);
					
					if(binding.nRelationInfos && binding.nRelationInfos.length > 0) {
						item.folder = true;
						item.children = new Array();
						for(var j = 0; j < binding.nRelationInfos.length; j++) {
							var relationItem = {};
							relationItem.title = binding.nRelationInfos[j].label;
							relationItem.checkbox = true;
							relationItem.folder = true;
							relationItem.lazy = true;
							relationItem.data = {}
							relationItem.data.relationInfo = true;

							var sort = binding.childsortdataprovider ? foundset.viewPort.rows[i][binding.childsortdataprovider]: null		
							relationItem.data.getChildren = {
									foundsethash: foundsethash,
									sort: sort,
									rowid: foundset.viewPort.rows[i]._svyRowId,
									relation: binding.nRelationInfos[j].nRelationName,
									level: level+1
							}

							//relationItem.data.parentItem = item;
							item.children.push(relationItem);
						}

					}
					else if(binding.nrelationname) 
	    			{
	    				if (item.expanded)
		    			{
		    				//we have to load it, library doesn't lazy load
		    				// see also https://github.com/mar10/fancytree/issues/609
	    					$scope.pendingChildrenRequests = $scope.pendingChildrenRequests + 1; 
		    				var sort = binding.childsortdataprovider ? foundset.viewPort.rows[i][binding.childsortdataprovider]: null
							foundset_manager.getRelatedFoundSetHash(
									foundsethash,
									foundset.viewPort.rows[i]._svyRowId,
									binding.nrelationname).then(getRelatedFoundSetCallback(null, item, sort, level + 1));
		    			}
		    			else
	    				{
							var hasChildren = true;
							if(foundset_manager.getFoundSetChildRelationInfo) {
								var foundSetChildRelationInfo = foundset_manager.getFoundSetChildRelationInfo(foundsethash, binding.nrelationname);
								if(foundSetChildRelationInfo && !foundSetChildRelationInfo[foundset.viewPort.rows[i]._svyRowId]) {
									item.lazy = false;
									item.folder = false;
									hasChildren = false;
								}
							}
							if(hasChildren) {
								item.lazy = true;
								item.folder = true;

								var sort = binding.childsortdataprovider ? foundset.viewPort.rows[i][binding.childsortdataprovider]: null
										
								item.data.getChildren = {
										foundsethash: foundsethash,
										sort: sort,
										rowid: foundset.viewPort.rows[i]._svyRowId,
										relation: binding.nrelationname,
										level: level+1
								}
							}
	    				}
	    			}
	    		} 
	    	}
    		return returnChildren;
		}
		
    	function findNode(node, pkarray, level) {
    		if(pkarray && pkarray.length > 0) {
    			var nodeChildren = node.getChildren();
    			if(nodeChildren) {
	    			for(var i = 0; i < nodeChildren.length; i++) {
	    				if(getPKFromNodeKey(nodeChildren[i].key) == pkarray[level].toString()) {
	    					if(level + 1 < pkarray.length) {
	    						return findNode(nodeChildren[i], pkarray, level + 1);
	    					}
	    					else {
	    						return nodeChildren[i];
	    					}
	    				}
	    			}
	    		}
    		}
    		return null;
    	}

    	function loadRoot(nr) {
				var foundsetNRelation = getBinding($scope.model.roots[nr].foundsetdatasource).nrelationname;
				foundset_manager.getFoundSet($scope.model.roots[nr].foundsethash, getDataproviders($scope.model.roots[nr].foundsetdatasource, $scope.model.roots[nr].foundsetpk), null, foundsetNRelation).then(
						function(foundset) {
							if(foundsetChangeWatches[$scope.model.roots[nr].foundsethash] != undefined) {
								foundsetChangeWatches[$scope.model.roots[nr].foundsethash]();
							}							
							if($scope.model.autoRefresh) {
								foundsetChangeWatches[$scope.model.roots[nr].foundsethash] = foundset_manager.addFoundSetChangeCallback($scope.model.roots[nr].foundsethash, function() {
									if(jQuery.contains(document.documentElement, $element.get(0)) && ($scope.pendingChildrenRequests < 1)) {
										refresh();
									}
								});
							}
 
							$scope.treeJSON = $scope.treeJSON.concat(getChildren(foundset, $scope.model.roots[nr].foundsethash, $scope.model.roots[nr].foundsetpk, getBinding($scope.model.roots[nr].foundsetdatasource), 1, null));
							$scope.pendingChildrenRequests = $scope.pendingChildrenRequests - 1;
				});    	
    	}
  		
  		function selectNode(selection) {
			if(selection && selection.length) {
				$scope.expandedNodes = selection.slice(0, selection.length);
				var node = theTree ? findNode(theTree.getRootNode(), selection, 0) : null;
				if(node && !node.isActive()) {
					node.makeVisible({scrollIntoView: true});
					node.setActive(true);
				}
				else {
					refresh();
				}
	      	}
  		}
  		
      	function refresh() {
			if($scope.pendingChildrenRequests < 1 && $scope.model.roots && $scope.model.roots.length > 0) {	
				for(var wKey in foundsetChangeWatches) {
					// foundset_manager.removeFoundSetFromCache(wKey);
					if(foundsetChangeWatches[wKey]) {
      					foundsetChangeWatches[wKey]();
      					delete foundsetChangeWatches[wKey];
      				}
      			}
      			foundset_manager.removeFoundSetsFromCache();
			
				$scope.pendingChildrenRequests = $scope.model.roots.length;
				if((!$scope.expandedNodes || !$scope.expandedNodes.length) && theTree) {
					if(!$scope.expandedNodes) $scope.expandedNodes = [];
		  			theTree.getRootNode().visit(function(node){
		  				if(node.isExpanded()) {
		  					$scope.expandedNodes.push(getPKFromNodeKey(node.key));
		  				}	
			        });
	      		}

				$scope.treeJSON = [];
				for(var i = 0; i < $scope.model.roots.length; i++) {
					$scope.pendingChildrenRequests = $scope.pendingChildrenRequests + 1; 
					loadRoot(i);
				}
				
				
				var pendingChildrenRequestsWatch = $scope.$watch('pendingChildrenRequests', function(nV) {
						if(nV == $scope.model.roots.length) {
							pendingChildrenRequestsWatch();
							if(theTree) {
								reloadTree();
							}
							else {
								initTree();
							}

							$scope.pendingChildrenRequests = 0;
							if($scope.pendingRefresh) {
								$scope.pendingRefresh = false;
								refresh();
							}
						}
				})
			}
			else if($scope.pendingChildrenRequests > 0) {
				$scope.pendingRefresh = true;
			}
      	}

      	/**
		 * Refresh the tree display.
		 *
		 * @example
		 * %%elementName%%.refresh()
		 *
		 */
      	$scope.api.refresh = function() {
      		if($scope.pendingChildrenRequests > 0) {
      			$scope.pendingRefresh = true;
      			return;
      		}
      		refresh();
      	}
      	
      	/**
		 * Returns expand state of a node.
		 *
		 * @example
		 * var expanded = %%elementName%%.isNodeExpanded([22])
		 *
		 * @param pk array of each level id
		 * 
		 * @return {boolean}
		 */
      	$scope.api.isNodeExpanded = function(pk) {
      		if(theTree) {	  			
	  			var node = findNode(theTree.getRootNode(), pk, 0);
	  			if(node) {
	  				return node.isExpanded();
	  			}
      		}
      		return false;
      	}

      	/**
		 * Sets expand state of a node.
		 *
		 * @example
		 * %%elementName%%.setExpandNode([22],true)
		 *
		 * @param pk array of each level id
		 * @param state expand state
		 * 
		 */
      	$scope.api.setExpandNode = function(pk, state) {
			if (pk && pk.length) {
				if(state) {
					$scope.expandedNodes = pk.slice(0, pk.length);
				}

				var node = theTree ? findNode(theTree.getRootNode(), pk, 0) : null;
				if(node) {
					node.makeVisible();
					node.setExpanded(state);
				}
				else {
					refresh();
				}
			}
      	}      	

      	function expandChildNodes(node, level, state) {
      		if(level >= 1) {
				var nodeChildren = node.getChildren();
				if(nodeChildren) {
					for(var i = 0; i < nodeChildren.length; i++) {
						if(state) {
							nodeChildren[i].makeVisible();
							nodeChildren[i].setExpanded(state);
						}
						else if(level == 1) {
							nodeChildren[i].setExpanded(state);
						}
						expandChildNodes(nodeChildren[i], level - 1, state);
					}
				}
			  }
      	}
      	
      	/**
		 * Returns path of the selected node.
		 *
		 * @example
		 * var selection = %%elementName%%.getSelectionPath()
		 *
		 * @return {Array}
		 */
      	$scope.api.getSelectionPath = function() {
      		return $scope.model.selection;
      	}
		
      	/**
		 * Update checkbox state for nodes
		 *
		 * @example
		 * %%elementName%%.updateCheckBoxValues(databaseManager.getDataSource('example_data', 'categories'),[1, 3, 5], true);
		 *
		 * @param datasource
		 * @param pks array of pks to update state
		 * @param state true for check / false for uncheck
		 */	  
		$scope.api.updateCheckBoxValues = function(datasource, pks, state) {
			var updatedNodesPks = [];
			if(theTree) {
				theTree.findAll(function(node) {
					if(node.data.datasource == datasource) {
						var pk = getPKFromNodeKey(node.key);
						for(var index = 0; index < pks.length; index++) {
							if(pk == ("" + pks[index])) {
								node.setSelected(state, {noEvents:true});
								updatedNodesPks.push(pks[index]);
								return true;
							}
						}
					}
					return false;
				});
			}

			// if node state was not update, it means it was not yet created, push the check state to the binding
			for(var index = 0; index < pks.length; index++) {
				if(updatedNodesPks.indexOf(pks[index]) == -1) {
					if(state) {
						if(!getBinding(datasource).initialCheckboxValues) {
							getBinding(datasource).initialCheckboxValues = [];
						}
						if(getBinding(datasource).initialCheckboxValues.indexOf(pks[index]) == -1) {
							getBinding(datasource).initialCheckboxValues.push(pks[index]);
						}
					}
					else if(getBinding(datasource).initialCheckboxValues) {
						var index = getBinding(datasource).initialCheckboxValues.indexOf(pks[index]);
						if(index != -1) {
							getBinding(datasource).initialCheckboxValues.splice(index, 1);
						}
					}
				}
			}
		}

      	/**
		 * Returns array of pk of nodes that are checked for the datasource
		 *
		 * @example
		 * var arrayPkChecked = %%elementName%%.getCheckBoxValues(databaseManager.getDataSource('example_data', 'categories'));
		 *
		 * @param datasource
		 * @return {Array} of pk of nodes that are checked
		 */
		$scope.api.getCheckBoxValues = function(datasource) {
			var checkBoxValues = [];
			if(theTree) {
				var selectedNodes = theTree.getSelectedNodes();
				for (var index = 0; index < selectedNodes.length; index++) {
					if(selectedNodes[index].data.datasource == datasource) {
						checkBoxValues.push(getPKFromNodeKey(selectedNodes[index].key));
					}
				}
			}
			return checkBoxValues;
		}

  		$scope.$watch('model.roots', function(newValue) {
  			$scope.api.refresh();
		})
		
		$scope.$watch('model.selection', function(newValue) {
			selectNode(newValue);
		})
		
  		$scope.$watch('model.levelVisibility', function(newValue) {
			if (newValue && theTree) {
				expandChildNodes(theTree.getRootNode(), newValue.level, newValue.state);
			}
		})
		
		$scope.$watch('model.enabled', function(newValue, oldValue) {
			if(newValue != oldValue) {
				var dbtreeviewEl = $element.find(".dbtreeview");
				if(newValue) {
					dbtreeviewEl.removeClass("dbtreeview-disabled");
				}
				else {
					dbtreeviewEl.addClass("dbtreeview-disabled");
				}
			}
	  	})
		
		if(!$scope.svyServoyapi.isInAbsoluteLayout()){
			$scope.$watch('model.responsiveHeight', function(newValue){
					var dbtreeviewEl = $element.find(".dbtreeview")[0];
					if(newValue && dbtreeviewEl) {
						dbtreeviewEl.style.height = newValue+'px';
					}
			})
		}
		
      },
      templateUrl: 'servoyextra/dbtreeview/dbtreeview.html'
    };
  }]);
