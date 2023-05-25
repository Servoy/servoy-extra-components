{
	"name": "servoyextra-slider",
	"displayName": "Slider",
	"categoryName": "Input Control",
	"version": 1,
	"definition": "servoyextra/slider/slider.js",
	"doc": "servoyextra/slider/slider_doc.js",
	"icon": "servoyextra/slider/slider.png",
	"libraries": [
		{ "name": "rzslider-css", "version": "6.4.3", "url": "servoyextra/slider/rzslider/rzslider.min.css", "mimetype": "text/css" }, 
		{ "name": "slider", "version": "1.0", "url": "servoyextra/slider/svy-slider.css", "mimetype": "text/css" }, 
		{ "name": "rzslider", "version": "6.4.3", "url": "servoyextra/slider/rzslider/rzslider.min.js", "mimetype": "text/javascript" }
	],
	"keywords": ["step", "move"],
	"model":
	{
		"size"							: { "type": "dimension", "default": {"width": 400, "height": 70} },
		
		"dataProvider" 					: { "type": "dataprovider", "pushToServer": "allow", "ondatachange": { "onchange":"onDataChangeMethodID", "callback":"onDataChangeCallback"}, "tags": { "doc": "The dataProvider for the slider value" } },
		"dataProviderHigh" 				: { "type": "dataprovider", "pushToServer": "allow", "ondatachange": { "onchange":"onDataChangeHigh", "callback":"onDataChangeCallback"}, "tags": { "doc": "The dataProvider for a range slider's maximum value" } },
		"enabled" 						: { "type": "enabled", "blockingOn": false, "default": true, "for": ["dataProvider", "dataProviderHigh", "onDataChange", "onDataChangeHigh"] },
		"ticksValuesInterval"			: { "type": "int", "default": 0, "tags": { "doc": "Number of steps between each tick to display tick values at intermediate positions" } },
		"ticksInterval"					: { "type": "int", "default": null, "tags": { "doc": "Number of steps between each tick to display ticks at intermediate positions" } },
		"styleClass"					: { "type": "styleclass" },
		"dataChangeOnSlideEnd"			: { "type": "boolean", "default": true, "tags": { "doc": "Set this to false to update the dataProvider(s) while the user drags the slider and not only when the user is done dragging" } },
		"numberFormat"					: { "type": "format", "for":["dataProvider"], "tags": { "doc": "A Servoy number format that is used to format numbers when a formattingFunction is not provided" }},
		"formattingFunction"			: { "type": "tagstring", "tags": { "doc": "Can be given a function code as string that can be used to format numbers client side." } },
		"selectionBarColorFunction"		: { "type": "clientfunction", "tags": { "doc": "Function code as String that returns the current color of the selection bar." } },
		"tickColorFunction"				: { "type": "clientfunction", "tags": { "doc": "Function provided as a String that returns the color of a tick." } },
		"ticksTooltipFunction"			: { "type": "clientfunction", "tags": { "doc": "Function provided as string that returns the tooltip content for a tick." } },
		"ticksValuesTooltipFunction"	: { "type": "clientfunction", "tags": { "doc": "Function provided as string that returns the tooltip content for a tick value." } },
		"getLegendFunction"				: { "type": "clientfunction", "tags": { "doc": "Can be given a function code as string that can be used to display legend under ticks" } },
		"pointerColorFunction"			: { "type": "clientfunction", "tags": { "doc": "Function provided as a String that returns the color of a tick." } },
		
		"readOnly"						: { "type": "protected", "blockingOn": true, "default": false,"for": ["dataProvider","onDataChangeMethod","dataProviderHigh","onDataChangeHigh"], "tags": {"scope":"runtime"} },
		
		"floor"							: { "type": "int", "default": 0, "tags": { "doc": "Minimum value for a slider" } },
		"ceil"							: { "type": "int", "default": null, "tags": { "doc": "Maximum value for a slider" } },
		"step"							: { "type": "int", "default": 1, "tags": { "doc": "Step between each value" } },
		"precision"						: { "type": "int", "default": 0, "tags": { "doc": "The precision to display values with." } },
		"minLimit"						: { "type": "int", "default": null, "tags": { "doc": "The minimum value authorized on the slider." } },
		"maxLimit"						: { "type": "int", "default": null, "tags": { "doc": "The maximum value authorized on the slider." } },
		"minRange"						: { "type": "int", "default": null, "tags": { "doc": "The minimum range authorized on the slider." } },
		"maxRange"						: { "type": "int", "default": null, "tags": { "doc": "The maximum range authorized on the slider." } },
		"enforceStep"					: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to force the value to be rounded to the step" } },
		"enforceRange"					: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to round the value and valueHigh to the slider range" } },
		"pushRange"						: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to have a push behavior. When the min handle goes above the max, the max is moved as well" } },
		"rightToLeft"					: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to show graphs right to left." } },
		"noSwitching"					: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to prevent to user from switching the min and max handles" } },
		"draggableRange"				: { "type": "boolean", "default": false, "tags": { "doc": "When set to true and using a range slider, the range can be dragged by the selection bar" } },
		"draggableRangeOnly"			: { "type": "boolean", "default": false, "tags": { "doc": "Same as draggableRange but the slider range can't be changed" } },
		"showSelectionBar"				: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to always show the selection bar before the slider handle" } },
		"showSelectionBarEnd"			: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to always show the selection bar after the slider handle" } },
		"selectionBarGradient"			: { "type": "gradient", "tags": { "doc": "Use to display the selection bar as a gradient" } },
		"showOuterSelectionBars"		: { "type": "boolean", "default": false, "tags": { "doc": "Only for range slider. Set to true to visualize in different colour the areas on the left/right (top/bottom for vertical range slider) of selection bar between the handles" } },
		"showTicks"						: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to display a tick for each step of the slider" } },
		"showTicksValues"				: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to display a tick and the step value for each step of the slider" } },
		"hidePointerLabels"				: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to hide pointer labels" } },
		"hideLimitLabels"				: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to hide min / max labels" } },
		"autoHideLimitLabels"			: { "type": "boolean", "default": false, "tags": { "doc": "Set to false to disable the auto-hiding behavior of the limit labels" } },
		"stepsValueList"				: { "type": "valuelist", "for":["dataProvider"], "tags": { "doc": "If you want to provide all the steps with display and real values, you can provide a value list to provide step values (realValues) and step labels (displayValues)." } },
		"ticksArray"					: { "type": "int[]", "tags": { "doc": "Use to display ticks at specific positions. The array contains the index of the ticks that should be displayed." } },
		"stepsArray"					: { "type": "int[]", "tags": { "doc": "If you want to display a slider with non linear/number steps." } },
		"visible" 						: { "type": "boolean", "default": true },
		"vertical" 						: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to display the slider vertically." }},
		"logScale" 						: { "type": "boolean", "default": false, "tags": { "doc": "Set to true to use a logarithmic scale to display the slider" }}
	},
	"api": {
		"refresh" : {
		}
	},
	"handlers": {
		"onDataChangeMethodID" : {
			"returns": "boolean", 
			"doc": "Called when the dataProvider value changed",
	        "parameters": [
					{ "name": "oldValue", "type": "${dataproviderType}" }, 
					{ "name": "newValue", "type": "${dataproviderType}" }, 
					{ "name": "event", "type": "JSEvent"} 
				]
	        },
	    "onDataChangeHigh" : {
			"returns": "boolean", 
			"doc": "Called when the dataProviderHigh value changed",
	        "parameters": [
					{ "name": "oldValue", "type": "${dataproviderType}" }, 
					{ "name": "newValue", "type": "${dataproviderType}" }, 
					{ "name": "event", "type": "JSEvent"} 
				]
	        },
	    "onSlideStart" : {
			"doc": "Called when user starts dragging the slider",
			"parameters":[
					{ "name": "event", "type": "JSEvent"} , 
					{ "name": "value", "type": "object", "description": "the value when the user dragged the pointer of a non-range slider or the low value in a range slider" }, 
					{ "name": "highValue", "type": "object", "description": "the valueHigh when the user dragged the high value pointer in a range slider" },
					{ "name": "pointerType", "type": "string", "description": "either \"value\" or \"valueHigh\"" }
				]
	        },
	    "onSlideEnd" : {
			"doc": "Called when user stops dragging the slider",
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