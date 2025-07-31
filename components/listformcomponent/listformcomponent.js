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
			}
		}
	}])