var isShowing = false;

/**
 * Gets the resize weight, which specifies how to distribute extra space when the size of the split pane changes.
 * A value of 0, the default, indicates the right/bottom component gets all the extra space (the left/top component acts fixed),
 * where as a value of 1 specifies the left/top component gets all the extra space (the right/bottom component acts fixed).
 * Specifically, the left/top component gets (weight * diff) extra space and the right/bottom component gets (1 - weight) * diff extra space
 * @example var resizeWeight = %%prefix%%%%elementName%%.resizeWeight
 */
$scope.api.getResizeWeight = function() {
	return $scope.model.resizeWeight;
}

/**
 * Sets the resize weight, which specifies how to distribute extra space when the size of the split pane changes.
 * A value of 0, the default, indicates the right/bottom component gets all the extra space (the left/top component acts fixed),
 * where as a value of 1 specifies the left/top component gets all the extra space (the right/bottom component acts fixed).
 * Specifically, the left/top component gets (weight * diff) extra space and the right/bottom component gets (1 - weight) * diff extra space
 * @example %%prefix%%%%elementName%%.resizeWeight = 10;
 */
$scope.api.setResizeWeight = function(resizeW) {
	$scope.model.resizeWeight = resizeW;
}

/**
 * Gets left form minimum size in pixels.
 * @example var left = %%prefix%%%%elementName%%.leftFormMinSize
 */
$scope.api.getLeftFormMinSize = function() {
	return $scope.model.pane1MinSize;
}

/**
 * Sets left form minimum size in pixels.
 * @example %%prefix%%%%elementName%%.leftFormMinSize = 100;
 */
$scope.api.setLeftFormMinSize = function(minSize) {
	$scope.model.pane1MinSize = minSize;
}

/**
 * Gets right form minimum size in pixels.
 * @example var right = %%prefix%%%%elementName%%.rightFormMinSize
 */
$scope.api.getRightFormMinSize = function() {
	return $scope.model.pane2MinSize;
}

/**
 * Sets right form minimum size in pixels.
 * @example %%prefix%%%%elementName%%.rightFormMinSize = 100;
 */
$scope.api.setRightFormMinSize = function(minSize) {
	$scope.model.pane2MinSize = minSize;
}

/**
 * Gets the divider size in pixels.
 * @example var dividerSize = %%prefix%%%%elementName%%.dividerSize
 * @return the size in pixels
 */
$scope.api.getDividerSize = function() {
	return $scope.model.divSize;
}

/**
 * Sets divider size in pixels.
 * @example %%prefix%%%%elementName%%.dividerSize = 10;
 */
$scope.api.setDividerSize = function(size) {
	if (size >= 0) {
		$scope.model.divSize = size;
	}
}
/**
 * Gets the divider location in pixels.
 * @example var dividerSize = %%prefix%%%%elementName%%.dividerSize
 * @return the size in pixels
 */
$scope.api.getDividerLocation = function() {
	return $scope.model.divLocation;
}

/**
 * Gets the divider location in percentage.
 * @example var divRelativeLocation = %%prefix%%%%elementName%%.getRelativeDividerLocation()
 * @return the location in percentage
 */
$scope.api.getRelativeDividerLocation = function() {
	var location = $scope.model.divLocation;
	var direction = $scope.model.splitType;
	if (location == -1) {
		return 0.5;
	} else if (location >= 0 && location <= 1) {
		return location;
	} else {
		if (direction == 0) {
			return location / $scope.api.getInternalWidth();
		}
		return location / $scope.api.getInternalHeight();
	}
}

/**
 * Sets divider location. If location is less then 1 then the location will be considered at (location * 100) percent of the split pane from left, otherwise it will represent the pixels from left.
 * @example %%prefix%%%%elementName%%.dividerLocation = 0.75;
 * %%prefix%%%%elementName%%.dividerLocation = 100;
 */
$scope.api.setDividerLocation = function(location) {
	if (location >= 0) {
		$scope.model.divLocation = location;
	}
}

/**
 * Set a relationless or related form as left panel.
 * @example %%prefix%%%%elementName%%.setLeftForm(forms.orders);
 * @param form the specified form or form name you wish to add as left panel
 * @return {Boolean} value indicating if pane was successfully added
 */
$scope.api.setLeftForm = function(form, relation) {
	$scope.initPanes();
	if (form && isShowing && servoyApi.showForm(form, relation)) {
		$scope.model.pane1 = {
			containsFormId: form,
			relationName: relation
		};
		return true;
	}
	else if (!isShowing) {
		$scope.model.pane1 = {
			containsFormId: form,
			relationName: relation
		};
		return true;
	}
	return false;
}

/**
 * Set a relationless or related form as right panel.
 * @example %%prefix%%%%elementName%%.setRightForm(forms.orders);
 * @param form the specified form or form name you wish to add as right panel
 * @return {Boolean} value indicating if pane was successfully added
 */
$scope.api.setRightForm = function(form, relation) {
	$scope.initPanes();
	if (form && isShowing && servoyApi.showForm(form, relation)) {
		$scope.model.pane2 = {
			containsFormId: form,
			relationName: relation
		};
		return true;
	}
	else if (!isShowing) {
		$scope.model.pane2 = {
			containsFormId: form,
			relationName: relation
		};
		return true;
	}
	return false;
}

/**
 * Returns the left form of the split pane.
 * @example var leftForm = %%prefix%%%%elementName%%.getLeftForm();
 * @return {FormScope} left form of the split pane
 */
$scope.api.getLeftForm = function() {
	$scope.initPanes();
	if (!$scope.model.pane1) return null;
	return $scope.model.pane1.containsFormId;
}

/**
 * Returns the right form of the split pane.
 * @example var rightForm = %%prefix%%%%elementName%%.getRightForm();
 * @return {FormScope} right form of the split pane
 */
$scope.api.getRightForm = function() {
	$scope.initPanes();
	if (!$scope.model.pane2) return null;
	return $scope.model.pane2.containsFormId;
}

$scope.initPanes = function() {
	if ($scope.model.panes) {
		if (!$scope.model.pane1 && $scope.model.panes[0]) {
			$scope.model.pane1 = $scope.model.panes[0];
		}
		if (!$scope.model.pane2 && $scope.model.panes[1]) {
			$scope.model.pane2 = $scope.model.panes[1];
		}
		$scope.model.panes = null;
	}
}

$scope.setters.setContainsFormId = function(pane, form) {

	if (pane.containsFormId && !servoyApi.hideForm(pane.containsFormId)) {
		return false;
	}

	if (!servoyApi.showForm(form, pane.relationName)) {
		return false;
	}

	pane.containsFormId = form;
}

/**
	 * Servoy component lifecycle callback
	 *
	 *	This is needed for backward compatibility with the deprecated property panes[]
	 */
$scope.onShow = function() {
	isShowing = true;
	$scope.initPanes();
	if ($scope.model.pane1.containsFormId) {
		servoyApi.showForm($scope.model.pane1.containsFormId, $scope.model.pane1.relationName);
	}
	if ($scope.model.pane2.containsFormId) {
		servoyApi.showForm($scope.model.pane2.containsFormId, $scope.model.pane2.relationName);
	}
}

$scope.onHide = function() {
	isShowing = false;
}

