
/**
 * @properties={typeid:24,uuid:"BA3C7E51-E93C-47F9-9069-6C730F17A05C"}
 */
function onLoad() {
	var tabSeq = forms.selectorForm.controller.getTabSequence();
	if (tabSeq.length > 0) {
		forms.selectorForm.controller.focusField(tabSeq[0], false);
		forms.selectorForm.elements.button_collapse.addStyleClass('selected');
	}
	
	forms.selectorForm.loadComponentForm('Collapse', 'collapseForm')
}
