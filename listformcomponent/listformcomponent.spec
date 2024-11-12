{
	"name": "servoyextra-listformcomponent",
	"displayName": "List FormComponent Container",
	"version": 1,
	"icon": "servoyextra/listformcomponent/listformcomponent.png",
	"definition": "servoyextra/listformcomponent/listformcomponent.js", 
	"libraries": [],
	"deprecated" : "true",
	"replacement": "servoycore-listformcomponent",	
	"model":
	{
		"foundset" : {"type": "foundset", "default" : {"foundsetSelector":""}},
		"containedForm": {"type":"formcomponent", "forFoundset":"foundset", "tags": { "scope" :"design" }},
		"pageLayout" : {"type" : "string" , "values" : ["cardview","listview"] , "initialValue" : "cardview" },
		"responsivePageSize": {"type": "foundsetInitialPreferredViewportSize", "for": "foundset"},
		"styleClass" : { "type" :"styleclass", "tags": { "scope" :"design" }, "default": "svy-listformcomponent" },
		"selectionClass": { "type": "styleclass", "tags": { "scope" :"design" }}
	},
	"handlers" : {
		"onSelectionChanged": {
			"doc": "Called after the foundset selection changed",
			"parameters": [{
				"name": "event",
				"type": "JSEvent"
			}]
		}
	}
}