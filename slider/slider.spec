{
	"name": "servoyextra-slider",
	"displayName": "Slider",
	"version": 1,
	"definition": "servoyextra/slider/slider.js",
	"icon": "servoyextra/slider/slider.png",
	"libraries": [
		{ "name": "rzslider-css", "version": "6.4.3", "url": "servoyextra/slider/rzslider/rzslider.min.css", "mimetype": "text/css" }, 
		{ "name": "slider", "version": "1.0", "url": "servoyextra/slider/svy-slider.css", "mimetype": "text/css" }, 
		{ "name": "rzslider", "version": "6.4.3", "url": "servoyextra/slider/rzslider/rzslider.min.js", "mimetype": "text/javascript" }
	],
	"model":
	{
		"size"							: { "type": "dimension", "default": {"width": 400, "height": 70} },
		
		"dataProvider" 					: { "type": "dataprovider", "pushToServer": "allow", "ondatachange": { "onchange":"onDataChangeMethodID", "callback":"onDataChangeCallback"} },
		"dataProviderHigh" 				: { "type": "dataprovider", "pushToServer": "allow", "ondatachange": { "onchange":"onDataChangeHigh", "callback":"onDataChangeCallback"} },
		"enabled" 						: { "type": "enabled", "blockingOn": false, "default": true, "for": ["dataProvider", "dataProviderHigh", "onDataChange", "onDataChangeHigh"] },
		"ticksValuesInterval"			: { "type": "int", "default": 0 },
		"ticksInterval"					: { "type": "int", "default": null },
		"styleClass"					: { "type": "styleclass" },
		"dataChangeOnSlideEnd"			: { "type": "boolean", "default": true },
		"numberFormat"					: { "type": "format", "for":["dataProvider"]},
		"formattingFunction"			: { "type": "tagstring" },
		"selectionBarColorFunction"		: { "type": "tagstring" },
		"tickColorFunction"				: { "type": "tagstring" },
		"ticksTooltipFunction"			: { "type": "tagstring" },
		"ticksValuesTooltipFunction"	: { "type": "tagstring" },
		"getLegendFunction"				: { "type": "tagstring" },
		"pointerColorFunction"			: { "type": "tagstring" },
		
		"readOnly"						: { "type": "protected", "blockingOn": true, "default": false,"for": ["dataProvider","onDataChangeMethod","dataProviderHigh","onDataChangeHigh"], "tags": {"scope":"runtime"} },
		
		"floor"							: { "type": "int", "default": 0 },
		"ceil"							: { "type": "int", "default": null },
		"step"							: { "type": "int", "default": 1 },
		"precision"						: { "type": "int", "default": 0 },
		"minLimit"						: { "type": "int", "default": null },
		"maxLimit"						: { "type": "int", "default": null },
		"minRange"						: { "type": "int", "default": null },
		"maxRange"						: { "type": "int", "default": null },
		"enforceStep"					: { "type": "boolean", "default": false },
		"enforceRange"					: { "type": "boolean", "default": false },
		"pushRange"						: { "type": "boolean", "default": false },
		"rightToLeft"					: { "type": "boolean", "default": false },
		"noSwitching"					: { "type": "boolean", "default": false },
		"draggableRange"				: { "type": "boolean", "default": false },
		"draggableRangeOnly"			: { "type": "boolean", "default": false },
		"showSelectionBar"				: { "type": "boolean", "default": false },
		"showSelectionBarEnd"			: { "type": "boolean", "default": false },
		"selectionBarGradient"			: { "type": "gradient" },
		"showOuterSelectionBars"		: { "type": "boolean", "default": false },
		"showTicks"						: { "type": "boolean", "default": false },
		"showTicksValues"				: { "type": "boolean", "default": false },
		"hidePointerLabels"				: { "type": "boolean", "default": false },
		"hideLimitLabels"				: { "type": "boolean", "default": false },
		"autoHideLimitLabels"			: { "type": "boolean", "default": false },
		"stepsValueList"				: { "type": "valuelist", "for":["dataProvider"] },
		"ticksArray"					: { "type": "int[]" },
		"stepsArray"					: { "type": "int[]" },
		"visible" 						: { "type": "boolean", "default": true},
		"vertical" 						: { "type": "boolean", "default": false},
		"logScale" 						: { "type": "boolean", "default": false}
	},
	"api": {
		"refresh" : {
		}
	},
	"handlers": {
		"onDataChangeMethodID" : {
			"returns": "boolean", 
			"description": "Called when the dataProvider value changed",
	        "parameters": [
					{ "name": "oldValue", "type": "${dataproviderType}" }, 
					{ "name": "newValue", "type": "${dataproviderType}" }, 
					{ "name": "event", "type": "JSEvent"} 
				]
	        },
	    "onDataChangeHigh" : {
			"returns": "boolean", 
			"description": "Called when the dataProviderHigh value changed",
	        "parameters": [
					{ "name": "oldValue", "type": "${dataproviderType}" }, 
					{ "name": "newValue", "type": "${dataproviderType}" }, 
					{ "name": "event", "type": "JSEvent"} 
				]
	        },
	    "onSlideStart" : {
			"description": "Called when user starts dragging the slider",
			"parameters":[
					{ "name": "event", "type": "JSEvent"} , 
					{ "name": "value", "type": "object", "description": "the value when the user dragged the pointer of a non-range slider or the low value in a range slider" }, 
					{ "name": "highValue", "type": "object", "description": "the valueHigh when the user dragged the high value pointer in a range slider" },
					{ "name": "pointerType", "type": "string", "description": "either \"value\" or \"valueHigh\"" }
				]
	        },
	    "onSlideEnd" : {
			"description": "Called when user stops dragging the slider",
			"parameters":[
					{ "name": "event", "type": "JSEvent"}, 
					{ "name": "value", "type": "object", "description": "the value when the user dragged the pointer of a non-range slider or the low value in a range slider" }, 
					{ "name": "highValue", "type": "object", "description": "the valueHigh when the user dragged the high value pointer in a range slider" },
					{ "name": "pointerType", "type": "string", "description": "either \"value\" or \"valueHigh\"" }
				]
	        }
	},
	"types": {
		"gradient" : {
			"from"		: { "type": "color" },
			"to"		: { "type": "color" }
		}
	}
}