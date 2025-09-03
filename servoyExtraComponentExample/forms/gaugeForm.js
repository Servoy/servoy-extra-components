/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A8C2F1CC-75AA-4D42-9B55-D97E5C08DBC8"}
 */
var unitsDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"882888CA-05FE-4D5D-8586-49D1B00267E9",variableType:8}
 */
var minValueDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"FF2FCE1B-6DF5-4B1C-A0F4-24200222F7F3",variableType:8}
 */
var maxValueDP = null;

/**
 * @properties={typeid:35,uuid:"AF2496E0-2D70-4AA0-B68D-57ABA5BF5160",variableType:-4}
 */
var bordersDP = true;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EFBB4B0F-B2C1-4C49-BD5E-20DF234ADBED",variableType:8}
 */
var borderShadowWidthDP = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"A98986A3-0803-44F6-BEF7-2A137FB7DBA2",variableType:8}
 */
var borderOuterWidthDP = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"1FCC45F7-2729-4CD2-BE24-E41C26BEBECB",variableType:8}
 */
var borderMiddleWidthDP = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"E704DBC0-4EEF-479E-9560-BD08B09306F6",variableType:8}
 */
var borderInnerWidthDP = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"9986132A-439C-42A4-8789-B8CB778FCA60",variableType:8}
 */
var animationDurationDP = 500;

/**
 * @properties={typeid:35,uuid:"EB98258A-D4F1-4A05-A57B-A786B1CE88DD",variableType:-4}
 */
var animationDP = true;

/**
 * @properties={typeid:35,uuid:"30C762F8-0B1C-44C9-BC6D-3A4F92FFB158",variableType:-4}
 */
var animatedOnInitDP = true;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4DAF6BBC-691C-480D-A0B3-96D7F320A541"}
 */
var animationRuleDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"4CD3C3B8-F3BB-41B5-BDE7-588BF2A9DF4A"}
 */
var linearGaugeValue = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"3ECE3EF8-C954-4823-9FBC-E751378EC309"}
 */
var radialGaugeValue = null;

/**
 * Called when the dataProvider value changed.
 *
 * @param oldValue
 * @param newValue
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"1DB8A7FB-1253-484A-AFED-418391B90098"}
 */
function onDataChange(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"8270A832-A648-4E37-9A95-F4748A7FAFA7"}
 */
function onAction_animatedValue(event, dataTarget) {
	elements.gauge_radial.animationOptions.animatedValue = !elements.gauge_radial.animationOptions.animatedValue
	elements.gauge_linear.animationOptions.animatedValue = !elements.gauge_linear.animationOptions.animatedValue
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"7FD267BE-F1F9-4F40-9D39-C2D816E106F7"}
 */
function onAction_animatedOnInit(event, dataTarget) {
	elements.gauge_radial.animationOptions.animateOnInit = !elements.gauge_radial.animationOptions.animateOnInit
	elements.gauge_linear.animationOptions.animateOnInit = !elements.gauge_linear.animationOptions.animateOnInit
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"D7DA969B-EDEE-40FF-9C82-055465595BAC"}
 */
function onAction_animation(event, dataTarget) {
	elements.gauge_radial.animationOptions.animation = !elements.gauge_radial.animationOptions.animation
	elements.gauge_linear.animationOptions.animation = !elements.gauge_linear.animationOptions.animation
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
 * @properties={typeid:24,uuid:"CA62AD57-924C-4AB6-BAC8-43C8E85E7C9E"}
 */
function onDataChange_animationDuration(oldValue, newValue, event) {
	elements.gauge_radial.animationOptions.animationDuration = animationDurationDP
	elements.gauge_linear.animationOptions.animationDuration = animationDurationDP
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
 * @properties={typeid:24,uuid:"5E2FF5F0-4746-44D5-A911-CAFD14F42E95"}
 */
function onDataChange_animationRule(oldValue, newValue, event) {
	elements.gauge_radial.animationOptions.animationRule = animationRuleDP
	elements.gauge_linear.animationOptions.animationRule = animationRuleDP
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
 * @properties={typeid:24,uuid:"4247A629-6032-413B-80F1-83F72197C75E"}
 */
function onDataChange_borderInnerWidth(oldValue, newValue, event) {
	elements.gauge_radial.borderOptions.borderInnerWidth = borderInnerWidthDP
	elements.gauge_linear.borderOptions.borderInnerWidth = borderInnerWidthDP
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
 * @properties={typeid:24,uuid:"1E5992C5-30DA-4419-8257-A3C2134819F3"}
 */
function onDataChange_borderMiddleWidth(oldValue, newValue, event) {
	elements.gauge_radial.borderOptions.borderMiddleWidth = borderMiddleWidthDP
	elements.gauge_linear.borderOptions.borderMiddleWidth = borderMiddleWidthDP
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
 * @properties={typeid:24,uuid:"0036DAEF-7342-449F-A18A-56C2C68597B1"}
 */
function onDataChange_borderOuterWidth(oldValue, newValue, event) {
	elements.gauge_radial.borderOptions.borderOuterWidth = borderOuterWidthDP
	elements.gauge_linear.borderOptions.borderOuterWidth = borderOuterWidthDP
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
 * @properties={typeid:24,uuid:"1C08F195-C828-4508-BC0D-A767A59D86CF"}
 */
function onDataChange_borderShadowWidth(oldValue, newValue, event) {
	elements.gauge_radial.borderOptions.borderShadowWidth = borderShadowWidthDP
	elements.gauge_linear.borderOptions.borderShadowWidth = borderShadowWidthDP
	return true
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"9C9B4D63-377C-4D66-9821-DCF67E5E864D"}
 */
function onAction_borders(event, dataTarget) {
	elements.gauge_radial.borderOptions.borders = !elements.gauge_radial.borderOptions.borders
	elements.gauge_linear.borderOptions.borders = !elements.gauge_linear.borderOptions.borders
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
 * @properties={typeid:24,uuid:"8B2CEC26-ABF1-4C9C-BD59-AE56A1666F36"}
 */
function onDataChange_maxValue(oldValue, newValue, event) {
	// TODO Auto-generated method stub
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
 * @properties={typeid:24,uuid:"C73B7968-2910-44CD-9DD6-35AEE72A5069"}
 */
function onDataChange_minValue(oldValue, newValue, event) {
	// TODO Auto-generated method stub
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
 * @properties={typeid:24,uuid:"94CAC5AC-50B8-47ED-8C5B-50CFDF8F673F"}
 */
function onDataChange_units(oldValue, newValue, event) {
	// TODO Auto-generated method stub
	return true
}
