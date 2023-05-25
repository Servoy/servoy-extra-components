
/**
 * Refresh the tree display.
 *
 * @example
 * %%elementName%%.refresh()
 *
 */
function refresh(restoreExpandedNodes) {
}

/**
 * 
 * Expand all nodes
 *
 * @example
 * %%elementName%%.expandAll
 * 
 * @return {Boolean}
 *
 */
function expandAll() {
}

/**
 * Collapse all nodes
 *
 * @example
 * %%elementName%%.collapseAll()
 * 
 * @return {Boolean}
 */
function collapseAll() {
}

/**
 * Expand a node by id.
 *
 * @example
 * %%elementName%%.expandNode(22)
 *
 * @param nodeId node id
 * 
 */
function expandNode(nodeId) {
}

/**
 * Returns expand state of a node.
 *
 * @example
 * var expanded = %%elementName%%.isNodeExpanded([22])
 *
 * @param pk array of each level id
 * 
 * @return {boolean}
 */
function isNodeExpanded(nodeId) {
}

/**
 * Collaps a node by id.
 *
 * @example
 * %%elementName%%.collapseNode(22)
 *
 * @param nodeId node id
 * 
 */
function collapseNode(nodeId) {
}

/**
 * Sets selected node by id.
 *
 * @example
 * %%elementName%%.setSelectedNode(22)
 *
 * @param nodeId node id
 */
function setSelectedNode(nodeId) {
}

/**
 * Get selected node id.
 *
 * @example
 * var selection = %%elementName%%.getSeletedNode()
 *
 * @return {Object}
 */
function getSeletedNode() {
}

/**
 * Get child nodes ids of a parent node.
 *
 * @example
 * var childNodes = %%elementName%%.getChildNodes()
 *
 * @param nodeId node id
 * 
 * @return {Array}
 */
function getChildNodes(nodeId) {
}

/**
 * Get child nodes ids of a parent node.
 *
 * @example
 * var childNodes = %%elementName%%.getChildNodes()
 *
 * @param nodeId node id
 * 
 * @return {Object}
 */
function getParentNode(nodeId) {
}

/**
 * Get the tree level a node is situated.
 *
 * @example
 * var nodeLevel = %%elementName%%.getNodeLevel()
 *
 * @param nodeId node id
 * 
 * @return {int}
 */
function getNodeLevel(nodeId) {
}

/**
 * Get root nodes ids .
 *
 * @example
 * var rootNodes = %%elementName%%.getRootNodes()
 *
 * @return {Array}
 */
function getRootNodes() {
}

/**
 * Dimm or hide unmatched nodes.
 * 
 * <br>
 * <b>NOTE</b>: This function might not work as expected if the node titles contain HTML markup.
 * 
 * 
 * @param {String} text filter nodes matching the given text
 * @param {Object} [options] filter options
 * 
 * <br>
 * <br>
 * List of options:
 * <br>
 *  <b>autoExpand</b>, type: {boolean}, default: false
 *  Temporarily expand matching node parents while filter is active.
 *  <br>
 *  <b>fuzzy</b>, type: {boolean}, default: false
 *  Match single characters in order, e.g. 'fb' will match 'FooBar'.
 *  <br>
 *  <b>hideExpanders</b>, type: {boolean}, default: false
 *  Hide hideExpanders expanders if all child nodes are hidden by filter.
 *  <br>
 *  <b>highlight</b>, type: {boolean}, default: false
 *  Highlight matches by wrapping inside tags.
 *  <br>
 *  <b>leavesOnly</b>, type: {boolean}, default: false
 *  Match end nodes only.
 *  <br>
 *  <b>mode</b>, type: {string: 'dimm' | 'hide'}, default: 'hide'
 *  Defines if unmatched nodes are grayed out or hidden.
 *  <br>
 *  <b>nodata</b>, type: {boolean|string|object|function}, default: true
 *  Display the string 'No data' if the filtered tree would be empty.
 *
 * @example <pre>
 * elements.tree.filterNodes(searchFilter, {mode: 'hide', autoExpand: true, leavesOnly: true});
 * </pre>
 * 
 */
function filterNodes(text, options) {
}

/**
 * Dimm or hide unmatched branches. Matching nodes are displayed together with all descendants.
 * 
 * @param {String} text filter nodes matching the given text
 * @param {Object} [options] filter options, same as for 'filterNodes'
 */
function filterBranches(text, options) {
}

/**
 * Sets the tree data
 * @param jsDataSet the JSDataSet used for the tree model
 * @example
 *  var treeviewDataSet = databaseManager.createEmptyDataSet( 0,  ['id', 'pid', 'treeColumn', 'icon']);
 * 
 *  treeviewDataSet.addRow([1,      null,   'Main group',   'media:///group.png']);
 *  treeviewDataSet.addRow([2,      null,   'Second group', 'media:///group.png']);
 *  treeviewDataSet.addRow([3,      2,      'Subgroup',     'media:///group.png']);
 *  treeviewDataSet.addRow([4,      3,      'Mark',         'media:///user.png']);
 *  treeviewDataSet.addRow([5,      3,      'George',       'media:///user.png']);
 *
 *  %%prefix%%%%elementName%%.setDataSet(treeviewDataSet);
 *
 *  // Render tree as a table by providing any additional 'column*' in the DataSet; additional columns must be prefixed with 'column'; e.g. columnone, columntwo...
 *  var tableTreeviewDataSet = databaseManager.createEmptyDataSet( 0, ['id', 'pid', 'treeColumn', 'icon', 'column1', 'column2']);
 *
 *  tableTreeviewDataSet.addRow([null, null, 'Group', null, 'Description', 'Extra info']);  // header
 *  tableTreeviewDataSet.addRow([1, null, 'Main group', 'media:///group.png', 'This is my the Main Group', 'Has (0) child']);
 *  tableTreeviewDataSet.addRow([2, null, 'Second group', 'media:///group.png', 'This is my the Second Group', 'Has (1) child']);
 *  tableTreeviewDataSet.addRow([3, 2, 'Subgroup', 'media:///group.png', 'This is my the Subgroup Group', 'Has (2) children']);
 *  tableTreeviewDataSet.addRow([4, 3, 'Mark', 'media:///user.png', 'This is leaf Mark', 'Has (0) child']);
 *  tableTreeviewDataSet.addRow([5, 3, 'George', 'media:///user.png', 'This is leaf George', 'Has (0) child']);
 *
 *  %%prefix%%%%elementName%%.setDataSet(tableTreeviewDataSet);
 *
 */
function setDataSet(jsDataSet) {
}