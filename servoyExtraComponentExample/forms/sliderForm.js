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
