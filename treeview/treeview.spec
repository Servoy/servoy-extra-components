{
	"name": "servoyextra-treeview",
	"displayName": "Treeview",
	"version": 1,
	"icon": "servoyextra/dbtreeview/treeview.png",
	"definition": "servoyextra/treeview/treeview.js",
	"serverscript": "servoyextra/treeview/treeview_server.js",
	"libraries": [{"name":"treeview.css", "version":"1", "url":"servoyextra/treeview/css/treeview.css", "mimetype":"text/css"}],
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
      						}
      					]},
      	"onNodeRightClicked": {
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
      						}
      					]},
		"onNodeDoubleClicked": {
		      		"parameters":[
      						{
      						"name":"nodeId",
      						"type":"object"
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
      	}
	}
}
