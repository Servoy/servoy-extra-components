angular.module('servoyextraYoutubevideoembedder', ['servoy', 'ngSanitize'])
.directive('servoyextraYoutubevideoembedder', function($sce, $sabloConstants) {
    return {
      restrict: 'E',
      scope: {
    	  model: '=svyModel',
		  api: "=svyApi"
      },
      controller: function($scope, $element, $attrs) {
    	  var urlWithParams = ""; // cache calculated URL which is watched
    	  
    	  function updateURLWithParams() {
    		  var m = $scope.model;
    		  if (! m.embeddedVideoURL) {
    			  urlWithParams = "";
    			  return;
    		  }
    		  
    		  // see https://developers.google.com/youtube/player_parameters for more info on the params and their default values
    		  urlWithParams = m.embeddedVideoURL;
    		  var params = "";
    		  
    		  // in these if's we rely on YouTube defaults as well; we only set them when non-default
    		  if (!m.allowFullScreen) params += "&fs=0";
    		  if (!m.showControls) params += "&controls=0";
    		  if (m.modestBranding) params += "&modestbranding=1";
    		  if (m.autoPlay) params += "&autoplay=1";
    		  if (!m.showRelatedVideosAtEnd) params += "&rel=0";
    		  
    		  if (params.length > 0) urlWithParams += "?" + params.substr(1);
    	  }
    	  
    	  updateURLWithParams();
    	  
    	  // this method is watched in angular so keep it fast
    	  $scope.getEmbedURL = function() {
    		  return $sce.trustAsResourceUrl(urlWithParams);
    	  }
    	  
    	  // TODO if needed add support for more URL parameters and for YouTube iframe javascript API and callbacks
    	  
    	  Object.defineProperty($scope.model, $sabloConstants.modelChangeNotifier, { configurable: true, value: function(property, value) {
              switch(property) {
                  case "embeddedVideoURL":
	              case "allowFullScreen":
	              case "autoPlay":
                  case "showControls":
                  case "modestBranding":
                  case "showRelatedVideosAtEnd":
                      updateURLWithParams();
              }
          }});
      },
      templateUrl: 'servoyextra/youtubevideoembedder/youtubevideoembedder.html'
    };
  })