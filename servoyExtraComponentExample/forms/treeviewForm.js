/**
 * @type {String}
 *
 *
 * @properties={typeid:35,uuid:"DB1E28DA-B210-43AE-A0F6-546C79A59309"}
 */
var fv_colname = null;

/**
 *
 * @properties={typeid:35,uuid:"32FC305A-AFA9-401F-A009-057867A17C17",variableType:-4}
 */
var fv_node_clicked = null;

/**
 * @type {String}
 *
 *
 * @properties={typeid:35,uuid:"6609DDE7-0171-4F0A-888D-AC055C289B25"}
 */
var fv_double_clicked = null;

/**
 * @type {String}
 *
 *
 * @properties={typeid:35,uuid:"BAB27E97-8CE6-4520-AEF1-07889C8E8026"}
 */
var fv_right_clicked = null;

/**
 * @type {String}
 *
 *
 * @properties={typeid:35,uuid:"8F70A847-85C5-4BC1-A4E1-2A471528621E"}
 */
var path = null;

/**
 * Callback method for when form is shown.
 *
 * TODO generated, please specify type and doc for the params
 * @param firstShow
 * @param event
 *
 * @properties={typeid:24,uuid:"786363DF-2CA3-4355-8C45-261794AC15ED"}
 */
function onShow(firstShow, event) { }

/**
 * @properties={typeid:24,uuid:"B11411F4-F405-42BF-AC21-E9558E776760"}
 */
function onLoad() {
	var treeviewDataSet = databaseManager.createEmptyDataSet(0, ['id', 'pid', 'treeColumn', 'fa-icon']);
	treeviewDataSet.addRow([1, null, 'Main group', 'fa fa-users']);
	treeviewDataSet.addRow([2, null, 'Second group', 'fa fa-users']);
	treeviewDataSet.addRow([3, 2, 'Subgroup', 'fa fa-users']);
	treeviewDataSet.addRow([4, 3, 'Mark', 'fa fa-users']);
	treeviewDataSet.addRow([5, 3, 'George', 'fa fa-users']);
	elements.treeview_1.setDataSet(treeviewDataSet);

	// Render tree as a table by providing any additional 'column*' in the DataSet; additional columns must be prefixed with 'column'; e.g. columnone, columntwo...
	var tableTreeviewDataSet = databaseManager.createEmptyDataSet(0, ['id', 'pid', 'treeColumn', 'icon', 'column1', 'column2']);

	tableTreeviewDataSet.addRow([null, null, 'Group', null, 'Description', 'Extra info']); // header
	tableTreeviewDataSet.addRow([1, null, 'Some group', 'media:///group.png', 'Main Group', 'Has (1) child']);
	tableTreeviewDataSet.addRow([2, 1, 'New user Node', 'media:///user.png', 'Leaf of Some group', 'Has (0) child']);
	tableTreeviewDataSet.addRow([3, null, 'Another group', 'media:///group.png', 'Second Group', 'Has (1) child']);
	tableTreeviewDataSet.addRow([4, 3, 'Subanother', 'media:///group.png', 'Subgroup Group', 'Has (2) children']);
	tableTreeviewDataSet.addRow([5, 4, 'John', 'media:///user.png', 'This is leaf John', 'Has (0) child']);
	tableTreeviewDataSet.addRow([6, 4, 'James', 'media:///user.png', 'This is leaf James', 'Has (0) child']);
	elements.treeview_2.setDataSet(tableTreeviewDataSet);

}

/**
 * TODO generated, please specify type and doc for the params
 * @param nodeId
 * @param event
 *
 * @properties={typeid:24,uuid:"07CC51B1-EAD0-4F09-95B9-87E23EBECB06"}
 */
function onNodeClicked(nodeId, event) {
	fv_node_clicked = 'node ' + nodeId + ' ' + event.getType();
	application.output('node clicked' + ' onDoubleClicked');

}

/**
 * TODO generated, please specify type and doc for the params
 * @param nodeId
 * @param event
 *
 * @properties={typeid:24,uuid:"5890D55A-1257-4B96-ADEB-8EE8D6DE06C2"}
 */
function onNodeDoubleClicked(nodeId, event) {
	fv_double_clicked = 'node ' + nodeId + ' ' + event.getType();
	application.output('doubleCl ' + ' onDoubleClicked');
}

/**
 * TODO generated, please specify type and doc for the params
 * @param nodeId
 * @param event
 *
 * @properties={typeid:24,uuid:"0163ADAB-8FAC-41FF-AAA7-7316CF912A50"}
 */
function onNodeRightClicked(nodeId, event) {
	fv_right_clicked = 'node ' + nodeId + ' ' + event.getType()

}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"E1EEAD69-2BE5-4B0A-BD54-700044F4156E"}
 */
