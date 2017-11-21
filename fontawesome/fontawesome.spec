{
	"name": "servoyextra-fontawesome",
	"displayName": "Font-awesome",
	"version": 1,
	"icon": "servoyextra/fontawesome/fontawesome.gif",
	"definition": "servoyextra/fontawesome/fontawesome.js",
	"libraries": [{"name":"font-awesome.css", "version":"4.7.0", "url":"servoyextra/fontawesome/lib/font-awesome.min.css", "mimetype":"text/css", "group":false},
				  {"name":"fontawesome-custom.css", "version":"1.0.0", "url":"servoyextra/fontawesome/fontawesome.css", "mimetype":"text/css"}],
	"model":
	{
		"faclass"      	: {"type":"string", "tags": { "scope" :"design" }},
		"enabled" 		: {"type": "enabled", "blockingOn": false, "default": true, "for": ["dataProviderID","onActionMethodID"] },
		"styleclass"   	: {"type": "styleclass", "tags": { "scope" :"design" }},
		"size" 			: {"type":"dimension",  "default" : {"width":25, "height":25}}, 
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