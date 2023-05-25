{
	"name": "servoyextra-select2tokenizer",
	"displayName": "select2tokenizer",
	"categoryName": "Input Control",
	"version": "1.0.0",
	"icon": "servoyextra/select2tokenizer/tags.png",
	"definition": "servoyextra/select2tokenizer/select2tokenizer.js",
	"doc": "servoyextra/select2tokenizer/select2tokenizer_doc.js",
	"libraries": [
		{
			"name": "diacritics.js",
			"version": "1.0.0",
			"url": "servoyextra/select2tokenizer/diacritics.js",
			"mimetype": "text/javascript"
		},
		{
			"name": "select2.js",
			"version": "4.0.3",
			"url": "servoyextra/select2tokenizer/js/select2patched.full.js",
			"mimetype": "text/javascript"
		},
		{
			"name": "select2.css",
			"version": "4.0.3",
			"url": "servoyextra/select2tokenizer/css/select2.min.css",
			"mimetype": "text/css"
		},
		{
			"name": "select2-autotokenizer.css",
			"version": "1.0.0",
			"url": "servoyextra/select2tokenizer/css/select2-tokenizer.css",
			"mimetype": "text/css"
		}
	],
	"keywords": [],
	"model":
	{
		"dataProviderID": { "type":"dataprovider", "pushToServer": "allow","tags": { "scope" :"design" }, "ondatachange": { "onchange":"onDataChangeMethodID" , "callback":"onDataChangeCallback"}},
		"format" : {"for":["dataProviderID"] , "type" :"format", "tags": { "scope" :"private" }}, 
		"valuelistID": { "type" : "valuelist", "tags": {  "logWhenOverMax" : false }, "default":"autoVL" , "max" : 100}, 
		"visible" : {"type":"visible", "default":true},
        "allowNewEntries": {"type": "boolean", "default": false, "tags": {"scope" : "design"}}, 
        "closeOnSelect": {"type": "boolean", "default": true, "tags": {"scope" : "design"}}, 
        "selectOnClose": {"type": "boolean", "default": false, "tags": {"scope" : "design"}}, 
        "openOnUnselect": {"type": "boolean", "default": true, "tags": {"scope" : "design"}}, 
        "clearSearchTextOnSelect": {"type": "boolean", "default": false, "tags": {"scope" : "design"}}, 
        "containSearchText" : {"type": "boolean", "default": false, "tags": {"scope" : "design"}},
        "noMatchesFoundText": {"type": "tagstring", "default": "No matches found", "tags": {"scope" : "design"}},
        "searchingText": {"type": "tagstring", "default": "Searching…", "tags": {"scope" : "design"}},
        "tabSeq" : {"type" :"tabseq", "tags": { "scope" :"design" }}, 
        "placeholderText" : {"type": "tagstring", "default" : "Select...", "tags": {"scope" : "design"}}, 
        "toolTipText" : {"type" : "tagstring"}, 
        "styleClass" : {"type": "styleclass", "values" : ["select2-xs", "select2-sm", "select2-md", "select2-lg"], "default": "select2-sm"},
        "enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["dataProviderID","onDataChangeMethodID"] },
        "readOnly" : { "type": "protected", "blockingOn": true, "default": false,"for": ["dataProviderID","onDataChangeMethodID"], "tags": { "scope" :"runtime" } },
        "editable" : { "type": "protected", "blockingOn": false, "default": true,"for": ["dataProviderID","onDataChangeMethodID"] },
        "maximumSelectionSize": {"type": "int", "tags": { "scope" :"design" }},
        "valueSeparator" : {"type" :"string", "tags" : {"scope" :"private"}, "values" : [{"NEW_LINE":"new_line"}, {"COMMA": "comma"}], "default" : "new_line"},    
        "size" : {"type" :"dimension",  "default" : {"width":140, "height":32}}, 
        "location" : "point"

	},
	"handlers":
	{
		"onDataChangeMethodID" : {
	          "returns": "boolean", 
	         	"code": "return true",
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
		},
		"onFocusGainedMethodID" : { 	
	        "parameters":[
								{
						          "name":"event",
								  "type":"JSEvent"
								} 
							 ]
	     }, 
	    "onFocusLostMethodID" : {
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
		"requestFocus" : {
	     	"parameters":[
								{
						          "name":"mustExecuteOnFocusGainedMethod",
								  "type":"boolean",
								  "optional": true
								}
							 ],
            "delayUntilFormLoads": true,
            "discardPreviouslyQueuedSimilarCalls": true
	     }
	}
}