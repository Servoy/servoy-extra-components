/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B6B22F16-BFC6-4498-8AA1-39659E566D11"}
 */
var hoverButtonIconDP = 'fa fa-trash fa-lg';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"FE6A3513-5350-4879-9B7C-54E6B1119372"}
 */
var buttonTextDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"40B26EA0-D0A9-4A33-BB18-9FF20B25F1A6"}
 */
var buttonStyleClassDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1D5F6898-5A99-499E-B6BB-81EFBD5E074A"}
 */
var albumLabelDP = 'image %1 of %2';

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B8B835DC-3091-4904-9E16-BC2292C38D29",variableType:8}
 */
var positionFromTopDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"68946F3D-4831-4D19-9699-E2C1521248DB",variableType:8}
 */
var maxImageHeightDP = null;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2A70B16F-EEE2-483A-A333-6249BF15AB19",variableType:8}
 */
var maxImageWidthDP = null;

/**
 * @properties={typeid:35,uuid:"B8FE0830-9BAB-4053-B2B4-73B818678760",variableType:-4}
 */
var dataHorizontal = plugins.http.getMediaData("media:///i98rzu.jpg");
/**
 * @properties={typeid:35,uuid:"CBE89003-F812-48DB-9D39-388406C82C12",variableType:-4}
 */
var dataVertical = plugins.http.getMediaData("media:///wallpaperPortrait.jpg");

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"FA3DA4B0-3126-4D0E-903F-FF812A972756",variableType:4}
 */
var fadeDuration = 100;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"B55F4B3F-30BB-4422-A55E-DF8179F555D2",variableType:4}
 */
var imageFadeDuration = 100;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"29855D78-C330-453C-A4EC-181C9E1F536C",variableType:4}
 */
var resizeDuration = 100;
/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"6AACF11A-379C-4189-AF29-548508682B5D",variableType:4}
 */
var batchSize = 5;

/**
 * @properties={typeid:24,uuid:"F757184F-B9AA-4E53-80C8-D508394540A4"}
 */
function createData() {
	var record;
	var imageHorizontal = plugins.images.getImage(dataHorizontal)
	var thumbHorizontal = imageHorizontal.resize(400, 400)
	var imageVertical = plugins.images.getImage(dataVertical)
	var thumbVertical = imageVertical.resize(400, 400)
	var fsPics = datasources.mem.pictures.getFoundSet();
	fsPics.loadAllRecords();
	fsPics.deleteAllRecords();
	for (var i = 0; i < 5; i++) {
		record = fsPics.getRecord(fsPics.newRecord());
		record.picture = dataHorizontal;
		record.name = 'horizontal ' + i.toString();
		record.sort = (i + 1) * 10 + 1
		record.id = application.getUUID();
		record.thumbnail = thumbHorizontal;

		record = fsPics.getRecord(fsPics.newRecord());
		record.picture = dataVertical;
		record.name = 'vertical ' + i.toString();
		record.sort = (i + 1) * 10 + 2
		record.id = application.getUUID();
		record.thumbnail = thumbVertical;

	}
	databaseManager.saveData(fsPics)
}

/**
 * @properties={typeid:24,uuid:"06AB2BCA-0BCF-4B77-A97F-FDB189A43FB3"}
 */
function initDurations() {
	elements.lightboxgallery_17.imageFadeDuration = imageFadeDuration;
	elements.lightboxgallery_17.fadeDuration = fadeDuration;
	elements.lightboxgallery_17.resizeDuration = resizeDuration;
	elements.lightboxgallery_17.imageBatchSize = batchSize;
}

/**
 * @properties={typeid:24,uuid:"EE3765D4-8B40-496D-AF30-1EC8608E85BB"}
 */
function onShow() {
	createData();
}

/**
 * @param {JSEvent} event
 * @param {String} imageId
 *
 * @properties={typeid:24,uuid:"0B0E8A61-2FC5-4FC4-95F0-C7357C3F927D"}
 */
function onHoverButtonClicked(event, imageId) {
	elements.label_1.text = 'Hover button clicked! ';
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"EDF7A059-75A7-40E3-9C5E-967A1DA5D3B6"}
 */
