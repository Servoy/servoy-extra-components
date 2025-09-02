/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B3CDE1F3-AB2D-4F4E-B3DD-3DD1D6DA0D2A"}
 */
var styleClassDP = null;

/**
 * @properties={typeid:35,uuid:"00F53BE2-6403-4DEB-9A52-3C480D314465",variableType:-4}
 */
var visibleDP = true;

/**
 * @properties={typeid:35,uuid:"B1E2D7B2-D985-4BBD-9BEE-5126D6EE736F",variableType:-4}
 */
var showControlsDP = true;

/**
 * @properties={typeid:35,uuid:"82791980-422B-4E11-88DE-375904B007F3",variableType:-4}
 */
var allowFullScreen = true;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"C6F88537-26DA-400B-A7D5-0D0DFF2DE7AF",variableType:8}
 */
var videoWidthDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"5DA49586-201B-4B31-8961-8D22C8122B01",variableType:8}
 */
var videoHeightDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"55399A49-6EF9-4AAD-A343-9C392D2BE799"}
 */
var embeddedVideoURLDP = 'https://www.youtube.com/embed/Ic3n5o7PLD0?si=mz26zqG1mEM1xdSk';

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
 * @properties={typeid:24,uuid:"889A7744-066C-476D-97BD-81AB41965ACE"}
 */
function onDataChange_videoURL(oldValue, newValue, event) {
	elements.embeddedyoutube_10.embeddedVideoURL = embeddedVideoURLDP;
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
 * @properties={typeid:24,uuid:"32879357-27A7-46B2-8ECC-584B356E54AF"}
 */
function onDataChange_videoHeight(oldValue, newValue, event) {
	elements.embeddedyoutube_10.videoHeight = videoHeightDP;
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
 * @properties={typeid:24,uuid:"A4B48FD5-57FC-4F7B-9630-5B774C0CF8AE"}
 */
function onDataChange_videoWidth(oldValue, newValue, event) {
	elements.embeddedyoutube_10.videoWidth = videoWidthDP;
	return true
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"72A3545F-BA49-4553-8010-DB58F1B89B36"}
 */
function onAction_allowFullScreen(event, dataTarget) {
	elements.embeddedyoutube_10.allowFullScreen = !elements.embeddedyoutube_10.allowFullScreen;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"FD7208E2-D654-482C-A71F-52D7DBB62DD3"}
 */
function onAction_modestBranding(event, dataTarget) {
	elements.embeddedyoutube_10.modestBranding = !elements.embeddedyoutube_10.modestBranding;	
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"DA230AB2-6B73-4278-81EB-0AF0D1E85DEA"}
 */
function onAction_showControls(event, dataTarget) {
	elements.embeddedyoutube_10.showControls = !elements.embeddedyoutube_10.showControls;	
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"C40C7C9C-09DF-4612-8A40-0DE4F10B5A5E"}
 */
function onAction_showRelatedVideoAtEnd(event, dataTarget) {
	elements.embeddedyoutube_10.showRelatedVideosAtEnd = !elements.embeddedyoutube_10.showRelatedVideosAtEnd;	
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"0AC93400-B925-46D3-BA5C-21B7C06FABE2"}
 */
function onAction_visible(event, dataTarget) {
	elements.embeddedyoutube_10.visible = !elements.embeddedyoutube_10.visible;
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
 * @properties={typeid:24,uuid:"CF8F8D4D-B6E1-4F16-B72D-372FFFCF196D"}
 */
function onDataChange_styleClass(oldValue, newValue, event) {
	elements.embeddedyoutube_10.styleClass = styleClassDP;
	return true
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"110B9685-3AF7-4E24-8A43-BDD2A87BA28B"}
 */
function onAction_autoPlay(event, dataTarget) {
	elements.embeddedyoutube_10.autoPlay = !elements.embeddedyoutube_10.autoPlay;
}
