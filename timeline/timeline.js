angular.module('servoyextraTimeline', ['servoy']).directive('servoyextraTimeline', ['$log',
	function($log) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				handlers: '=svyHandlers',
				api: '=svyApi',
				svyServoyapi: '='
			},
			controller: function($scope, $element, $attrs) {
				if ($scope.svyServoyapi.isInDesigner()) {
					$scope.model.data = [{ time: ' today', subject: 'timeline subject', content: 'timeline content' }];
				}

				var entryStyleClassFunc = null;
				$scope.$watch("model.entryStyleClassFunc", function(newValue, oldValue) {
						if ($scope.model.entryStyleClassFunc) {
							entryStyleClassFunc = eval($scope.model.entryStyleClassFunc);
						}
					});

				$scope.getEntryStyleClass = function(entry) {
					if (entryStyleClassFunc) {
						return entryStyleClassFunc(entry);
					}
					return '';
				}

				// var entryRendererFunc = function(entry) {
				// 	return '<div class="feed-icon"></div>' + '<div class="feed-subject" svy-tooltip="entry.tooltip">' + entry.subject + ' </div>' + '<div class="feed-content">' + entry.content + '</div>' + '<div class="feed-actions"><div class="pull-right"><i class="fa fa-clock-o"></i>' + entry.time + '</div></div>';
				// }

				var entryRendererFunc = function(entry) {
					var template;
					if (entry.data && entry.data.isDivider) {
						template = '<div class="label-header3 feed-divider">DEADLINE ' + entry.subject + '</div>';
					} else {
						template = '<div class="feed-icon"></div>' + '<i class="pull-right md md-check icon-round text-success"></i>' + '<div class="feed-subject">' + entry.subject + ' <i class="md md-note" ng-attr-title="{{entry.tooltip}}"></i> </div>' + '<div class="feed-content">' + entry.content + '</div>';
					}
					return template;
				}
				
				$scope.$watch("model.entryRendererFunc", function(newValue, oldValue) {
						if ($scope.model.entryRendererFunc) {
							entryRendererFunc = eval($scope.model.entryRendererFunc);
						}
					});

				$scope.getEntryRenderer = function(entry) {
					if (entryRendererFunc) {
						return entryRendererFunc(entry);
					}
					return '';
				}

				$scope.onEntryClick = function(entry, e) {
					if ($scope.handlers.onClick) {
						$scope.handlers.onClick(entry, e.target.id);
					}
				}

				$scope.$watch('model.foundset', function(oldValue, newValue) {
						if (!$scope.svyServoyapi || $scope.svyServoyapi.isInDesigner()) return;
						loadDataFromFoundset();
					});

				var monthNames = ["January", "February", "March", "April", "May", "June",
					"July", "August", "September", "October", "November", "December"];

				function loadDataFromFoundset() {
					if ($scope.model.foundset && $scope.model.foundset.viewPort.size) {
						$scope.model.data = [];

						var lastDate;
						for (var i = 0; i < $scope.model.foundset.viewPort.size; i++) {
							var row = $scope.model.foundset.viewPort.rows[i];

							var entry = { };
							if (row.time) {
								var time = new Date(row.time);
								// TODO allow date format here

								if (!lastDate || lastDate.toDateString() != time.toDateString()) {
									var entryDateDivider = new Object()
									entryDateDivider.time = time.toDateString();
									entryDateDivider.subject = time.getDate() + ' ' + monthNames[time.getMonth()];
									entryDateDivider.data = {
										isDivider: true
									};
									$scope.model.data.push(entryDateDivider);
								}
								
								lastDate = time;
								entry['time'] = time.toDateString();

							}

							//  entry['time'] = row['time'] != undefined ? row['time'] : '';
							entry['subject'] = row['subject'] != undefined ? row['subject'] : '';
							entry['content'] = row['content'] != undefined ? row['content'] : '';
							entry['tooltip'] = row['tooltip'] != undefined ? row['tooltip'] : '';
							entry['data'] = row['data'] != undefined ? row['data'] : '';
							$scope.model.data.push(entry);
						}
					}

				}
			},
			templateUrl: 'servoyextra/timeline/timeline.html'
		}
	}])
	.directive('bindHtmlCompile', ['$compile', function ($compile) {
		return {
		  restrict: 'A',
		  link: function (scope, element, attrs) {
			scope.$watch(function () {
			  return scope.$eval(attrs.bindHtmlCompile);
			}, function (value) {
			  // Incase value is a TrustedValueHolderType, sometimes it
			  // needs to be explicitly called into a string in order to
			  // get the HTML string.
			  element.html(value && value.toString());
			  // If scope is provided use it, otherwise use parent scope
			  var compileScope = scope;
			  if (attrs.bindHtmlScope) {
				compileScope = scope.$eval(attrs.bindHtmlScope);
			  }
			  $compile(element.contents())(compileScope);
			});
		  }
		};
	}]);