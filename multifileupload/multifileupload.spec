{
    "name": "servoyextra-multifileupload",
    "displayName": "MultiFile Upload",
    "categoryName": "Media",
    "version": 1,
    "icon": "servoyextra/multifileupload/multifileupload.png",
    "definition": "servoyextra/multifileupload/multifileupload.js",
    "libraries": [
        { "name": "style.min.css", "version": "1.3.0", "url": "servoyextra/multifileupload/lib/style.min.css", "mimetype": "text/css" },
        { "name": "dashboard-style.min.css", "version": "1.3.0", "url": "servoyextra/multifileupload/lib/dashboard/dashboard-style.min.css", "mimetype": "text/css" },
        { "name": "drag-drop-style.min.css", "version": "1.3.0", "url": "servoyextra/multifileupload/lib/drag-drop/drag-drop-style.min.css", "mimetype": "text/css" },
        { "name": "webcam-style.min.css", "version": "1.3.0", "url": "servoyextra/multifileupload/lib/webcam/webcam-style.min.css", "mimetype": "text/css" },
        { "name": "uppy.min.js", "version": "1.4.0", "url": "servoyextra/multifileupload/lib/svyextra-multifileupload-bundle.js", "mimetype": "text/javascript" },
        { "name": "multifileupload.css", "version": "1.0", "url": "servoyextra/multifileupload/multifileupload.css", "mimetype": "text/css" }
    ],
    "keywords": ["multiple"],
    "model": {
        "autoProceed": 					{ "type": "boolean", "default": false },
        "allowMultipleUploads": 		{ "type": "boolean", "default": true },
        "hideUploadButton": 			{ "type": "boolean", "default": false },
        "disableStatusBar": 			{ "type": "boolean", "default": false },
        "visible": 						{ "type": "visible", "default": true },
        "restrictions": 				{ "type": "uploadRestriction" },
        "inline": 						{ "type": "boolean", "default": true },
        "note": 						{ "type": "tagstring" },
        "closeAfterFinish": 			{ "type": "boolean", "default": false },
        "sources": 						{ "type": "string[]", "elementConfig": { "values": [{"Webcam": "Webcam"}], "default": "Webcam" } },
        "metaFields": 					{ "type": "metaField[]" },
        "language": 					{ "type": "string", "default": null, "values": ["English", "Spanish", "German", "French", "Dutch", "Italian", "Chinese", "Czech", "Danish", "Finnish", "Greek", "Hungarian", "Japanese", "Persian", "Russian", "Swedish", "Turkish"] },
        "localeStrings":				{ "type": "map" }, 
        "size": 						{ "type": "dimension", "default": { "width": 290, "height": 450 } },
        "options": 						{ "type": "map" }
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
            	{"name": "jsUpload", "type": "object"}
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
            "maxFileSize": 			{"type": "int", "default": null},
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
            "uploadStarted": 		{"type": "date"}
        }
    }
}