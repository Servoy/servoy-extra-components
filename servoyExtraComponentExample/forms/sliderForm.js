/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"F1836F18-6D11-40FA-B57A-DE6618EBB478"}
 */
var pointerColorFunctionDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FEF3E427-476B-4A66-8278-8CF2DEBD7EA3"}
 */
var formattingFunctionDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"E2E1A3B6-03D6-44F1-B738-76A446EB3272"}
 */
var ticksTooltipFunctionDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CBC10C9E-F5F9-4F36-BF34-DD98F4D3C716"}
 */
var getLegendFunctionDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"DE3520CE-3C59-471A-B0B4-F3D6D531EC81",variableType:-4}
 */
var visibleDP = true;

/**
 * @properties={typeid:35,uuid:"55A5FB81-9AA9-4CB7-9E53-5AEBC76CDB03",variableType:-4}
 */
var enabledDP = true;

/**
 * @properties={typeid:35,uuid:"1EB327E7-4BB8-4EF9-94CA-89AD47DC0D15",variableType:-4}
 */
var dataChangeOnSlideEndDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"ABD26C4E-F9AE-4748-9DA3-186B360FAEA4"}
 */
var sliderHighDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"58F7EC2D-0CD2-4907-97B4-B0057D8D8CC0"}
 */
var sliderDP = null;

/**
 * Called when the dataProvider value changed.
 *
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"EEC114DE-0CE7-45CD-A8EB-837D2B17FADF"}
 */
function onDataChange(oldValue, newValue, event) {
	elements.label_dataChange.text = "on data change oldValue: -- " + oldValue + " newValue: -- " + newValue;
	return false;
}

/**
 * Called when the dataProviderHigh value changed.
 *
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"6CD8D156-21B6-4913-9F11-98999D267F53"}
 */
function onDataChangeHigh(oldValue, newValue, event) {
	elements.label_dataChangeHigh.text = "on data change HIGH oldValue: -- " + oldValue + " newValue: -- " + newValue;
	return false;
}

/**
 * Called when user stops dragging the slider.
 *
 * @param {JSEvent} event
 * @param value the value when the user dragged the pointer of a non-range slider or the low value in a range slider
 * @param highValue the valueHigh when the user dragged the high value pointer in a range slider
 * @param {String} pointerType either "value" or "high"
 *
 * @properties={typeid:24,uuid:"0C82C7DD-D425-4668-AAF4-C7DF2E47EB07"}
 */
function onSlideEnd(event, value, highValue, pointerType) {
	elements.label_sliderEnd.text = "Slider End";
}

/**
 * Called when user starts dragging the slider.
 *
 * @param {JSEvent} event
 * @param value the value when the user dragged the pointer of a non-range slider or the low value in a range slider
 * @param highValue the valueHigh when the user dragged the high value pointer in a range slider
 * @param {String} pointerType either "value" or "high"
 *
 * @properties={typeid:24,uuid:"D5D8FB45-F3C2-489E-A2DD-4A3C35A442E9"}
 */
function onSlideStart(event, value, highValue, pointerType) {
	elements.label_sliderEnd.text = "Slider Start";
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"CEB9FD03-1D29-496E-956E-86C2EAE8859A",variableType:4}
 */
var i = 0;
/**
 * Called when user clicks on a tick or drags the slider pointer to a tick.
 *
 * @param value the value when the user ticked/ dragged the pointer of a non-range slider or the low value in a range slider
 * @param highValue the valueHigh when the user ticked/ dragged the high value pointer in a range slider
 * @param {String} pointerType either "value" or "high"
 * @param {Boolean} rightToLeft true - if the slider is right to left, false - if the slider is left to right
 *
 * @properties={typeid:24,uuid:"00396182-95A8-4301-9DF6-BE0B12565BC3"}
 */
function onTick(value, highValue, pointerType, rightToLeft) {
	elements.label_tick.text = "Tick " + i;
	i++;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"C385FE83-EB96-481F-B4ED-B98FB081FD8C"}
 */
