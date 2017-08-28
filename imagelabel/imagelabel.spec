{
	"name": "servoyextra-imagelabel",
	"displayName": "Image Label",
	"definition": "servoyextra/imagelabel/imagelabel.js",
	"icon": "servoyextra/onrenderlabel/label.png",
	"version": 1,
	"model":
	{
		"enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["onActionMethodID","onRightClickMethodID"] },
	    "media" : { "type" :"media", "tags": { "scope" :"design" }},
	    "styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" } },
	    "tabSeq" : {"type" :"tabseq", "tags": { "scope" :"design" }}, 
	    "visible" : "visible"
	},
	"handlers": {
		 "onActionMethodID" : {

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
	"api": {
	}
}
