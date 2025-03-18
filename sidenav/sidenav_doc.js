var menu;

var servoyMenu;

var tabSeq;

var containedForm;

var headerForm;

var footerForm;

var relationName;

/**
 * Width of the container
 */
var sidenavWidth;

/**
 * Height of the container, set only in responsive forms.
 */
var responsiveHeight;

var iconOpenStyleClass;

var iconCloseStyleClass;

var iconExpandStyleClass;

var iconCollapseStyleClass;

var styleClass;

var slidePosition;

var slideAnimation;

var togglePosition;

var scrollbarPosition;

var open;

var enabled;

var animate;

var size;

var location;

var visible;


var handlers = {
    /**
     * @param {Object} menuItemId
     * @param {JSEvent} event
     *
     * @returns {Boolean}
     */
    onMenuItemSelected: function() {},

    /**
     * @param {Object} menuItemId
     * @param {JSEvent} event
     */
    onMenuItemExpanded: function() {},

    /**
     * @param {Object} menuItemId
     * @param {JSEvent} event
     */
    onMenuItemCollapsed: function() {},

    /**
     * @param {JSEvent} event
     */
    onOpenToggled: function() {}
};


/**
 * @deprecated use setSelectedMenuItem(id, false, false) instead.
 * 
 * Select the menu item with the given id.
 * 
 * This function doesn't wait for a return value; 
 * use setSelectedMenuItem if you want to know if the menu item can be select successfully
 * @public
 *
 * @param {String|Number} id
 *
 */
function setSelectedMenuItemAsync(id) {
}


/**
 * Returns true if the menuItem is expanded.
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item to check.
 * @return {Boolean} Returns `true` if the specified menu item is currently expanded, otherwise `false`.
 */
function isMenuItemExpanded(menuItemId) {
}

/**
 * Returns true if the menuItem and all it's ancestors are enabled. <br/>
 * Return false if menuItemId cannot be found.
 * <i>NOTE: The method returns false if any ancestor of the menuItem is not enabled; if the property enabled of the menuItem is set to true, but has a parent with the enabled property set to false, then isMenuItemEnabled returns false. </i><br/>
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item to check.
 * @return {Boolean} Returns `true` if the specified menu item and all its ancestors are enabled. Returns `false` if the `menuItemId` cannot be found or if any ancestor of the menu item is not enabled.
 */
function isMenuItemEnabled(menuItemId) {
}

/**
 * Retrieves the screen location of a specific menu item. Returns the location as point (object with x and y properties).
 * 
 * @param {Object} menuItemId The node to retrieve location for.
 * @return {Point} the location of the menu item.
 */
function getLocation(nodeId) {
}

/**
 * Retrieves the size of a specific menu item. Returns the size as dimension (object with width and height properties).
 * 
 * @param {Object} menuItemId the id to retrieve size for.
 * @return {Dimension} the size of the menu item.
 */
function getSize(menuItemId) {
}

/**
 * Init the menu setting the root menuItems.
 *
 * @public
 * @param {Array<CustomType<servoyextra-sidenav.MenuItem>>} menuItems is an array of MenuItem objects.
 *               A MenuItem type is like this {{id: String|Number, text: String=, styleClass: String=, iconStyleClass: String=, enabled: Boolean=, data: Object=, menuItems: Array=, isDivider : Boolean=}} 
 *               Each MenuItem object should set the required properties 'id', which uniquely identifies the menuItem object in menu, and 'text' property.
 *               The MenuItem may contain the optional properties 'styleClass', 'iconStyleClass', 'data', 'enabled', 'menuItems', 'isDivider'
 *
 * @example var menu = [{
 *  id: 1,
 *  text: "Sample Item #1",
 *  styleClass : "sn-large",
 *  iconStyleClass:  "glyphicon glyphicon-search",
 *  data: { description: "This is sample information that can be added to a menuItem" },
 *  menuItems: [{
 *    id: 5,
 *    text: "Sub Item #1"
 *    }, {
 *    id: 6,
 *    text: "Sub Item #2"
 *  }]
 *  }, {
 *  id: 2,
 *  text: "Sample Item #2"
 *  },{
 *  isDivider: true
 *  },{
 *  id: 3,
 *  text: "Sample Item #3",
 *  enabled: false
 *  }];
 *  elements.sideNavigation.setRootMenuItems(menu);
 */
