/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DA7A0C18-B418-4029-82D6-FF8D5A2F104A"}
 */
function onAction(event) {
	elements.label_15.text = "Image label on action"
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CCA77F90-5B58-4E0B-BA1E-34B74E6AA5D1"}
 */
function onRightClick(event) {
	elements.label_15.text = "Image label on right click"
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"0C504E09-0C00-4280-B8F3-5CEFE3310091"}
 */
function onAction_centerImage(event, dataTarget) {
	elements.imagelabel_10.centerImage = !elements.imagelabel_10.centerImage;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"679A5709-2CD9-4C65-9080-AA37B5C98462"}
 */
function onAction_enabled(event, dataTarget) {
	elements.imagelabel_10.enabled = !elements.imagelabel_10.enabled;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"DCF37455-1547-4870-BE2C-91CD14BA74F8"}
 */
function onAction_visible(event, dataTarget) {
	elements.imagelabel_10.visible = !elements.imagelabel_10.visible;
}
