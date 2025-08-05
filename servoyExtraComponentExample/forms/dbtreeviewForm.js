/**
 * @properties={typeid:35,uuid:"CB4584DD-A503-43FD-B3BD-CCC53CC39BE4",variableType:-4}
 */
var selected = null;

/** @type {JSFoundSet<mem:users>} *
 * @properties={typeid:35,uuid:"8469D87F-5BFD-422D-A83D-59599BD5C152",variableType:-4}
 */
var memUserFS = databaseManager.getFoundSet('mem:users');

/** @type {JSFoundSet<mem:user_orders>} *
 * @properties={typeid:35,uuid:"78661E9F-295D-49C3-A2B2-3D461798D4BF",variableType:-4}
 */
var memOrderFS = databaseManager.getFoundSet('mem:user_orders');

/**
 * @param first
 *
 * @properties={typeid:24,uuid:"F3C0C5B0-D5C8-4664-AC7B-E342C313EE6F"}
 */
function onUserSelected(first) {
	selected = "selected " + first
}

/**
 * @properties={typeid:24,uuid:"A485C631-B49C-4F19-A0CC-6ED0DDF437D4"}
 */
function onShow() {
	addRecords()
	memUserFS.loadAllRecords();

	// Add the foundset as roots to the tree
	elements.dbtreeview_1.removeAllRoots();
	elements.dbtreeview_1.addRoots(memUserFS);

	// Show the user's name in the tree (replace 'name' with your actual column)
	elements.dbtreeview_1.setTextDataprovider('mem:users', 'firstname');

	elements.dbtreeview_1.setNRelationName('mem:users', 'users_to_user_orders');

	elements.dbtreeview_1.setTextDataprovider('mem:user_orders', 'description');

	elements.dbtreeview_1.setHasCheckBoxValue(memUserFS.getDataSource(), ['1', '2', '3', '4', '5'])
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2F9E3CB0-52F9-4BD6-82B9-93EC7DED0E2A",variableType:4}
 */
var orderIdCounter = 1;

/**
 * @properties={typeid:24,uuid:"9E7400E2-76E6-4D3D-AE83-86F6D8873DC9"}
 */
function addRecords() {
	/** @type {JSFoundSet<mem:users>} */
	var usersFS = databaseManager.getFoundSet('mem:users');
	usersFS.loadAllRecords()
	usersFS.deleteAllRecords()

	/** @type {JSFoundSet<mem:user_orders>} */
	var userOrdersFS = databaseManager.getFoundSet('mem:user_orders');
	userOrdersFS.loadAllRecords()
	userOrdersFS.deleteAllRecords()

	var names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
	for (var i = 0; i < names.length; i++) {
		var userId = i + 1;
		var recUsers = usersFS.getRecord(usersFS.newRecord());
		recUsers.user_id = userId;
		recUsers.firstname = names[i];
		recUsers.age = i * 10;
		for (var j = 0; j < 5; j++) {
			var recUserOrder = userOrdersFS.getRecord(userOrdersFS.newRecord());
			recUserOrder.order_id = orderIdCounter;
			orderIdCounter++;
			recUserOrder.user_id = userId;
			recUserOrder.description = 'Order: ' + recUserOrder.order_id + ' for User ' + recUserOrder.user_id;
		}

	}
	// Save to the database
	databaseManager.saveData(usersFS);
	databaseManager.saveData(userOrdersFS);
}
/**
 * Called when a node is dropped as a result of a drag-n-drop.
 *
 * @param {Array<String>} sourceNodePkPath
 * @param {Array<String>} targetNodePkPath
 * @param {Number} indexInParent
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"08E22F76-F260-43DE-A471-BCFB9D430649"}
 */
function onDrop(sourceNodePkPath, targetNodePkPath, indexInParent, event) {
	elements.label_2.text = 'On drop: ';
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"EF7B6923-F34C-4D10-BD5C-919425BADB08",variableType:4}
 */
var ready = 0;
/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D84D3CB1-ED0A-4681-B181-8D96373CBD70"}
 */
function onReady(event) {
	elements.label_2.text = 'On ready: ' + ready;
	ready++;
}

/**
 * Called when an ng grid row is dropped as a result of a drag-n-drop.
 *
 * @param {Array<object>} sourceRows an Array of plain objects if dragged from a power grid, or JSRecord objects if from a data grid
 * @param {Array<String>} targetNodePkPath
 * @param {CustomType<servoyextra-dbtreeview.JSDNDEvent>} event
 *
 * @properties={typeid:24,uuid:"BE932C45-4C99-4B8E-916F-F9B6EC8A8B61"}
 */
function onRowDrop(sourceRows, targetNodePkPath, event) {
	elements.label_2.text = 'On row drop: ';
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"A4348819-DA1A-4EE1-A246-CB227374B13B"}
 */
function onGetRoots(event) {
	elements.label_2c.text = 'Root count: ' + elements.dbtreeview_1.getRoots().length;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"07229913-EA05-48D1-A799-F41BBAD668E7"}
 */
function onRefresh(event) {
	elements.dbtreeview_1.refresh();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E9E1E85D-2E2B-4E03-861C-A6CF815B9010"}
 */
function onIsNodeExpanded(event) {
	elements.label_2c.text = 'Is node expanded: ' + elements.dbtreeview_1.isNodeExpanded([3]);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"946BE957-3C51-450A-B0C4-44D2A0E92C42"}
 */
function onSetExpandNode(event) {
	elements.dbtreeview_1.setExpandNode([1, 4], true);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2A4CE9F5-7520-4862-B906-0BDFF18E0D28"}
 */
function onSetNodeLevelVisible(event) {
	elements.dbtreeview_1.setNodeLevelVisible(2, true);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"1B9BEE00-DEB5-47A5-BA76-0ED7D1FCA1A5"}
 */
function onSetHasCheckBoxDataprovider(event) {
	elements.dbtreeview_1.setHasCheckBoxDataprovider(memOrderFS.getDataSource(), true);
	// TODO: fix this call
}
/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"96DDB8A1-7154-4D31-8D1F-06B2DEA99774"}
 */
function onSetCallBackInfo(event) {
	elements.dbtreeview_1.setCallBackInfo(memOrderFS.getDataSource(), callbackfunction1, null)
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2E358944-88AB-47EF-A4F0-1CA5B37CC317",variableType:4}
 */
var call1 = 0;
/**
 * @properties={typeid:24,uuid:"C0AF26D1-F1CD-4705-AABB-49E79474A938"}
 */
function callbackfunction1() {
	elements.label_2cc.text = 'Callback function1 executed! ' + call1;
	call1++;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"079C74C0-69FF-46D4-AE7A-6C0DBC60CA30"}
 */
function onSetActionsCallBack(event) {
	elements.dbtreeview_1.setActionsCallBack([[memUserFS.getDataSource(), callbackfunction2, 'param1', 'dbtreeview_1']]);
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"269498FD-EBD7-465C-918F-A9A9914C545F",variableType:4}
 */
var call2 = 0;
/**
 * @param param1
 *
 * @properties={typeid:24,uuid:"80A5A16A-1D33-45D1-9B85-AD4AF1994D8F"}
 */
function callbackfunction2(param1) {
	elements.label_2cc.text = 'Callback function3 executed! ' + param1 + '    ' + call2;
	call2++;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0B03B346-63FF-4729-802C-7C101EE9C608"}
 */
function onSetMethodToCallOnCheckBoxChange(event) {
	elements.dbtreeview_1.setMethodToCallOnCheckBoxChange(memUserFS.getDataSource(), callbackfunction3, 'arg1')
}

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"536D7BB5-DB5A-4334-B253-AF9BBB83911B",variableType:4}
 */
var call3 = 0;
/**
 * @param param1
 *
 * @properties={typeid:24,uuid:"E16052FE-3E01-4778-998F-FC7E0C2FDADB"}
 */
function callbackfunction3(param1) {
	elements.label_2cc.text = 'Callback function3 executed! ' + param1 + '    ' + call3;
	call3++;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"ABF1376E-18F1-4FDD-BE22-E9CBAEFF6133"}
 */
function onSetToolTipTextDataprovider(event) {
	elements.dbtreeview_1.setToolTipTextDataprovider(memUserFS.getDataSource(), 'Tooltip for mem users');
	elements.dbtreeview_1.setToolTipTextDataprovider(memOrderFS.getDataSource(), 'Tooltip for mem user orders');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"4F894ACC-2E93-4B47-B78C-D12AA88DDC9A"}
 */
function onSetImageURLDataprovider(event) {
	// TODO Auto-generated method stub

}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"CBF62A35-F732-4DAC-9353-448285ACA7C1"}
 */
function onSetChildSortDataprovider(event) {
	elements.dbtreeview_1.setChildSortDataprovider(memUserFS.getDataSource(), 'firstname_sort');
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3A4082ED-73E5-4D02-B1E7-8C51CB626299"}
 */
function onSetMethodToCallOnDoubleClick(event) {
	elements.dbtreeview_1.setMethodToCallOnDoubleClick(memUserFS.getDataSource(), onDoubleClickCallback, null);
}

/**
 * @properties={typeid:24,uuid:"7F112870-CCC1-4A03-A21C-7DB44C3500E6"}
 */
function onDoubleClickCallback() {
	elements.label_2c.text = 'On double click on: ' + memUserFS.getDataSource();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"86DBA958-7826-43A4-B772-88B04975E342"}
 */
function onSetMethodToCallOnRightClick(event) {
	elements.dbtreeview_1.setMethodToCallOnRightClick(memUserFS.getDataSource(), onRightClickCallback, null);
}

/**
 * @properties={typeid:24,uuid:"B7BB67CA-06B0-4570-898F-97D6F7C8C2DA"}
 */
function onRightClickCallback() {
	elements.label_2c.text = 'On right click on: ' + memUserFS.getDataSource();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C7C708A2-5165-493D-9265-C89DF0637F31"}
 */
function onSetSelectionPath(event) {
	elements.dbtreeview_1.setSelectionPath([2, 7]);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"A11E015A-D6D3-475F-BBAD-3E5193D18873"}
 */
function onGetSelectionPath(event) {
	var elementsArray = elements.dbtreeview_1.getSelectionPath();
	var elementsString = elementsArray.map(item => item).join(',');
	elements.label_2c.text = 'Selection path: ' + elementsString;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"F5718683-AAB0-4537-8C1D-6C27D0CB4FBB"}
 */
function onCreateRelationInfo(event) {
	var info = elements.dbtreeview_1.createRelationInfo('firstname', 'users_to_user_orders');
	elements.label_2cc.text = info.label;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"8EDC08A1-BA29-46B9-A0A4-E86223A64E5F"}
 */
function onSetNRelationInfos(event) {
	// TODO: create more than 1 relation
	//elements.dbtreeview_1.setNRelationInfos('firstname', ['users_to_user_orders']);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E7D8802D-E287-4F9D-BF2C-A0808FFBF8D8"}
 */
function onSetHasCheckBoxValue(event) {
	elements.dbtreeview_1.setHasCheckBoxValue(memOrderFS.getDataSource(), [1, 3, 5, 7, 9]);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"33459BB4-DFC4-49D0-B2D4-5654CF0CF6B7"}
 */
function onSetInitialCheckBoxValues(event) {
	elements.dbtreeview_1.setInitialCheckBoxValues(memOrderFS.getDataSource(), [1, 2, 3]);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"E33A9A43-54F1-4243-9EFF-C0322FED8615"}
 */
function onUpdateCheckBoxValues(event) {
	elements.dbtreeview_1.setHasCheckBoxValue(memOrderFS.getDataSource(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
	elements.dbtreeview_1.updateCheckBoxValues(memOrderFS.getDataSource(), [6, 7, 8, 9, 10, 11], true);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"B5DF1F35-CBE9-4719-B5DA-2E60F1B39123"}
 */
function onGetCheckBoxValues(event) {
	elements.label_2cc.text = elements.dbtreeview_1.getCheckBoxValues(memOrderFS.getDataSource());
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"C45612BD-C0C4-4090-BA58-25F60226B706"}
 */
function onSetCheckBoxAutoselectsChildren(event) {
	elements.dbtreeview_1.setHasCheckBoxValue(memOrderFS.getDataSource(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);

	elements.dbtreeview_1.setCheckBoxAutoselectsChildren(memOrderFS.getDataSource(), true);
}
