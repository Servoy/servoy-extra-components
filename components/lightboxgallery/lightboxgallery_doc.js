/*
 * A Servoy Extra Component that displays a lightbox gallery for images with captions and thumbnails.
 * Component needs dataproviders from the foundset for the following: imageId, image, caption and thumbnail.
 */

/**
 * The foundset containing the images and related dataproviders for image, caption, thumbnail and imageId.
 */
var imagesFoundset;

/**
 * The maximum width for images in the gallery.
 */
var maxImageWidth;

/**
 * The maximum height for images in the gallery.
 */
var maxImageHeight;

/**
 * The label format for the album (e.g. "image %1 of %2").
 */
var albumLabel;

/**
 * The duration (in milliseconds) of the fade effect when transitioning images.
 */
var fadeDuration;

/**
 * When true, images are scaled to fit within the viewport.
 */
var fitImagesInViewport;

/**
 * The duration (in milliseconds) of the fade effect for image transitions.
 */
var imageFadeDuration;

/**
 * The vertical offset (in pixels) from the top when displaying the lightbox.
 */
var positionFromTop;

/**
 * The duration (in milliseconds) of the resizing animation.
 */
var resizeDuration;

/**
 * When true, navigating past the last image wraps around to the first image.
 */
var wrapAround;

/**
 * Flag indicating whether the gallery is visible.
 */
var galleryVisible;

/**
 * When true, captions are displayed in the gallery.
 */
var showCaptionInGallery;

/**
 * When true, a label showing the image number is displayed.
 */
var showImageNumberLabel;

/**
 * The icon displayed on the hover button (e.g. "fa fa-trash fa-lg").
 */
var hoverButtonIcon;

/**
 * The text displayed on the button associated with the gallery.
 */
var buttonText;

/**
 * CSS style classes applied to the button.
 */
var buttonStyleClass;

/**
 * Flag indicating whether the component is enabled for user interaction.
 */
var enabled;

/**
 * This will be the height of the component when used inside a responsive form; it will affect only responsive form usage.
 */
var responsiveHeight;

/**
 * The default / minimum value is 5 (the component will not render less than 5 images); it will load more when scrolling or using next in gallery mode.
 */
var imageBatchSize;

/**
 * Holds a collection of images to be displayed in the lightbox gallery.
 * Each image object includes details such as the image URL, caption, thumbnail, and identifier.
 */
var imagesDataset;

var handlers = {
    /**
     * Called when the hover button is clicked.
     *
     * @param {JSEvent} event The event object associated with the click.
     * @param {String} imageId The identifier of the image related to the click.
     */
    onHoverButtonClicked: function() {}
};


/**
 * Opens the lightbox gallery at the specified index, defaulting to the first image if the index is invalid.
 * 
 * @param {number} [index] The index of the image to display in the lightbox. If negative, the gallery will open at the first image.
 */
function showLightbox() {
}

/**
 * Refreshes the component by reinitializing its configuration and loading data. 
 * This can be used to apply updates or reset the gallery state.
 */
function refresh() {
}

var svy_types = {
    /**
     * Defines an image object for the Lightbox Gallery.
     */
    image: {
        /**
         * URL of the main image.
         */
        imageUrl: null,
        /**
         * Caption text for the image.
         */
        caption: null,
        /**
         * URL of the thumbnail image.
         */
        thumbnailUrl: null,
        /**
         * Unique identifier for the image.
         */
        id: null
    }
};
