angular.module('servoyextraImagelabel', ['servoy']).directive('servoyextraImagelabel', function() {
		return {
			restrict: 'E',
			scope: {
				model: "=svyModel",
				handlers: "=svyHandlers"
			},
			link: function($scope, $element, $attrs) {
				$scope.$watch('model.centerImage', function(newValue) {
					$element.find('img').removeClass('svy-extra-imagelabel-center');
					if (newValue) $element.find('img').addClass('svy-extra-imagelabel-center');
				});
			},
			templateUrl: 'servoyextra/imagelabel/imagelabel.html'
		};
	})
