angular.module('servoyextraTreeview',['servoy']).directive('servoyextraTreeview', ['$timeout', function($timeout) {  
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
    	  
    	var renderedAsTable = false;
    	var columnsLength = 0;
    	var treeJSON;
    	var theTree;
    	var clickTimeout;
    	
		$scope.$watch('model.jsDataSet', function(newValue) {
			if($scope.model.jsDataSet) {
				treeJSON = toTreeJSON($scope.model.jsDataSet);
				if(theTree) {
					if (renderedAsTable == isTableView()) {
						// reload the data
						theTree.reload(treeJSON);
					} else {
						// reload the tree if switching between table and non-table view
						initTree();
					}
				}
				else {
					initTree();
				}
			}
		})    	
    	
      	function initTree() {
      		var treeOptions = {
 				source: treeJSON,
 				selectMode: 1,
// 				extensions: ["wide"],
 				activate: function(event, data) {
					if(!data.node.isSelected()) data.node.setSelected();
				},
				click: function(event, data) {	
					if ($scope.handlers.onNodeClicked) {

						// if double click available execute timeout
						if ($scope.handlers.onNodeDoubleClicked) {
							if (clickTimeout) {
								$timeout.cancel(clickTimeout);
							}
							clickTimeout = $timeout(function() {
									$scope.handlers.onNodeClicked(data.node.key);
								}, 400);
						} else {
							// if no double click execute immediately the click
							$scope.handlers.onNodeClicked(data.node.key);
						}
					}
				},
				dblclick: function(event, data) {
					if($scope.handlers.onNodeDoubleClicked)  {
			    		if(clickTimeout) {
			    			$timeout.cancel(clickTimeout);
			    			clickTimeout = null;
			    		}	
						$scope.handlers.onNodeDoubleClicked(data.node.key);
					}
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
 			};
      		
		    /*Bind context menu for every node when its DOM element is created.
	        We do it here, so we can also bind to lazy nodes, which do not
	        exist at load-time.*/
      		if ($scope.handlers.onNodeRightClicked) {
      			treeOptions.createNode = function(event, data){
			        bindContextMenu(data.node.span);
			    }
      		}
      		
      		/** if should be rendered as a table */
      		if (isTableView()) {
					treeOptions.extensions = ["table"]
					treeOptions.table = {
	 					nodeColumnIdx: 0         // render node expander, icon, and title to this column (default: #0)
	 				}
					treeOptions.renderColumns = function(event, data) {					
	 			        var node = data.node,
				        $tdList = $(node.tr).find(">td");
	 			        
	 			        for (var i = 1; i <= columnsLength; i++) {
	 				        $tdList.eq(i).text(node.data['column' + i]);
	 			        } 			        
						return;
	 				}
	      		
	 			var columnHeaders = toTreeColumnHeaders($scope.model.jsDataSet);
 				
	 			var table = '<table class="treeview"><colgroup>';
	 			var thead = '<thead><tr>';
	 			
 				// sets the title for the other columns
	 			for (var i = 0; i < columnHeaders.length; i++) {
	 				table += '<col></col>';
	 				if (columnHeaders[i] != null && columnHeaders[i] != undefined) {
	 					thead += '<th>' + columnHeaders[i] + '</th>'; 
	 				} else {
	 					thead += '<th></th>';
	 				}
	 			}
	 			
	 			table += '</colgroup>';
	 			thead +='</tr></thead><tbody></tbody>';
	 			table += thead;
	 			table += '</table>'
	 			
	 			$element.append(table);
	 			$element.find('div').css('display','none');
	 				
	      		theTree = $element.find("table").fancytree(treeOptions);
	      		renderedAsTable = true;
      		} else {
	      		theTree = $element.find("div").fancytree(treeOptions);
	      		renderedAsTable = false;
      		}
      		
      		theTree = theTree.fancytree("getTree");
     	}
		
     	  // --- Contextmenu helper --------------------------------------------------
     	  function bindContextMenu(span) {
     	    // Add context menu to this node:
     	    
     		 if ($scope.handlers.onNodeRightClicked) {
	     	    $(span).contextmenu(function(event) {
	     	      // The event was bound to the <span> tag, but the node object
	     	      // is stored in the parent <li> tag
	     	      if ($scope.handlers.onNodeRightClicked) {     	    	
		     	      var node = $.ui.fancytree.getNode(event.target);
					  event.preventDefault();
					  if (node) {
					  	 $scope.handlers.onNodeRightClicked(node.key);
					  }
	     	      }
	     	    });
     		 }
     	  };

  		function findParent(parentId, children) {
  			if(children != null) {
  				for(var i = 0; i < children.length; i++) {
  					var p = (parentId == children[i].key) ? children[i] : findParent(parentId, children[i].children ? children[i].children : null); 
  					if(p != null) return p;
  				}
  			}
  			return null;
  		};
  		
  		function isTableView() {
  			return columnsLength === 0 ? false : true;
  		}
  		
  		/**
  		 * Returns the column headers sorted by index
  		 * */
  		function toTreeColumnHeaders(jsDataSet) {
      		// index for extra columns
      		var columnHeaders = [];
      		if (jsDataSet) {
      			columnHeaders.push(jsDataSet[1][jsDataSet[0].indexOf("treeColumn")])
      		}
      		for (var c = 0; jsDataSet && c < jsDataSet[0].length; c++) {
      			if (jsDataSet[0][c].indexOf("column") === 0) {
      				columnHeaders.push(jsDataSet[1][c]);
      			}
      		}
      		return columnHeaders;
  		}

  		/**
  		 * Returns the treeJSON
  		 * 
  		 * */
      	function toTreeJSON(jsDataSet) {
      		var fancyTreeJSON = new Array();
      		
      		var idIdx = jsDataSet[0].indexOf("id");
      		var pidIdx = jsDataSet[0].indexOf("pid")
      		var iconIdx = jsDataSet[0].indexOf("icon");
      		var treeColumnIdx = jsDataSet[0].indexOf("treeColumn");
      		
      		// index for extra columns
      		var columnsIdx = [];
      		for (var c = 0; c < jsDataSet[0].length; c++) {
      			if (jsDataSet[0][c].indexOf("column") === 0) {
      				columnsIdx.push(c);
      			}
      		}
      		
      		// sets the column length. Not very nice coded;
      		columnsLength = columnsIdx.length;
      		
      		// in table view the first contains the table header names
      		var i = columnsIdx.length ? 2 : 1;
      		for(i; i < jsDataSet.length; i++) {
      			var n = {key: jsDataSet[i][idIdx], title: jsDataSet[i][treeColumnIdx]};
      			
      			for (c = 1; c <= columnsIdx.length; c++) {
      				n['column' + c] = jsDataSet[i][columnsIdx[c - 1]];
      			}
      			
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
  }])
