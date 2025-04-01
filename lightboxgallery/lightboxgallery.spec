{
	"name": "servoyextra-lightboxgallery",
	"displayName": "Lightbox Gallery",
	"categoryName": "Media",
	"version": 1,
	"icon": "servoyextra/lightboxgallery/lightbox.png",
	"definition": "servoyextra/lightboxgallery/lightboxgallery.js",
	"doc": "servoyextra/lightboxgallery/lightboxgallery_doc.js",
	"libraries": [
		{"name":"lightbox.min.js", "version":"2.10.0", "url":"servoyextra/lightboxgallery/js/lightbox.min.js", "mimetype":"text/javascript"},
		{"name":"lightbox.min.css", "version":"2.10.0", "url":"servoyextra/lightboxgallery/css/lightbox.min.css", "mimetype":"text/css"},
		{"name":"lightboxgallery.css", "version":"1.0.0", "url":"servoyextra/lightboxgallery/lightboxgallery.css", "mimetype":"text/css"}
	],
	"keywords": ["collection", "library"],
	"model":
	{
		"imagesFoundset"			: { "type": "foundset", "initialPreferredViewPortSize": 5, "dataproviders": ["image", "caption", "thumbnail", "imageId"], "tags": { "doc": "Component needs dataproviders from the foundset for the following: imageId, image, caption and thumbnail."} },
		"maxImageWidth"				: { "type": "int" },
		"maxImageHeight"			: { "type": "int" },
		"albumLabel"				: { "type": "string", "default": "image %1 of %2" },
		"fadeDuration"				: { "type": "int", "default": 600 },
		"fitImagesInViewport"		: { "type": "boolean", "default": true },
		"imageFadeDuration"			: { "type": "int", "default": 600 },
		"positionFromTop"			: { "type": "int", "default": 50 },
		"resizeDuration"			: { "type": "int", "default": 700 },
		"wrapAround"				: { "type": "boolean", "default": false },
		"galleryVisible"			: { "type": "boolean", "default": true },
		"showCaptionInGallery" 		: { "type" : "boolean", "default": false },
		"showImageNumberLabel"		: { "type": "boolean", "default": true },
		"hoverButtonIcon"			: { "type": "string", "default": "fa fa-trash fa-lg" },
		"buttonText"				: { "type": "tagstring" },
		"buttonStyleClass"			: { "type": "styleclass" },
		"enabled"					: { "type": "boolean", "default": "false" },
		"responsiveHeight"			: { "type": "int", "default": 300, "tags": { "doc": "This will be the height of the component when used inside a responsive form; it will affect only responsive form usage."} },
		"imageBatchSize"			: { "type": "int", "default": 5, "tags": { "doc": "The default / minimum value is 5 (the component will not render less than 5 images); it will load more when scrolling or using next in gallery mode."} },
		"imagesDataset"             : { "type": "image[]", "pushToServer": "deep" }
	},
	"api": {
		"showLightbox": {
			"parameters": [
				{ "name": "index", "type": "int", "optional": true }
			]
		},
		"refresh":{}
	},
	"handlers": {
		"onHoverButtonClicked": {
			"parameters": [
				{ "name": "event", "type": "JSEvent" },
				{ "name": "imageId", "type": "string" }
			]
		}
	},
	"types": 
    {
        "image": {
            "imageUrl": { "type": "string" },
            "caption": { "type": "tagstring" },
            "thumbnailUrl": { "type": "string" },
            "id": { "type": "string" }
        }
    }
}