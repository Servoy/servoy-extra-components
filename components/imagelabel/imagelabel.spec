{
	"name": "servoyextra-imagelabel",
	"displayName": "Image Label",
	"categoryName": "Media",
	"definition": "servoyextra/imagelabel/imagelabel.js",
	"doc": "servoyextra/imagelabel/imagelabel_doc.js",
	"icon": "servoyextra/imagelabel/label.png",
	"version": 1,
	"keywords": [],
	"libraries": [
		{"name":"imagelabel.css", "version":"1.0.0", "url":"servoyextra/imagelabel/imagelabel.css", "mimetype":"text/css"}
	],
	"model":
	{
		"enabled" : { "type": "enabled", "blockingOn": false, "default": true, "for": ["onActionMethodID","onRightClickMethodID"] },
	    "media" : { "type" :"media", "tags": { "scope" :"design", "basic": true }},
	    "styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" } },
	    "tabSeq" : {"type" :"tabseq", "tags": { "scope" :"design" }}, 
	    "visible" : "visible",
	    "centerImage": {"type":"boolean", "default": false}
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
