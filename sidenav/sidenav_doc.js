
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
 *  */
function setSelectedMenuItemAsync(id) {
}


/**
 * Returns true if the menuItem is expanded.
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {Boolean}
 *  */
function isMenuItemExpanded(menuItemId) {
}

/**
 * Returns true if the menuItem and all it's ancestors are enabled. <br/>
 * Return false if menuItemId cannot be found.
 * <i>NOTE: The method returns false if any ancestor of the menuItem is not enabled; if the property enabled of the menuItem is set to true, but has a parent with the enabled property set to false, then isMenuItemEnabled returns false. </i><br/>
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {Boolean}
 *  */
function isMenuItemEnabled(menuItemId) {
}

/**
 * Retrieves the screen location of a specific menu item. Returns the location as point (object with x and y properties).
 * 
 * @param {object} nodeId the node to retrieve location for.
 * @return {point} the location of the menu item.
 */
function getLocation(nodeId) {
}

/**
 * Retrieves the size of a specific menu item. Returns the size as dimension (object with width and height properties).
 * 
 * @param {object} nodeId the node to retrieve size for.
 * @return {dimension} the size of the menu item.
 */
function getSize(nodeId) {
}

/**
 * Init the menu setting the root menuItems.
 *
 * @public
 * @param {Array<{id: String|Number ,
                text: String=,
                styleClass: String=,
                iconStyleClass: String=,
                enabled: Boolean=,
                data: Object=,
                menuItems: Array=,
                isDivider : Boolean=}>} menuItems is an array of MenuItem objects. 
                Each MenuItem object should set the required properties 'id', which uniquely identifies the menuItem object in menu, and 'text' property.
                The MenuItem may contain the optional properties 'styleClass', 'iconStyleClass', 'data', 'enabled', 'menuItems', 'isDivider'
 *
 * @example var menu = [{
  id: 1,
  text: "Sample Item #1",
  styleClass : "sn-large",
  iconStyleClass:  "glyphicon glyphicon-search",
  data: { description: "This is sample information that can be added to a menuItem" },
  menuItems: [{
    id: 5,
    text: "Sub Item #1"
    }, {
    id: 6,
    text: "Sub Item #2"
  }]
  }, {
  id: 2,
  text: "Sample Item #2"
  },{
  isDivider: true
  },{
  id: 3,
  text: "Sample Item #3",
  enabled: false
  }];
  elements.sideNavigation.setRootMenuItems(menu);
 * */
function setRootMenuItems(menuItems) {
}

/**
 * Returns the root menu object
 * @public
 *
 * @return {Array<CustomType<servoyextra-sidenav.MenuItem>>}
 * */
function getRootMenuItems() {
}

/**
 * Returns the menuItem object
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>}
 * */
function getMenuItem(menuItemId) {
}

/**
 * Returns the parent menuItem object of the menu item with id menuItemId
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>}
 * */
function getParentMenuItem(menuItemId) {
}

/**
 * Enable or disable the menuItem
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId
 * @param {Boolean} enabled
 *
 * @return {Boolean}
 * */
function setMenuItemEnabled(menuItemId, enabled) {
}

/**
 * Add a menu item. The menu is added as sub Menu Item if a menuItemId is provided, otherwise is added in root.
 * If index is provided the menu is added at the specified index position, otherwise is added as last element.
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItem.id id uniquely identifies the menuItem in the menu object. <b>Required</b>
 * @param {String} [menuItem.text] The menu text, optional, default is empty
 * @param {String} [menuItem.StyleClass] add style classes to the menuItem, optional,. Separate multiple value with a SPACE char. example 'nav-large nav-primary'.
 * @param {String} [menuItem.iconStyleClass] use style classes to display icons as Font Icons, optional. example 'glyphicon glyphicon-search'.
 * @param {Boolean} [menuItem.enabled] menuItem cannot be selected or expanded if disabled, optional. Default true.
 * @param {Object} [menuItem.data] data object can be used to add custom properties to the menuItem, optional. For example you may set the formName to be shown when the menuItem is selected { formName: "aFormName", description: "This menu item will open the given form" }
 * @param {Array} [menuItem.menuItems] an array of nested menuItems, optional.
 * @param {Boolean} [menuItem.isDivider] if true render a divider into the menu instead of a menuItem, optional. All other properties are ignored. Default false.
 * @param {String|Number} [menuItemId] add the item as subMenuItem of the menuItemId, optional. Default add the menuItem as root.
 * @param {Number} [index]  0-based. The index at which to insert the item. Optional. Index value should not be greater then number of sibelings. Default is at the end.
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
 * @return {Boolean}
 * */
