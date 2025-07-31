angular.module('servoyextraFontawesome',['servoy']).directive('servoyextraFontawesome', ['$sabloConstants','$svyProperties', function($sabloConstants, $svyProperties) {  
    return {
      restrict: 'E',
      scope: {
    	  model: '=svyModel',
    	  handlers : "=svyHandlers"
      },
      controller: function($scope, $element, $attrs) {
    	  
    	  var tooltipState = null;
    	  Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, {
    		  configurable: true,
    		  value: function(property, value) {
    			  switch (property) {
    			  case "toolTipText":
    				  if (tooltipState)
    					  tooltipState(value);
    				  else
    					  tooltipState = $svyProperties.createTooltipState($element, value);
    				  break;
    			  }
    		  }
    	  });
    	  var destroyListenerUnreg = $scope.$on("$destroy", function() {
    		  destroyListenerUnreg();
    		  delete $scope.model[$sabloConstants.modelChangeNotifier];
    	  });
    	  // data can already be here, if so call the modelChange function so
    	  // that it is initialized correctly.
    	  var modelChangFunction = $scope.model[$sabloConstants.modelChangeNotifier];
    	  for (var key in $scope.model) {
    		  modelChangFunction(key, $scope.model[key]);
    	  }

    	  
      },
      templateUrl: 'servoyextra/fontawesome/fontawesome.html'
    };
  }])