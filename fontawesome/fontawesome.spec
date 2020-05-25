{
	"name": "servoyextra-fontawesome",
	"displayName": "Font-awesome",
	"categoryName": "Buttons & Text",
	"version": 1,
	"icon": "servoyextra/fontawesome/fontawesome.gif",
	"definition": "servoyextra/fontawesome/fontawesome.js",
	"libraries": [{"name":"fontawesome-custom.css", "version":"1.0.0", "url":"servoyextra/fontawesome/fontawesome.css", "mimetype":"text/css"}],
	"keywords": ['style', 'styling'],
	"model":
	{
		"faclass"      	: {"type":"string", "default": "fa", "tags": { "doc": "Example 'fas fa-search' <br/>If you want to use Font Awesome classes you need to enable the Font Awesome service from the Servoy Package Manager. "}},
		"enabled" 		: {"type": "enabled", "blockingOn": false, "default": true, "for": ["dataProviderID","onActionMethodID"] },
		"styleclass"   	: {"type": "styleclass"},
		"size" 			: {"type":"dimension",  "default" : {"width":25, "height":25}},
		"toolTipText" : { "type" : "tagstring"}, 
		"visible" 		: "visible",
		"alignment" : {"type":"string" , "tags": { "scope" :"design" }, "default" : "text",  "values" :["center", "center-horizontally", "center-vertically"]}
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