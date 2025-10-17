/*
 * A Servoy Extra Component for displaying a linear or radial gauge with various options.
 */

/**
 * The type of gauge to display. A linear gauge is similar to a thermometer and a radial gauge is like a speedometer
 */
var gaugeType;

/**
 * The minimum value for the gauge
 */
var minValue;

/**
 * The maximum value for the gauge
 */
var maxValue;

/**
 * The dimensions of the gauge component.
 */
var size;

/**
 * The title configuration for the gauge, including text, font, and styling options.
 */
var title;

/**
 * The unit of measurement displayed on the gauge (e.g., °C, %, etc.).
 */
var units;

/**
 * The current value displayed on the gauge, bound to a data provider.
 */
var value;

/**
 * Tick options for the gauge. Defines major and minor ticks along the gauge scale.
 */
var ticks;

/**
 * An array of highlight definitions, specifying ranges to be emphasized on the gauge.
 */
var highlights;

/**
 * Animation options for the gauge. Configures behavior such as duration, animation rule, and animated value settings.
 */
var animationOptions;

/**
 * Color options for the gauge. Defines colors for the gauge plate, ticks, needle, borders, and other elements.
 */
var colorOptions;

/**
 * Needle options for the gauge. Configures the appearance and behavior of the gauge needle.
 */
var needleOptions;

/**
 * Border options for the gauge. Configures the widths and styles of the gauge borders.
 */
var borderOptions;

/**
 * Font options for the gauge. Defines fonts for tick numbers, title, units, and the value text.
 */
var fontOptions;

/**
 * Options specific to a linear gauge layout, such as bar length and tick placement.
 */
var linearGaugeOptions;

/**
 * Options specific to a radial gauge layout, such as angles and circular configurations.
 */
var radialGaugeOptions;

/**
 * Options for the value box, which displays the gauge's value with optional formatting.
 */
var valueBoxOptions;


