/*
 * A Servoy Extra Component for displaying images with customizable styling and events.
 */

/**
 * Indicates whether the Image Label component is enabled.
 */
var enabled;

/**
 * Holds the media resource to be displayed in the image label.
 */
var media;

/**
 * Specifies the CSS style class for custom styling of the image label.
 */
var styleClass;

/**
 * Defines the tab order sequence for the image label component.
 */
var tabSeq;

/**
 * Indicates whether the image label is visible.
 */
var visible;

/**
 * Determines if the image should be centered within the component.
 */
var centerImage;

var handlers = {
    /**
     * Handler for the action event. Triggered when the image label is activated.
     * 
     * @param {JSEvent} event The event object.
     */
    onActionMethodID: function() {},

    /**
     * Handler for the right-click event on the image label.
     * 
     * @param {JSEvent} event The event object.
     */
    onRightClickMethodID: function() {}
};