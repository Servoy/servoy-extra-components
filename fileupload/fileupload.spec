{
	"name": "servoyextra-fileupload",
	"displayName": "File upload",
	"version": 1,
	"icon": "servoyextra/fileupload/fileupload.png",
	"definition": "servoyextra/fileupload/fileupload.js",
	"libraries": [{"name":"fileupload.css", "version":"1", "url":"servoyextra/fileupload/fileupload.css", "mimetype":"text/css"}, {"name":"font-awesome.css", "version":"4.6.3", "url":"servoyextra/fileupload/lib/font-awesome.min.css", "mimetype":"text/css", "group":false}],
	"model":
	{
	        "dataProviderID" : { "type":"dataprovider", "pushToServer": "allow", "tags": { "scope": "design", "typeName": "mediaDataprovider" }, "ondatachange": { "onchange":"onDataChangeMethodID"}, "displayTagsPropertyName" : "displaysTags"},
					"displaysTags" : { "type" : "boolean", "tags": { "scope" : "design" } },
	        "enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["onActionMethodID","onDoubleClickMethodID","onRightClickMethodID"] }, 
	        "location" : "point", 
	        "size" : {"type" :"dimension",  "default" : {"width":80, "height":20}}, 
	        "styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }, "values" :[]}, 
	        "styleClassExpression" : { "type" :"dataprovider", "tags": { "scope" :"design" }}, 
					"toolTipText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags" },
					"uploadText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "Drop a file here or click to upload"},  
					"uploadProgressText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "Uploading click to cancel"},  
					"uploadSuccessText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "Successfully uploaded"},  
					"uploadCancelText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "Upload canceled"},  
					"uploadNotSupportedText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "File Drag/Drop is not supported for this browser"}, 
					"resultDisplayTimeout": { "type": "int", "default": 2000 },
	        "visible" : "visible" 
	},
	"handlers":
	{
	        "onDataChangeMethodID" : {
	          "returns": "boolean", 
	         	
	        	"parameters":[
								{
						          "name":"oldValue",
								  "type":"${dataproviderType}"
								}, 
								{
						          "name":"newValue",
								  "type":"${dataproviderType}"
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
	}
	 
}