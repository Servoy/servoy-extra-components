{
	"name": "servoyextra-table",
	"displayName": "Table",
	"version": 1,
	"icon": "servoycore/portal/portal.gif",
	"definition": "servoyextra/table/table.js",
	"serverscript": "servoyextra/table/table_server.js",
	"libraries": [{ "name": "servoyextra-table-css", "version": "1.0", "url": "servoyextra/table/table.css", "mimetype": "text/css" }, { "name": "colResizable", "version": "1.7", "url": "servoyextra/table/js/colResizable-1.7.js", "mimetype": "text/javascript" }],
	"model": {
		"columns": { "type": "column[]", "droppable": true, "pushToServer": "shallow", "elementConfig": { "pushToServer": "shallow" } },
		"currentPage": { "type": "int", "default": 1, "tags": { "scope": "runtime" }, "pushToServer": "shallow" },
		"foundset": { "type": "foundset","default" : {"foundsetSelector":""} , "pushToServer": "allow", "initialPreferredViewPortSize": 130, "sendSelectionViewportInitially": true },
		"pageSize": { "type": "int", "default": 20 },
		"styleClass": { "type": "styleclass", "tags": { "scope": "design" }, "default": "table", "values": ["table", "table-striped", "table-bordered", "table-hover", "table-condensed"] },
		"selectionClass": { "type": "styleclass", "default": "table-servoyextra-selected " },
		"rowStyleClassDataprovider": { "type": "dataprovider", "forFoundset": "foundset" },
		"tabSeq": { "type": "tabseq", "tags": { "scope": "design" } },
		"visible": "visible",
		"enableColumnResize": { "type": "boolean", "default": false },
		"enableSort": { "type": "boolean", "default": true },
		"responsiveHeight": { "type": "int", "default": 300 },
		"minRowHeight": { "type": "string", "default": "25px","tags": { "scope": "design" } },
		"sortupClass": { "type": "styleclass", "default": "table-servoyextra-sort-up " },
		"sortdownClass": { "type": "styleclass", "default": "table-servoyextra-sort-down " },
		"sortColumnIndex": { "type": "int", "default": -1, "tags": { "scope": "runtime" }, "pushToServer": "shallow" },
		"sortDirection": { "type": "string", "tags": { "scope": "runtime" }, "pushToServer": "shallow" },
		"lastSelectionFirstElement": { "type": "int", "default": -1, "tags": { "scope": "private" }, "pushToServer": "shallow" },
		"performanceSettings" : { "type": "settings", "tags": { "scope": "design" } }
	},
	"types": {
		"column": {
			"dataprovider": { "type": "dataprovider", "forFoundset": "foundset" },
			"format": { "for": ["valuelist", "dataprovider"], "type": "format" },
			"headerStyleClass": { "type": "styleclass" },
			"headerText": { "type": "tagstring", "initialValue": "header", "tags": { "showInOutlineView": true } },
			"styleClass": { "type": "styleclass" },
			"styleClassDataprovider": { "type": "dataprovider", "forFoundset": "foundset" },
			"valuelist": { "type": "valuelist", "for": "dataprovider" },
			"width": { "type": "string" },
			"initialWidth": { "type": "string", "tags": { "scope": "runtime" } },
			"autoResize": { "type": "boolean", "default": false }
		},
		"settings": {
			"minBatchSizeForRenderingMoreRows" : { "type": "int", "default": 10 }, 
			"minBatchSizeForLoadingMoreRows" : { "type": "int", "default": 20 },
			"maxRenderedRows" : { "type": "int", "default": 450 }, 
			"maxLoadedRows" : { "type": "int", "default": 1000 },
			"fastScrollRenderThresholdFactor" : { "type": "int", "default": 3.0 }, 
			"fastScrollLoadThresholdFactor" : { "type": "int", "default": 2.3 }
		}
	},
	"handlers": {
		"onCellClick": {
			"description": "Called when the mouse is clicked on a row/cell (foundset and column indexes are given) or\nwhen the ENTER key is used then only the selected foundset index is given\nUse the record to exactly match where the user clicked on",
			"parameters": [{
				"name": "foundsetindex",
				"type": "int"
			}, {
				"name": "columnindex",
				"type": "int",
				"optional": true
			}, {
				"name": "record",
				"type": "record",
				"optional": true
			}, {
				"name": "event",
				"type": "JSEvent",
				"optional": true
			}]
		},
		"onCellRightClick": {
			"description": "Called when the right mouse button is clicked on a row/cell (foundset and column indexes are given) or\nwhen the ENTER key is used then only the selected foundset index is given\nUse the record to exactly match where the user clicked on",
			"parameters": [{
				"name": "foundsetindex",
				"type": "int"
			}, {
				"name": "columnindex",
				"type": "int",
				"optional": true
			}, {
				"name": "record",
				"type": "record",
				"optional": true
			}, {
				"name": "event",
				"type": "JSEvent",
				"optional": true
			}]
		},
		"onHeaderClick": {
			"parameters": [{
				"name": "columnindex",
				"type": "int"
			}, {
				"name": "sortdirection",
				"type": "string"
			}, {
				"name": "event",
				"type": "JSEvent",
				"optional": true
			}],
			"returns": "string"
		},
		"onColumnResize": {
			"parameters": [{
				"name": "event",
				"type": "JSEvent",
				"optional": true
			}]
		},
		"onFocusGainedMethodID": {

			"parameters": [{
				"name": "event",
				"type": "JSEvent"
			}]
		},
		"onFocusLostMethodID": {

			"parameters": [{
				"name": "event",
				"type": "JSEvent"
			}]
		}
	},
	"api": {
		"requestFocus": {
			"parameters": [{
				"name": "mustExecuteOnFocusGainedMethod",
				"type": "boolean",
				"optional": true
			}],

			"delayUntilFormLoad": true,
			"globalExclusive": true
		},
		 "getColumnsCount": {
	            "returns": "int"
	     },
	     "getColumn": {
		      "parameters": [{
					"name": "index",
					"type": "int"
				}],
	            "returns": "column"
	     },
	     "newColumn": {
		      "parameters": [{
		      		"name": "dataprovider",
					"type": "string"
		      	},{
					"name": "index",
					"type": "int",
					"optional": true
				}],
	            "returns": "column"
	     },
	     "removeColumn": {
		      "parameters": [{
					"name": "index",
					"type": "int"
				}],
	            "returns": "boolean"
	     },
	     "removeAllColumns": {
	            "returns": "boolean"
	     }
	}
}
