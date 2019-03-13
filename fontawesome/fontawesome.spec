{
	"name": "servoyextra-fontawesome",
	"displayName": "Font-awesome",
	"version": 1,
	"icon": "servoyextra/fontawesome/fontawesome.gif",
	"definition": "servoyextra/fontawesome/fontawesome.js",
	"libraries": [{"name":"fontawesome-custom.css", "version":"1.0.0", "url":"servoyextra/fontawesome/fontawesome.css", "mimetype":"text/css"}],
	"model":
	{
		"faclass"      	: {"type":"string", "tags": { "scope" :"design" }},
		"enabled" 		: {"type": "enabled", "blockingOn": false, "default": true, "for": ["dataProviderID","onActionMethodID"] },
		"styleclass"   	: {"type": "styleclass"},
		"size" 			: {"type":"dimension",  "default" : {"width":25, "height":25}},
		"toolTipText" : { "type" : "tagstring"}, 
		"visible" 		: "visible"
	}, "handlers":
	{
		"onActionMethodID": {"parameters":[
								{
						          "name":"event",
								  "type":"JSEvent"
								} 
							 ]}, 
	    "onDoubleClickMethodID" : {"parameters":[
									{
						          		"name":"event",
								  		"type":"JSEvent"
									} 
							 		]}, 
	    "onRightClickMethodID" : {"parameters":[
									{
						          		"name":"event",
								  		"type":"JSEvent"
									}
							 	]} 
	}
}