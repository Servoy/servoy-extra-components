/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"95007895-E46E-4B0E-8249-C0D1E01EFF35"}
 */
var scrollbarPositionDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"B67152D6-FD11-4B9B-94E9-9069653C3497"}
 */
var togglePositionDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"614B6583-B07E-4DD6-A173-9BD8349CB1D2"}
 */
var slidePositionDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0BC02BDF-768B-401A-8FA5-509DC87F9C66"}
 */
var slideAnimationDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AB62E325-F751-4893-B698-68838EE0F816"}
 */
var iconOpenStyleClassDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"55E2E046-49A2-45E0-AD9A-B8C8730AD878"}
 */
var iconExpandStyleClassDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"AF1A0DB7-43C7-42EF-B0DD-6299C4516362"}
 */
var iconCollapseStyleClassDP = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"CD95DCAA-9795-4142-B2E4-0D697711E9F7"}
 */
var iconCloseStyleClassDP = null;

/**
 * @properties={typeid:35,uuid:"80B6E65B-0A92-47C5-BB7F-677385B03D7E",variableType:-4}
 */
var visibleDP = true;

/**
 * @properties={typeid:35,uuid:"7CC44ACC-EDF4-46A7-AD64-81FBFFE90E7E",variableType:-4}
 */
var openDP = true;

/**
 * @properties={typeid:35,uuid:"79A8403F-73D8-4BEA-A22F-D2F7D0689186",variableType:-4}
 */
var enabledDP = true;

/**
 * @properties={typeid:35,uuid:"1C63BD53-DE40-4C83-A3CF-9A61F3911FE4",variableType:-4}
 */
var animateDP = true;

/**
 * @param menuItem
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"6CAA9D54-A656-4563-964F-6BF7A1DAAC6D"}
 */
function onMenuItemCollapsed1(menuItem, event) {
	elements.label_normal.text = 'Menu item collaped: ' + menuItem.menuText;
}

/**
 * @param menuItem
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C07797D3-2FD9-42B8-9C62-18D1170BBE40"}
 */
function onMenuItemExpanded1(menuItem, event) {
	elements.label_normal.text = 'Menu item expanded: ' + menuItem.menuText;
}

/**
 * @param menuItem
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"4378646A-1BE3-494A-A0D3-488FF7013CE7"}
 */
function onMenuItemSelected1(menuItem, event) {

	elements.label_selection.text = 'Menu item selected: ' + menuItem.menuText;
	return true;
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"70114A99-5DED-4245-865D-7E4ABBE19C3E"}
 */
function onOpenToggled1(event) {
	elements.label_normal.text = 'on open toggled';
}

/**
 * @param menuItem
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4644344B-6AF7-4113-9B98-FAA6D09E23A3"}
 */
function onMenuItemCollapsed2(menuItem, event) {
	elements.label_custom.text = 'Menu item collaped: ' + menuItem;
}

/**
 * @param menuItem
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"20A546B2-1205-4227-A127-0C09569A3853"}
 */
function onMenuItemExpanded2(menuItem, event) {
	elements.label_custom.text = 'Menu item expanded: ' + menuItem;
}

/**
 * @param menuItem
 * @param {JSEvent} event
 *
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"DAE785B8-6192-4D4F-80CF-76D7C13E5953"}
 */