function onAction_autoHideLimitLabels(event, dataTarget) {
	elements.slider_horizontal.autoHideLimitLabels = !elements.slider_horizontal.autoHideLimitLabels
	elements.slider_vertical.autoHideLimitLabels = !elements.slider_vertical.autoHideLimitLabels
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"16AD3DFD-6371-4313-A865-274A3B667950"}
 */
function onAction_dataChangeOnSlideEnd(event, dataTarget) {
	elements.slider_horizontal.dataChangeOnSlideEnd = !elements.slider_horizontal.dataChangeOnSlideEnd
	elements.slider_vertical.dataChangeOnSlideEnd = !elements.slider_vertical.dataChangeOnSlideEnd
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"AA0CA516-E41A-43CF-B27F-FF196B0AE9AA"}
 */
function onAction_draggableRange(event, dataTarget) {
	elements.slider_horizontal.draggableRange = !elements.slider_horizontal.draggableRange
	elements.slider_vertical.draggableRange = !elements.slider_vertical.draggableRange
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"9EE6D6CD-434A-45F4-BF2C-77C880E87226"}
 */
function onAction_enabled(event, dataTarget) {
	elements.slider_horizontal.enabled = !elements.slider_horizontal.enabled
	elements.slider_vertical.enabled = !elements.slider_vertical.enabled
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"CE934749-8CD4-4980-8DDE-6B6D5F541FD4"}
 */
function onAction_enforceRange(event, dataTarget) {
	elements.slider_horizontal.enforceRange = !elements.slider_horizontal.enforceRange
	elements.slider_vertical.enforceRange = !elements.slider_vertical.enforceRange
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"6CEDB0B4-700A-4058-AA39-6731A880E7DD"}
 */
function onAction_enforceStep(event, dataTarget) {
	elements.slider_horizontal.enforceStep = !elements.slider_horizontal.enforceStep
	elements.slider_vertical.enforceStep = !elements.slider_vertical.enforceStep
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"2BB3E4EC-F4F6-4740-A506-74174B022F04"}
 */
function onAction_draggableRangeOnly(event, dataTarget) {
	elements.slider_horizontal.draggableRangeOnly = !elements.slider_horizontal.draggableRangeOnly
	elements.slider_vertical.draggableRangeOnly = !elements.slider_vertical.draggableRangeOnly
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"79DA9705-CA7A-483C-943C-60CA87D29D60"}
 */
function onAction_hideLimitLabels(event, dataTarget) {
	elements.slider_horizontal.hideLimitLabels = !elements.slider_horizontal.hideLimitLabels
	elements.slider_vertical.hideLimitLabels = !elements.slider_vertical.hideLimitLabels
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"6F618A94-0A2A-4A20-9A92-F8AED999F852"}
 */
function onAction_hidePointerLabels(event, dataTarget) {
	elements.slider_horizontal.hidePointerLabels = !elements.slider_horizontal.hidePointerLabels
	elements.slider_vertical.hidePointerLabels = !elements.slider_vertical.hidePointerLabels
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"80BEBB87-B845-456F-AAC9-3FB99B31D1F3"}
 */
function onAction_logScale(event, dataTarget) {
	elements.slider_horizontal.logScale = !elements.slider_horizontal.logScale
	elements.slider_vertical.logScale = !elements.slider_vertical.logScale
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"2AD7C062-62E5-40AA-8B86-4CA24E6E4180"}
 */
function onAction_noSwitching(event, dataTarget) {
	elements.slider_horizontal.noSwitching = !elements.slider_horizontal.noSwitching
	elements.slider_vertical.noSwitching = !elements.slider_vertical.noSwitching
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"2C61E4FB-35D8-4238-8EB5-12B73F033967"}
 */
function onAction_pushRange(event, dataTarget) {
	elements.slider_horizontal.pushRange = !elements.slider_horizontal.pushRange
	elements.slider_vertical.pushRange = !elements.slider_vertical.pushRange
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"49B74B9A-3AC2-4BE4-8F32-983DC4FD2B6D"}
 */
