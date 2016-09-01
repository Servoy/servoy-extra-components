{
	"name": "servoyextra-textfieldgroup",
	"displayName": "Textbox Group",
	"version": 1,
	"icon": "servoyextra/textfieldgroup/textfieldgroup.gif",
	"definition": "servoyextra/textfieldgroup/textfieldgroup.js",
	"libraries": [{"name":"textboxgroup.css", "version":"1", "url":"servoyextra/textfieldgroup/textfieldgroup.css", "mimetype":"text/css"}, {"name":"font-awesome.css", "version":"4.6.3", "url":"servoyextra/textfieldgroup/lib/font-awesome.min.css", "mimetype":"text/css"}],
	"model":
	{
			"dataProviderID" : { "type":"dataprovider", "pushToServer": "allow","tags": { "scope" :"design" }, "ondatachange": { "onchange":"onDataChangeMethodID", "callback":"onDataChangeCallback"}},
			"enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["dataProviderID","onActionMethodID","onDataChangeMethodID","onFocusGainedMethodID","onFocusLostMethodID","onRightClickMethodID"] },
			"format" : {"for":["dataProviderID"] , "type" :"format"}, 
			"faclass" : {"type":"string"},
			"inputType" : {"type":"string" , "tags": { "scope" :"design" }, "default" : "text",  "values" :["text", "password"]},
			"inputValidation" : {"type":"string", "default" : "text",  "values" :["none", "email"]},
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
	        }
	}

}