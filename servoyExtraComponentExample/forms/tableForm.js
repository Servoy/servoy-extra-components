/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8774A436-5F17-4FC0-A3C2-4ED10CF090A1"}
 */
var dataproviderid = "this is a new dataprovider";

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E0828F0A-6904-4BE4-8C73-008D847CA4D2"}
 */
function onAction(event) {
	foundset.deleteAllRecords();
	for (var lv_index = 0; lv_index < 100; lv_index++) {
		foundset.newRecord();
		foundset.column_a = "A" + utils.numberFormat(lv_index, "0000");
		foundset.column_b = "B" + utils.numberFormat(lv_index, "0000");
		foundset.column_c = "C" + utils.numberFormat(lv_index, "0000");
		foundset.column_d = "D" + utils.numberFormat(lv_index, "0000");
	}
	databaseManager.saveData(foundset);
}

/**
 * Called when the mouse is clicked on a row/cell (foundset and column indexes are given) or when the ENTER key is used (then only the selected foundset index is given).
 * Use the record to exactly match what the user clicked on.
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {JSRecord} [record]
 * @param {JSEvent} [event]
 * @param {String} [columnid]
 *
 * @properties={typeid:24,uuid:"4DF0AD9E-DE81-4CFB-A4D2-412FB5C6A03A"}
 */
function onCellClick(foundsetindex, columnindex, record, event, columnid) {
	elements.label_actions.text = "Cell clicked: " + foundsetindex;
}

/**
 * Called when the mouse is double clicked on a row/cell (foundset and column indexes are given).
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {JSRecord} [record]
 * @param {JSEvent} [event]
 * @param {String} [columnid]
 *
 * @properties={typeid:24,uuid:"CE9E7DEE-9045-4003-A619-7939C782590C"}
 */
function onCellDoubleClick(foundsetindex, columnindex, record, event, columnid) {
	elements.label_actions.text = "Cell double clicked: " + foundsetindex;
}

/**
 * Called when the right mouse button is clicked on a row/cell (foundset and column indexes are given).
 * Use the record to exactly match what the user clicked on.
 *
 * @param {Number} foundsetindex
 * @param {Number} [columnindex]
 * @param {JSRecord} [record]
 * @param {JSEvent} [event]
 * @param {String} [columnid]
 *
 * @properties={typeid:24,uuid:"E24D7470-EFA1-4ED6-B1EE-21088F9C2210"}
 */
function onCellRightClick(foundsetindex, columnindex, record, event, columnid) {
	elements.label_actions.text = "Cell right clicked: " + foundsetindex;
}

/**
 * @param {JSEvent} [event]
 *
 * @properties={typeid:24,uuid:"EA193841-9460-4FFE-9DB9-2113CF3A1B8B"}
 */
function onColumnResize(event) {
	elements.label_actions.text = "Column resized ";
}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4B86E4EC-2765-4056-B9CF-18B3A3146879"}
 */
function onFocusGained(event) {
	elements.label_focus.text = "Focus gained";

}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"726CB088-427C-4A2E-B4A0-35149D552210"}
 */
function onFocusLost(event) {
	elements.label_focus.text = "Focus lost";
}

/**
 * @param {Number} columnindex
 * @param {String} sortdirection
 * @param {JSEvent} [event]
 * @param {String} [columnid]
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"3BD0BFFB-D868-493B-8E45-2E55632A60E5"}
 */
function onHeaderClick(columnindex, sortdirection, event, columnid) {
	elements.label_header.text = "Heder clicked: " + columnid;
	return null;
}

/**
 * @param {Number} columnindex
 * @param {String} sortdirection
 * @param {JSEvent} [event]
 * @param {String} [columnid]
 *
 * @return {String}
 *
 * @properties={typeid:24,uuid:"BAE2B484-9316-4101-8619-D36298FA3D71"}
 */
function onHeaderRightClick(columnindex, sortdirection, event, columnid) {
	elements.label_header.text = "Heder right clicked: " + columnid;
	return null;
}

/**
 * @param {Number} start
 * @param {Number} end
 *
 * @properties={typeid:24,uuid:"CDC23F77-A2A1-45AB-A5A2-FBAE23703485"}
 */
function onViewPortChanged(start, end) {
	elements.label_viewport.text = 'view port changed start: ' + start + ' end: ' + end;

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"560B1771-71C5-486F-A37F-9BB84472C966"}
 */
function onSetSelectedHeader(event) {
	elements.table_4.setSelectedHeader(2);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1B48DD21-A365-4382-B1E7-BE2B3801F357"}
 */
function onGetViewPortPosition(event) {
	elements.label_viewport.text = elements.table_4.getViewPortPosition().toString();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3A2EF9B1-1E29-4332-8EAC-4C1C38B6341D"}
 */
function onGetSortClass(event) {
	elements.label_viewport.text = elements.table_4.getSortClass(3);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1EF2FD80-E9DA-43C4-A301-E7815F9B897C"}
 */
function onRequestFocusTrue(event) {
	elements.table_4.requestFocus(true);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"AAF0F86F-2E8B-4B07-9AA2-4F87F8E595D8"}
 */
function onRequestFocusFalse(event) {
	elements.table_4.requestFocus(false);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"75C8AC86-CF98-4935-B667-F79F90112A8B"}
 */
function onGetColumnsCount(event) {
	elements.label_actions.text = elements.table_4.getColumnsCount();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"30BD7505-E5A0-4387-828A-75891CF2684B"}
 */
function onGetColumn(event) {
	elements.label_actions.text = elements.table_4.getColumn(1).headerText;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C83BC9ED-F378-4C47-A0B8-40BA8C70B97A"}
 */
function onNewColumn(event) {
	elements.table_4.newColumn(dataproviderid, 4);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"92535E47-2562-4BB0-9593-AD763A0DC965"}
 */
function onRemoveColumn(event) {
	elements.table_4.removeColumn(2);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CE0251E8-28D0-4B29-86AA-4D3308C7FD26"}
 */
function onRemoveAllColumns(event) {
	elements.table_4.removeAllColumns();
}
