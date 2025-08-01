{
	"name": "servoyextra-dbtreeview",
	"displayName": "DBTreeview",
	"categoryName": "Visualization",
	"version": 1,
	"icon": "servoyextra/dbtreeview/treeview.png",
	"definition": "servoyextra/dbtreeview/dbtreeview.js",
	"doc": "servoyextra/dbtreeview/dbtreeview_doc.js",
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
		"foundsettree" : {"type": "foundsettree", "default" : [], "tags": { "scope": "private" }, "pushToServer": "allow"},
		"roots": {"type":"foundsetref[]", "tags": { "scope": "private" }},
	    "bindings" : {"type":"binding[]", "tags": { "scope": "private" }},
	    "allowDrag" : {"type":"object", "tags": { "scope": "runtime", "doc": "Can be used to enable dragging of nodes. Can either be a boolean value or a clientfunction that is executed in browser. Default value is false." }},
	    "allowDrop" : {"type":"object", "tags": { "scope": "runtime", "doc": "Can be used to enable dropping of nodes. Can either be a boolean value or a clientfunction that is executed in browser. Default value is false." }},
	    "visible" : {"type":"boolean", "default":true},
		"enabled" : {"type":"boolean", "default":true},
		"autoRefresh": {"type":"boolean", "default":true, "tags": { "doc" :"If true, component listens to foundset changes and updates itself while visible."}},
	    "selection" : {"type":"object[]", "tags": { "scope": "private" }},
	    "levelVisibility" : {"type":"levelVisibilityType", "tags": { "scope": "private" }, "pushToServer": "shallow"},
		"responsiveHeight": { "type": "int", "default": 0, "tags": { "doc" :"Height of the treeview, set only in responsive forms."} },
		"isInitialized": { "type": "boolean", "default":false, "tags": {"scope" : "private", "allowaccess": "enabled"}, "pushToServer": "allow"},
		"showLoadingIndicator": {"type": "boolean", "default": true},
		"styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }, "values" :[]},
		"actions": {"type":"action[]", "tags": { "scope": "private" }}
	},
	"handlers": {
		      	"onReady": {
		      	"parameters":[
      						{
      						"name":"event",
      						"type":"JSEvent"
      						}
      			]},
      			"onDrop": {
                    "doc": "Called when a node is dropped as a result of a drag-n-drop",
                    "parameters": [{
                        "name": "sourceNodePkPath",
                        "type": "string[]"
                    }, {
                        "name": "targetNodePkPath",
                        "type": "string[]"
                    }, {
                        "name": "indexInParent",
                        "type": "int"
                    }, {
                        "name": "event",
                        "type": "JSEvent"
                    }]
                },
				"onRowDrop": {
					"doc": "Called when an ng grid row is dropped as a result of a drag-n-drop",
					"parameters": [{
						"name": "sourceRows",
						"type": "object[]",
						"doc": "an Array of plain objects if dragged from a power grid, or JSRecord objects if from a data grid"
					}, {
						"name": "targetNodePkPath",
						"type": "string[]"
					}, {
						"name": "event",
						"type": "JSDNDEvent"
					}]
				}
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
        "getRoots": {
        	"returns": "foundsetRef[]"
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
        "setActionsCallBack": {
        	"parameters":[
        					{
        					"name": "actions",
        					"type": "action[]"
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
        },
        "setCheckBoxAutoselectsChildren": {
            "parameters":[
                            {                                                                 
                            "name":"datasource",
                            "type": "string"
                            },
                            {                                                                 
                            "name":"autoselect",
                            "type": "boolean"
                            }   
                         ]
        }				
	},
	"internalApi" : {
        "setSelectionPathClientSide" : {
                "parameters" : [{"name": "idarray", "type": "string[]"}]
        },
        "isNodeExpandedClientSide": {
            "parameters":[
                            {                                                                 
                            "name":"idarray",
                            "type": "string[]"
                            }
                         ],
            "returns": "boolean"
        },
        "setExpandNodeClientSide": {
            "parameters":[
                            {                                                                 
                            "name":"idarray",
                            "type": "string[]"
                            },
                            {                                                                 
                            "name":"state",
                            "type": "boolean"
                            }                           
                         ]
        },
        "updateCheckBoxValuesForTree": {
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
        "onShow" : {},
		"onHide" : {}
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
	  "action": {
	  		"datasource": "string",
	  		"callbackfunction": "function",
	  		"param": "string",
	  		"name": "string"
	  },
	  "JSDNDEvent" : {
			"extends" : "JSEvent",
			"model":{
				"sourceGridName": {"type" : "string"},
				"sourceColumnId": {"type" : "string"}
			}
	  }
	}
}