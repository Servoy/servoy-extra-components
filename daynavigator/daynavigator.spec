{
	"name": "servoyextra-daynavigator",
	"displayName": "Day navigator",
	"version": 1,
	"definition": "servoyextra/daynavigator/daynavigator.js",
    "libraries": [{ "name": "daynavigator.css", "version": "1.0", "url": "servoyextra/daynavigator/daynavigator.css", "mimetype": "text/css" }, {"name":"bootstrap-datepaginator.css", "version":"1", "url":"servoyextra/daynavigator/lib/bootstrap-datepaginator.css", "mimetype":"text/css"}, {"name":"bootstrap-datepaginator.js", "version":"1", "url":"servoyextra/daynavigator/lib/bootstrap-datepaginator.js", "mimetype":"text/javascript"}],
	"model":
	{
		"selectedDate": "date",
		"visible": "visible"
	},
	"handlers" :
	{
		"onChange": {
			"description": "Called when the day is changed",
			"parameters": [{
				"name": "date",
				"type": "date"
			}]
		}
	}
}