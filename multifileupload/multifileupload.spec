{
    "name": "servoyextra-multifileupload",
    "displayName": "MultiFile Upload",
    "categoryName": "Media",
    "version": 1,
    "icon": "servoyextra/multifileupload/multifileupload.png",
    "definition": "servoyextra/multifileupload/multifileupload.js",
    "doc": "servoyextra/multifileupload/multifileupload_doc.js",
    "libraries": [
        { "name": "style.min.css", "version": "2.1.2", "url": "servoyextra/multifileupload/lib/style.min.css", "mimetype": "text/css" },
        { "name": "dashboard-style.min.css", "version": "2.1.1", "url": "servoyextra/multifileupload/lib/dashboard/style.min.css", "mimetype": "text/css" },
        { "name": "drag-drop-style.min.css", "version": "2.0.4", "url": "servoyextra/multifileupload/lib/drag-drop/style.min.css", "mimetype": "text/css" },
        { "name": "webcam-style.min.css", "version": "2.0.4", "url": "servoyextra/multifileupload/lib/webcam/style.min.css", "mimetype": "text/css" },
        { "name": "screen-capture-style.min.css", "version": "2.0.4", "url": "servoyextra/multifileupload/lib/screen-capture/style.min.css", "mimetype": "text/css" },
        { "name": "uppy.min.js", "version": "2.1.2", "url": "servoyextra/multifileupload/lib/svyextra-multifileupload-bundle.js", "mimetype": "text/javascript" },
        { "name": "multifileupload.css", "version": "1.0", "url": "servoyextra/multifileupload/multifileupload.css", "mimetype": "text/css" }
    ],
    "keywords": ["multiple"],
    "model": {
        "autoProceed": 					{ "type": "boolean", "default": false, "tags": { "doc": "By default the component will wait for an upload button to be pressed in the UI, or the upload() method to be called, before starting an upload. Setting this to autoProceed: true will start uploading automatically after the first file is selected."} },
        "allowMultipleUploads": 		{ "type": "boolean", "default": true },
        "hideUploadButton": 			{ "type": "boolean", "default": false, "tags": { "doc": "Hide the upload button. Use this if you are providing a custom upload button somewhere, and using the upload() API." } },
        "disableStatusBar": 			{ "type": "boolean", "default": false, "tags": { "doc": "Whether to show upload progress and pause/resume/cancel buttons." } },
        "visible": 						{ "type": "visible", "default": true },
        "restrictions": 				{ "type": "uploadRestriction", "tags": { "doc": "Provide rules and conditions to limit the type and/or number of files that can be selected." } },
        "inline": 						{ "type": "boolean", "default": true, "tags": { "doc": "When false, the component does not show on the form, but in a modal that is shown when openModal() is called" } },
        "note": 						{ "type": "tagstring" },
        "closeAfterFinish": 			{ "type": "boolean", "default": false, "tags": { "doc": "Whether to automatically close the modal when all current uploads are complete."} },
        "sources": 						{ "type": "string[]", "elementConfig": { "values": ["Webcam", "ScreenCapture"], "default": "Webcam" }, "tags": { "doc": "Allows to add additional sources of files (other than the user's file system)" } },
        "metaFields": 					{ "type": "metaField[]", "tags": { "doc": "An array of UI field objects that will be shown when a user clicks the 'edit' button on that file" } },
        "language": 					{ "type": "string", "default": null, "values": ["English", "Spanish", "German", "French", "Dutch", "Italian", "Chinese", "Czech", "Danish", "Finnish", "Greek", "Hungarian", "Japanese", "Persian", "Russian", "Swedish", "Turkish"], "tags": { "doc": "One of the language packs shipped. If you need to provide your own translations, use the localeStrings property."} },
        "localeStrings":				{ "type": "map", "tags": { "doc": "Any number of key/value pairs to translate single strings in the component, overriding the ones provided by the language pack selected." } }, 
        "size": 						{ "type": "dimension", "default": { "width": 290, "height": 450 } },
        "options": 						{ "type": "map" },
        "tusOptions":                   { "type": "map", "tags": { "scope" : "design" , "doc":"Look at the Uppy TUS options what you can set here like chunkSize: nrOfBytes"}  },
        "webcamOptions":                { "type": "json", "default" : { "target" : "Dashboard", "showVideoSourceDropdown": true } ,"tags": { "scope" : "design" , "doc":"Look at the Uppy webcam plugin options what you can set here like showVideoSourceDropdown"}  }
    },
    "api": {
        "reset": {
            "delayUntilFormLoads": true,
            "parameters": []
        },
        "initialize": {
            "delayUntilFormLoads": true,
            "parameters": []
        },
        "openModal": {
            "delayUntilFormLoads": true,
            "parameters": []
        },
        "closeModal": {
            "delayUntilFormLoads": true,
            "parameters": []
        },
        "upload": {
            "delayUntilFormLoads": true,
            "parameters": []
        },
        "retryAll": {
            "delayUntilFormLoads": true,
            "parameters": []
        },
        "cancelAll": {
            "delayUntilFormLoads": true,
            "parameters": []
        },
        "retryUpload": {
            "delayUntilFormLoads": true,
            "parameters": [
            	{"name": "fileID", "type": "string"
            }]
        },
        "info": {
            "delayUntilFormLoads": true,
            "parameters": [
                {"name": "message", "type": "object"},
                {"name": "type", "type": "string"},
                {"name": "duration", "type": "int"}
            ]
        },
        "getFiles": {
            "delayUntilFormLoads": true,
            "returns": "uploadFile[]",
            "parameters": []
        },
        "getFile": {
            "delayUntilFormLoads": true,
            "returns": "uploadFile",
            "parameters": [
            	{"name": "fileID", "type": "string"
          	}]
        },
        "removeFile": {
            "delayUntilFormLoads": true,
            "parameters": [
            	{"name": "fileID", "type": "string"
            }]
        }
    },
    "handlers": {
        "onFileUploaded": {
        	"parameters": [
            	{"name": "jsUpload", "type": "JSUpload"}
        ]},
        "onFileAdded": {
        	"parameters": [
        		{"name": "fileAdded", "type": "uploadFile"}
        ]},
        "onBeforeFileAdded": {
            "returns": "boolean",
            "parameters": [
                {"name": "fileToAdd", "type": "uploadFile"},
                {"name": "files", "type": "uploadFile[]"}
            ]
        },
        "onFileRemoved": {
        	"parameters": [
        		{"name": "fileRemoved", "type": "uploadFile"}
        ]},
        "onUploadComplete": {
        	"parameters": [
	            {"name": "successfulFiles","type": "uploadFile[]"},
	            {"name": "failedFiles", "type": "uploadFile[]"}
        ]},
        "onModalOpened": {
        	"parameters": []
        },
        "onModalClosed": {
        	"parameters": []
        },
        "onRestrictionFailed": {
        	"parameters": [
	            {"name": "file", "type": "uploadFile"},
	            {"name": "error", "type": "string"}
        ]}
    },
    "types": {
        "uploadRestriction": {
            "maxFileSize": 			{"type": "long", "default": null},
            "maxNumberOfFiles": 	{"type": "int", "default": null},
            "minNumberOfFiles": 	{"type": "int", "default": null},
            "allowedFileTypes": 	{"type": "string[]"}
        },
        "metaField": {
            "id": 					{"type": "string"},
            "name": 				{"type": "string"},
            "placeholder": 			{"type": "tagstring"}
        },
        "uploadFile": {
            "id": 					{"type": "string"},
            "name": 				{"type": "string"},
            "extension": 			{"type": "string"},
            "type": 				{"type": "string"},
            "size": 				{"type": "int"},
            "metaFields": 			{"type": "object"},
            "progress": 			{"type": "progress"},
            "error": 				{"type": "string"}
        },
        "progress": {
            "bytesTotal": 			{"type": "int"},
            "bytesUploaded": 		{"type": "int"},
            "percentage": 			{"type": "int"},
            "uploadComplete": 		{"type": "boolean"},
            "uploadStarted": 		{"type": "int"}
        }
    }
}