var svy_types = {

    /**
     * Represents configuration options for gauge ticks including major and minor tick settings.
     */
    TickOptions: {

        /**
         * Flag indicating whether the provided major tick values should be used exactly as specified.
         */
        exactTicks: null,

        /**
         * An array of numeric or string values which will be displayed on a gauge bar as major ticks. This array values define the labels for the ticks. The length of the array defines a number of sections on a ticks bar.
         */
        majorTicks : null,

        /**
         * The Number of digits for the integer part of the tick number
         */
        majorTicksInt : null,

        /**
         * The Number of digits for the decimal part of the tick number
         */
        majorTicksDec : null,

        /**
         * How many divisions to draw between two neighbour major ticks.
         */
        minorTicks : null,

        /**
         * Should the ticks bar of the gauge be stroked or not
         */
        strokeTicks : null,

        /**
         * Sets the width of highlights area in relative units
         */
        highlightsWidth : null,

    },

    /**
     * Represents a gauge highlight range with starting and ending values and a specific color.
     */
    Highlight: {

         /**
         * The starting value of the highlight range.
         */
        from: null,
        /**
         * The ending value of the highlight range.
         */
        to: null,
        /**
         * The color to be used for the highlight range.
         */
        color: null
    },

    /**
     * Represents animation settings for the gauge, such as duration and animation behavior.
     */
    AnimationOptions: {

        /**
         * Flag to indicate if animations are enabled
         */
        animation : null,

        /**
         * Time in milliseconds of the animation duration
         */
        animationDuration : null,

        /**
         * The type of animation behaviour for the guage
         */
        animationRule : null,

        /**
         * Flag to indicate if the value should be constantly updated during the animation
         */
        animatedValue : null,

        /**
         * Flag to indicate if the guage should be animated on first draw
         */
        animateOnInit : null,

    },

    /**
     * Represents color configuration for various gauge elements.
     */
    ColorOptions: {

        /**
         * The background color for the gauge
         */
        colorPlate : null,

        /**
         * The end background color for the gauge. If specified will give a gradient effect to the gauge
         */
        colorPlateEnd : null,

        /**
         * Color of the major tick marks
         */
        colorMajorTicks : null,

        /**
         * Color of the minor tick marks
         */
        colorMinorTicks : null,

        /**
         * Color of the numbers on the ticks
         */
        colorNumbers : null,

        /**
         * Color of the needle
         */
        colorNeedle : null,

        /**
         * This value and the main needle colour can be used to specify a gradient for the needle
         */
        colorNeedleEnd : null,

        /**
         * Color of the title
         */
        colorTitle : null,

        /**
         * Color of the value text
         */
        colorValueText : null,

        /**
         * Color of the value text shadow. If not specified then there will be no shadow
         */
        colorValueTextShadow : null,

        /**
         * Defines the color of the outer border for the gauge plate
         */
        colorBorderOuter : null,

        /**
         * This value and the main border outer colour can be used to specify a gradient for the outer border
         */
        colorBorderOuterEnd : null,

        /**
         * Defines the color of the middle border for the gauge plate
         */
        colorBorderMiddle : null,

        /**
         * This value and the main border middle colour can be used to specify a gradient for the middle border
         */
        colorBorderMiddleEnd : null,

        /**
         * Defines the color of the inner border for the gauge plate
         */
        colorBorderInner : null,

        /**
         * This value and the main border outer colour can be used to specify a gradient for the inner border
         */
        colorBorderInnerEnd : null,

        /**
         * Defines the color of the value box rectangle stroke
         */
        colorValueBoxRect : null,

        /**
         * This value and the main value box rectangle colour can be used to specify a gradient for the value box rectangle
         */
        colorValueBoxRectEnd : null,

        /**
         * Defines the color of the background for the value box
         */
        colorValueBoxBackground : null,

        /**
         * Defines the color of the shadow for the value box. If not specified then there will be no shadow
         */
        colorValueBoxShadow : null,

        /**
         * Defines the upper half of the needle shadow color
         */
        colorNeedleShadowUp : null,

        /**
         * Defines the lower half of the needle shadow color
         */
        colorNeedleShadowDown : null,

        /**
         * Defines the color of the bar stroke
         */
        colorBarStroke : null,

        /**
         * Defines the background color of the bar
         */
        colorBar : null,

        /**
         * Defines the color of the progress bar
         */
        colorBarProgress : null,

        /**
         * Color of the units
         */
        colorUnits : null,

    },

    /**
     * Represents configuration options for the gauge value box.
     */
    ValueBoxOptions: {

        /**
         * Flag to indicate if the value box should be shown or not
         */
        valueBox : null,

        /**
         * Number of digits for the integer part of the value
         */
        valueInt : null,

        /**
         * Number of digits for the decimal part of the value
         */
        valueDec : null,

    },

    /**
     * Represents configuration options for the gauge needle.
     */
    NeedleOptions: {

        /**
         * Flag to indicate if the needle should be drawn
         */
        needle : null,

        /**
         * Flag to indicate if the needle shadow should be drawn
         */
        needleShadow : null,

        /**
         * Can be either 'line' or 'arrow'
         */
        needleType : null,

    },

    /**
     * Represents configuration options for the gauge borders.
     */
    BorderOptions: {

        /**
         * Flag to indicate if borders should be drawn
         */
        borders : null,

        /**
         * Sets the outer width of the border in pixels. If 0, then no border will be drawn
         */
        borderOuterWidth : null,

        /**
         * Sets the middle width of the border in pixels. If 0, then no border will be drawn
         */
        borderMiddleWidth : null,

        /**
         * Sets the inner width of the border in pixels. If 0, then no border will be drawn
         */
        borderInnerWidth : null,

        /**
         * Sets the width of the outer border drop shadow. If 0, then no shadow will be drawn
         */
        borderShadowWidth : null,

    },

    /**
     * Represents font configuration options for gauge elements.
     */
    FontOptions: {

        /**
         * The font family to be used for the tick numbers
         */
        fontNumbers : null,

        /**
         * The font size to be used for the tick numbers in relative units
         */
        fontNumbersSize : null,

        /**
         * The font style to be used for the tick numbers
         */
        fontNumbersStyle : null,

        /**
         * The font weight to be used for the tick numbers
         */
        fontNumbersWeight : null,

        /**
         * The font family to be used for the title text
         */
        fontTitle : null,

        /**
         * The font size to be used for the title in relative units
         */
        fontTitleSize : null,

        /**
         * The font style to be used for the title
         */
        fontTitleStyle : null,

        /**
         * The font weight to be used for the title
         */
        fontTitleWeight : null,

        /**
         * The font family to be used for the units
         */
        fontUnits : null,

        /**
         * The font size to be used for the units in relative units
         */
        fontUnitsSize : null,

        /**
         * The font style to be used for the units
         */
        fontUnitsStyle : null,

        /**
         * The font weight to be used for the units
         */
        fontUnitsWeight : null,

        /**
         * The font family to be used for the value
         */
        fontValue : null,

        /**
         * The font size to be used for the value in relative units
         */
        fontValueSize : null,

        /**
         * The font style to be used for the value
         */
        fontValueStyle : null,

        /**
         * The font weight to be used for the value
         */
        fontValueWeight : null,

    },

    /**
     * Represents configuration options for the gauge title.
     */
    TitleOptions: {

        /**
         * The title text to display on the gauge.
         */
        text: null,

        /**
         * A data provider for dynamic title content.
         */
        dataProviderID: null,

        /**
         * Determines if formatting tags are applied to the title text.
         */
        displaysTags: null,

        /**
         * Specifies the formatting rules for the title text.
         */
        format: null,

    },

    /**
     * Represents configuration options specific to a linear gauge layout.
     */
    LinearGaugeOptions: {

        /**
         * The radius for rounded corners of the gauge plate and its borders
         */
        borderRadius : null,

        /**
         * Defines if a gauge bar should start with a circle element imitating flask view of the bar. If set to zero it won’t be drawn at all
         */
        barBeginCircle : null,

        /**
         * Defines bar length (in percent) in relation to overall gauge length
         */
        barLength : null,

        /**
         * If given, bar background will be drawn as gradient. If null or undefined, bar color will be solid
         */
        colorBarEnd : null,

        /**
         * If given, progress bar background will be drawn as gradient. If null or undefined, progress bar color will be solid
         */
        colorBarProgressEnd : null,

        /**
         * Defines a side on which ticks bar should be drawn
         */
        tickSide : null,

        /**
         * Defines a side on which the needle should be drawn
         */
        needleSide : null,

        /**
         * Defines a side on which the numbers should be drawn
         */
        numbersSide : null,

        /**
         * Defines a length of major ticks width in relative units
         */
        ticksWidth : null,

        /**
         * Defines a length of minor tick lines width in relative units
         */
        ticksWidthMinor : null,

        /**
         * Defines a padding used for drawing ticks out of a bar, in relative units
         */
        ticksPadding : null,

    },

    /**
     * Represents configuration options specific to a radial gauge layout.
     */
    RadialGaugeOptions: {

        /**
         * Defines a max angle for ticks bar
         */
        ticksAngle : null,

        /**
         * Defines a start angle for the start of the ticks bar
         */
        startAngle : null,

        /**
         * Enable anti-clockwise progress bars and middle start point progress bars
         */
        barStartPosition : null,

        /**
         * Defines a color which should be used to draw outer decorative circle element at the middle of the gauge
         */
        colorNeedleCircleOuter : null,

        /**
         * : If defined, outer decorative circle gauge element will be drawn as gradient. If falsy - outer circle will be drawn using solid color
         */
        colorNeedleCircleOuterEnd : null,

        /**
         * Defines a color which should be used to draw inner decorative circle element at the middle of the gauge
         */
        colorNeedleCircleInner : null,

        /**
         * : If defined, inner decorative circle gauge element will be drawn as gradient. If falsy - inner circle will be drawn using solid color
         */
        colorNeedleCircleInnerEnd : null,

        /**
         * Defines the size in relative units of the decorative circles element of the gauge
         */
        needleCircleSize : null,

        /**
         * Turns on/off inner decorative circle element drawing
         */
        needleCircleInner : null,

        /**
         * Turns on/off outer decorative circle element drawing
         */
        needleCircleOuter : null,

        /**
         * Defines which part of the gauge should be animated when changing the value
         */
        animationTarget : null,

        /**
         * Applicable only to radial gauges which have full 360-degree ticks plate. If set to true, the gauge will rotate needle/plate by a minimal rotation path
         */
        useMinPath : null,

    }
}
