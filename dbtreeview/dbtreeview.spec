{
	"name": "servoyextra-dbtreeview",
	"displayName": "DBTreeview",
	"version": 1,
	"icon": "servoyextra/dbtreeview/treeview.png",
	"definition": "servoyextra/dbtreeview/dbtreeview.js",
	"serverscript": "servoyextra/dbtreeview/dbtreeview_server.js",
	"libraries": [{"name":"dbtreeview.css", "version":"1", "url":"servoyextra/dbtreeview/css/dbtreeview.css", "mimetype":"text/css"}],
	"model":
	{
	    "roots": {"type":"foundsetref[]", "tags": { "scope": "private" }},
	    "bindings" : {"type":"binding[]", "tags": { "scope": "private" }},
	    "visible" : {"type":"boolean", "default":true},
		"enabled" : {"type":"boolean", "default":true},
		"autoRefresh": {"type":"boolean", "default":true},
	    "selection" : {"type":"object[]", "tags": { "scope": "private" }},
	    "levelVisibility" : {"type":"levelVisibilityType", "tags": { "scope": "private" }, "pushToServer": "shallow"},
		"responsiveHeight": { "type": "int", "default": 0 }
	},	
	"api":
	{
        "addRoots": {
			"parameters":[
							{                                                                 
							"name":"root",
							"type": "foundsetref"
		                	}             
						 ]
        },
        "removeAllRoots": {
        },
        "refresh": {
        	"delayUntilFormLoads": true
        },  
        "isNodeExpanded": {
			"parameters":[
							{                                                                 
							"name":"pk",
							"type": "object[]"
		                	}
						 ],
			"returns": "boolean"
        },
        "setExpandNode": {
			"parameters":[
							{                                                                 
							"name":"pk",
							"type": "object[]"
		                	},
							{                                                                 
							"name":"state",
							"type": "boolean"
		                	}		                	
						 ]
        },
        "setNodeLevelVisible": {
			"parameters":[
							{                                                                 
							"name":"level",
							"type": "int"
		                	},
							{                                                                 
							"name":"visible",
							"type": "boolean"
		                	}		                	
						 ]
        },
        "setTextDataprovider": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"textdataprovider",
							"type": "string"
		                	}	
						 ]
        },
        "setNRelationName": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"nrelationname",
							"type": "string"
		                	}	
						 ]
        },                
		"setHasCheckBoxDataprovider": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"hascheckboxdataprovider",
							"type": "string"
		                	}	
						 ]
        },
		"setCallBackInfo": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"callbackfunction",
							"type": "function"
		                	},
		                	{                                                                 
							"name":"param",
							"type": "string"
		                	}
						 ]
        },
		"setCheckBoxValueDataprovider": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"checkboxvaluedataprovider",
							"type": "string"
		                	}	
						 ]
        },
		"setMethodToCallOnCheckBoxChange": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"callbackfunction",
							"type": "function"
		                	},
		                	{                                                                 
							"name":"param",
							"type": "string"
		                	}
						 ]
        },
		"setToolTipTextDataprovider": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"tooltiptextdataprovider",
							"type": "string"
		                	}	
						 ]
        },
        "setImageURLDataprovider": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"imageurldataprovider",
							"type": "string"
		                	}	
						 ]
        },
        "setChildSortDataprovider": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"childsortdataprovider",
							"type": "string"
		                	}	
						 ]
        },        
		"setMethodToCallOnDoubleClick": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"callbackfunction",
							"type": "function"
		                	},
		                	{                                                                 
							"name":"param",
							"type": "string"
		                	}
						 ]
        },
		"setSelectionPath": {
			"parameters":[
							{                                                                 
							"name":"pk",
							"type": "object[]"
		                	}
						 ]						 
        },
		"getSelectionPath": {
			"returns": "object[]"
        },
		"createRelationInfo": {
			"parameters":[
							{                                                                 
							"name":"label",
							"type": "string"
		                	},
							{                                                                 
							"name":"nRelationInfo",
							"type": "string"
		                	}
						 ],
			"returns": "relationInfo"
		},
		"setNRelationInfos": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"relationInfos",
							"type": "relationInfo[]"
		                	}
						 ]
		}
	},
	"types": {
	  "callback": {
	  		"f": "function",
	  		"param": "string"
	  },
	  "binding": {
	  		"datasource": "string",
	  		"textdataprovider": "string",
	  		"nrelationname": "string",
	  		"hascheckboxdataprovider": "string",
	  		"checkboxvaluedataprovider": "string",
	  		"tooltiptextdataprovider": "string",
	  		"imageurldataprovider": "string",
	  		"childsortdataprovider": "string",
	  		"callbackinfo": "callback",
	  		"methodToCallOnCheckBoxChange": "callback",
	  		"methodToCallOnDoubleClick": "callback",
			"nRelationInfos": "relationInfo[]"
	  },
	  "levelVisibilityType": {
	  		"level": "int",
	  		"state": "boolean"
	  },
	  "relationInfo": {
		  	"label": "string",
			"nRelationName": "string"
	  }
	}
}