function onMenuItemSelected2(menuItem, event) {
	elements.label_customselection.text = 'Menu item selected: ' + menuItem;
	return true;
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DB0299E9-BECD-4904-B66E-46940B1F7AF4"}
 */
function onOpenToggled2(event) {
	elements.label_custom.text = 'on open toggled';
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"650065B3-0974-45AC-B21F-C73565659511"}
 */
function onGetMenuItem(event) {
	elements.label_normal.text = 'Get menu item - text: ' + elements.sidenav_servoyMenu.getMenuItem('sideNavItem1').text;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"84BEA5D5-6F08-4C80-8872-63C81896EF2B"}
 */
function onGetSelectedMenuItem(event) {
	elements.label_normal.text = 'Get selected menu item - text: ' + elements.sidenav_servoyMenu.getSelectedMenuItem()
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C3F6A3C2-3D61-47E9-A7EB-6143DC5DD604"}
 */
function onGetParentMenuItem(event) {
	elements.label_normal.text = 'Get Parent Menu item - text: ' + elements.sidenav_servoyMenu.getParentMenuItem('normalmenuitem1').text;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3D1E8AAD-2E47-47B4-A56A-3BF108461A16"}
 */
function onGetRootsMenuItems(event) {
	var roots = elements.sidenav_servoyMenu.getRootMenuItems();
	var rootTexts = roots.map(item => item.text).join(', ');
	elements.label_normal.text = 'Get root menu items - text: ' + rootTexts;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B8B9B24E-CD93-4E68-950F-998F6F75281F"}
 */
function onSetRootMenuItems(event) {
	var menuItem = elements.sidenav_servoyMenu.getMenuItem('sideNavItem1');
	var menuItem1 = elements.sidenav_servoyMenu.getMenuItem('normalmenuitem2');
	elements.sidenav_servoyMenu.setRootMenuItems([menuItem, menuItem1]);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F151E182-60BB-4E09-8A2D-71C1E02ECCAF"}
 */
function onSetSelectedMenuItem(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"ED022ACA-C32C-42AA-A6A0-D45DA1B31D23"}
 */
function onSetSelectedMenuItemAsync(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"164F48AE-07AD-4CD0-88B3-247B935BA58C"}
 */
function onAddMenuItem(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D5F56324-3230-4CC6-B673-04EAB73D9E18"}
 */
function onRemoveMenuItem(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"A1E345EF-611F-4ED9-8F5F-22439A1623E5"}
 */
function onGetSubMenuItems(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8B7941BF-A7F5-4D3F-A6D4-E7E89365F4FA"}
 */
function onRemoveSubMenuItems(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CDE8C9F7-C090-4282-95BD-9D6813E0AF0B"}
 */
function onClearMenuItems(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E9B10813-7289-49F9-95D8-BD8AD04DAA5A"}
 */
function onSetMenuItemEnabled(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"345A7014-109B-4FBF-B92B-13E4A5486A69"}
 */
function onIsMenuItemEnabled(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"BB2D69F3-2352-4AD5-94E0-4CE4249086CB"}
 */
function onSetMenuItemExpanded(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"ABFB39BF-55C9-47F1-9ED0-C47B94859334"}
 */
function onIsMenuItemExpanded(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F27C68EE-B073-403F-BC77-3202F652CE1B"}
 */
function onGetLocation(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7B5F15F6-6D25-4BDD-B27C-34C3D5A95720"}
 */
function onGetSize(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CBEB9093-0DD1-4659-8F05-E77838B1F473"}
 */
function onGetMenuItem1(event) {
	elements.label_custom.text = 'Get menu item - text: ' + elements.sidenav_customMenu.getMenuItem('menuitem1').text;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0C2CBE79-1F41-4A79-BC96-7314D6B986D5"}
 */
function onGetSelectedMenuItem1(event) {
	elements.label_custom.text = 'Get selected menu item - text: ' + elements.sidenav_customMenu.getSelectedMenuItem().text;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7597896A-FD25-43E1-B05D-DA59CCB93B34"}
 */
function onGetParentMenuItem1(event) {
	elements.label_custom.text = 'Get parent menu item - text: ' + elements.sidenav_customMenu.getParentMenuItem('menuitem1').text;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"EF3BA0F5-006F-4769-8B98-F333BCD79557"}
 */
function onGetRootsMenuItems1(event) {
	var roots = elements.sidenav_customMenu.getRootMenuItems();
	var rootTexts = roots.map(item => item.text).join(', ');
	elements.label_custom.text = 'Get root menu items - text: ' + rootTexts;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3F82F5EF-F10A-4258-8194-1790D856C9A8"}
 */
function onSetRootMenuItems1(event) {
	var menuitem1 = elements.sidenav_customMenu.getMenuItem('menuitem1');
	var menuitem2 = elements.sidenav_customMenu.getMenuItem('menuitem2');
	elements.sidenav_customMenu.setRootMenuItems([menuitem1, menuitem2]);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D1A0B8FA-B746-4B38-82F0-7F0CC1AEC511"}
 */
function onSetSelectedMenuItem1(event) {
	elements.sidenav_customMenu.setSelectedMenuItem('menuitem1');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0128D7E8-69F5-424B-BC7F-15332D9794D6"}
 */
function onSetSelectedMenuItemAsync1(event) {
	elements.sidenav_customMenu.setSelectedMenuItemAsync('menuitem1');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"9FCA9779-4E28-4EB4-AB91-8B08F2DCBC71"}
 */
function onAddMenuItem1(event) {
	var menuItem = {
		id: 1,
		text: "Dashboard",
		styleClass: "nav-large nav-primary", // Optional CSS classes
		iconStyleClass: "glyphicon glyphicon-home", // Optional icon
		data: {
			description: "Go to Dashboard"
		}
	};
	elements.sidenav_customMenu.addMenuItem(menuItem);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"30BDEF37-CBEC-44E1-94DE-76FC9D9C5ABF"}
 */
function onRemoveMenuItem1(event) {
	elements.sidenav_customMenu.removeMenuItem('menuitem12');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8176C1CA-9DE3-4D98-A196-9834C27DBD3F"}
 */
function onGetSubMenuItems1(event) {
	var itemsarray = elements.sidenav_customMenu.getSubMenuItems('menuitem1');
	var rootTexts = itemsarray.map(item => item.text).join(', ');
	elements.label_custom.text = 'Get sub menu items - text: ' + rootTexts;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"38988795-9D83-4621-AB83-E3A4F87AA958"}
 */
function onRemoveSubMenuItems1(event) {
	elements.sidenav_customMenu.removeSubMenuItems('menuitem1');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C3D003F2-FEF7-4C69-A343-33B7E4E27974"}
 */
function onClearMenuItems1(event) {
	elements.sidenav_customMenu.clearMenuItems(2);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"36504AC3-53C9-44D5-AD3F-7BCB66B3CB4F"}
 */
function onSetMenuItemEnabled1(event) {
	elements.sidenav_customMenu.setMenuItemEnabled('menuitem1', false);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"DDFBD428-CB3E-4402-80CF-613FCC24711D"}
 */
function onIsMenuItemEnabled1(event) {
	elements.label_customselection.text = 'Menuitem 1 is enabled: ' + elements.sidenav_customMenu.isMenuItemEnabled('menuitem1');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B7304519-8354-4FB0-B5FC-F8A04B908379"}
 */
function onSetMenuItemExpanded1(event) {
	elements.sidenav_customMenu.setMenuItemExpanded('menuitem1', true);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"5B307F9C-A63B-48F0-BF39-B0F2C7C5E29A"}
 */
function onIsMenuItemExpanded1(event) {
	elements.label_customselection.text = 'Menuitem 1 is enabled: ' + elements.sidenav_customMenu.isMenuItemExpanded('menuitem1');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3B6B9807-71EC-4DE3-A279-1F1A83C3F656"}
 */
function onGetLocation1(event) {
	var location = elements.sidenav_customMenu.getLocation('menuitem1');
	elements.label_customselection.text = 'Get Location: x=' + location.x + ' y= ' + location.y;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8C31ACB9-02DE-427B-84C7-92C61C66F622"}
 */
function onGetSize1(event) {
	var size = elements.sidenav_customMenu.getSize('menuitem1');
	elements.label_customselection.text = 'size is: height: ' + size.height + ' width:' + size.width;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8D4D042D-2F61-4EB6-A84F-DC3D3F2DD45F"}
 */
function onSetSubMenuItems1(event) {
	var menuItem1 = {
		id: 1,
		text: "Dashboard",
		styleClass: "nav-large nav-primary", // Optional CSS classes
		iconStyleClass: "glyphicon glyphicon-home", // Optional icon
		data: {
			description: "Go to Dashboard"
		}
	};
	var menuItem2 = {
		id: 1,
		text: "Dashboard2",
		styleClass: "nav-large nav-primary", // Optional CSS classes
		iconStyleClass: "glyphicon glyphicon-home", // Optional icon
		data: {
			description: "Go to Dashboard2"
		}
	};
	elements.sidenav_customMenu.setSubMenuItems('menuitem1', [menuItem1, menuItem2]);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7683EEAF-3DC8-4D5A-8112-6C92CA07A33B"}
 */
function onSetSubMenuItems(event) {

	var menuItem1 = {
		id: 1,
		text: "Dashboard",
		styleClass: "nav-large nav-primary", // Optional CSS classes
		iconStyleClass: "glyphicon glyphicon-home", // Optional icon
		data: {
			description: "Go to Dashboard"
		}
	};
	var menuItem2 = {
		id: 2,
		text: "Dashboard2",
		styleClass: "nav-large nav-primary", // Optional CSS classes
		iconStyleClass: "glyphicon glyphicon-home", // Optional icon
		data: {
			description: "Go to Dashboard2"
		}
	};
	elements.sidenav_servoyMenu.setSubMenuItems('normalmenuitem1', [menuItem1, menuItem2]);
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"63E13474-DAB6-48BC-B25D-627C2F486260"}
 */
function onAction_animate(event, dataTarget) {
	elements.sidenav_servoyMenu.animate = !elements.sidenav_servoyMenu.animate;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"4BCCF990-BFFF-4D07-A25C-0F4EFC53A0A9"}
 */
function onAction_enabled(event, dataTarget) {
	elements.sidenav_servoyMenu.enabled = !elements.sidenav_servoyMenu.enabled;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"64E7D09C-6E96-45A8-A4C9-9463574E6117"}
 */
function onAction_open(event, dataTarget) {
	elements.sidenav_servoyMenu.open = !elements.sidenav_servoyMenu.open;
}

/**
 * Click event. dataTarget parameter is used to identify inner html elements (by their data-target attribute).
 *
 * @param {JSEvent} event
 * @param {String} dataTarget
 *
 * @properties={typeid:24,uuid:"3D4699CD-9A75-4CA6-8FD5-29FD80C06D85"}
 */
function onAction_visible(event, dataTarget) {
	elements.sidenav_servoyMenu.visible = !elements.sidenav_servoyMenu.visible;
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
 * @properties={typeid:24,uuid:"CF3D581E-1AF6-48EE-97CF-1E44097DAFF8"}
 */
function onDataChange_iconCloseStyleClass(oldValue, newValue, event) {
	elements.sidenav_servoyMenu.iconCloseStyleClass = iconCloseStyleClassDP;
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
 * @properties={typeid:24,uuid:"DD3E29EE-0C49-417F-9387-B14EF76E9CBF"}
 */
function onDataChange_iconCollapseStyleClass(oldValue, newValue, event) {
	elements.sidenav_servoyMenu.iconCollapseStyleClass = iconCollapseStyleClassDP;
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
 * @properties={typeid:24,uuid:"37A38A2A-0BC7-45AC-A79C-6A935B3A9898"}
 */
function onDataChange_iconExpandStyleClass(oldValue, newValue, event) {
	elements.sidenav_servoyMenu.iconExpandStyleClass = iconExpandStyleClassDP;
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
 * @properties={typeid:24,uuid:"47C1E07A-F385-4D18-BDDE-FA1627A496F1"}
 */
function onDataChange_iconOpenStyleClass(oldValue, newValue, event) {
	elements.sidenav_servoyMenu.iconOpenStyleClass = iconOpenStyleClassDP;
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
 * @properties={typeid:24,uuid:"F139C3FA-F7EA-491B-B556-57E4860BE5DB"}
 */
function onDataChange_slideAnimation(oldValue, newValue, event) {
	elements.sidenav_servoyMenu.slideAnimation = slideAnimationDP;
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
 * @properties={typeid:24,uuid:"F1572859-B32B-4377-9F9D-AE6E7106D575"}
 */
function onDataChange_slidePosition(oldValue, newValue, event) {
	elements.sidenav_servoyMenu.slidePosition = slidePositionDP;
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
 * @properties={typeid:24,uuid:"A4C6B2A7-2A19-49B3-A4D1-A24CD79BEA14"}
 */
function onDataChange_togglePosition(oldValue, newValue, event) {
	elements.sidenav_servoyMenu.togglePosition = togglePositionDP;
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
 * @properties={typeid:24,uuid:"6C943F30-15D6-4A5C-AEB6-FC20CD2FFA77"}
 */
function onDataChange_scrollbarPosition(oldValue, newValue, event) {
	elements.sidenav_servoyMenu.scrollbarPosition = scrollbarPositionDP;
	return true
}
