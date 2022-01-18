{
	"name": "servoyextra-dbtreeview",
	"displayName": "DBTreeview",
	"categoryName": "Visualization",
	"version": 1,
	"icon": "servoyextra/dbtreeview/treeview.png",
	"definition": "servoyextra/dbtreeview/dbtreeview.js",
	"serverscript": "servoyextra/dbtreeview/dbtreeview_server.js",
	"ng2Config": {
    	"dependencies": {
    	   "serverscript": "servoyextra/dbtreeview/dbtreeview_server_ng2.js"
    	}
    },
	"libraries": [{"name":"dbtreeview.css", "version":"1", "url":"servoyextra/dbtreeview/css/dbtreeview.css", "mimetype":"text/css"}],
	"keywords": ["database"],
	"model":
	{
		"foundsets" : {"type": "foundsetInfo[]", "elementConfig" : { "dynamicDataproviders": true }, "tags": { "scope": "private" }},
	    "relatedFoundsets": { "type": "foundsetInfo[]", "elementConfig" : { "dynamicDataproviders": true }, "default": [], "tags": { "scope": "private" }},
		"roots": {"type":"foundsetref[]", "tags": { "scope": "private" }},
	    "bindings" : {"type":"binding[]", "tags": { "scope": "private" }},
	    "visible" : {"type":"boolean", "default":true},
		"enabled" : {"type":"boolean", "default":true},
		"autoRefresh": {"type":"boolean", "default":true, "tags": { "doc" :"If true, component listens to foundset changes and updates itself while visible."}},
	    "selection" : {"type":"object[]", "tags": { "scope": "private" }},
	    "levelVisibility" : {"type":"levelVisibilityType", "tags": { "scope": "private" }, "pushToServer": "shallow"},
		"responsiveHeight": { "type": "int", "default": 0, "tags": { "doc" :"Height of the treeview, set only in responsive forms."} },
		"isInitialized": { "type": "boolean", "default":false, "tags": {"scope" : "private", "allowaccess": "enabled"}, "pushToServer": "allow"}
	},
	"handlers": {
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
		"setMethodToCallOnRightClick": {
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
							"name":"nRelationName",
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
		},
		"setHasCheckBoxValue": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"pks",
							"type": "string[]"
		                	}	
						 ]
        },		
		"setInitialCheckBoxValues": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"pks",
							"type": "string[]"
		                	}	
						 ]
        },
		"updateCheckBoxValues": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	},
							{                                                                 
							"name":"pks",
							"type": "string[]"
		                	},
							{                                                                 
							"name":"state",
							"type": "boolean"
		                	}								
						 ]
        },		
		"getCheckBoxValues": {
			"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "string"
		                	}
						 ],
			"returns": "string[]"
        }				
	},
	"internalApi" : {
		"loadRelatedFoundset" : {
				"parameters" : [{"name": "index", "type": "int"}]
		},
		"getCheckBoxValuesFromTree": {
			"parameters": [{"name": "datasourceID", "type": "object"}],
			"returns": "object[]"
		},
		"updateCheckBoxValuesForTree": {
						"parameters":[
							{                                                                 
							"name":"datasource",
							"type": "object"
		                	},
							{                                                                 
							"name":"pks",
							"type": "string[]"
		                	},
							{                                                                 
							"name":"state",
							"type": "boolean"
		                	}								
						 ]
		},
		"updateFoundsetRow": {
						"parameters":[
							{                                                                 
							"name":"isRoot",
							"type": "boolean"
		                	},
							{                                                                 
							"name":"fsInfoID",
							"type": "int"
		                	},
							{                                                                 
							"name":"index",
							"type": "int"
		                	},
							{
							"name":"checkboxValueDP",
							"type": "string"
		                	}, 
						    {
							"name":"value",
							"type": "object"
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
	  		"methodToCallOnRightClick": "callback",
			"nRelationInfos": "relationInfo[]",
			"hasCheckboxValue": "object[]",
			"initialCheckboxValues": "object[]"
	  },
	  "levelVisibilityType": {
	  		"level": "int",
	  		"value": "boolean"
	  },
	  "relationInfo": {
		  	"label": "string",
			"nRelationName": "string"
	  }, 
	  "foundsetInfo": { 
		  "datasourceID": "int",
		  "foundset": "foundset",
		  "foundsetpk": "string", 
		  "foundsetInfoID": "int",
		  "foundsetInfoParentID": "int",
		  "indexOfTheParentRecord": "int"
	  }
	}
}