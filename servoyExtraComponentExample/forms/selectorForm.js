/**
 * Handles button clicks and loads the corresponding form based on button naming convention.
 * Button names should follow the pattern 'btn_FormName' where FormName corresponds to 'formNameForm'.
 * Also manages the visual selection state of buttons.
 * @param event
 *
 * @properties={typeid:24,uuid:"5CD03CAB-5845-4F9B-8138-25FF61CC55A8"}
 */
function onAction(event) {
	var elementName = event.getElementName();
	var formTitle = event.getSource().text;
	if (formTitle && elementName && elementName.indexOf('button_') === 0) {
		// Clear selected state from all buttons
		clearButtonSelection();
		
		// Add selected state to the clicked button
		elements[elementName].addStyleClass('selected');
		
		// Extract form name from button name and load the form
		var formNamePart = elementName.substring(7);
		var formBase = formNamePart.charAt(0).toLowerCase() + formNamePart.substring(1);
		var formName = formBase + 'Form';		
		loadComponentForm(formTitle, formName);
	}
}

/**
 * Loads the specified form into the component container in bootstrapMain.
 * @param {String} formTitle The name which will appear in the header
 * @param {String} formName The name of the form to load
 *
 * @properties={typeid:24,uuid:"424A2C24-B6D0-4229-93AC-F9B3B3C764A5"}
 */
function loadComponentForm(formTitle, formName) {
	forms.baseComponentForm.setTitle(formTitle);
	forms.baseComponentForm.setContainedForm(forms[formName]);
}


/**
 * Removes the 'selected' class from all buttons in the selector form.
 *
 * @properties={typeid:24,uuid:"F08A5DB7-14F8-4917-849B-8345D71F45FD"}
 */
function clearButtonSelection() {
	// Get all elements in the form
	var allElements = elements.allnames;
	
	// Loop through elements and remove 'selected' class from buttons
	for (var i = 0; i < allElements.length; i++) {
		var elementName = allElements[i];
		if (elementName.indexOf('button_') === 0) {
			elements[elementName].removeStyleClass('selected');
		}
	}
}