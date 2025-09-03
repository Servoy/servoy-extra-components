{
	"name": "servoyextra-gauge",
	"displayName": "Gauge",
	"categoryName": "Visualization",
	"version": 1,
	"definition": "servoyextra/gauge/gauge.js",
	"doc": "servoyextra/gauge/gauge_doc.js",
	"icon": "servoyextra/gauge/gauge.png",
	"libraries": 
	[
		{
			"name": "gauge.min.js",
			"version": "2.1.7",
			"url": "servoyextra/gauge/libs/gauge.min.js",
			"mimetype": "text/javascript"
		}
	],

	"model": 
	{
		"gaugeType": 
		{
			"type": "string",
			"default": "radial",
			"tags": 
			{
				"doc": "The type of gauge to display. A linear gauge is similar to a thermometer and a radial gauge is like a speedometer",
				"basic": true
			},

			"values": 
			[
				"linear",
				"radial"
			]
		},

		"minValue": 
		{
			"type": "int",
			"default": 0,
			"tags": 
			{
				"doc": "The minimum value for the gauge",
				"basic": true
			}
		},

		"maxValue": 
		{
			"type": "int",
			"default": 100,
			"tags": 
			{
				"doc": "The maximum value for the gauge",
				"basic": true
			}
		},

		"size": 
		{
			"type": "dimension",
			"pushToServer": "deep"
		},

		"title": 
		{
			"type": "TitleOptions"
		},

		"units": 
		{
			"type": "string"
		},

		"value": 
		{
			"type": "dataprovider",
			"tags": 
			{
				"basic": true
			}
		},

		"ticks": 
		{
			"type": "TickOptions"
		},

		"highlights": "Highlight[]",
		"animationOptions": "AnimationOptions",
		"colorOptions": "ColorOptions",
		"needleOptions": "NeedleOptions",
		"borderOptions": "BorderOptions",
		"fontOptions": "FontOptions",
		"linearGaugeOptions": "LinearGaugeOptions",
		"radialGaugeOptions": "RadialGaugeOptions",
		"valueBoxOptions": "ValueBoxOptions"
	},

	"types": 
	{
		"TickOptions": 
		{
			"exactTicks": 
			{
				"type": "boolean",
				"default": false
			},

			"majorTicks": 
			{
				"type": "string[]",
				"tags": 
				{
					"doc": "An array of numeric or string values which will be displayed on a gauge bar as major ticks. This array values define the labels for the ticks. The length of the array defines a number of sections on a ticks bar."
				},

				"default": 
				[
					"0",
					"20",
					"40",
					"60",
					"80",
					"100"
				]
			},

			"majorTicksInt": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "The Number of digits for the integer part of the tick number"
				}
			},

			"majorTicksDec": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "The Number of digits for the decimal part of the tick number"
				}
			},

			"minorTicks": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "How many divisions to draw between two neighbour major ticks."
				},

				"default": 10
			},

			"strokeTicks": 
			{
				"type": "boolean",
				"default": true,
				"tags": 
				{
					"doc": "Should the ticks bar of the gauge be stroked or not"
				}
			},

			"highlightsWidth": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Sets the width of highlights area in relative units"
				},

				"default": 15
			}
		},

		"Highlight": 
		{
			"from": 
			{
				"type": "int",
				"default": 0
			},

			"to": 
			{
				"type": "int",
				"default": 0
			},

			"color": "color"
		},

		"AnimationOptions": 
		{
			"animation": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Flag to indicate if animations are enabled"
				},

				"default": true
			},

			"animationDuration": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Time in milliseconds of the animation duration"
				},

				"default": 500
			},

			"animationRule": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The type of animation behaviour for the guage"
				},

				"default": "linear",
				"values": 
				[
					"quad",
					"quint",
					"cycle",
					"bounce",
					"elastic",
					"delinear",
					"dequad",
					"dequint",
					"decycle",
					"debounce",
					"delastic"
				]
			},

			"animatedValue": 
			{
				"type": "boolean",
				"default": false,
				"tags": 
				{
					"doc": "Flag to indicate if the value should be constantly updated during the animation"
				}
			},

			"animateOnInit": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Flag to indicate if the guage should be animated on first draw"
				},

				"default": true
			}
		},

		"ColorOptions": 
		{
			"colorPlate": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "The background color for the gauge"
				},

				"default": "#fff"
			},

			"colorPlateEnd": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "The end background color for the gauge. If specified will give a gradient effect to the gauge"
				}
			},

			"colorMajorTicks": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Color of the major tick marks"
				},

				"default": "#444"
			},

			"colorMinorTicks": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Color of the minor tick marks"
				},

				"default": "#666"
			},

			"colorNumbers": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Color of the numbers on the ticks"
				},

				"default": "#444"
			},

			"colorNeedle": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Color of the needle"
				},

				"default": "rgba(240,128,128,1)"
			},

			"colorNeedleEnd": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "This value and the main needle colour can be used to specify a gradient for the needle"
				},

				"default": "rgba(255,160,122,.9)"
			},

			"colorTitle": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Color of the title"
				},

				"default": "#888"
			},

			"colorValueText": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Color of the value text"
				},

				"default": "#444"
			},

			"colorValueTextShadow": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Color of the value text shadow. If not specified then there will be no shadow"
				},

				"default": "rgba(0,0,0,0.3)"
			},

			"colorBorderOuter": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the color of the outer border for the gauge plate"
				}
			},

			"colorBorderOuterEnd": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "This value and the main border outer colour can be used to specify a gradient for the outer border"
				}
			},

			"colorBorderMiddle": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the color of the middle border for the gauge plate"
				}
			},

			"colorBorderMiddleEnd": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "This value and the main border middle colour can be used to specify a gradient for the middle border"
				}
			},

			"colorBorderInner": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the color of the inner border for the gauge plate"
				}
			},

			"colorBorderInnerEnd": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "This value and the main border outer colour can be used to specify a gradient for the inner border"
				}
			},

			"colorValueBoxRect": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the color of the value box rectangle stroke"
				}
			},

			"colorValueBoxRectEnd": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "This value and the main value box rectangle colour can be used to specify a gradient for the value box rectangle"
				}
			},

			"colorValueBoxBackground": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the color of the background for the value box"
				}
			},

			"colorValueBoxShadow": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the color of the shadow for the value box. If not specified then there will be no shadow"
				}
			},

			"colorNeedleShadowUp": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the upper half of the needle shadow color"
				}
			},

			"colorNeedleShadowDown": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the lower half of the needle shadow color"
				}
			},

			"colorBarStroke": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the color of the bar stroke"
				}
			},

			"colorBar": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the background color of the bar"
				}
			},

			"colorBarProgress": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines the color of the progress bar"
				}
			},

			"colorUnits": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Color of the units"
				}
			}
		},

		"ValueBoxOptions": 
		{
			"valueBox": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Flag to indicate if the value box should be shown or not"
				},

				"default": true
			},

			"valueInt": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Number of digits for the integer part of the value"
				},

				"default": 3
			},

			"valueDec": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Number of digits for the decimal part of the value"
				},

				"default": 2
			}
		},

		"NeedleOptions": 
		{
			"needle": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Flag to indicate if the needle should be drawn"
				},

				"default": true
			},

			"needleShadow": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Flag to indicate if the needle shadow should be drawn"
				},

				"default": true
			},

			"needleType": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "Can be either 'line' or 'arrow'"
				},

				"default": "arrow",
				"values": 
				[
					"arrow",
					"line"
				]
			}
		},

		"BorderOptions": 
		{
			"borders": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Flag to indicate if borders should be drawn"
				},

				"default": true
			},

			"borderOuterWidth": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Sets the outer width of the border in pixels. If 0, then no border will be drawn"
				}
			},

			"borderMiddleWidth": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Sets the middle width of the border in pixels. If 0, then no border will be drawn"
				}
			},

			"borderInnerWidth": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Sets the inner width of the border in pixels. If 0, then no border will be drawn"
				}
			},

			"borderShadowWidth": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Sets the width of the outer border drop shadow. If 0, then no shadow will be drawn"
				}
			}
		},

		"FontOptions": 
		{
			"fontNumbers": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font family to be used for the tick numbers"
				}
			},

			"fontNumbersSize": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "The font size to be used for the tick numbers in relative units"
				}
			},

			"fontNumbersStyle": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font style to be used for the tick numbers"
				},

				"default": "normal",
				"values": 
				[
					"normal",
					"italic",
					"oblique"
				]
			},

			"fontNumbersWeight": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font weight to be used for the tick numbers"
				},

				"default": "normal",
				"values": 
				[
					"normal",
					"bold",
					"bolder",
					"lighter",
					"100",
					"200",
					"300",
					"400",
					"500",
					"600",
					"700",
					"800",
					"900"
				]
			},

			"fontTitle": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font family to be used for the title text"
				}
			},

			"fontTitleSize": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "The font size to be used for the title in relative units"
				}
			},

			"fontTitleStyle": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font style to be used for the title"
				},

				"default": "normal",
				"values": 
				[
					"normal",
					"italic",
					"oblique"
				]
			},

			"fontTitleWeight": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font weight to be used for the title"
				},

				"default": "normal",
				"values": 
				[
					"normal",
					"bold",
					"bolder",
					"lighter",
					"100",
					"200",
					"300",
					"400",
					"500",
					"600",
					"700",
					"800",
					"900"
				]
			},

			"fontUnits": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font family to be used for the units"
				}
			},

			"fontUnitsSize": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "The font size to be used for the units in relative units"
				}
			},

			"fontUnitsStyle": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font style to be used for the units"
				},

				"default": "normal",
				"values": 
				[
					"normal",
					"italic",
					"oblique"
				]
			},

			"fontUnitsWeight": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font weight to be used for the units"
				},

				"default": "normal",
				"values": 
				[
					"normal",
					"bold",
					"bolder",
					"lighter",
					"100",
					"200",
					"300",
					"400",
					"500",
					"600",
					"700",
					"800",
					"900"
				]
			},

			"fontValue": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font family to be used for the value"
				}
			},

			"fontValueSize": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "The font size to be used for the value in relative units"
				}
			},

			"fontValueStyle": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font style to be used for the value"
				},

				"default": "normal",
				"values": 
				[
					"normal",
					"italic",
					"oblique"
				]
			},

			"fontValueWeight": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "The font weight to be used for the value"
				},

				"default": "normal",
				"values": 
				[
					"normal",
					"bold",
					"bolder",
					"lighter",
					"100",
					"200",
					"300",
					"400",
					"500",
					"600",
					"700",
					"800",
					"900"
				]
			}
		},

		"TitleOptions": 
		{
			"text": 
			{
				"type": "string"
			},

			"dataProviderID": 
			{
				"type": "dataprovider",
				"tags": 
				{
					"scope": "design"
				},

				"displayTagsPropertyName": "displaysTags"
			},

			"displaysTags": 
			{
				"type": "boolean",
				"tags": 
				{
					"scope": "design"
				}
			},

			"format": 
			{
				"for": 
				[
					"dataProviderID"
				],

				"type": "format"
			}
		},

		"LinearGaugeOptions": 
		{
			"borderRadius": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "The radius for rounded corners of the gauge plate and its borders"
				}
			},

			"barBeginCircle": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Defines if a gauge bar should start with a circle element imitating flask view of the bar. If set to zero it won’t be drawn at all"
				}
			},

			"barLength": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Defines bar length (in percent) in relation to overall gauge length"
				}
			},

			"colorBarEnd": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "If given, bar background will be drawn as gradient. If null or undefined, bar color will be solid"
				}
			},

			"colorBarProgressEnd": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "If given, progress bar background will be drawn as gradient. If null or undefined, progress bar color will be solid"
				}
			},

			"tickSide": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "Defines a side on which ticks bar should be drawn"
				},

				"default": "both",
				"values": 
				[
					"both",
					"left",
					"right"
				]
			},

			"needleSide": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "Defines a side on which the needle should be drawn"
				},

				"default": "both",
				"values": 
				[
					"both",
					"left",
					"right"
				]
			},

			"numbersSide": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "Defines a side on which the numbers should be drawn"
				},

				"default": "both",
				"values": 
				[
					"both",
					"left",
					"right"
				]
			},

			"ticksWidth": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Defines a length of major ticks width in relative units"
				}
			},

			"ticksWidthMinor": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Defines a length of minor tick lines width in relative units"
				}
			},

			"ticksPadding": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Defines a padding used for drawing ticks out of a bar, in relative units"
				}
			}
		},

		"RadialGaugeOptions": 
		{
			"ticksAngle": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Defines a max angle for ticks bar"
				},

				"default": 270
			},

			"startAngle": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Defines a start angle for the start of the ticks bar"
				},

				"default": 45
			},

			"barStartPosition": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "Enable anti-clockwise progress bars and middle start point progress bars"
				},

				"default": "left",
				"values": 
				[
					"left",
					"right"
				]
			},

			"colorNeedleCircleOuter": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines a color which should be used to draw outer decorative circle element at the middle of the gauge"
				}
			},

			"colorNeedleCircleOuterEnd": 
			{
				"type": "color",
				"tags": 
				{
					"doc": ": If defined, outer decorative circle gauge element will be drawn as gradient. If falsy - outer circle will be drawn using solid color"
				}
			},

			"colorNeedleCircleInner": 
			{
				"type": "color",
				"tags": 
				{
					"doc": "Defines a color which should be used to draw inner decorative circle element at the middle of the gauge"
				}
			},

			"colorNeedleCircleInnerEnd": 
			{
				"type": "color",
				"tags": 
				{
					"doc": ": If defined, inner decorative circle gauge element will be drawn as gradient. If falsy - inner circle will be drawn using solid color"
				}
			},

			"needleCircleSize": 
			{
				"type": "int",
				"tags": 
				{
					"doc": "Defines the size in relative units of the decorative circles element of the gauge"
				},

				"default": 45
			},

			"needleCircleInner": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Turns on/off inner decorative circle element drawing"
				},

				"default": true
			},

			"needleCircleOuter": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Turns on/off outer decorative circle element drawing"
				},

				"default": true
			},

			"animationTarget": 
			{
				"type": "string",
				"tags": 
				{
					"doc": "Defines which part of the gauge should be animated when changing the value"
				},

				"default": "needle",
				"values": 
				[
					"needle",
					"plate"
				]
			},

			"useMinPath": 
			{
				"type": "boolean",
				"tags": 
				{
					"doc": "Applicable only to radial gauges which have full 360-degree ticks plate. If set to true, the gauge will rotate needle/plate by a minimal rotation path"
				},

				"default": true
			}
		}
	}
}