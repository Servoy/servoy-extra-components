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

