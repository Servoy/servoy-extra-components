angular.module('servoyextraFontawesome',['servoy']).directive('servoyextraFontawesome', function() {  
    return {
      restrict: 'E',
      scope: {
    	  model: '=svyModel',
    	  handlers : "=svyHandlers"
      },
      controller: function($scope, $element, $attrs) {
      },
      templateUrl: 'servoyextra/fontawesome/fontawesome.html'
    };
  })