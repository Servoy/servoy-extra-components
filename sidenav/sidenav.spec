{
	"name": "servoyextra-sidenav",
	"displayName": "sidenav",
	"version": 1,
	"icon": "servoyextra/sidenav/bars.png",
	"definition": "servoyextra/sidenav/sidenav.js",
	"serverscript" : "servoyextra/sidenav/sidenav_server.js",
	"libraries": [{"name":"svy-sidenav.css", "version":"1", "url":"servoyextra/sidenav/svy-sidenav.css", "mimetype":"text/css"},
				  {"name":"angular-animate.js", "version":"1.6.3", "url":"servoyextra/sidenav/angular-animate.min.js", "mimetype":"text/javascript"}],
	"model":
	{
		"menu"							: {"type" :"MenuItem[]", "default" : [], "pushToServer": "allow", "tags": { "scope" :"runtime" }},
		
		"selectedIndex"					: {"type" :"object", "tags": { "scope" :"private" }, "pushToServer" : "allow"},
		"expandedIndex"					: {"type" :"object", "tags": { "scope" :"private" }, "pushToServer" : "allow"},
		
		"iconOpenStyleClass"			: {"type" :"styleclass", "tags": { "scope" :"design" }, "default": "fa fa-bars"},
		"iconCloseStyleClass"			: {"type" :"styleclass", "tags": { "scope" :"design" }, "default": "fa fa-bars"},
		"iconExpandStyleClass"			: {"type" :"styleclass", "tags": { "scope" :"design" }, "default": "fa fa-caret-right"},
		"iconCollapseStyleClass"		: {"type" :"styleclass", "tags": { "scope" :"design" }, "default": "fa fa-caret-down"},
		"styleClass"					: {"type" :"styleclass", "tags": {"scope": "design"}, "values" : ["nav-hide-toggle", "nav-side-toggle"]},
		"slidePosition"					: {"type" :"string", "tags": {"scope": "design"},"values": [{"LEFT": "left"}, {"RIGHT": "right"}, {"STATIC": "static"}], "default" : "left"},
		
		"open"							: {"type" :"boolean", "default" : true, "pushToServer": "allow"},
		"enabled"						: {"type" :"enabled", "default" : true, "blockingOn": false, "for": ["onMenuItemSelected","onMenuItemExpanded","onMenuItemCollapsed"]},
		"animate"						: {"type" :"boolean", "default" : true, "tags": { "scope" :"design" }},
		
		"size" 							: {"type" :"dimension",  "default" : {"width":260, "height":300}},
		"location" 						: "point", 
		"visible"						: "visible"
	},
	
	"handlers":
	{
	        "onMenuItemSelected" 		: {
										        "parameters" : [
										        	{ "name" : "menuItemId", "type" : "object" },
										            { "name" : "event", "type" : "JSEvent" }
										        ],
										        "returns" : "boolean"
										  },
			"onMenuItemExpanded" 		: {
										        "parameters" : [
										        	{ "name" : "menuItemId", "type" : "object" },
										            { "name" : "event", "type" : "JSEvent" }
										        ]
										  },
			"onMenuItemCollapsed" 		: {
										        "parameters" : [
										        	{ "name" : "menuItemId", "type" : "object" },
										            { "name" : "event", "type" : "JSEvent" }
										        ]
										  },
			"onOpenToggled" 			: {
										        "parameters" : [
										            { "name" : "event", "type" : "JSEvent" }
										        ]
										  }
	},
	"api":
	{
		"getMenuItem": 
		{
			"parameters": 
			[
				{	"name": "menuItemId",	"type": "object" }
			],
			"returns" : "MenuItem"
		},
		"getSelectedMenuItem": 
		{
			"parameters": 
			[
				{	"name": "level", "type": "int", "optional" : true }
			],
			"returns" : "MenuItem"
		},
		"getParentMenuItem": 
		{
			"parameters": 
			[
				{	"name": "menuItemId",	"type": "object" }
			],
			"returns" : "MenuItem"
		},
		"getRootMenuItems": 
		{
			"parameters": [],
			"returns" : "MenuItem[]"
		},
		"setRootMenuItems": 
		{
			"parameters": 
			[
				{	"name": "menuItems",	"type": "MenuItem[]" }
			]
		},
		"setSelectedMenuItem": 
		{
			"parameters": 
			[
				{	"name": "menuItemId",	"type": "object" },
				{	"name": "mustExecuteOnMenuItemSelected", "type": "boolean", "optional" : true},
				{	"name": "mustExecuteOnMenuItemExpand", "type": "boolean", "optional" : true},
				{	"name": "level", "type": "int", "optional" : true}
			],
			"returns" : "boolean"
		},
		"addMenuItem" :{
			"parameters":[
				{
					"name": "menuItem",	
					"type": "MenuItem"
				},
				{
					"name": "menuItemId",	
					"type": "object",
					"optional" : true
				},
				{
					"name": "index",
					"type" : "int",
					"optional" : true
				}
			],
			"returns" : "boolean"
		},
		"removeMenuItem" :{
			"parameters":[
				{
					"name": "menuItemId",	
					"type": "object"
				}
			],
			"returns" : "boolean"
		},
		"getSubMenuItems" :{
			"parameters":[
				{
					"name": "menuItemId",	
					"type": "object"
				}
			],
			"returns" : "MenuItem[]"
		},
		"setSubMenuItems" :{
			"parameters":[
				{
					"name": "menuItemId",	
					"type": "object"
				},
				{
					"name": "menuItems",	
					"type": "MenuItem[]"
				}
			],
			"returns" : "boolean"
		},
		"removeSubMenuItems" : {
			"parameters":[
				{
					"name": "menuItemId",	
					"type": "object"
				}
			],
			"returns" : "boolean"
		},
		"clearMenuItems" : {
			"parameters":[
				{
					"name": "depth",	
					"type": "int",
					"optional" : true
				}]
		},
		"setMenuItemEnabled": 
		{
			"parameters": 
			[
				{ "name": "menuItemId",	"type": "object" },
				{ "name": "enabled",	"type": "boolean" }
			],
			"returns" : "boolean"
		},
		"isMenuItemEnabled": 
		{
			"parameters": 
			[
				{ "name": "menuItemId",	"type": "object" }
			],
			"returns" : "boolean"
		},
		"setMenuItemExpanded": 
		{
			"parameters": 
			[
				{ "name": "menuItemId",	"type": "object" },
				{ "name": "expanded",	"type": "boolean" },
				{ "name": "mustExecuteOnMenuItemExpand", "type": "boolean", "optional" : true}
			],
			"returns" : "boolean"
		},
		"isMenuItemExpanded": 
		{
			"parameters": 
			[
				{ "name": "menuItemId",	"type": "object" }
			],
			"returns" : "boolean"
		}
	},
	"types": {
    	"MenuItem": {
      		"id"					: {"type" : "object"},
      		"text"					: {"type" : "tagstring"},
      		"iconStyleClass"		: {"type" : "styleclass"},
      		"styleClass"			: {"type" : "styleclass"},
      		"enabled"				: {"type" : "boolean", "default": true},
      		"data"					: {"type" : "object"},
      		"menuItems"				: {"type" : "MenuItem[]"},
      		"isDivider"				: {"type" : "boolean", "default": false}
    	}
	}
}