function setRootMenuItems(menuItems) {
}

/**
 * Returns the root menu object
 * @public
 *
 * @return {Array<CustomType<servoyextra-sidenav.MenuItem>>} An array of root menu item objects representing the top-level menu structure of the sidenav.
 */
function getRootMenuItems() {
}

/**
 * Returns the menuItem object
 * @public
 *
  * @param {String|Number} menuItemId The unique identifier of the menu item to retrieve.
 * @return {CustomType<servoyextra-sidenav.MenuItem>} The menu item object corresponding to the specified `menuItemId`.
 */
function getMenuItem(menuItemId) {
}

/**
 * Returns the parent menuItem object of the menu item with id menuItemId
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item whose parent menu item is to be retrieved.
 * @return {CustomType<servoyextra-sidenav.MenuItem>} The parent menu item object of the specified `menuItemId`. 
 */
function getParentMenuItem(menuItemId) {
}

/**
 * Enable or disable the menuItem
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item to enable or disable.
 * @param {Boolean} enabled A boolean value where `true` enables the menu item and `false` disables it.
 *
 * @return {Boolean} Returns `false` if the `menuItemId` cannot be found, otherwise `true` indicating the operation was successful.
 */
function setMenuItemEnabled(menuItemId, enabled) {
}

/**
 * Add a menu item. The menu is added as sub Menu Item if a menuItemId is provided, otherwise is added in root.
 * If index is provided the menu is added at the specified index position, otherwise is added as last element.
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {CustomType<servoyextra-sidenav.MenuItem>} menuItem An array containing the menu item(s) to be added. Each menu item should include properties such as `id`, `text`, `styleClass`, `iconStyleClass`, `data`, and optionally `menuItems` for nested sub-menu items.
 * @param {String|Number} [menuItemId] add the item as subMenuItem of the menuItemId. Default add the menuItem as root.
 * @param {Number} [index]	0-based. The index at which to insert the item. Index value should not be greater then number of sibelings. Default is at the end.
 * 
 * @example<pre> var menuItem = {
  id: 100,
  text: "Sample Item #1",
  styleClass : "nav-large nav-primary",
  iconStyleClass:  "glyphicon glyphicon-search",
  data: { description: "This is sample information that can be added to a menuItem" },
  menuItems: [{
        id: 101,
        text: "Sub Item #1"
        }, {
        id: 102,
        text: "Sub Item #2"}]
  };
  elements.sideNavigation.addMenuItem(menuItem, 1, 0);</pre>
 * 
 * @return {Boolean} Returns `false` if the `menuItemId` cannot be found, otherwise `true` indicating the menu item was successfully added.
 * */
function addMenuItem(menuItem, menuItemId, index) {
}

/**
 * Remove the menu item and all it's subMenuItems from the tree.
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item to be removed, including all its sub-menu items.
 *
 * @return {Boolean} True if the menu item was successfully removed; false if the specified menuItemId could not be found.
 */
function removeMenuItem(menuItemId) {
}

/**
* Returns the sub menu items of the menu item with id 'menuItemId'
* @public
*
* @param {String|Number} menuItemId The unique identifier of the menu item whose sub-menu items are to be retrieved.
* @return {Array<CustomType<servoyextra-sidenav.MenuItem>>} An array of sub-menu items for the specified menu item.
*/
function getSubMenuItems(menuItemId) {
}

