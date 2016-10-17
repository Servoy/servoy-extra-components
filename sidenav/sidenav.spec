{
	"name": "servoyextra-sidenav",
	"displayName": "sidenav",
	"version": 1,
	"definition": "servoyextra/sidenav/sidenav.js",
	"libraries": [{"name":"svy-sidenav.css", "version":"1", "url":"servoyextra/sidenav/svy-sidenav.css", "mimetype":"text/css"}],
	"model":
	{
		"menu"					: {"type" :"menuItem[]", "default" : [], "pushToServer": "deep", "tags": { "scope" :"runtime" }},
		"selectedIndex"					: {"type" :"object", "tags": { "scope" :"private" }, "pushToServer" : "allow"},
		
		"verticalAlignment"				: {"type" :"string", "tags": {"scope": "design"},"values": [{"FIXED-TOP": "navbar-fixed-top"}, {"FIXED-BOTTOM": "navbar-fixed-bottom"}, {"STATIC": "navbar-static-top"}], "default" : "navbar-static-top"},
		
		"openMenuOnHover"				: {"type" :"boolean", "default" : true, "tags": { "scope" :"design" }},
		"styleClass"					: {"type" :"styleclass", "tags": { "scope" :"design" }},
		
		"styleClassSelectedMenu"		: {"type" :"styleclass", "tags": { "scope" :"design" }},
		"styleClassMenuItem"			: {"type" :"styleclass", "tags": { "scope" :"design" }},
		"styleClassSelectedMenuItem"	: {"type" :"styleclass", "tags": { "scope" :"design" }},
		"brandingTemplate"				: {"type" :"tagstring", "tags": { "scope" :"design" }, "default" : ""},
		
		"size" 							: {"type" :"dimension",  "default" : {"width":260, "height":300}},
		"location" 						: "point", 
		"visible"						: "visible"
	},
	
	"handlers":
	{
	        "onMenuItemSelected" 		: {
										        "parameters" : [
										            { "name" : "event", "type" : "JSEvent" },
										            { "name" : "menuItem", "type" : "menuItem" }
										        ]
										  },
			"onMenuItemExpanded" 		: {
										        "parameters" : [
										            { "name" : "event", "type" : "JSEvent" },
										            { "name" : "menuItem", "type" : "menuItem" }
										        ]
										  },
			"onMenuItemCollapsed" 		: {
										        "parameters" : [
										            { "name" : "event", "type" : "JSEvent" },
										            { "name" : "menuItem", "type" : "menuItem" }
										        ]
										  }
	},
	"api":
	{
		"getSelectedMenuItem": 
		{
			"parameters": 
			[
				{	"name": "level",	"type": "int" }
			],
			"returns" : "object"
		},
		"setSelectedById": 
		{
			"parameters": 
			[
				{	"name": "id",	"type": "string" },
				{	"name": "level", "type": "int", "optional" : true},
				{	"name": "mustExecuteOnMenuItemSelected", "type": "boolan", "optional" : true}
			],
			"returns" : "boolean"
		},
		"setSelectedByIndexPath": 
		{
			"parameters": 
			[
				{	"name": "selectedNodePath",	"type": "object[]" },
				{	"name": "mustExecuteOnMenuItemSelected", "type": "boolan", "optional" : true}
			],
			"returns" : "boolean"
		},
		
		"setMenuItemsByIndexPath" :{
			"parameters":[
				{
					"name": "indexNodePath",	
					"type": "array"
				},
				{
					"name": "menuItems",	
					"type": "menuItem[]"
				}
			],
			"returns" : "boolean"
		},
		
		"setMenuItemsById" :{
			"parameters":[
				{
					"name": "id",	
					"type": "string"
				},
				{
					"name": "menuItems",	
					"type": "menuItem[]"
				}
			],
			"returns" : "boolean"
		},
		"clearMenuItems" : {
			"parameters":[
				{
					"name": "deep",	
					"type": "int"
				}]
		}
	},
	"types": {
    	"menuItem": {
      		"id"					: "string",
      		"text"					: "tagstring",
      		"icon"					: "media",
      		"iconStyleClass"		: "styleclass",
      		"enabled"				: "boolean",
      		
      		"data"					: "object",
      		"menuItems"				: "menuItem[]",
      		"isDivider"				: "boolean",
      		
      		"selected"				: "boolean"
    	}
	}
}