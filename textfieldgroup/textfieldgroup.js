angular.module('servoyextraTextfieldgroup',['servoy']).directive('servoyextraTextfieldgroup', function() {  
    return {
        restrict: 'E',
        scope: {
         	model: "=svyModel",
         	api: "=svyApi",
         	handlers: "=svyHandlers"
        },
        link: function($scope, $element, $attrs) {
        	var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        	$scope.showError = false
			
        	$scope.$watch('model.dataProviderID', function() {
        		if($scope.model.inputValidation == 'email') {
        			var isMatchRegex = EMAIL_REGEXP.test($scope.model.dataProviderID);
        			if(isMatchRegex || !$scope.model.dataProviderID) {
        				$scope.showError = false
        			} else {
        				$scope.showError =  true
        			}
        		} else {
        			$scope.showError = false
        		}
        	})
			
			$scope.api.isValid = function() {
				return !$scope.showError
			}
        	
			
			$scope.api.requestFocus = function(mustExecuteOnFocusGainedMethod) {
				var input = $element.find('input');
				if (mustExecuteOnFocusGainedMethod === false && $scope.handlers.onFocusGainedMethodID)
				{
					input.unbind('focus');
					input[0].focus();
					input.bind('focus', $scope.handlers.onFocusGainedMethodID)
				}
				else
				{
					input[0].focus();
				}
			}
			
        },
      templateUrl: 'servoyextra/textfieldgroup/textfieldgroup.html'
    };
  })