/**
 * Set the menuItems as sub menu items of the menu item with id 'menuItemId'
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item to which the provided sub-menu items should be added.
 * @param {Array<CustomType<servoyextra-sidenav.MenuItem>>} menuItems String|Number, text: String=, styleClass: String=, iconStyleClass: String=, enabled: Boolean=, data: Object=, menuItems: Array=, isDivider : Boolean=}>} menuItems is an array of MenuItem objects.
 *          Each MenuItem object should set the required properties 'id', which uniquely identifies the menuItem object in menu, and 'text' property. 
 *          The MenuItem may contain the optional properties 'styleClass', 'iconStyleClass', 'data', 'enabled', 'menuItems', 'isDivider'.
 *
 * @example <pre>var menuItems = [{
 *  id: 10,
 *  text: "Sample Item #1",
 *  styleClass : "sn-large",
 *  iconStyleClass:  "glyphicon glyphicon-search",
 *  data: { description: "This is sample information that can be added to a menuItem" },
 *  menuItems: [{
 *    id: 12,
 *    text: "Sub Item #1"
 *    }
 *  }]
 *  }, {
 *  id: 11,
 *  text: "Sample Item #2"
 *  },{
 *  isDivider: true
 *  }];
 *  elements.sideNavigation.setSubMenuItems(menuItems);</pre>
 *
  * @return {Boolean} Returns `false` if the `menuItemId` cannot be found, otherwise `true` indicating the sub-menu items were successfully set.
 */
function setSubMenuItems(menuItemId, menuItems) {
}

/**
 * Remove all the sub menu items of the menu item with id 'menuItemId'
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item whose sub-menu items are to be removed.
 *
 * @return {Boolean} True if the sub-menu items were successfully set; false if the specified menuItemId could not be found. 
 */
function removeSubMenuItems(menuItemId) {
}

/**
 * Remove all the menu items. If depth is specified removes all the menu items at depth.
 * If depth is equal to 1 all roots will be removed. Default depth is 1.
 * 
 * @public
 * 
 * @example 
 * <pre>
 * // clear the whole menu removing all nodes. 
 * elements.sidenav.clearMenuItems();
 * 
 * // clear menu at depth 2 removes the sub menu items of each root menu.
 * elements.sidenav.clearMenuItems(2);
 * </pre>
 *
 * @param {Number} [depth] 1-based. Default 1.
 */
function clearMenuItems(depth) {
}

/**
 * Returns the selected menuItem.
 * @public
 *
 * @param {Number} [level] if level is provided search for the selected menu item at level.
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>} The selected menu item object.
 */
function getSelectedMenuItem(level) {
}

/**
 * Select the menu item with the given id.
 * If level is provided search is optimized since it will search only within the descendant of the selected menuItem at level.
 * For example if a root menuItem is selected and level is equal 2 search only in the subMenuItems of the selected root.
 * Return false if menuItemId cannot be found or is disabled.
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item to select.
 * @param {Boolean} [mustExecuteOnMenuItemSelected] Force the onMenuItemSelect to be executed. Default false.
 * @param {Boolean} [mustExecuteOnMenuItemExpand] Force the onMenuItemExpand to be executed. Default false.
 * @param {Number} [level] reduce the search to the selected menuItem at level, if any menuItem is selected at level.
 *
 * @return {Boolean} Returns `true` if the menu item is successfully selected, otherwise `false` if the `id` cannot be found or the menu item is disabled.
 *
 */
function setSelectedMenuItem(menuItemId, mustExecuteOnMenuItemSelected, mustExecuteOnMenuItemExpand, level) {
}

/**
 * Force the menuItem to be expanded or collapsed.
 * Return false if menuItemId cannot be found or is disabled.
 * @public
 *
 * @param {String|Number} menuItemId The unique identifier of the menu item to expand or collapse.
 * @param {Boolean} expanded force the menuItem to expand if true, is collapsed otherwise
 * @param {Boolean} [mustExecuteOnMenuItemExpand] Force the onMenuItemExpand to be executed. Default false.
 *
 * @return {Boolean} Returns `false` if the `menuItemId` cannot be found or is disabled, otherwise `true` indicating the operation was successful.
 */
function setMenuItemExpanded(menuItemId, expanded, mustExecuteOnMenuItemExpand) {
}


/**
 * @private 
 * @return {Boolean}
 */
function showForm(formToHide, formToShow, relationToShow) {
}


var svy_types = {

    MenuItem: {

        id : null,

        text : null,

        iconStyleClass : null,

        styleClass : null,

        enabled : null,

        data : null,

        menuItems : null,

        isDivider : null,

        tooltip : null,

        badgeText : null,

        badgeStyleClass : null,

        formName : null,

        relationName : null,

    }
}
