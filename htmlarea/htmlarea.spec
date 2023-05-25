{
	"name": "servoyextra-htmlarea",
	"displayName": "Html Area",
	"categoryName": "Input Control",
	"version": 1,
	"icon": "servoyextra/htmlarea/html_area.png",
	"definition": "servoyextra/htmlarea/htmlarea.js",
	"doc": "servoyextra/htmlarea/htmlarea_doc.js",
	"libraries": [{"name":"tinymce", "version":"5.7.0", "url":"servoyextra/htmlarea/lib/tinymce/tinymce.min.js", "mimetype":"text/javascript", "group":false},{"name":"ui-tinymce", "version":"1", "url":"servoyextra/htmlarea/lib/ui-tinymce.js", "mimetype":"text/javascript"}],
	"ng2Config": {
       "assets": [{
                "glob" : "tinymce.min.js",
                "input" : "node_modules/tinymce",
                "output": "/tinymce/"
            },
            {
                "glob" : "plugins/*/plugin.min.js",
                "input" : "node_modules/tinymce",
                "output": "/tinymce/"
            },
            {
                "glob" : "themes/*/theme.min.js",
                "input" : "node_modules/tinymce",
                "output": "/tinymce/"
            },
            {
                "glob" : "models/*/model.min.js",
                "input" : "node_modules/tinymce",
                "output": "/tinymce/"
            },
            {
                "glob" : "skins/**",
                "input" : "node_modules/tinymce",
                "output": "/tinymce/"
            },
            {
                "glob" : "icons/*/icons.min.js",
                "input" : "node_modules/tinymce",
                "output": "/tinymce/"
            },
            {
                "glob" : "**/*",
                "input" : "node_modules/tinymce-i18n/langs",
                "output": "/tinymce/langs"
            },
            {
                "glob" : "**/*",
                "input" : "node_modules/tinymce-i18n/langs5",
                "output": "/tinymce/langs5"
            }
        ]
    },
	"model":
	{
	        "dataProviderID" : { "type":"dataprovider", "pushToServer": "allow", "tags": { "scope": "design" }, "ondatachange": { "onchange":"onDataChangeMethodID"}, "displayTagsPropertyName" : "displaysTags"}, 
	        "displaysTags" : { "type" : "boolean", "tags": { "scope" : "design" } }, 
	        "editable" : { "type": "protected", "blockingOn": false, "default": true,"for": ["dataProviderID","onDataChangeMethodID"] }, 
	        "enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["dataProviderID","onActionMethodID","onDataChangeMethodID","onFocusGainedMethodID","onFocusLostMethodID","onRightClickMethodID"] }, 
	        "findmode" : { "type":"findmode", "tags":{"scope":"private"}, "for" : {"editable":true}}, 
	        "placeholderText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags" }, 
	        "readOnly" : { "type" : "readOnly", "oppositeOf" : "editable"}, 
	        "scrollbars" : {"type" :"scrollbars", "tags": { "scope" :"design" }}, 
	        "styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }, "values" :[]}, 
	        "tabSeq" : {"type" :"tabseq", "tags": { "scope" :"design" }}, 
	        "text" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags" }, 
	        "toolTipText" : { "type" : "tagstring", "displayTagsPropertyName" : "displaysTags" }, 
	        "visible" : "visible",
			"responsiveHeight": { "type": "int", "default": 300, "tags": { "doc" :"Min height of the html editor, set only in responsive forms."} }
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
	        "getAsPlainText": {
	            "returns": "string"
	        },
	        "getScrollX": {
	            "returns": "int"
	        },
	        "getScrollY": {
	            "returns": "int"
	        },
	        "getSelectedText": {
	            "returns": "string"
	        },
	        "replaceSelectedText": {
				"parameters":[
								{                                                                 
 								"name":"s",
								"type":"string"
			                	}             
							 ],
				"returns": "string"			 
	
	        },
	        "requestFocus": {
				"parameters":[
								{                                                                 
 								"name":"mustExecuteOnFocusGainedMethod",
								"type":"boolean",
			            		"optional":true
			            		}             
							 ],
				"delayUntilFormLoads": true,
			"discardPreviouslyQueuedSimilarCalls": true

	        },
	        "selectAll": {
				"delayUntilFormLoads": true,
			"discardPreviouslyQueuedSimilarCalls": true

	        },
	        "setScroll": {
				"parameters":[
								{                                                                 
 								"name":"x",
								"type":"int"
			                	},
             					{                                                                 
 								"name":"y",
								"type":"int"
			                	}             
							 ]
	
	        }
	}
	 
}