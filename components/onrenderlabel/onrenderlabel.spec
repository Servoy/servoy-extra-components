{
	"name": "servoyextra-onrenderlabel",
	"displayName": "OnRender Label",
	"categoryName": "Buttons & Text",
	"version": 1,
	"icon": "servoyextra/onrenderlabel/label.png",
	"definition": "servoyextra/onrenderlabel/onrenderlabel.js",
	"doc": "servoyextra/onrenderlabel/onrenderlabel_doc.js",
	"deprecated": "Set the 'styleClassExpression' property on the DataLabel component from the Bootstrap Components package.",
	"replacement": "bootstrapcomponents-datalabel",
	"libraries": [{"name":"onrenderlabel-css", "version":"1.0", "url":"servoyextra/onrenderlabel/onrenderlabel.css", "mimetype":"text/css"}],
	"model":
	{
	        "dataProviderID" : { "type":"dataprovider", "tags": { "wizard": true, "scope": "design", "main": true}, "displayTagsPropertyName" : "displaysTags"}, 
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