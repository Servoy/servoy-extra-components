angular.module('servoyextraListformcomponent', ['servoy']).directive('servoyextraListformcomponent', ['$compile', '$sabloConstants', function($compile, $sabloConstants) {
		return {
			restrict: 'E',
			scope: {
				model: '=svyModel',
				api: "=svyApi",
				svyServoyapi: "=",
				handlers: "=svyHandlers"
			},
			templateUrl: 'servoyextra/listformcomponent/listformcomponent.html',
			controller: function($scope, $element, $attrs) {
			},
			link: function($scope, $element, $attrs) {
				$scope.getListStyle = function() {
					return ( ($scope.model.containedForm && !$scope.model.containedForm.absoluteLayout && $scope.model.responsivePageLayout == "listview") ? {"width":"100%"} : "" );
				}
			}
		}
	}])