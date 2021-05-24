angular.module('servoyextraGauge', ['servoy']).directive('servoyextraGauge', function($apifunctions, $svyProperties, $timeout) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				handlers: '=svyHandlers',
				svyServoyapi: '=svyServoyapi',
				api: '=svyApi'
			},
			controller: function($scope, $element, $attrs) {

				$scope.api.getWidth = $apifunctions.getWidth($element[0]);
				$scope.api.getHeight = $apifunctions.getHeight($element[0]);
				$scope.api.getLocationX = $apifunctions.getX($element[0]);
				$scope.api.getLocationY = $apifunctions.getY($element[0]);

				$scope.refreshGauge = function() {
					angular.element(document).ready(function() {
						$scope.target = $element.find('.gauge-canvas')[0];

						var options = {
							renderTo: $scope.target,
							minValue: $scope.model.minValue || 0,
							maxValue: $scope.model.maxValue || 100,
							value: $scope.model.value,
							units: $scope.model.units,
							title: $scope.getTitleText()
						}
						if($scope.model.animationOptions) Object.assign(options, $scope.model.animationOptions);
						if($scope.model.highlights) {
							$scope.model.ticks = $scope.model.ticks || {};
							$scope.model.ticks.highlights = $scope.model.highlights;
						}
						if($scope.model.ticks) {
							Object.assign(options, $scope.model.ticks);
						}
						if($scope.model.colorOptions) Object.assign(options, $scope.model.colorOptions);
						if($scope.model.valueBoxOptions) Object.assign(options, $scope.model.valueBoxOptions);
						if($scope.model.needleOptions) Object.assign(options, $scope.model.needleOptions);
						if($scope.model.borderOptions) Object.assign(options, $scope.model.borderOptions);
						if($scope.model.fontOptions) Object.assign(options, $scope.model.fontOptions);

						if ($scope.model.gaugeType == "radial") {
							if($scope.model.radialGaugeOptions) Object.assign(options, $scope.model.radialGaugeOptions)
							$scope.gauge = new RadialGauge(options);
						} else if ($scope.model.gaugeType == "linear") {
							if($scope.model.linearGaugeOptions) Object.assign(options, $scope.model.linearGaugeOptions)
							$scope.gauge = new LinearGauge(options);
						}
						$scope.gauge.draw();
					});
				}
				
				$scope.getTitleText = function() {
					var result = null;
					
					if($scope.model.title) {
						result = (($scope.model.title.dataProviderID == null) ? $scope.model.title.text : $scope.model.title.dataProviderID );
					}
					
					return result;
				}
				
				$scope.resize = function() {
					var gaugeHeight = $apifunctions.getHeight($element[0])();
					var gaugeWidth = $apifunctions.getWidth($element[0])();
					var canvasHeight = Math.max(1, (gaugeHeight - 10));
					$scope.gauge.update({ height: canvasHeight });
					$scope.gauge.update({ width: gaugeWidth });
					$scope.gauge.draw();
				}

				var resizeTimeout = null;

				var windowResizeHandler = function() {
					if (resizeTimeout) $timeout.cancel(resizeTimeout);
					if ($element.is(":visible")) {
						resizeTimeout = $timeout(function() {
								$scope.$apply(function() {
									$scope.resize();
								});
							}, 50);
					}
				}

				$(window).on('resize', windowResizeHandler);
				$scope.$on("dialogResize", windowResizeHandler);

			},
			link: function($scope, $element, $attrs) {
				$scope.$watch('model.gaugeType',
					function(_newValue, _oldValue) {
						angular.element(document).ready(function() {
							$scope.refreshGauge();
						});
					},
					true
				);

				$scope.$watch('model.value',
					function(_newValue, _oldValue) {
						if ($scope.gauge) {
							$scope.gauge.value = _newValue;
						}
					},
					true
				);

			},
			templateUrl: 'servoyextra/gauge/gauge.html'
		};
	})