/**
 * Creates a new collapsible that can be added to the Collapse component using <code>addCollapsible</code> / <code>setCollapsibles</code>
 * 
 * @param {String} [headerHtml]
 * @param {String} [collapsibleId]
 * 
 * @return {svy-collapse.collapsible}
 */
$scope.api.createCollapsible = function(headerHtml, collapsibleId) {
	return {
		headerHtml: headerHtml || null,
		collapsibleId: collapsibleId || Math.ceil(Math.random() * 10000000) + '',
		headerStyleClass: null,
		collapsibleHtml: null,
		form: null,
		isCollapsed: true,
		cards: [],
        styleClass: null,
        iconLocation: 'RIGHT',
        collapsedIconName: 'fa fa-2x fa-angle-down',
		expandedIconName: 'fa fa-2x fa-angle-up',
		minResponsiveHeight: null,
		maxResponsiveHeight: null
	}
}

/**
 * Creates a new card that can be added to any collapsible's cards array
 * 
 * @param {String} [textOrHtml]
 * @param {String} [cardId]
 * @param {String} [styleClass]
 * @return {svy-collapse.card}
 */
$scope.api.createCard = function(textOrHtml, cardId, styleClass) {
	return {
		contentHtml: textOrHtml || null,
		cardId: cardId || Math.ceil(Math.random() * 10000000) + '',
		form: null, 
		styleClass: styleClass || null,
		minResponsiveHeight: null,
		maxResponsiveHeight: null
	}
}

/**
 * Adds a new collapsible to the list of collapsibles of this Collapse component
 * 
 * @param {svy-collapse.collapsible} collapsible
 * @param {Number} [index] the index to insert the new collapsible at
 */
$scope.api.addCollapsible = function(collapsible, index) {
	if (!$scope.model.collapsibles || $scope.model.collapsibles.length == 0) {
		$scope.model.collapsibles = [];
	}
	if (index >= 0) {
		$scope.model.collapsibles.splice(index, 0, collapsible);
	} else {
		$scope.model.collapsibles.push(collapsible);
	}
}

/**
 * Sets all collapsibles of this Collapse component
 * 
 * @param {Array<svy-collapse.collapsible>} collapsibles
 */
$scope.api.setCollapsibles = function(collapsibles) {
	if ($scope.model.collapsibles !== collapsibles) {
		$scope.api.removeAllCollapsibles();
	}
	
	$scope.model.collapsibles = collapsibles;
}

/**
 * Returns the card with the given ID
 * @param {String} cardId
 * @return {svy-collapse.card} the card or null when not found
 */
$scope.api.getCardById = function(cardId) {
	if (!$scope.model.collapsibles || $scope.model.collapsibles.length === 0) {
		return null;
	}
	
	for (var i = 0; i < $scope.model.collapsibles.length; i++) {
		var collapsible = $scope.model.collapsibles[i];
		if (collapsible.cards && collapsible.cards.length > 0) {
			for (var c = 0; c < collapsible.cards.length; c++) {
				if (collapsible.cards[c].cardId == cardId) {
					return collapsible.cards[c];
				}
			}
		}
	}
	
	return null;
}

/**
 * Returns the card with the given index
 * @param {Number} cardIndex the index of the card to get (0 based)
 * @param {Number} [collapsibleIndex] if not given, the first collapsible is used
 * 
 * @return {svy-collapse.card} the card or null when not found
 */
$scope.api.getCard = function(cardIndex, collapsibleIndex) {
	if (!(collapsibleIndex >= 0)) {
		collapsibleIndex = 0;
	}
	if (!$scope.model.collapsibles || $scope.model.collapsibles.length === 0 || !$scope.model.collapsibles[collapsibleIndex]) {
		return null;
	}
	
	if ($scope.model.collapsibles[collapsibleIndex].cards && $scope.model.collapsibles[collapsibleIndex].cards[cardIndex]) {
		return $scope.model.collapsibles[collapsibleIndex].cards[cardIndex];
	}
	
	return null;
}