function onAction_rightToLeft(event, dataTarget) {
	elements.slider_horizontal.rightToLeft = !elements.slider_horizontal.rightToLeft
	elements.slider_vertical.rightToLeft = !elements.slider_vertical.rightToLeft
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"57A11355-191E-4576-B158-3923BCD3A2CB"}
 */
function onAction_showOuterSelectionBars(event, dataTarget) {
	elements.slider_horizontal.showOuterSelectionBars = !elements.slider_horizontal.showOuterSelectionBars
	elements.slider_vertical.showOuterSelectionBars = !elements.slider_vertical.showOuterSelectionBars
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"F8C9437D-4699-46E7-A43E-6814A792CCFB"}
 */
function onAction_showSelectionBar(event, dataTarget) {
	elements.slider_horizontal.showSelectionBar = !elements.slider_horizontal.showSelectionBar
	elements.slider_vertical.showSelectionBar = !elements.slider_vertical.showSelectionBar
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"F93767D7-57B0-49F4-B4EE-ADF792265BFD"}
 */
function onAction_showSelectionBarEnd(event, dataTarget) {
	elements.slider_horizontal.showSelectionBarEnd = !elements.slider_horizontal.showSelectionBarEnd
	elements.slider_vertical.showSelectionBarEnd = !elements.slider_vertical.showSelectionBarEnd
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"FC9E5C28-E72E-4F7E-AB31-06F378908458"}
 */
function onAction_showTicks(event, dataTarget) {
	elements.slider_horizontal.showTicks = !elements.slider_horizontal.showTicks
	elements.slider_vertical.showTicks = !elements.slider_vertical.showTicks
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"C43B78C5-36BD-417B-8243-9A11C068E56D"}
 */
function onAction_showTicksValues(event, dataTarget) {
	elements.slider_horizontal.showTicksValues = !elements.slider_horizontal.showTicksValues
	elements.slider_vertical.showTicksValues = !elements.slider_vertical.showTicksValues
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"6C6D616C-3E5B-4F49-8126-7C980135C83F"}
 */
function onAction_visible(event, dataTarget) {
	elements.slider_horizontal.visible = !elements.slider_horizontal.visible
	elements.slider_vertical.visible = !elements.slider_vertical.visible
}

/**
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"C765E381-D563-42C8-95D2-2EA06CF83B1D"}
 */
function onDataChange_ticksTooltipFunction(oldValue, newValue, event) {
	elements.slider_horizontal.ticksTooltipFunction = ticksTooltipFunctionDP;
	elements.slider_vertical.ticksTooltipFunction = ticksTooltipFunctionDP;
	return true
}

/**
 * Handle changed data, return false if the value should not be accepted.
 * JSEvent.data will contain extra information about dataproviderid, its scope and the scope id (record datasource or form/global variable scope)
 *
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"4BEBC025-284C-4FC6-A154-7E51244307AC"}
 */
function onDataChange_getLegendFunction(oldValue, newValue, event) {

	elements.slider_horizontal.getLegendFunction = getLegendFunctionDP;
	elements.slider_vertical.getLegendFunction = getLegendFunctionDP;

	return true
}

/**
 * Handle changed data, return false if the value should not be accepted.
 * JSEvent.data will contain extra information about dataproviderid, its scope and the scope id (record datasource or form/global variable scope)
 *
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"6EE19683-D0C1-4E24-9441-C15A092BC76F"}
 */
function onDataChange_formattingFunction(oldValue, newValue, event) {

	elements.slider_horizontal.formattingFunction = formattingFunctionDP;
	elements.slider_vertical.formattingFunction = formattingFunctionDP;

	return true
}

/**
 * Handle changed data, return false if the value should not be accepted.
 * JSEvent.data will contain extra information about dataproviderid, its scope and the scope id (record datasource or form/global variable scope)
 *
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"71C5AAE2-A6E3-4A9E-8B83-DFA64FE12133"}
 */
function onDataChange_pointerColorFunction(oldValue, newValue, event) {

	elements.slider_horizontal.pointerColorFunction = pointerColorFunctionDP;
	elements.slider_vertical.pointerColorFunction = pointerColorFunctionDP;

	return true
}
