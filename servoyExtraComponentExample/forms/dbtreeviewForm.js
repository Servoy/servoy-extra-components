
/**
 * @properties={typeid:35,uuid:"CB4584DD-A503-43FD-B3BD-CCC53CC39BE4",variableType:-4}
 */
var selected = null;

/**
 * @properties={typeid:35,uuid:"FDBEF466-4769-42E4-B7EE-238C400CDEE5",variableType:-4}
 */
//foundset: JSFoundSet<mem:testing>
var userFS = databaseManager.getFoundSet('mem:users');

/**
 * TODO generated, please specify type and doc for the params
 * @param first
 *
 * @properties={typeid:24,uuid:"F3C0C5B0-D5C8-4664-AC7B-E342C313EE6F"}
 */
function onUserSelected(first) {
    selected = "selected "+ first
}
/**
 * @properties={typeid:24,uuid:"A485C631-B49C-4F19-A0CC-6ED0DDF437D4"}
 */
function onShow() {
	 // Get the foundset for the users table
	   
    addRecords()
    userFS.loadAllRecords();

    // Add the foundset as roots to the tree
    elements.dbtreeview_1.addRoots(userFS);

    // Show the user's name in the tree (replace 'name' with your actual column)
    elements.dbtreeview_1.setTextDataprovider(userFS.getDataSource(), 'firstname');
    elements.dbtreeview_1.setHasCheckBoxValue(userFS.getDataSource(), ['1','2','3','4','5'])
	elements.dbtreeview_1.setNRelationName(userFS.getDataSource(), 'users_to_users')
    // Optionally, set the callback when a node is selected
    elements.dbtreeview_1.setCallBackInfo(userFS.getDataSource(), onUserSelected, 'firstname');
   }

/**
 * @properties={typeid:24,uuid:"9E7400E2-76E6-4D3D-AE83-86F6D8873DC9"}
 */
function addRecords() {
	/** @type {JSFoundSet<mem:testing>} */
	var fs = databaseManager.getFoundSet('mem:users');
	fs.loadAllRecords()
	fs.deleteAllRecords()
	
	var names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
	for (var i = 0; i < names.length; i++) {
	    var rec = fs.getRecord(fs.newRecord());
	    rec.user_id = i+1
	    rec.firstname = names[i];
	    rec.age = i*10   
	}
	// Save to the database
	databaseManager.saveData(fs);
}