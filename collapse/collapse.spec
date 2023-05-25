{
	"name": "servoyextra-collapse",
	"displayName": "Collapse",
	"categoryName": "Form Containers",
	"version": 1,
	"icon": "servoyextra/collapse/collapse.png",
	"definition": "servoyextra/collapse/collapse.js",
	"doc": "servoyextra/collapse/collapse_doc.js",
	"serverscript": "servoyextra/collapse/collapse_server.js",
	"libraries": [
		{"name":"svy-collapse.css", "version":"1.0.0", "url":"servoyextra/collapse/svy-collapse.css", "mimetype":"text/css"},
		{"name":"bootstrap", "version":"3.4.1", "url":"servoyextra/lib/js/bootstrap.min.js", "mimetype":"text/javascript"}
	],
	"keywords": [],
	"model":
	{
		"collapsibles"			: { "type": "collapsible[]", "droppable": true, "pushToServer": "shallow", "tags": {"wizard": "autoshow"} },
		"accordionMode"			: { "type": "boolean", "default": true },
		"expandedIndices"		: { "type": "int[]", "tags": { "scope": "design" } },
		"styleClass"			: { "type": "styleclass" },
		"tabSeq" : {"type" :"tabseq", "tags": { "scope" :"design" }}
	},
	"api": 
	{
		"createCollapsible"	: { 
			"returns" 	: "collapsible", 
			"parameters": [ 
				{ "name": "headerHtml", "type": "string", "optional": true }, 
				{ "name": "collapsibleId", "type": "string", "optional": true }
			] 
		},
		"createCard"		: { 
			"returns" 	: "card", 
			"parameters": [ 
				{ "name": "textOrHtml", "type": "string", "optional": true }, 
				{ "name": "cardId", "type": "string", "optional": true },
				{ "name": "styleClass", "type": "string", "optional": true }
			] 
		},
		"getCard"			: {
			"returns"	: "card",
			"parameters": [ 
				{ "name": "index", "type": "int" }, 
				{ "name": "collapsibleIndex", "type": "int", "optional": true }
			] 
		},
		"getCardById"		: {
			"returns"		: "card",
			"parameters": [ 
				{ "name": "cardId", "type": "string" }
			] 
		},
		"addCollapsible"	: { 
			"parameters": [ 
				{ "name": "collapsible", "type": "collapsible" }, 
				{ "name": "index", "type": "int", "optional": true }
			] 
		},
		"getCollapsible"	: { 
			"parameters": [ 
				{ "name": "index", "type": "int" }
			] 
		},
		"getCollapsibleById": { 
			"parameters": [ 
				{ "name": "collapsibleId", "type": "string" }
			] 
		},
		"removeCollapsibleById": {
			"returns" 	: "boolean",
			"parameters": [ 
				{ "name": "collapsibleId", "type": "string" }
			] 
		},
		"removeCollapsibleAt"	: { 
			"returns" 	: "boolean",
			"parameters": [ 
				{ "name": "index", "type": "int" }
			] 
		},
		"removeAllCollapsibles": {
			"returns" 	: "boolean"
		},
		"isCollapsed"	: { 
			"parameters": [ 
				{ "name": "index", "type": "int", "optional": true }
			] 
		},
		"setCollapsibles"	: { 
			"parameters": [ 
				{ "name": "collapsibles", "type": "collapsible[]" }
			] 
		},
		"toggle"			: { 
			"async": true,
			"delayUntilFormLoads": true,
			"parameters": [ 
				{ "name": "index", "type": "int", "optional": true } 
			] 
		},
		"show"				: { 
			"async": true,
			"delayUntilFormLoads": true,
			"parameters": [ 
				{ "name": "index", "type": "int", "optional": true } 
			] 
		},
		"hide"				: { 
			"async": true,
			"delayUntilFormLoads": true,
			"parameters": [ 
				{ "name": "index", "type": "int", "optional": true } 
			] 
		}
	},
	"handlers": 
	{
		"onCollapsibleShown"	: 
			{ "parameters": [
					{ "name": "event", "type": "JSEvent" },
					{ "name": "collapsible", "type": "collapsible" },
					{ "name": "collapsibleIndex", "type": "int" }
				] 
			},
		"onCollapsibleHidden"	: 
			{ "parameters": [
					{ "name": "event", "type": "JSEvent" },
					{ "name": "collapsible", "type": "collapsible" },
					{ "name": "collapsibleIndex", "type": "int" }
				] 
			},
		"onHeaderClicked"	:
			{ "returns" : "boolean",
			  "parameters": [
			  		{ "name": "event", "type": "JSEvent" },
					{ "name": "collapsible", "type": "collapsible" }, 
					{ "name": "collapsibleIndex", "type": "int" },
					{ "name": "dataTarget", "type": "string" }
			    ]
			},
		"onCardClicked"			: 
			{ "parameters": [
					{ "name": "event", "type": "JSEvent" },
					{ "name": "card", "type": "card" }, 
					{ "name": "collapsible", "type": "collapsible" }, 
					{ "name": "cardIndex", "type": "int" }, 
					{ "name": "collapsibleIndex", "type": "int" }, 
					{ "name": "dataTarget", "type": "string" }
				]
			},
		"onHeaderDoubleClicked"		:
			{ "returns": "boolean", 
			  "parameters": [
					{ "name": "event", "type": "JSEvent" },
					{ "name": "collapsible", "type": "collapsible" }, 
					{ "name": "collapsibleIndex", "type": "int" },
					{ "name": "dataTarget", "type": "string" }
			  ]
			}
	},
	"types": 
	{
		"card" : {
			"cardId"						: { "type": "string" },
			"contentHtml" 					: { "type": "tagstring" },
			"form" 							: { "type": "form", "default": "" },
			"minResponsiveHeight"			: { "type": "int", "default": null },
			"maxResponsiveHeight"			: { "type": "int", "default": null },
			"styleClass"					: { "type": "styleclass" }
		},
		"collapsible" : {
			"collapsibleId"					: { "type": "string" },
			"isCollapsed" 					: { "type": "boolean", "tags": { "scope": "private" }, "default": true },
			"headerHtml" 					: { "type": "tagstring", "default": "" },
			"headerStyleClass" 				: { "type": "styleclass", "default": "" },
			"bodyStyleClass"				: { "type": "styleclass" },
			"collapsibleHtml" 				: { "type": "tagstring", "default": "" },
            "form" 							: { "type": "form", "default": "", "tags": {"wizard": {"order": "1", "wizardRelated": "relationName"}}},
            "relationName"                  : { "type":"relation", "tags": {"wizard": "2"}},
			"cards"							: { "type": "card[]" },
			"styleClass"					: { "type": "styleclass", "default": "" },
			"collapsedIconName"				: { "type": "string", "default": "fa fa-2x fa-angle-down" },
            "expandedIconName"				: { "type": "string", "default": "fa fa-2x fa-angle-up" },
            "iconLocation"                  : { "type": "string", "values":["LEFT", "RIGHT", "HIDDEN"], "default": "RIGHT"}, 
			"minResponsiveHeight"			: { "type": "int", "default": null },
			"maxResponsiveHeight"			: { "type": "int", "default": null }
		}
	}
}