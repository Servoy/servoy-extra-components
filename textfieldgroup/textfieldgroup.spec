{
	"name": "servoyextra-textfieldgroup",
	"displayName": "Textbox Group",
	"categoryName": "Input Control",
	"version": 1,
	"icon": "servoyextra/textfieldgroup/textbox_group.png",
	"definition": "servoyextra/textfieldgroup/textfieldgroup.js",
	"doc": "servoyextra/textfieldgroup/textfieldgroup_doc.js",
	"libraries": [{"name":"textboxgroup.css", "version":"1", "url":"servoyextra/textfieldgroup/textfieldgroup.css", "mimetype":"text/css"}],
	"keywords": [],
	"model":
	{
			"dataProviderID" : { "type":"dataprovider", "pushToServer": "allow","tags": { "scope" :"design" }, "ondatachange": { "onchange":"onDataChangeMethodID"}},
			"enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["dataProviderID","onActionMethodID","onDataChangeMethodID","onFocusGainedMethodID","onFocusLostMethodID","onRightClickMethodID"] },
			"format" : {"for":["dataProviderID"] , "type" :"format"}, 
			"faclass" : {"type":"string"},
			"inputType" : {"type":"string" , "tags": { "scope" :"design" }, "default" : "text",  "values" :["text", "password"]},
			"inputValidation" : {"type":"string", "default" : "text",  "values" :["none", "email"]},
			"invalidEmailMessage" : { "type": "tagstring", "default" : "This is an invalid email address" },
			"readOnly" : { "type": "protected", "blockingOn": true, "default": false,"for": ["dataProviderID","onDataChangeMethodID"] },
			"placeholderText" : "tagstring",
			"styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }, "default": "form-control", "values" :["form-control", "input-sm"]},
			"tabSeq" : {"type" :"tabseq", "tags": { "scope" :"design" }},
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
		"isValid": {
	            "returns": "boolean"
	     },
	     "requestFocus" : {
	     	"parameters":[
								{
						          "name":"mustExecuteOnFocusGainedMethod",
								  "type":"boolean",
								  "optional": true
								}
							 ]
	     }
	}

}