/**
 * Component needs dataproviders from the foundset for the following: imageId, image, caption and thumbnail.
 */
var imagesFoundset;

/**
 * This will be the height of the component when used inside a responsive form; it will affect only responsive form usage.
 */
var responsiveHeight;

/**
 * The default / minimum value is 5 (the component will not render less than 5 images); it will load more when scrolling or using next in gallery mode.
 */
var imageBatchSize;



var handlers = {
    /**
     * @param {JSEvent} event
     * @param {String} imageId
     */
    onHoverButtonClicked: function() {}
};


/**
 * Opens the lightbox gallery at the specified index, defaulting to the first image if the index is invalid.
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
