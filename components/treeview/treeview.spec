{
	"name": "servoyextra-treeview",
	"displayName": "Treeview",
	"categoryName": "Visualization",
	"version": 1,
	"icon": "servoyextra/dbtreeview/treeview.png",
	"definition": "servoyextra/treeview/treeview.js",
	"doc": "servoyextra/treeview/treeview_doc.js",
	"serverscript": "servoyextra/treeview/treeview_server.js",
	"libraries": [{"name":"treeview.css", "version":"1", "url":"servoyextra/treeview/css/treeview.css", "mimetype":"text/css"}],
	"keywords": [],
	"model":
	{
	    "jsDataSet": {"type" :"dataset", "includeColumnNames": true, "columnTypes":{ "icon" : "media" }},
	    "styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }, "values" :[]},
	    "showCheckboxes": {"type":"boolean", "default":false, "tags": { "doc": "If true, a checkbox is displayed for each node. The checked state is separate from the (single) selected node, and is cleared when a new data set is set. Changing this property clears the current checked nodes." }},
	    "checkboxAutoselectsChildren": {"type":"boolean", "default":true, "tags": { "doc": "If true, checking a node checks all its descendants and a parent node is checked when all its children are checked (shown as partially checked when only some are). If false, each node is checked independently. Changing this property clears the current checked nodes." }}
	},	
	"handlers":
	{
		"onNodeClicked": {
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						},
      						{
      						"name":"event",
      						"type":"JSEvent"
      						},
							{
      						"name":"columnName",
      						"type":"string"
      						}
      					]},
      	"onNodeRightClicked": {
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						},
      						{
      						"name":"event",
      						"type":"JSEvent"
      						}
      					]},
		"onNodeDoubleClicked": {
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						},
      						{
      						"name":"event",
      						"type":"JSEvent"
      						}
      					]},
		"onNodeExpanded": {
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					]},
	    "onNodeCollapsed": {
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					]},
	    "onNodeSelected": {
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					]},
	    "onNodeChecked": {
	    			"doc": "Called when the user checks or unchecks a node (only when showCheckboxes is true). Only the node that was clicked is reported, use getCheckedNodes() to get all the checked nodes (including the ones changed by checking a parent). Not called for changes made through setCheckedNodes or clearCheckedNodes.",
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						},
      						{
      						"name":"checked",
      						"type":"boolean"
      						},
      						{
      						"name":"event",
      						"type":"JSEvent"
      						}
      					]},
      	"onReady": {
		      	"parameters":[
      						{
      						"name":"event",
      						"type":"JSEvent"
      						}
      			]},
		"onRowDrop": {
			"doc": "Called when an ng grid row is dropped as a result of a drag-n-drop",
			"parameters": [{
				"name": "sourceRows",
				"type": "object[]",
				"doc": "an Array of plain objects if dragged from a power grid, or JSRecord objects if from a data grid"
			}, {
				"name": "nodeId",
				"type": "object"
			}, {
				"name": "event",
				"type": "JSDNDEvent"
			}]
		}
	},
	"api":
	{
		"setColumnWidth" : {
			"delayUntilFormLoads": true,
			"parameters": 
			[
				{
					"name": "columnWidth",
					"type": "int"
				},
				{
					"name": "index",
					"type": "int",
					"optional": true
				}
			]
		},
		
		"addOrUpdateRowData": {
		    "parameters": [
                {
                    "name": "data",
                    "type": "object"
                }
            ]
        },

        "setDataSet": {
			"parameters":[
							{                                                                 
							"name":"jsDataSet",
							"type": {"type" :"dataset", "includeColumnNames": true, "columnTypes":{ "icon" : "media" }}
		                	}             
						 ]
        },
        
      	"refresh": {
      		"parameters":[
      						{
      						"name":"restoreExpandedNodes",
      						"type":"boolean"
      						}
      					]
      	},
      	
        "expandAll": {
      		"parameters":[],
      		"returns": "boolean"
      	},
      	"collapseAll": {
      		"parameters":[],
      		"returns": "boolean"
      	},
      	"expandNode": {
      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					]
      	},
      	
		"isNodeExpanded": {
      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					],
      		"returns": "boolean"
      	},
      	
     	"collapseNode": {
      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					]
      	},
 
      	"setSelectedNode": {
      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					]
      	},
      	
      	"scrollToNode": {
      	    "parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					]
      	
      	},
      	
     	"getSelectedNode": {
      		"returns": "object"
      	},
      	"getSeletedNode": {
      		"returns": "object",
			"deprecated": "Should use getSelectedNode instead."
      	},
      	
     	"getChildNodes": {
      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					],     	
      		"returns": "object[]"
      	},
      	
     	"getParentNode": {
      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					],     	
      		"returns": "object"
      	},      	
      	
     	"getNodeLevel": {
      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					],     	
      		"returns": "int"
      	},      	      	
      	
		"getRootNodes": {   	
      		"returns": "object[]"
      	},
      	"getCheckedNodes": {
      		"returns": "object[]"
      	},
      	"setCheckedNodes": {
      		"parameters":[
      						{
      						"name":"nodeIds",
      						"type":"object[]"
      						}, {
      						"name":"state",
      						"type":"boolean",
      						"optional":true
      						}
      					]
      	},
      	"clearCheckedNodes": {
      		"parameters":[]
      	},
      	"filterNodes": {
      		"parameters":[
      						{
      						"name":"text",
      						"type":"string"
      						}, {
      						"name":"options",
      						"type":"object",
      						"optional":true
      						}
      					]
		},
      	"filterBranches": {
      		"parameters":[
      						{
      						"name":"text",
      						"type":"string"
      						}, {
      						"name":"options",
      						"type":"object",
      						"optional":true
      						}
      					]
      	}
	},
	"types": {
	  "JSDNDEvent" : {
			"extends" : "JSEvent",
			"model":{
				"sourceGridName": {"type" : "string"},
				"sourceColumnId": {"type" : "string"}
			}
	  }
	}
}