function onReady(event) {
	application.output('on ready tree 1 called')
	elements.treeview_1.expandAll()
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"AD2DBA9D-D823-4E17-A31E-D72B5BE8EF2A"}
 */
function collapseTree1(event) {
	elements.treeview_1.collapseAll()
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"FFDC24D9-DBD6-40F6-AACD-D96925875B93"}
 */
function collapseTree2(event) {
	elements.treeview_2.collapseAll()
}

/**
 * TODO generated, please specify type and doc for the params
 * @param nodeId
 * @param event
 * @param columnName
 *
 * @properties={typeid:24,uuid:"664D335C-0BEB-4CD7-A71F-FD830826866B"}
 */
function onNodeClicked1(nodeId, event, columnName) {
	fv_colname = columnName + " clicked";
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"D629E499-1690-45EB-9F76-CE3B078ADD6A"}
 */
function filter(event) {
	elements.treeview_2.filterNodes('some', { fuzzy: true })
}

/**
 * TODO generated, please specify type and doc for the params
 * @param event
 *
 * @properties={typeid:24,uuid:"32718CAF-D33C-4CA6-A5FF-A847772D1994"}
 */
function onAction1(event) {
	elements.treeview_2.filterNodes('')
}

/**
 * @properties={typeid:35,uuid:"66FF4253-AC91-4C8D-ABEE-6565735E0BF3",variableType:-4}
 */
var fv_node_actions = null;

/**
 * @properties={typeid:35,uuid:"9180B00F-C882-4F4F-9E3D-796C9BE4C7B7",variableType:-4}
 */
var fv_node_selection = null;

/**
 * @param nodeId
 *
 * @properties={typeid:24,uuid:"6E7D21C1-CBED-47A7-9AA3-2C67542A44CA"}
 */
function onNodeCollapsed(nodeId) {
	fv_node_actions = "on node collapsed " + nodeId;
}

/**
 * @param nodeId
 *
 * @properties={typeid:24,uuid:"7CAA27C7-790E-4885-B0D6-A8A808A6869E"}
 */
function onNodeExpanded(nodeId) {
	fv_node_actions = "on node expanded " + nodeId;
}

/**
 * @param nodeId
 *
 * @properties={typeid:24,uuid:"DC63AF3D-5F7A-4D34-B051-65147BCE4338"}
 */
function onNodeSelected(nodeId) {
	fv_node_selection = "on node selected " + nodeId;
}

/**
 * Called when an ng grid row is dropped as a result of a drag-n-drop.
 *
 * @param {Array<object>} sourceRows an Array of plain objects if dragged from a power grid, or JSRecord objects if from a data grid
 * @param nodeId
 * @param {CustomType<servoyextra-treeview.JSDNDEvent>} event
 *
 * @properties={typeid:24,uuid:"64BBB030-0B42-439A-ABC2-A4CD731D7210"}
 */
function onRowDrop(sourceRows, nodeId, event) {
	fv_node_actions = "on row drop " + nodeId;
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"2F6C0A32-7220-4D3A-9B0C-EA7592F6A4EC"}
 */
function onExpandTree(event) {
	elements.treeview_1.expandAll();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"7DA94598-4B72-485A-A2D3-23743396293D"}
 */
function setColumnWidth(event) {
	elements.treeview_2.setColumnWidth(300, 2);
}
/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"391A770B-789D-4C24-9A27-83D5C20E2A29"}
 */
function onExpandNode(event) {
	elements.treeview_2.expandNode(4);
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"865ED344-F4D8-45AD-8D95-CA8631B9502B"}
 */
function onGetRootNodes(event) {
	elements.label_12.text = elements.treeview_2.getRootNodes().toString();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"0B23AAA7-5773-4813-9981-0DA07A12B778"}
 */
function onFilterBranches(event) {
	elements.treeview_2.filterBranches("Another group");
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"06B1AA83-10C0-413C-9A3F-49D5E145EB26"}
 */
function onFilterNodes(event) {
	elements.treeview_2.filterNodes("Group", { mode: 'hide', autoExpand: true, leavesOnly: true });
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"84545B91-5F2A-4AAD-870D-69BD8C314592"}
 */
function onGetSelectedNodes(event) {
	fv_node_selection = elements.treeview_1.getSelectedNode();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"369A1CE4-E8AE-4613-9F8E-26E2050A9721"}
 */
function onGetChildNodes(event) {
	fv_node_actions = elements.treeview_1.getChildNodes(2).toString();
}

/**
 * Fired when the button is clicked.
 *
 * @param {JSEvent} event
 *
 * @properties={typeid:24,uuid:"3BBC2ED1-3130-4CE4-B823-1C7BCEFBE826"}
 */
function onGetParentNodes(event) {
	fv_node_actions = elements.treeview_1.getChildNodes(3).toString();
}
