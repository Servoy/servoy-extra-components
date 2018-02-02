angular.module('servoyextraSlider', ['servoy', 'rzModule', 'servoyformat']) //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$
	.directive('servoyextraSlider', ['$formatterUtils', '$timeout', '$sabloConstants', '$utils', "$log", //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$ //$NON-NLS-4$ //$NON-NLS-5$ //$NON-NLS-6$ 
		function($formatterUtils, $timeout, $sabloConstants, $utils, $log) {
		return {
			restrict: 'E', //$NON-NLS-1$ 
			scope: {
				model: '=svyModel', //$NON-NLS-1$ 
				api: "=svyApi", //$NON-NLS-1$ 
				handlers: "=svyHandlers", //$NON-NLS-1$ 
				svyServoyapi: "=" //$NON-NLS-1$ 
			},
			controller: function($scope, $element, $attrs) {
				/** "Missing" options
				// id: null,
				// bindIndexForStepsArray: false,
				// showSelectionBarFromValue: null,
				// interval: 500,
				// keyboardSupport: true,
				// onlyBindHandles: false,
				// reversedControls: false,
				// boundPointerLabels: true,
				// mergeRangeLabelsIfSame: false,
				// customTemplateScope: null,
				// customValueToPosition: null,
				// customPositionToValue: null,
				// ariaLabel: null,
				// ariaLabelledBy: null,
				// ariaLabelHigh: null,
				// ariaLabelledByHigh: null
				*/
				
				$scope.options = {
					onEnd: onSlideEnd,
					onStart: onSlideStart,					
					translate: formatValue
				};
				
				/**
				 * @type {Function}
				 */
				$scope.formattingFunction = null;
				
				/**
				 * @type {Function}
				 */
				$scope.pointColorFunction = null;	
				
				function getPointerColor(value, pointerType) {
					if (pointerType === 'min') { //$NON-NLS-1$ 
						pointerType = 'value'; //$NON-NLS-1$ 
					} else if (pointerType === 'max') { //$NON-NLS-1$ 
						pointerType = 'high'; //$NON-NLS-1$ 
					}
					return $scope.pointColorFunction(value, pointerType);
				}
				
				/**
				 * called onSlideEnd
				 */
				function onSlideEnd(sliderId, modelValue, highValue, pointerType) {
					if ($scope.model.dataChangeOnSlideEnd && pointerType === 'max') { //$NON-NLS-1$ 
						$scope.svyServoyapi.apply('dataProviderHigh'); //$NON-NLS-1$ 
					}
					if ($scope.model.dataChangeOnSlideEnd && pointerType === 'min') { //$NON-NLS-1$ 
						$scope.svyServoyapi.apply('dataProvider'); //$NON-NLS-1$ 
					}
					if ($scope.handlers.onSlideEnd) {
						var event = $utils.createJSEvent({target: $element[0]}, 'onSlideEnd'); //$NON-NLS-1$ 
						$scope.handlers.onSlideEnd(event, modelValue, highValue, pointerType === 'min' ? 'value' : 'high'); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
					}
				}
				
				/**
				 * called onSlideStart
				 */
				function onSlideStart(sliderId, modelValue, highValue, pointerType) {
					if ($scope.handlers.onSlideStart) {
						var event = $utils.createJSEvent({target: $element[0]}, 'onSlideStart'); //$NON-NLS-1$ 
						$scope.handlers.onSlideStart(event, modelValue, highValue, pointerType === 'min' ? 'value' : 'high'); //$NON-NLS-1$ //$NON-NLS-2$ //$NON-NLS-3$
					}
				}
				
				/**
				 * Formats a value either using a formattingFunction or the given numberFormat
				 */
				function formatValue(value, sliderId, label) {
					if (!$scope.model.numberFormat || !$scope.formattingFunction || !value) return value;
					if ($scope.formattingFunction) {
						if (label === 'model') { //$NON-NLS-1$
							label = 'value'; //$NON-NLS-1$
						}
						return $scope.formattingFunction(value, label);
					} else {
						return numberFormat(value, $scope.model.numberFormat.display);
					}
				}
				
				/**
				 * Servoy formatter to format a number with the given Servoy pattern
				 */
				function numberFormat(value, format) {
					return $formatterUtils.format(value, format, 'NUMBER'); //$NON-NLS-1$
				}
				
				/**
				 * Refreshes the slider
				 */
				$scope.api.refresh = function () {
					  $timeout(function () {
					    $scope.$broadcast('rzSliderForceRender'); //$NON-NLS-1$
					  });
					};								
				
				//deal with model changes
				Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
					configurable: true,
					value: function(property, value) {
						switch (property) {
							case "dataProvider": //$NON-NLS-1$
								break;
							case "dataProviderHigh": //$NON-NLS-1$
								break;
							case "enabled": //$NON-NLS-1$
								$scope.options.disabled = !value;
								break;
							case "vertical": //$NON-NLS-1$
								$scope.options.vertical = value;
								$scope.api.refresh();
								break;
							case "readOnly": //$NON-NLS-1$
								$scope.options.readOnly = value;
								break;
							case "ticksValuesInterval": //$NON-NLS-1$
								if ($scope.model.showTicksValues) {
									$scope.options.showTicksValues = $scope.model.ticksValuesInterval;
								} else {
									$scope.options.showTicksValues = false;
								}
								break;	
							case "showTicksValues": //$NON-NLS-1$
								if ($scope.model.ticksValuesInterval && value) {									
									$scope.options.showTicksValues = $scope.model.ticksValuesInterval;
								} else {
									$scope.options.showTicksValues = value || false;
								}
								break;	
							case "ticksInterval": //$NON-NLS-1$
								if ($scope.model.showTicks) {
									$scope.options.showTicks = $scope.model.ticksInterval;
								} else {
									$scope.options.showTicks = false;
								}
								break;
							case "showTicks": //$NON-NLS-1$
								if ($scope.model.ticksInterval && value) {									
									$scope.options.showTicks = $scope.model.ticksInterval;
								} else {
									$scope.options.showTicks = value || false;
								}
								break;
							case "styleClass": //$NON-NLS-1$
								break;
							case "stepsValueList": //$NON-NLS-1$
								var stepsArray = [];
								for (var vl = 0; vl < value.length; vl++) {
									/** @type {{displayValue: String, realValue: Object}} */
									var item = value[vl];
									if (item.realValue == item.displayValue) {
										//no "legend"										
										stepsArray.push({value: item.realValue})
									} else {
										stepsArray.push({value: item.realValue, legend: item.displayValue})
									}
								}
								$scope.options.stepsArray = stepsArray;
								break;
							case "formattingFunction": //$NON-NLS-1$
								$scope.formattingFunction = eval('(' + value + ')'); //$NON-NLS-1$ //$NON-NLS-2$
								break;
							case "selectionBarColorFunction": //$NON-NLS-1$
								$scope.options.getSelectionBarColor = eval('(' + value + ')'); //$NON-NLS-1$ //$NON-NLS-2$
								break;
							case "getLegendFunction": //$NON-NLS-1$
								$scope.options.getLegend = eval('(' + value + ')'); //$NON-NLS-1$ //$NON-NLS-2$
								break;
							case "tickColorFunction": //$NON-NLS-1$
								$scope.options.getTickColor = eval('(' + value + ')'); //$NON-NLS-1$ //$NON-NLS-2$
								break;
							case "ticksTooltipFunction": //$NON-NLS-1$
								$scope.options.ticksTooltip = eval('(' + value + ')'); //$NON-NLS-1$ //$NON-NLS-2$
								break;
							case "ticksValuesTooltipFunction": //$NON-NLS-1$
								$scope.options.ticksValuesTooltip = eval('(' + value + ')'); //$NON-NLS-1$ //$NON-NLS-2$
								break;
							case "pointerColorFunction": //$NON-NLS-1$
								$scope.pointColorFunction = eval('(' + value + ')'); //$NON-NLS-1$ //$NON-NLS-2$
								$scope.options.getPointerColor = getPointerColor;
								break;
							default:
								$scope.options[property] = value;
						}
					}
				});
				
				/**
				 * @type {Function}
				 */
				var modelChangeFunction = $scope.model[$sabloConstants.modelChangeNotifier];
				for (var key in $scope.model) {
					modelChangeFunction(key, $scope.model[key]);
				}
				
				/** @type {Function} */
				var destroyListenerUnreg = $scope.$on("$destroy", function() { //$NON-NLS-1$
					destroyListenerUnreg();
					delete $scope.model[$sabloConstants.modelChangeNotifier];
				});
				
				if ($log.debugEnabled && $log.debugLevel === $log.SPAM) {
					$log.debug($scope.options);
				}
				
				$scope.$watch('model.dataProvider', function(newValue, oldValue) { //$NON-NLS-1$
					if (!$scope.model.dataChangeOnSlideEnd) {
						//directly apply changes
						$scope.svyServoyapi.apply('dataProvider'); //$NON-NLS-1$
					}
				});	
				
				$scope.$watch('model.dataProviderHigh', function(newValue, oldValue) { //$NON-NLS-1$
					if (!$scope.model.dataChangeOnSlideEnd) {
						//directly apply changes
						$scope.svyServoyapi.apply('dataProviderHigh'); //$NON-NLS-1$
					}
				});	
				
				$scope.api.onDataChangeCallback = function(event, returnval) {
				}
				
				$scope.api.onDataChangeCallbackHigh = function(event, returnval) {
				}
				
			},
			link: function($scope, $element, $attrs) {
				
			},
			templateUrl: 'servoyextra/slider/slider.html' //$NON-NLS-1$
		};
	}])