/**
 * Returns the collapsible with the given index (0 based)
 * @param {Number} [collapsibleIndex] if not given, the first collapsible is used
 * 
 * @return {svy-collapse.card} the card or null when not found
 */
$scope.api.getCollapsible = function(collapsibleIndex) {
	if (!(collapsibleIndex >= 0)) {
		collapsibleIndex = 0;
	}
	if (!$scope.model.collapsibles || $scope.model.collapsibles.length === 0 || !$scope.model.collapsibles[collapsibleIndex]) {
		return null;
	}
	
	return $scope.model.collapsibles[collapsibleIndex];
}

/**
 * Returns whether the collapsible at the given index (or the first one if no index is provided) is collapsed
 * @param {Number} [collapsibleIndex]
 * 
 * @return {Boolean}
 */
$scope.api.isCollapsed = function(collapsibleIndex) {
	if (!(collapsibleIndex >= 0)) {
		collapsibleIndex = 0;
	}
	var collapsible = $scope.model.collapsibles[collapsibleIndex];
	if (collapsible) {
		return collapsible.isCollapsed;
	}
	return false;
}

/**
 * Returns the collapsible with the given ID
 * @param {String} [collapsibleId] if not given, the first collapsible is used
 * 
 * @return {svy-collapse.card} the card or null when not found
 */
$scope.api.getCollapsibleById = function(collapsibleId) {
	if (!$scope.model.collapsibles || $scope.model.collapsibles.length === 0) {
		return null;
	}
	
	for (var c = 0; c < $scope.model.collapsibles.length; c++) {
		if ($scope.model.collapsibles[c].collapsibleId == collapsibleId) {
			return $scope.model.collapsibles[c];
		}
	}
	
	return null;
}

/**
 * Hide the collapsible with the given ID
 * @param {String} collapsibleId
 * 
 * @return
 */
$scope.api.removeCollapsibleById = function(collapsibleId) {
	if (!collapsibleId) return false;
    for (var c = 0; c < $scope.model.collapsibles.length; c++) {
        if ($scope.model.collapsibles[c].collapsibleId && $scope.model.collapsibles[c].collapsibleId == collapsibleId) {
            if ($scope.model.collapsibles[c].form && !servoyApi.hideForm($scope.model.collapsibles[c].form)) {
            	return false;
            } 
            $scope.model.collapsibles.splice(c, 1);
            break;
        }
    }
    return true;
}

/**
 * Remove the collapsible with the given index (0 based)
 * @param {Number} [collapsibleIndex] if not given, the first collapsible is used
 * 
 * @return
 */
$scope.api.removeCollapsibleAt = function (collapsibleIndex) {
    if (!(collapsibleIndex >= 0)) {
        collapsibleIndex = 0;
    }
    if (!$scope.model.collapsibles || $scope.model.collapsibles.length === 0 || !$scope.model.collapsibles[collapsibleIndex]) {
        return false;
    }

    if ($scope.model.collapsibles[collapsibleIndex].form && !servoyApi.hideForm($scope.model.collapsibles[collapsibleIndex].form)) {
    	return false;
    }
    
    $scope.model.collapsibles.splice(collapsibleIndex, 1);
    
    return true;
}

/**
 * Hide all collapsibles
 * 
 * @return
 */
$scope.api.removeAllCollapsibles = function () {
    if (!$scope.model.collapsibles) return true;
 
    for (var c = 0; c < $scope.model.collapsibles.length; c++) {
    	if ($scope.model.collapsibles[c].form && !servoyApi.hideForm($scope.model.collapsibles[c].form)) {
    		for (var i = 0; i < c - 1; i++) {
    			$scope.api.hide(i);
    		}
    		return false;
    	}
    }
    
    $scope.model.collapsibles = undefined;
    
    return true;
}