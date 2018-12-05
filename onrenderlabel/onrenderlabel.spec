{
	"name": "servoyextra-onrenderlabel",
	"displayName": "OnRender Label",
	"version": 1,
	"icon": "servoyextra/onrenderlabel/label.png",
	"definition": "servoyextra/onrenderlabel/onrenderlabel.js",
	"libraries": [],
	"model":
	{
	        "dataProviderID" : { "type":"dataprovider", "tags": { "scope": "design", "main": true}, "displayTagsPropertyName" : "displaysTags"}, 
	        "displaysTags" : { "type" : "boolean", "tags": { "scope" : "design" } }, 
	        "enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["onActionMethodID","onDoubleClickMethodID","onRightClickMethodID"] }, 
	        "format" : { "type" :"format", "for":["dataProviderID"]}, 
	        "location" : {"type": "point", "pushToServer": "deep"}, 
	        "size" : {"type" :"dimension",  "default" : {"width":80, "height":20}, "pushToServer": "deep"}, 
	        "styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }, "values" :[]}, 
	        "styleClassExpression" : { "type" :"dataprovider", "tags": { "scope" :"design" }}, 
	        "toolTipText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags" }, 
	        "visible" : "visible" 
	},
	"handlers":
	{
	        "onActionMethodID" : {
	         	
	        	"parameters":[
								{
						          "name":"event",
								  "type":"JSEvent"
								} 
							 ]
	        }, 
	        "onDoubleClickMethodID" : {
	         	
	        	"parameters":[
								{
						          "name":"event",
								  "type":"JSEvent"
								} 
							 ]
	        }, 
	        "onRightClickMethodID" : {
	         	
	        	"parameters":[
								{
						          "name":"event",
								  "type":"JSEvent"
								} 
							 ]
	        } 
	},
	"api":
	{
	}
	 
}