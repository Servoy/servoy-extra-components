{
	"name": "servoyextra-listformcomponent",
	"displayName": "List FormComponent Container",
	"version": 1,
	"icon": "servoyextra/listformcomponent/listformcomponent.png",
	"definition": "servoyextra/listformcomponent/listformcomponent.js", 
	"libraries": [],	
	"model":
	{
		"foundset" : {"type": "foundset", "tags": { "scope" :"design" }},
		"containedForm": {"type":"formcomponent", "forFoundset":"foundset", "tags": { "scope" :"design" }},
		"responsivePageSize": "int"
	}
}