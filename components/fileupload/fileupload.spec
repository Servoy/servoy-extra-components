{
	"name": "servoyextra-fileupload",
	"displayName": "File upload",
	"categoryName": "Media",
	"version": 1,
	"icon": "servoyextra/fileupload/fileupload.png",
	"definition": "servoyextra/fileupload/fileupload.js",
	"doc": "servoyextra/fileupload/fileupload_doc.js",
	"libraries": [
		{"name":"fileupload.css", "version":"1", "url":"servoyextra/fileupload/fileupload.css", "mimetype":"text/css"}
	],
	"keywords": ["transfer"],
	"model":
	{
	        "dataProviderID" 			: { "type" : "dataprovider", "pushToServer": "allow", "tags": { "wizard": true, "scope": "design", "typeName": "mediaDataprovider", "basic": true }, "ondatachange": { "onchange":"onDataChangeMethodID"}, "displayTagsPropertyName" : "displaysTags"},
			"displaysTags" 				: { "type" : "boolean", "tags": { "scope" : "design" } },
	        "enabled" 					: { "type" : "enabled", "blockingOn": false, "default": true, "for": ["onActionMethodID","onDoubleClickMethodID","onRightClickMethodID"] }, 
	        "location" 					: { "type" : "point" }, 
	        "size" 						: { "type" : "dimension",  "default" : {"width":80, "height":20} }, 
	        "accept"					: { "type" : "string", "default": "*/*", "tags": { "doc" :"Html accept attribute - defines accepted files to be uploaded. Default is all files."} },
	        "styleClass" 				: { "type" : "styleclass", "tags": { "scope" :"design" }, "values" :[] }, 
	        "styleClassExpression" 		: { "type" : "dataprovider", "tags": { "scope" :"design" }}, 
	        "iconStyleClass" 			: { "type" : "styleclass", "tags": { "scope" :"design" }, "default": "fa fa-upload fa-3x", "values" :[]}, 
	        "successIconStyleClass" 	: { "type" : "styleclass", "tags": { "scope" :"design" }, "default": "fa fa-check fa-3x", "values" :[]}, 
			"showFileName" 				: { "type" : "boolean", "default": true },
            "showProgress" 				: { "type" : "boolean", "default": true },
            "multiFileUpload"           : { "type" : "boolean", "default": false},
			"maxFileSize" 				: { "type" : "long", "tags": { "doc" :"Maximum file size in bytes."} },
			"toolTipText" 				: { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags" },
			"uploadText" 				: { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "Drop a file here or click to upload"},  
			"uploadProgressText" 		: { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "Uploading click to cancel"},  
			"uploadSuccessText" 		: { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "Successfully uploaded"},  
			"uploadCancelText" 			: { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "Upload canceled"},  
            "uploadNotSupportedText" 	: { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "File Drag/Drop is not supported for this browser"},
            "uploadNotSupportedFileText": { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags", "default" : "File type is not supported for upload"},
			"resultDisplayTimeout"		: { "type" : "int", "default": 2000, "tags": { "doc" :"The result of an upload will be displayed for this amount of time (in milliseconds) before being cleared. After the timeout expires, the upload component will revert to it's initial display state. If set to -1, it will not automatically clear the upload result."}  },
	        "visible" 					: { "type" : "visible" }
	},
	"handlers":
	{
	        "onDataChangeMethodID" : {
	          "returns": "boolean", 
	        		"parameters": [
								{ "name": "oldValue", "type" : "${dataproviderType}" }, 
								{ "name": "newValue", "type" : "${dataproviderType}" }, 
								{ "name": "event", "type" : "JSEvent" } 
							 ]
            },
            "onFileUploadedMethodID" : {
                "parameters": [
                    {"name": "jsUpload", "type": "JSUpload"}
                ]
            },
            "onFileTransferFinishedMethodID" : {
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