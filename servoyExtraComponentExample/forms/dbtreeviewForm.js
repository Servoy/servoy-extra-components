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
 * TODO generated, please specify type and doc for the params
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
	for (var i = 1; i <= memUserFS.getSize(); i++) {
		var rec = memUserFS.getRecord(i);
		rec.users_to_user_orders.loadAllRecords();
	}

	application.output('Relation exists? ' + solutionModel.getRelation('users_to_user_orders'));
	var u = memUserFS.getRecord(1);
	application.output('User: ' + u.firstname);
	application.output('Orders found: ' + u.users_to_user_orders.getSize()); // Use your actual relation name

	// Add the foundset as roots to the tree
	elements.dbtreeview_1.removeAllRoots();
	elements.dbtreeview_1.addRoots(memUserFS);

	// Show the user's name in the tree (replace 'name' with your actual column)
	elements.dbtreeview_1.setTextDataprovider('mem:users', 'firstname');
	elements.dbtreeview_1.setImageURLDataprovider('mem:users', 'media:///group.png');

	elements.dbtreeview_1.setNRelationName('mem:users', 'users_to_user_orders');

	elements.dbtreeview_1.setTextDataprovider('mem:user_orders', 'description');

	elements.dbtreeview_1.setImageURLDataprovider('mem:user_orders', 'media:///user.png');
	elements.dbtreeview_1.setHasCheckBoxValue(memUserFS.getDataSource(), ['1', '2', '3', '4', '5'])

	application.output('Root count: ' + elements.dbtreeview_1.getRoots().length);

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
	// TODO Auto-generated method stub

}

/**
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"D84D3CB1-ED0A-4681-B181-8D96373CBD70"}
 */
function onReady(event) {
	// TODO Auto-generated method stub

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
	// TODO Auto-generated method stub

}
