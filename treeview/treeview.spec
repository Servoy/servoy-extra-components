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
	    "jsDataSet": {"type" :"dataset", "includeColumnNames": true, "columnTypes":{ "icon" : "media" }}
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
      	"onReady": {
		      	"parameters":[
      						{
      						"name":"event",
      						"type":"JSEvent"
      						}
      			]}
	},
	"api":
	{
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
      	
     	"getSeletedNode": {
      		"returns": "object"
      	},
      	
     	"getChildNodes": {
      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					],     	
      		"returns": "object"
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
      		"returns": "object"
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
	}
}
