{
	"name": "servoyextra-table",
	"displayName": "Table",
	"categoryName": "Grids",
	"version": 1,
	"icon": "servoyextra/table/table.png",
	"definition": "servoyextra/table/table.js",
	"doc": "servoyextra/table/table_doc.js",
	"serverscript": "servoyextra/table/table_server.js",
	"libraries": [{ "name": "servoyextra-table-css", "version": "1.0", "url": "servoyextra/table/table.css", "mimetype": "text/css" }, { "name": "colResizable", "version": "1.7", "url": "servoyextra/table/js/colResizable-1.7.js", "mimetype": "text/javascript" },
	{ "name": "servoyextra-table-mobileview-css", "version": "1.0", "url": "servoyextra/table/mobileview.css", "mimetype": "text/css" }],
	"keywords": ["row", "column"],
	"model": {
		"columns": { "type": "column[]", "droppable": true, "pushToServer": "shallow", "elementConfig": { "pushToServer": "shallow" }, "tags": { "wizard": "autoshow","allowaccess": "visible" } },
		"currentPage": { "type": "int", "default": 1, "tags": { "scope": "runtime" }, "pushToServer": "shallow" },
		"foundset": { "type": "foundset", "default" : {"foundsetSelector":""}, "pushToServer": "allow", "initialPreferredViewPortSize": 130, "sendSelectionViewportInitially": true },
		"pageSize": { "type": "int", "default": 20, "tags": { "doc" :"Number of rows per page, 0 means infinite scrolling mode." } },
		"styleClass": { "type": "styleclass", "tags": { "scope": "design" }, "default": "table", "values": ["table", "table-striped", "table-bordered", "table-hover", "table-condensed"] },
		"sortStyleClass": { "type": "styleclass", "default": "selected-column " },
		"selectionClass": { "type": "styleclass", "default": "table-servoyextra-selected " },
		"rowStyleClassDataprovider": { "type": "dataprovider", "forFoundset": "foundset" },
		"tabSeq": { "type": "tabseq", "tags": { "scope": "design" } },
		"visible": "visible",
		"enableColumnResize": { "type": "boolean", "default": false },
		"enableSort": { "type": "boolean", "default": true },
		"responsiveHeight": { "type": "int", "default": 300, "tags": { "doc" :"Height of the table, set only in responsive forms."} },
		"responsiveDynamicHeight": { "type": "boolean", "default": false, "tags": { "doc" :"When is set, the height is defined by the number of rows; if the calculated height exceeds 'responsiveHeight', then the later will be used as height."} },
		"minRowHeight": { "type": "string", "default": "25px","tags": { "scope": "design" } },
		"sortupClass": { "type": "styleclass", "default": "table-servoyextra-sort-up " },
		"sortdownClass": { "type": "styleclass", "default": "table-servoyextra-sort-down " },
		"sortColumnIndex": { "type": "int", "default": -1, "tags": { "scope": "runtime" }, "pushToServer": "shallow" },
		"sortDirection": { "type": "string", "tags": { "scope": "runtime" }, "pushToServer": "shallow" },
		"lastSelectionFirstElement": { "type": "int", "default": -1, "tags": { "scope": "private", "allowaccess": "visible" }, "pushToServer": "shallow" },
		"performanceSettings" : { "type": "settings", "tags": { "scope": "design","doc" :"Settings for incremental scrolling, see github wiki for more details." } },
		"keyCodeSettings" : { "type": "keyCodeSettings", "tags": { "scope": "design", "doc" :"Enable/Disable key bindings." } },
		"horizontalScrollbar" : {"type": "string", "values": [{"DEFAULT": null}, {"NEVER":"NEVER"}], "tags": {"doc": "By default horizontal scrollbar is shown as needed. Setting to NEVER will always hide it."}},
		"enableMobileView" : {"type" : "boolean"}
	},
	"types": {
		"column": {
			"dataprovider": { "type": "dataprovider", "forFoundset": "foundset", "resolveValuelist" : true, "tags": { "wizard": "1", "useAsCaptionInDeveloper" : true, "captionPriority" : 2 }},
			"format": { "for": ["valuelist", "dataprovider"], "type": "format" },
			"headerStyleClass": { "type": "styleclass" },
			"headerText": { "type": "tagstring", "tags": {"wizard": "4", "useAsCaptionInDeveloper" : true, "captionPriority" : 1, "showInOutlineView": true }},
			"styleClass": { "type": "styleclass","tags": {"wizard": {"order": "3", "values": [{"name": "Pencil icon", "cls": "fa fa-pencil"}, {"name": "Trash icon", "cls": "fa fa-trash"}, {"name": "Eye icon", "cls": "fa fa-eye"}, {"name": "Gear icon", "cls": "fa fa-gear"}] }} },
			"styleClassDataprovider": { "type": "dataprovider", "forFoundset": "foundset",  "tags": {"wizard": "2"} },
			"valuelist": { "type": "valuelist", "for": "dataprovider", "forFoundset": "foundset" },
			"width": { "type": "string", "default": "auto"},
			"initialWidth": { "type": "string", "tags": { "scope": "runtime" } },
			"autoResize": { "type": "boolean", "default": false },
			"showAs": { "type": "string", "default": "text", "values": ["text", "html", "sanitizedHtml"] },
			"id" : {"type": "string", "tags": {"wizard": {"prefill" : "dataprovider", "unique": true}, "doc": "Used to identify the column in cell event handlers, because column index can change if columns are added/removed at runtime."}}
		},
		"settings": {
			"minBatchSizeForRenderingMoreRows" : { "type": "int", "default": 10 }, 
			"minBatchSizeForLoadingMoreRows" : { "type": "int", "default": 20 },
			"maxRenderedRows" : { "type": "int", "default": 450 }, 
			"maxLoadedRows" : { "type": "int", "default": 1000 },
			"fastScrollRenderThresholdFactor" : { "type": "int", "default": 3.0 }, 
			"fastScrollLoadThresholdFactor" : { "type": "int", "default": 2.3 }
		},
		"keyCodeSettings": {
			"pageUp" : { "type": "boolean", "default": true },
			"pageDown" : { "type": "boolean", "default": true },
			"arrowUp" : { "type": "boolean", "default": true },
			"arrowDown" : { "type": "boolean", "default": true },
			"home" : { "type": "boolean", "default": true },
			"end" : { "type": "boolean", "default": true },
			"enter" : { "type": "boolean", "default": true }
		}
	},
	"handlers": {
		"onViewPortChanged":{
		"parameters": [{
				"name": "start",
				"type": "int"
			},{
				"name": "end",
				"type": "int"
			}]
		},	
		"onCellClick": {
			"doc": "Called when the mouse is clicked on a row/cell (foundset and column indexes are given) or\nwhen the ENTER key is used then only the selected foundset index is given\nUse the record to exactly match where the user clicked on",
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
			}, {
				"name": "columnid",
				"type": "string",
				"optional": true
			}]
		},
		"onCellDoubleClick": {
			"doc": "Called when the mouse is double clicked on a row/cell (foundset and column indexes are given)",
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
			}, {
				"name": "columnid",
				"type": "string",
				"optional": true
			}]
		},
		"onCellRightClick": {
			"doc": "Called when the right mouse button is clicked on a row/cell (foundset and column indexes are given) or\nwhen the ENTER key is used then only the selected foundset index is given\nUse the record to exactly match where the user clicked on",
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
			}, {
				"name": "columnid",
				"type": "string",
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
			}, {
				"name": "columnid",
				"type": "string",
				"optional": true
			}],
			"returns": "string"
		},
		"onHeaderRightClick": {
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
			}, {
				"name": "columnid",
				"type": "string",
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
	 	"setSelectedHeader": {
	         "parameters": [{
	           "name": "columnIndex",
	           "type": "int"
	         }]
	     },
		 "getViewPortPosition": {
	            "returns": "object"
	     },
	     "getSortClass": {
	       "parameters": [{"name": "columnIndex", "type": "int"}],
	       "returns": "string"
	     },
		"requestFocus": {
			"parameters": [{
				"name": "mustExecuteOnFocusGainedMethod",
				"type": "boolean",
				"optional": true
			}],

			"delayUntilFormLoads": true,
			"discardPreviouslyQueuedSimilarCalls": true
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
