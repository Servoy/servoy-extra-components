angular.module('servoyextraTreeview',['servoy']).directive('servoyextraTreeview', function() {  
    return {
      restrict: 'E',
      scope: {
    	  model: "=svyModel",
    	  api: "=svyApi",
    	  svyServoyapi: "=",
    	  handlers: "=svyHandlers"
      },
      link: function($scope, $element, $attrs) {
    	  
    	  if ($scope.svyServoyapi.isInDesigner() && !$scope.model.menu) {
    		  $element.html("<div class=\"tree_design\"></div>");
    	  }
    	  
    	var treeJSON;
    	var theTree;
    	
		$scope.$watch('model.jsDataSet', function(newValue) {
			if($scope.model.jsDataSet) {
				treeJSON = toTreeJSON($scope.model.jsDataSet);
				if(theTree) {
					theTree.reload(treeJSON);
				}
				else {
					initTree();
				}
			}
		})    	
    	
      	function initTree() {
      		theTree = $element.find("div").fancytree(
     	 	{
 				source: treeJSON,
 				selectMode: 1,
// 				extensions: ["wide"],
 				activate: function(event, data) {
					if(!data.node.isSelected()) data.node.setSelected();
					if($scope.handlers.onNodeClicked) $scope.handlers.onNodeClicked(data.node.key);
				},
				select: function(event, data) {
					if($scope.handlers.onNodeSelected) $scope.handlers.onNodeSelected(data.node.key);
				},
				expand: function(event, data) {
					if($scope.handlers.onNodeExpanded) $scope.handlers.onNodeExpanded(data.node.key);
				},
				collapse: function(event, data) {
					if($scope.handlers.onNodeCollapsed) $scope.handlers.onNodeCollapsed(data.node.key);
				}
// 				wide: {
// 					iconWidth: "1em",     // Adjust this if @fancy-icon-width != "16px"
// 					iconSpacing: "0.5em", // Adjust this if @fancy-icon-spacing != "3px"
// 					levelOfs: "1.5em"     // Adjust this if ul padding != "16px"
// 				},
 			});
      		theTree = theTree.fancytree("getTree");
     	}

  		function findParent(parentId, children) {
  			if(children != null) {
  				for(var i = 0; i < children.length; i++) {
  					var p = (parentId == children[i].key) ? children[i] : findParent(parentId, children[i].children ? children[i].children : null); 
  					if(p != null) return p;
  				}
  			}
  			return null;
  		};

      	function toTreeJSON(jsDataSet) {
      		var fancyTreeJSON = new Array();
      		
      		var idIdx = jsDataSet[0].indexOf("id");
      		var pidIdx = jsDataSet[0].indexOf("pid")
      		var iconIdx = jsDataSet[0].indexOf("icon");
      		var treeColumnIdx = jsDataSet[0].indexOf("treeColumn");
      		for(var i = 1; i < jsDataSet.length; i++) {
      			var n = {key: jsDataSet[i][idIdx], title: jsDataSet[i][treeColumnIdx]};
      			var icon = jsDataSet[i][iconIdx];
      			if(icon) n.icon = icon;
      			var parentChildren = fancyTreeJSON;
      			var p = findParent(jsDataSet[i][pidIdx], fancyTreeJSON);
      			if(p != null) {
      				if(!p.children) {
      					p.children = new Array();
      				}
      				parentChildren = p.children;
      				p.folder = "true";
      			}
				else if(jsDataSet[i][pidIdx] != null) {
					// check if the parent is not yet created
					var parentNotYetCreated = false;
					for(var j = i + 1; j < jsDataSet.length; j++) {
						if(jsDataSet[i][pidIdx] == jsDataSet[j][idIdx]) {
							jsDataSet[jsDataSet.length] = jsDataSet[i];
							parentNotYetCreated	= true;
							break;
						}
					}
					if(parentNotYetCreated) {
						continue;
					}
				}
      			parentChildren.push(n);
      		}
      		
      		return fancyTreeJSON;
      	}
      	
      	/**
		 * Refresh the tree display.
		 *
		 * @example
		 * %%elementName%%.refresh()
		 *
		 */
      	$scope.api.refresh = function(restoreExpandedNodes) {
      		if(theTree) theTree.reload();
      	}
      	
      	/**
		 * Expand a node by id.
		 *
		 * @example
		 * %%elementName%%.expandNode(22)
		 *
		 * @param nodeId node id
		 * 
		 */
      	$scope.api.expandNode = function(nodeId) {
      		if(theTree) {
	  			var node = theTree.getNodeByKey(nodeId.toString());
	  			if(node) {
	  				node.makeVisible();
	  				node.setExpanded(true);
	  			}
      		}
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
      	$scope.api.isNodeExpanded = function(nodeId) {
      		if(theTree) {
	  			var node = theTree.getNodeByKey(nodeId.toString());
	  			if(node) {
	  				return node.isExpanded();
	  			}
      		}
      		return false;
      	}

      	/**
		 * Collaps a node by id.
		 *
		 * @example
		 * %%elementName%%.collapseNode(22)
		 *
		 * @param nodeId node id
		 * 
		 */
      	$scope.api.collapseNode = function(nodeId) {
      		if(theTree) {
	  			var node = theTree.getNodeByKey(nodeId.toString());
	  			if(node) {
	  				node.setExpanded(false);
	  			}
      		}
      	}

      	/**
      	 * Sets selected node by id.
      	 *
      	 * @example
      	 * %%elementName%%.setSelectedNode(22)
      	 *
      	 * @param nodeId node id
      	 */
      	$scope.api.setSelectedNode = function(nodeId) {
      		if(theTree) {
	  			var node = theTree.getNodeByKey(nodeId.toString());
	  			if(node) {
	  				node.setSelected()
	  			}
      		}
      	}

      	/**
      	 * Get selected node id.
      	 *
      	 * @example
      	 * var selection = %%elementName%%.getSeletedNode()
      	 *
      	 * @return {Object}
      	 */
      	$scope.api.getSeletedNode = function() {
      		if(theTree) {
	  			var nodes = theTree.getSelectedNodes();
	  			if(nodes && nodes.length && nodes.length > 0) {
	  				return nodes[0].key;
	  			}
      		}
      		return null;
      	}

      	/**
      	 * Get child nodes ids of a parent node.
      	 *
      	 * @example
      	 * var childNodes = %%elementName%%.getChildNodes()
      	 *
      	 * @param nodeId node id
      	 * 
      	 * @return {Array}
      	 */
      	$scope.api.getChildNodes = function(nodeId) {
      		var childNodesId = new Array();
      		if(theTree) {
	  			var node = theTree.getNodeByKey(nodeId.toString());
	  			if(node && node.children) {
	  				for(var i = 0; i < node.children.length; i++) {
	  					childNodesId.push(node.children[i].key);
	  				}
	  			}
      		}
      		return childNodesId;
      	}
      	
      	/**
      	 * Get child nodes ids of a parent node.
      	 *
      	 * @example
      	 * var childNodes = %%elementName%%.getChildNodes()
      	 *
      	 * @param nodeId node id
      	 * 
      	 * @return {Object}
      	 */
      	$scope.api.getParentNode = function(nodeId) {
      		if(theTree) {
	  			var node = theTree.getNodeByKey(nodeId.toString());
	  			if(node && node.parent) {
	  				return node.parent.key;
	  			}
      		}
      		return null;
      	}
      	
      	/**
      	 * Get the tree level a node is situated.
      	 *
      	 * @example
      	 * var nodeLevel = %%elementName%%.getNodeLevel()
      	 *
      	 * @param nodeId node id
      	 * 
      	 * @return {int}
      	 */
      	$scope.api.getNodeLevel = function(nodeId) {
      		if(theTree) {
	  			var node = theTree.getNodeByKey(nodeId.toString());
	  			if(node) {
	  				return node.getLevel();
	  			}
      		}
      		return -1;
      	}
      	
      	/**
      	 * Get root nodes ids .
      	 *
      	 * @example
      	 * var rootNodes = %%elementName%%.getRootNodes()
      	 *
      	 * @return {Array}
      	 */
      	$scope.api.getRootNodes = function() {
      		var rootNodesId = new Array();
      		if(theTree) {
	  			var node = theTree.getRootNode();
	  			if(node && node.children) {
	  				for(var i = 0; i < node.children.length; i++) {
	  					rootNodesId.push(node.children[i].key);
	  				}
	  			}
      		}
      		return rootNodesId;
      	}
      	
      },
      templateUrl: 'servoyextra/treeview/treeview.html'
    };
  })
