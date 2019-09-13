{
    "name": "servoyextra-multifileupload",
    "displayName": "MultiFile Upload",
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
        "language": 					{ "type": "string", "default": "English", "values": ["English", "Spanish", "German", "French", "Dutch", "Italian"] },
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
        },
        "uppyLocale": {
			"addMore" : {"type": "string", "default": "Add more"},		
			"addMoreFiles" : {"type": "string", "default": "Add more files"},		
			"addingMoreFiles" : {"type": "string", "default": "Adding more files"},		
			"allowAccessDescription" : {"type": "string", "default": "In order to take pictures or record video with your camera, please allow camera access for this site."},		
			"allowAccessTitle" : {"type": "string", "default": "Please allow access to your camera"},		
			"authenticateWith" : {"type": "string", "default": "Connect to %{pluginName}"},		
			"authenticateWithTitle" : {"type": "string", "default": "Please authenticate with %{pluginName} to select files"},		
			"back" : {"type": "string", "default": "Back"},		
			"browse" : {"type": "string", "default": "browse"},		
			"cancel" : {"type": "string", "default": "Cancel"},		
			"cancelUpload" : {"type": "string", "default": "Cancel upload"},		
			"chooseFiles" : {"type": "string", "default": "Choose files"},		
			"closeModal" : {"type": "string", "default": "Close Modal"},		
			"companionAuthError" : {"type": "string", "default": "Authorization required"},		
			"companionError" : {"type": "string", "default": "Connection with Companion failed"},		
			"complete" : {"type": "string", "default": "Complete"},		
			"connectedToInternet" : {"type": "string", "default": "Connected to the Internet"},		
			"copyLink" : {"type": "string", "default": "Copy link"},		
			"copyLinkToClipboardFallback" : {"type": "string", "default": "Copy the URL below"},		
			"copyLinkToClipboardSuccess" : {"type": "string", "default": "Link copied to clipboard"},		
			"creatingAssembly" : {"type": "string", "default": "Preparing upload..."},		
			"creatingAssemblyFailed" : {"type": "string", "default": "Transloadit: Could not create Assembly"},		
			"dashboardTitle" : {"type": "string", "default": "File Uploader"},		
			"dashboardWindowTitle" : {"type": "string", "default": "File Uploader Window (Press escape to close)"},		
			"dataUploadedOfTotal" : {"type": "string", "default": "%{complete} of %{total}"},		
			"done" : {"type": "string", "default": "Done"},		
			"dropHereOr" : {"type": "string", "default": "Drop files here or %{browse}"},		
			"dropHint" : {"type": "string", "default": "Drop your files here"},		
			"dropPaste" : {"type": "string", "default": "Drop files here, paste or %{browse}"},		
			"dropPasteImport" : {"type": "string", "default": "Drop files here, paste, %{browse} or import from"},		
			"edit" : {"type": "string", "default": "Edit"},		
			"editFile" : {"type": "string", "default": "Edit file"},		
			"editing" : {"type": "string", "default": "Editing %{file}"},		
			"emptyFolderAdded" : {"type": "string", "default": "No files were added from empty folder"},		
			"encoding" : {"type": "string", "default": "Encoding..."},		
			"enterCorrectUrl" : {"type": "string", "default": "Incorrect URL: Please make sure you are entering a direct link to a file"},		
			"enterUrlToImport" : {"type": "string", "default": "Enter URL to import a file"},		
			"exceedsSize" : {"type": "string", "default": "This file exceeds maximum allowed size of"},		
			"failedToFetch" : {"type": "string", "default": "Companion failed to fetch this URL, please make sure it’s correct"},		
			"failedToUpload" : {"type": "string", "default": "Failed to upload %{file}"},		
			"fileSource" : {"type": "string", "default": "File source: %{name}"},		
			"filesUploadedOfTotal.0" : {"type": "string", "default": "%{complete} of %{smart_count} file uploaded"},		
			"filesUploadedOfTotal.1" : {"type": "string", "default": "%{complete} of %{smart_count} files uploaded"},		
			"filesUploadedOfTotal.2" : {"type": "string", "default": "%{complete} of %{smart_count} files uploaded"},		
			"filter" : {"type": "string", "default": "Filter"},		
			"finishEditingFile" : {"type": "string", "default": "Finish editing file"},		
			"folderAdded.0" : {"type": "string", "default": "Added %{smart_count} file from %{folder}"},		
			"folderAdded.1" : {"type": "string", "default": "Added %{smart_count} files from %{folder}"},		
			"folderAdded.2" : {"type": "string", "default": "Added %{smart_count} files from %{folder}"},		
			"import" : {"type": "string", "default": "Import"},		
			"importFrom" : {"type": "string", "default": "Import from %{name}"},		
			"link" : {"type": "string", "default": "Link"},		
			"loading" : {"type": "string", "default": "Loading..."},		
			"logOut" : {"type": "string", "default": "Log out"},		
			"myDevice" : {"type": "string", "default": "My Device"},		
			"noFilesFound" : {"type": "string", "default": "You have no files or folders here"},		
			"noInternetConnection" : {"type": "string", "default": "No Internet connection"},		
			"openFolderNamed" : {"type": "string", "default": "Open folder %{name}"},		
			"pause" : {"type": "string", "default": "Pause"},		
			"pauseUpload" : {"type": "string", "default": "Pause upload"},		
			"paused" : {"type": "string", "default": "Paused"},		
			"poweredBy" : {"type": "string", "default": "Powered by"},		
			"preparingUpload" : {"type": "string", "default": "Preparing upload..."},		
			"processingXFiles.0" : {"type": "string", "default": "Processing %{smart_count} file"},		
			"processingXFiles.1" : {"type": "string", "default": "Processing %{smart_count} files"},		
			"processingXFiles.2" : {"type": "string", "default": "Processing %{smart_count} files"},		
			"removeFile" : {"type": "string", "default": "Remove file"},		
			"resetFilter" : {"type": "string", "default": "Reset filter"},		
			"resume" : {"type": "string", "default": "Resume"},		
			"resumeUpload" : {"type": "string", "default": "Resume upload"},		
			"retry" : {"type": "string", "default": "Retry"},		
			"retryUpload" : {"type": "string", "default": "Retry upload"},		
			"saveChanges" : {"type": "string", "default": "Save changes"},		
			"selectAllFilesFromFolderNamed" : {"type": "string", "default": "Select all files from folder %{name}"},		
			"selectFileNamed" : {"type": "string", "default": "Select file %{name}"},		
			"selectX.0" : {"type": "string", "default": "Select %{smart_count}"},		
			"selectX.1" : {"type": "string", "default": "Select %{smart_count}"},		
			"selectX.2" : {"type": "string", "default": "Select %{smart_count}"},		
			"smile" : {"type": "string", "default": "Smile!"},		
			"startRecording" : {"type": "string", "default": "Begin video recording"},		
			"stopRecording" : {"type": "string", "default": "Stop video recording"},		
			"takePicture" : {"type": "string", "default": "Take a picture"},		
			"timedOut" : {"type": "string", "default": "Upload stalled for %{seconds} seconds, aborting."},		
			"unselectAllFilesFromFolderNamed" : {"type": "string", "default": "Unselect all files from folder %{name}"},		
			"unselectFileNamed" : {"type": "string", "default": "Unselect file %{name}"},		
			"upload" : {"type": "string", "default": "Upload"},		
			"uploadComplete" : {"type": "string", "default": "Upload complete"},		
			"uploadFailed" : {"type": "string", "default": "Upload failed"},		
			"uploadPaused" : {"type": "string", "default": "Upload paused"},		
			"uploadXFiles.0" : {"type": "string", "default": "Upload %{smart_count} file"},		
			"uploadXFiles.1" : {"type": "string", "default": "Upload %{smart_count} files"},		
			"uploadXFiles.2" : {"type": "string", "default": "Upload %{smart_count} files"},		
			"uploadXNewFiles.0" : {"type": "string", "default": "Upload +%{smart_count} file"},		
			"uploadXNewFiles.1" : {"type": "string", "default": "Upload +%{smart_count} files"},		
			"uploadXNewFiles.2" : {"type": "string", "default": "Upload +%{smart_count} files"},		
			"uploading" : {"type": "string", "default": "Uploading"},		
			"uploadingXFiles.0" : {"type": "string", "default": "Uploading %{smart_count} file"},		
			"uploadingXFiles.1" : {"type": "string", "default": "Uploading %{smart_count} files"},		
			"uploadingXFiles.2" : {"type": "string", "default": "Uploading %{smart_count} files"},		
			"xFilesSelected.0" : {"type": "string", "default": "%{smart_count} file selected"},		
			"xFilesSelected.1" : {"type": "string", "default": "%{smart_count} files selected"},		
			"xFilesSelected.2" : {"type": "string", "default": "%{smart_count} files selected"},		
			"xMoreFilesAdded.0" : {"type": "string", "default": "%{smart_count} more file added"},		
			"xMoreFilesAdded.1" : {"type": "string", "default": "%{smart_count} more files added"},		
			"xMoreFilesAdded.2" : {"type": "string", "default": "%{smart_count} more files added"},		
			"xTimeLeft" : {"type": "string", "default": "%{time} left"},		
			"youCanOnlyUploadFileTypes" : {"type": "string", "default": "You can only upload: %{types}"},		
			"youCanOnlyUploadX.0" : {"type": "string", "default": "You can only upload %{smart_count} file"},		
			"youCanOnlyUploadX.1" : {"type": "string", "default": "You can only upload %{smart_count} files"},		
			"youCanOnlyUploadX.2" : {"type": "string", "default": "You can only upload %{smart_count} files"},		
			"youHaveToAtLeastSelectX.0" : {"type": "string", "default": "You have to select at least %{smart_count} file"},		
			"youHaveToAtLeastSelectX.1" : {"type": "string", "default": "You have to select at least %{smart_count} files"},		
			"youHaveToAtLeastSelectX.2" : {"type": "string", "default": "You have to select at least %{smart_count} files"}
        }
    }
}