function addMenuItem(menuItem, menuItemId, index) {
}

/**
 * Remove the menu item and all it's subMenuItems from the tree.
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {Boolean}
 * */
function removeMenuItem(menuItemId) {
}

/**
* Returns the sub menu items of the menu item with id 'menuItemId'
* @public
*
* @param {String|Number} menuItemId
* @return {Array<CustomType<servoyextra-sidenav.MenuItem>>} 
*/
function getSubMenuItems(menuItemId) {
}

/**
 * Set the menuItems as sub menu items of the menu item with id 'menuItemId'
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId
 * @param {Array<{id: String|Number, 
 *          text: String=,
 *          styleClass: String=,
 *          iconStyleClass: String=,
 *          enabled: Boolean=,
 *          data: Object=,
 *          menuItems: Array=,
 *          isDivider : Boolean=}>} menuItems  is an array of MenuItem objects. 
 *                                  Each MenuItem object should set the required properties 'id', which uniquely identifies the menuItem object in menu, and 'text' property. 
 *                                  The MenuItem may contain the optional properties 'styleClass', 'iconStyleClass', 'data', 'enabled', 'menuItems', 'isDivider'.
 *
 * @example <pre>var menuItems = [{
  id: 10,
  text: "Sample Item #1",
  styleClass : "sn-large",
  iconStyleClass:  "glyphicon glyphicon-search",
  data: { description: "This is sample information that can be added to a menuItem" },
  menuItems: [{
    id: 12,
    text: "Sub Item #1"
    }
  }]
  }, {
  id: 11,
  text: "Sample Item #2"
  },{
  isDivider: true
  }];
  elements.sideNavigation.setSubMenuItems(menuItems);</pre>
 *
 * @return {Boolean}
 * */
function setSubMenuItems(menuItemId, menuItems) {
}

/**
 * Remove all the sub menu items of the menu item with id 'menuItemId'
 * Return false if menuItemId cannot be found.
 * @public
 *
 * @param {String|Number} menuItemId
 *
 * @return {Boolean}
 * */
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
 *  */
function clearMenuItems(depth) {
}

/**
 * Returns the selected menuItem.
 * @public
 *
 * @param {Number} [level] if level is provided search for the selected menu item at level.
 *
 * @return {CustomType<servoyextra-sidenav.MenuItem>}
 * */
function getSelectedMenuItem(level) {
}

/**
 * Select the menu item with the given id.
 * If level is provided search is optimized since it will search only within the descendant of the selected menuItem at level.
 * For example if a root menuItem is selected and level is equal 2 search only in the subMenuItems of the selected root.
 * Return false if menuItemId cannot be found or is disabled.
 * @public
 *
 * @param {String|Number} id
 * @param {Boolean} [mustExecuteOnMenuItemSelect] Force the onMenuItemSelect to be executed. Default false.
 * @param {Boolean} [mustExecuteOnMenuItemExpand] Force the onMenuItemExpand to be executed. Default false.
 * @param {Number} [level] reduce the search to the selected menuItem at level, if any menuItem is selected at level.
 *
 * @return {Boolean}
 *
 *  */
function setSelectedMenuItem(id, mustExecuteOnMenuItemSelect, mustExecuteOnMenuItemExpand, level) {
}

/**
 * Force the menuItem to be expanded or collapsed.
 * Return false if menuItemId cannot be found or is disabled.
 * @public
 *
 * @param {String|Number} menuItemId
 * @param {Boolean} expanded force the menuItem to expand if true, is collapsed otherwise
 * @param {Boolean} [mustExecuteOnMenuItemExpand] Force the onMenuItemExpand to be executed. Default false.
 *
 * @return {Boolean}
 *  */
function setMenuItemExpanded(menuItemId, expanded, mustExecuteOnMenuItemExpand) {
}


/**
 * @private 
 * @return {Boolean}
 *  */
function showForm(formToHide, formToShow, relationToShow) {
}
