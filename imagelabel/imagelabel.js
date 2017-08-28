angular.module('servoyextraImagelabel', ['servoy']).directive('servoyextraImagelabel', function() {
		return {
			restrict: 'E',
			scope: {
				model: "=svyModel",
				handlers: "=svyHandlers"
			},
			link: function($scope, $element, $attrs) {
				
				
			},
			templateUrl: 'servoyextra/imagelabel/imagelabel.html'
		};
	})
