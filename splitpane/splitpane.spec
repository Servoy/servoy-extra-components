{
	"name": "servoyextra-splitpane",
	"displayName": "Split Pane",
	"categoryName": "Form Containers",
	"version": 1,
	"icon": "servoyextra/splitpane/split.png",
	"definition": "servoyextra/splitpane/splitpane.js",
	"serverscript": "servoyextra/splitpane/splitpane_server.js",
	"libraries": [{"name":"bg-splitter", "version":"1", "url":"servoyextra/splitpane/bg-splitter/js/splitter.js", "mimetype":"text/javascript"},{"name":"bg-splitter", "version":"1", "url":"servoyextra/splitpane/bg-splitter/css/style.css", "mimetype":"text/css"},{"name":"splitpanecustom", "version":"1", "url":"servoyextra/splitpane/splitpanecustom.css", "mimetype":"text/css"}],
	"keywords": [],
	"model":
	{
	        "divLocation" : { "type": "double", "pushToServer": "shallow", "default": -1 }, 
	        "divSize" : { "type": "int", "default": 5 }, 
	        "enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["onChangeMethodID"] }, 
	        "pane1MinSize" : {"type":"int","default":30}, 
	        "pane2MinSize" : {"type":"int","default":30}, 
	        "readOnly" : { "type": "protected", "for": ["onChangeMethodID"] }, 
	        "resizeWeight" : {"type":"double","default":0}, 
	        "styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }, "values" :[]}, 
	        "splitType" : {"type" :"int", "tags": { "scope" :"design" }, "default":0, "values" :[{"HORIZONTAL":0}, {"VERTICAL":1}]}, 
	        "tabSeq" : {"type" :"tabseq", "tags": { "scope" :"design" }}, 
	        "panes" : {"type":"pane[]", "pushToServer": "allow", "droppable":true},
	        "visible" : "visible",
			"responsiveHeight": { "type": "int", "default": 300 }
	},
	"handlers":
	{
	        "onChangeMethodID" : {
	         	
	        	"parameters":[
								{
						          "name":"previousIndex",
								  "type":"int"
								}, 
								{
						          "name":"event",
								  "type":"JSEvent"
								} 
							 ]
	        } 
	},
	"api":
	{
	        "getDividerLocation": {
	            "returns": "double"
	        },
	        "getDividerSize": {
	            "returns": "int"
	        },
	        "getLeftForm": {
	            "returns": "formscope"
	        },
	        "getLeftFormMinSize": {
	            "returns": "int"
	        },
	        "getResizeWeight": {
	            "returns": "double"
	        },
	        "getRightForm": {
	            "returns": "formscope"
	        },
	        "getRightFormMinSize": {
	            "returns": "int"
	        },
	        "setDividerLocation": {
				"parameters":[
								{                                                                 
 								"name":"location",
								"type":"double"
			                	}             
							 ]
	
	        },
	        "setDividerSize": {
				"parameters":[
								{                                                                 
 								"name":"size",
								"type":"int"
			                	}             
							 ]
	
	        },
	        "setLeftForm": {
	            "returns": "boolean",
				"parameters":[
								{                                                                 
 								"name":"form",
								"type":"object"
			                	},
             					{                                                                 
 								"name":"relation",
								"type":"object",
			            		"optional":true
			            		}             
							 ]
	
	        },
	        "setLeftFormMinSize": {
				"parameters":[
								{                                                                 
 								"name":"minSize",
								"type":"int"
			                	}             
							 ]
	
	        },
	        "setResizeWeight": {
				"parameters":[
								{                                                                 
 								"name":"resizeWeight",
								"type":"double"
			                	}             
							 ]
	
	        },
	        "setRightForm": {
	            "returns": "boolean",
				"parameters":[
								{                                                                 
 								"name":"form",
								"type":"object"
			                	},
             					{                                                                 
 								"name":"relation",
								"type":"object",
			            		"optional":true
			            		}             
							 ]
	
	        },
	        "setRightFormMinSize": {
				"parameters":[
								{                                                                 
 								"name":"minSize",
								"type":"int"
			                	}             
							 ]
	
	        }
	},
"types": {
  "pane": {
  		"containsFormId": "form",
  		"relationName": "relation"
  	}
}
	 
}