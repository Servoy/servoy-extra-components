{
	"name": "servoyextra-timeline",
	"displayName": "Timeline",
	"version": 1,
	"definition": "servoyextra/timeline/timeline.js",
	"serverscript": "servoyextra/timeline/timeline_server.js",
	"libraries": [{ "name": "timeline.css", "version": "1.0", "url": "servoyextra/timeline/timeline.css", "mimetype": "text/css" }],
	"model":
	{
		"data": { "type": "entry[]", "tags": {"scope" : "private"}},
		"entryStyleClassFunc": { "type": "string"},
		"entryRendererFunc": { "type": "string"},
		"visible": "visible"
	},
	"handlers" : {
		"onClick": {
			"description": "Called when the mouse is clicked on a timeline entry",
			"parameters": [{
				"name": "entry",
				"type": "entry"
			}]
		}
	}, 
	"api" : {
		"newEntry": {
			"parameters": [
				{ "name": "time", "type": {"type": "string"} }
			],
            "returns": "entry"
		},
        "clear": {
        }
	},
	"types" : {
		"entry" : {
			"subject": {"type" : "string" },
			"content" : {"type" : "string"},
			"tooltip": {"type" : "string"},
            "time": {"type" : "string"}
		}
    }
}