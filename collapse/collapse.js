angular.module('servoyextraCollapse', ['servoy']) //$NON-NLS-1$ //$NON-NLS-2$
	.directive('servoyextraCollapse', ['$sabloApplication', '$sce', '$q', '$timeout', function($sabloApplication, $sce, $q, $timeout) { //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
		return {
			restrict: 'E', //$NON-NLS-1$
			scope: {
				model: '=svyModel',	//$NON-NLS-1$
				svyServoyapi: "=",	//$NON-NLS-1$
				handlers: "=svyHandlers",	//$NON-NLS-1$
				api: "=svyApi"	//$NON-NLS-1$
			},
			controller: function($scope, $element, $attrs) {
				
				$scope.getFormIfVisible = function(collapse) {
					if (collapse && collapse.form && !collapse.isCollapsed) {
						return $scope.svyServoyapi.getFormUrl(collapse.form);
					} else {
						return "";
					}
				}
				
				$scope.getCardFormIfVisible = function(collapse, card) {
					if (collapse && card.form && !collapse.isCollapsed) {
						return $scope.svyServoyapi.getFormUrl(card.form);
					} else {
						return "";
					}
				}
				
				$scope.getFormStyle = function(formToGet) {
					if (formToGet && $scope.formState && $scope.formState[formToGet]) {
						//form found
						var style;
						/** @type {{absoluteLayout: Boolean, minResponsiveHeight: Number, maxResponsiveHeight: Number, properties: {designSize: {height: Number, width: Number}}}} */
						var formState = $scope.formState[formToGet];
						if (formState.absoluteLayout === true) {
							//absolute layout
							style = {
								height: formState.properties.designSize.height + 'px'  //$NON-NLS-1$
							}
							return style;
						} else if (formState.absoluteLayout !== true) {
							//responsive layout; possibly add min- and/or max-height
							style = {};
							if (formState.minResponsiveHeight != null) {
								style['min-height'] = formState.minResponsiveHeight; //$NON-NLS-1$
							}
							if (formState.maxResponsiveHeight != null) {
								style['max-height'] = formState.maxResponsiveHeight; //$NON-NLS-1$
							}
							return style;
						}
					}
					return null;
				}

				$scope.trustAsHtml = function(string) {
					// not trusted
					if (!$scope.svyServoyapi.trustAsHtml()) return string;

					//allow html content     
					return $sce.trustAsHtml(string);
				};

			},
			link: function($scope, $element, $attrs) {

				/**
				 * Calls collapse method for the collapsible with the given index
				 */
				function collapse(index, state) {
					//set collapse state
					getCollapsibleElement(index).collapse(state);
				}

				/**
				 * Sets the collapsed state of the collapsible with the given index
				 */
				function setCollapsedState(index, state) {
					var collapsibleToChange = getCollapsible(index);
					var accordionClosedCollapsible = null;
					if ($scope.model.accordionMode && state === false) {
						//collapsible is being expanded and we are in accordionMode
						for (var i = 0; i < $scope.model.collapsibles.length; i++) {
							var otherCollapse = getCollapsible(i);
							//if another collapsible is open, close that
							if (i != index && !otherCollapse.isCollapsed) {
								otherCollapse.isCollapsed = true;
								collapse(i, 'hide');  //$NON-NLS-1$
								accordionClosedCollapsible = { collapsible: otherCollapse, index: i };
								if (otherCollapse.form) {
									//a form needs to be hidden
									$scope.svyServoyapi.hideForm(otherCollapse.form, otherCollapse.relationName);
								} else if (otherCollapse.cards) {
									//maybe cards have forms to hide
									toggleCardVisibility(otherCollapse.cards, true);
								}
							}
						}
					}
					
					//toggle form visibility
					if (collapsibleToChange.form) {
						if (state === false) {
							$scope.svyServoyapi.formWillShow(collapsibleToChange.form, collapsibleToChange.relationName).then(function() {
								$scope.model.collapsibles[index].isCollapsed = state;
							});
						} else if (state === true) {
							$scope.svyServoyapi.hideForm(collapsibleToChange.form, collapsibleToChange.relationName).then(function() {
								$scope.model.collapsibles[index].isCollapsed = state;
							});
						}
					} else if (collapsibleToChange.cards) {
						//toggle form visibility on cards
						toggleCardVisibility(collapsibleToChange.cards, state).then(function() {
							$scope.model.collapsibles[index].isCollapsed = state;
						});
					} else {
						$scope.model.collapsibles[index].isCollapsed = state;
					}
					return accordionClosedCollapsible;
				}

				/**
				 * @param {Array<{form: String}>} cardsArray
				 * @param {String} state
				 * Shows/Hides forms when a card containing a form becomes visible / not visible
				 */
				function toggleCardVisibility(cardsArray, state) {
					function toggleFormVisibility(card) {
						if (card.form) {
							if (state === false) {
								return $scope.svyServoyapi.formWillShow(card.form, card.relationName);
							} else {
								return $scope.svyServoyapi.hideForm(card.form, card.relationName);
							}
						} else {
							return true;
						}
					}
					
					return $q.all(cardsArray.map(toggleFormVisibility));
				}
				
				/**
				 * Returns the collapsible at the given index
				 * @return {{form: String, cards: Array}}
				 */
				function getCollapsible(index) {
					return $scope.model.collapsibles[index];
				}

				/**
				 * Returns the element containing the collapsible
				 */
				function getCollapsibleElement(index) {
					if (!(index >= 0)) {
						index = 0;
					}
					return $('#' + $scope.model.svyMarkupId + '-' + index + '-collapsible'); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
				}

				function openOrCloseCollapsiblesAfterClick(e, collapsibleIndex, collapsible, previousState) {
					var accordionClosedCollapsible = setCollapsedState(collapsibleIndex, !previousState);
					if (accordionClosedCollapsible !== null && $scope.handlers.onCollapsibleHidden) {
						$scope.handlers.onCollapsibleHidden(e, accordionClosedCollapsible.collapsible, accordionClosedCollapsible.index);
					}
					if (previousState === true && $scope.handlers.onCollapsibleShown) {
						$scope.handlers.onCollapsibleShown(e, collapsible, collapsibleIndex);
					} else if (previousState !== true && $scope.handlers.onCollapsibleHidden) {
						$scope.handlers.onCollapsibleHidden(e, collapsible, collapsibleIndex);
					}
				}

				function handleHeaderClickEvent(e, handlerFunction) {
					var collapsibleIndex = $(e.target).closest('.svy-collapse-collapsible').attr('id').split('-')[1] //$NON-NLS-1$ //$NON-NLS-2$
					var collapsible = $scope.model.collapsibles[collapsibleIndex];
					var previousState = collapsible.isCollapsed;

					if (handlerFunction) {
						var dataTarget = $(e.target).closest('[data-target]');
						handlerFunction(e, collapsible, collapsibleIndex, dataTarget ? dataTarget.attr('data-target') : null)
							.then(function(result) {
								if (result !== false) {
									var collapsibleElement = getCollapsibleElement(collapsibleIndex);
									collapsibleElement.collapse('toggle');
									openOrCloseCollapsiblesAfterClick(e, collapsibleIndex, collapsible, previousState);
								}
							});
					} else {
						openOrCloseCollapsiblesAfterClick(e, collapsibleIndex, collapsible, previousState);
					}
				}

				/**
				 * onClick handler setting the collapsible state and possibly calling handlers
				 */
				$scope.onClick = function(e) {
					e.stopPropagation();
					e.preventDefault();
					if ($scope.clicked) {
						$scope.cancelClick = true;
						return;
					}

					$scope.clicked = true;

					$timeout(function() {
						if ($scope.cancelClick) {
							$scope.cancelClick = false;
							$scope.clicked = false;
							return;
						}

						handleHeaderClickEvent(e, $scope.handlers.onHeaderClicked);

						$scope.cancelClick = false;
						$scope.clicked = false;
					}, 300);
				}

				$scope.onDoubleClick = function(e) {
					$timeout(function() {
						e.stopPropagation();
						e.preventDefault();
						
						handleHeaderClickEvent(e, $scope.handlers.onHeaderDoubleClicked);
					})
				}

				/**
				 * Calls the onCardClicked handler
				 */
				$scope.onCardClick = function(e, cardIndex, collapsibleIndex) {
					if ($scope.handlers.onCardClicked) {
						var collapsible = getCollapsible(collapsibleIndex);
						var dataTarget = $(e.target).closest('[data-target]');
						if (collapsible.cards && collapsible.cards[cardIndex])
							$scope.handlers.onCardClicked(e, collapsible.cards[cardIndex], collapsible, cardIndex, collapsibleIndex, dataTarget ? dataTarget.attr('data-target') : null);
					} else {
						//collasible html only
						$scope.handlers.onCardClicked(e, null, collapsible, cardIndex, collapsibleIndex, dataTarget ? dataTarget.attr('data-target') : null);
					}
				}


				/**
				 * Toggles the collapsible at the given index (or the first/only one, if no index is given)
				 * 
				 * @param {Number} index the index of the collapsible to toggle
				 */
				$scope.api.toggle = function(index) {
					var collapsibleElement = getCollapsibleElement(index);
					var collapsible = getCollapsible(index);
					collapsibleElement.collapse('toggle'); //$NON-NLS-1$
					setCollapsedState(index, !collapsible.isCollapsed);
				}

				/**
				 * Shows the collapsible at the given index (or the first/only one, if no index is given)
				 * 
				 * @param {Number} index the index of the collapsible to show
				 */
				$scope.api.show = function(index) {
					var collapsibleElement = getCollapsibleElement(index);
					collapsibleElement.collapse('show'); //$NON-NLS-1$
					setCollapsedState(index, false);
				}

				/**
				 * Hides the collapsible at the given index (or the first/only one, if no index is given)
				 * 
				 * @param {Number} index the index of the collapsible to hide
				 */
				$scope.api.hide = function(index) {
					var collapsibleElement = getCollapsibleElement(index);
					collapsibleElement.collapse('hide'); //$NON-NLS-1$
					setCollapsedState(index, true);
				}
				
				//loads form properties for newly added forms
				$scope.$watch('model.collapsibles', function(newValue, oldValue) { //$NON-NLS-1$
					if (newValue != null) {
						for (var cc = 0; cc < $scope.model.collapsibles.length; cc++) {
							if ($scope.model.collapsibles[cc].form) {
								getFormState($scope.model.collapsibles[cc].form, !$scope.model.collapsibles[cc].isCollapsed, $scope.model.collapsibles[cc]);
							}
							if ($scope.model.collapsibles[cc].cards) {
								for (var c = 0; c < $scope.model.collapsibles[cc].cards.length; c++) {
									var card = $scope.model.collapsibles[cc].cards[c];
									if (card.form) {
										getFormState(card.form, !$scope.model.collapsibles[cc].isCollapsed, $scope.model.collapsibles[cc]);
									}
								}
							}
						}
					}
				}, true)

				/**
				 * Loads a form's absoluteLayout property and its properties to be able to obtain the design size
				 */
				function getFormState(form, formWillShow, collapsibleOrCard) {
					$sabloApplication.getFormState(form).then(
						function(formState) {
							if (formState.properties) {
								if (!$scope.formState) {
									$scope.formState = {};
								}
								$scope.formState[form] = {
									properties: formState.properties,
									absoluteLayout: formState.absoluteLayout,
									maxResponsiveHeight: collapsibleOrCard.maxResponsiveHeight,
									minResponsiveHeight: collapsibleOrCard.minResponsiveHeight
								};
								if (formWillShow) {
									$scope.svyServoyapi.formWillShow(form, collapsibleOrCard.relationName);
								}
							}
						}
					);
				}

				function initCollapsibles() {
					//get form states and fix possible accordionMode misconfiguration
					var openedCollapseFound = false;
					if ($scope.model.collapsibles) {
						for (var x = 0; x < $scope.model.collapsibles.length; x++) {
							var collapsible = $scope.model.collapsibles[x];
							//see whether it should be collapsed or not
							if ($scope.model.expandedIndices && $scope.model.expandedIndices.indexOf(x) !== -1) {
								//should be expanded
								if (!$scope.model.accordionMode || !openedCollapseFound) {
									//when not in accordionMode or no collapse is yet expanded
									collapsible.isCollapsed = false;
									openedCollapseFound = true;
								} else {
									collapsible.isCollapsed = true;
								}
							}
							if (collapsible.form) {
								getFormState(collapsible.form, !collapsible.isCollapsed, collapsible);
							}
						}
					}	
				}
				
				initCollapsibles();
			},
			templateUrl: 'servoyextra/collapse/collapse.html' //$NON-NLS-1$
		};
	}])