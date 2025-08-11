/**
 * Creates a new collapsible that can be added to the Collapse component using <code>addCollapsible</code> / <code>setCollapsibles</code>
 * 
 * @param {String} [headerHtml]
 * @param {String} [collapsibleId]
 * 
 * @return {svy-collapse.collapsible}
 */
$scope.api.createCollapsible = function(headerHtml, collapsibleId) {
    if ($scope.api.getCollapsibleById(collapsibleId)) {
        console.warn('A collapsible with the ID "' + collapsibleId + '" already exists. Please ensure all IDs are unique.');
        return null;
    }
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
 * Adds a new card to the list of cards of this collapsibleId
 * 
 * @param {svy-collapse.card} card the card to add to the collapsible
 * @param {String} collapsibleId the ID of the collapsible to add the card
 * @param {Number} [index] the index to insert the new card at
 */
$scope.api.addCard = function(card, collapsibleId, index) {
    var collapsible = $scope.api.getCollapsibleById(collapsibleId);
    if (!collapsible) {
        console.warn('A collapsible with the ID "' + collapsibleId + '" doesn\'t exists.');
        return;
    }
    if ($scope.api.getCardById(card.cardId)) {
        console.warn('A card with the ID "' + card.cardId + '" already exists. No changes were made. Please ensure all IDs are unique.');
        return;
    }
    
    if (!collapsible.cards || collapsible.cards.length == 0) {
        collapsible.cards = [];
    }  
    if (index >= 0) {
        collapsible.cards.splice(index, 0, card);
    } else {
        collapsible.cards.push(card);
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
    if ($scope.api.getCollapsibleById(collapsible.collapsibleId)) {
        console.warn('A collapsible with the ID "' + collapsible.collapsibleId + '" already exists. No changes were made. Please ensure all IDs are unique.');
        return;
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
    if (_checkIfCollapsiblesHaveUniqueIds(collapsibles)) {
        console.warn('Collapsibles were not set because some collapsibles have non-unique IDs. Please ensure all IDs are unique.');
        return;
    }
    
	if ($scope.model.collapsibles !== collapsibles) {
		$scope.api.removeAllCollapsibles();
	}
	
	$scope.model.collapsibles = collapsibles;
}

function _checkIfCollapsiblesHaveUniqueIds(collapsibles) {
    if (!collapsibles || collapsibles.length === 0) return;
    
    var returnValue = false;
    var ids = {};
    for (var i = 0; i < collapsibles.length; i++) {
        if (collapsibles[i].collapsibleId) {
            if (ids[collapsibles[i].collapsibleId]) {
                ids[collapsibles[i].collapsibleId] = false;
            } else {
                ids[collapsibles[i].collapsibleId] = true;
            }
        }
    }
    
    for (var id in ids) {
        if (ids[id] === false) {
            console.warn('Collapsible with ID "' + id + '" is not unique. Please ensure all IDs are unique.');
            returnValue = true;
        }
    }
    
    return returnValue;
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
 * Removes the collapsible with the given ID. If the collapsible was showing a form, it will hide that form as well.
 * @param {String} collapsibleId the id of the collapsible to remove.
 * 
 * @return {Boolean} true if the collapsible with the given id was removed; false if collapsibleId is not given, not found or if the form shown by this collapsible denied hide.
 */
$scope.api.removeCollapsibleById = function(collapsibleId) {
	if (!collapsibleId) return false;
    for (var c = 0; c < $scope.model.collapsibles.length; c++) {
        if ($scope.model.collapsibles[c].collapsibleId && $scope.model.collapsibles[c].collapsibleId == collapsibleId) {
            if ($scope.model.collapsibles[c].form && !servoyApi.hideForm($scope.model.collapsibles[c].form)) {
            	return false;
            } 
            $scope.model.collapsibles.splice(c, 1);
            return true;
        }
    }
    return false;
}

/**
 * Remove the collapsible with the given index (the index is 0 based) or the first collapsible if no collapsibleIndex is given. If the collapsible was showing a form, it will hide that form as well.
 * @param {Number} [collapsibleIndex] the index of the collapsible to remove; if not given, the first collapsible is used
 * 
 * @return {Boolean} true if the collapsible at the give index (or 0 if not given) was removed; false if collapsibleIndex is out of bounds or if the form shown by this collapsible denied hide.
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
 * Removes all collapsibles. It will also hide the forms that are showing on any of the collpsibles.
 *
 * If one of the collapsibles has a form showing that denies hide, the removeAllCollapsibles operation will stop and return false. In this case, all collapsibles that had forms and were hidden so far will still be in the collapsible array but they will be 'collapsed'.
 * 
 * @return {Boolean} true if all collapsibles were removed successfully; false if one of the collapsibles had a form which denied hide.
 */
$scope.api.removeAllCollapsibles = function () {
    if (!$scope.model.collapsibles) return true;
 
    for (var c = 0; c < $scope.model.collapsibles.length; c++) {
    	if ($scope.model.collapsibles[c].form && !servoyApi.hideForm($scope.model.collapsibles[c].form)) {
    		for (var i = 0; i < c; i++) {
    			$scope.api.hide(i);
    		}
    		return false;
    	}
    }
    
    $scope.model.collapsibles = undefined;
    
    return true;
}