function onShowLightbox(event) {
	elements.lightboxgallery_17.showLightbox();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0BFFC76E-217A-44B4-AFDB-F0E913876B92"}
 */
function onRefresh(event) {
	elements.lightboxgallery_17.refresh();
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"42C88724-15EB-4045-B1BF-7B2E58AD4B34"}
 */
function onAction_galleryVisible(event, dataTarget) {
	elements.lightboxgallery_17.galleryVisible = !elements.lightboxgallery_17.galleryVisible;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"9D6D2DAE-98EE-4695-B201-3B61D18B1AFD"}
 */
function onAction_enabled(event, dataTarget) {
	elements.lightboxgallery_17.enabled = !elements.lightboxgallery_17.enabled;
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
 * @properties={typeid:24,uuid:"86F43030-9ABE-47D0-AD6A-64A011E4F8E7"}
 */
function onDataChange_maxImageWidth(oldValue, newValue, event) {
	elements.lightboxgallery_17.maxImageWidth = maxImageWidthDP;
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
 * @properties={typeid:24,uuid:"57715F54-55AC-4B64-8FDD-56A27A60ACE1"}
 */
function onDataChange_maxImageHeight(oldValue, newValue, event) {
	elements.lightboxgallery_17.maxImageHeight = maxImageHeightDP;
	return true
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"B29CE728-1813-4311-8F71-2554B196ABBA"}
 */
function onAction_fitImagesInView(event, dataTarget) {
	elements.lightboxgallery_17.fitImagesInViewport = !elements.lightboxgallery_17.fitImagesInViewport;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"8F02F95D-7E31-4B32-BBE4-E8572A0365C8"}
 */
function onAction_showCaptionInGallery(event, dataTarget) {
	elements.lightboxgallery_17.showCaptionInGallery = !elements.lightboxgallery_17.showCaptionInGallery;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"CD8A7A3E-191A-4BEA-A6F1-A0F711AD3A43"}
 */
function onAction_showImageNumberLabel(event, dataTarget) {
	elements.lightboxgallery_17.showImageNumberLabel = !elements.lightboxgallery_17.showImageNumberLabel;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"453207C7-C772-4122-85B5-75DB24036F87"}
 */
function onAction_wrapArround(event, dataTarget) {
	elements.lightboxgallery_17.wrapAround = !elements.lightboxgallery_17.wrapAround;
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
 * @properties={typeid:24,uuid:"4554FE10-A2F3-4BFE-87FD-2533433F1959"}
 */
function onDataChange_fadeDuration(oldValue, newValue, event) {
	elements.lightboxgallery_17.fadeDuration = fadeDuration;
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
 * @properties={typeid:24,uuid:"CE9D530F-9494-4B1F-85AB-D25F32D6F168"}
 */
function onDataChange_resizeDuration(oldValue, newValue, event) {
	elements.lightboxgallery_17.resizeDuration = resizeDuration;
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
 * @properties={typeid:24,uuid:"EA97D9B1-A298-4AC4-852D-AADD9F062EF3"}
 */
function onDataChange_positionFromTop(oldValue, newValue, event) {
	elements.lightboxgallery_17.positionFromTop = positionFromTopDP;
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
 * @properties={typeid:24,uuid:"11A97C4A-985F-41F8-88D6-81E7889CFF33"}
 */
function onDataChange_imageFadeDuration(oldValue, newValue, event) {
	elements.lightboxgallery_17.imageFadeDuration = imageFadeDuration;
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
 * @properties={typeid:24,uuid:"B92C2FDA-538C-4637-88F9-C0046ED41EAA"}
 */
function onDataChange_imageBatchSize(oldValue, newValue, event) {
	elements.lightboxgallery_17.imageBatchSize = batchSize;
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
 * @properties={typeid:24,uuid:"37700C37-DB59-485E-81F9-A6CA1B5DE8B4"}
 */
function onDataChange_albumLabel(oldValue, newValue, event) {
	elements.lightboxgallery_17.albumLabel = albumLabelDP;
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
 * @properties={typeid:24,uuid:"B52FBAC8-CD47-4B9C-8EEC-0F121686F9D8"}
 */
function onDataChange_buttonStyleClass(oldValue, newValue, event) {
	elements.lightboxgallery_17.buttonStyleClass = buttonStyleClassDP;
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
 * @properties={typeid:24,uuid:"CAECDD30-49DB-4B67-9FC5-8ED866304BDB"}
 */
function onDataChange_buttonText(oldValue, newValue, event) {
	elements.lightboxgallery_17.buttonText = buttonTextDP;
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
 * @properties={typeid:24,uuid:"AA734057-5215-48D6-B4C4-384301D9767B"}
 */
function onDataChange_hoverButtonIcon(oldValue, newValue, event) {
	elements.lightboxgallery_17.hoverButtonIcon = hoverButtonIconDP;
	return true
}
