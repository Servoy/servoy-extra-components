angular.module('servoyextraFileupload',['servoy', 'sabloApp'])
.directive('servoyextraFileupload', ['$sabloApplication', 'Upload', "$timeout", "$sabloConstants", "$svyProperties", function($sabloApplication, Upload, $timeout, $sabloConstants, $svyProperties) {
    return {
      restrict: 'E',
      templateUrl: 'servoyextra/fileupload/fileupload.html',
      scope: {
      	model: "=svyModel",
      	handlers: "=svyHandlers",
        api: "=svyApi"
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
    	  for (key in $scope.model) {
    		  modelChangFunction(key, $scope.model[key]);
    	  }

        $scope.errorText = "";
        var progress = 0;

        function hideProgress() {
          $timeout(function() {
            progress = 0;
            $scope.errorText = "";
          }, $scope.model.resultDisplayTimeout);
        }

        function upload(uploadFiles) {
          var parent = $scope.$parent;

          var beanname = $element.attr("name");
          if (! beanname) {
            var nameParentEl = $element.parents("[name]").first(); 
            if (nameParentEl) beanname = nameParentEl.attr("name");
          }
          if (! beanname) {
            for(var key in parent['model']) {
              if (parent['model'][key] === beanModel) {
                beanname = key;
                break;
              }
            }
          }
    
          var formname = parent['formname'];
          while (!formname) {
            if (parent.$parent) {
              parent = parent.$parent;
              formname = parent['formname'];
            }
            else { 
              break;
            }
          }

          if(beanname && formname) {
            var uploadURL = "resources/upload/" + $sabloApplication.getSessionId() + "/" + formname + "/" + beanname + "/dataProviderID";
            $scope.errorText = "";
            progress = 0;
            $scope.upload = Upload.upload({
              url: uploadURL,
              file: uploadFiles
            }).then(function(resp) {
              $scope.upload = null;
              hideProgress();
            },
            function(resp){
              $scope.upload = null;
              hideProgress();
              if (resp.data) $scope.errorText = resp.data;
              else $scope.errorText = $scope.model.uploadCancelText;
            },
            function(evt) {
              var current = 100.0 * evt.loaded / evt.total;
              if (current < progress) {
                $scope.upload.abort();
              }
              else progress  = current;
            });
          }
        }

        $scope.getMessage = function() {
          if ($scope.getProgress("")) {
            if($scope.errorText) {
              return $scope.errorText
            }
            else if($scope.upload == null) {
              return $scope.model.uploadSuccessText;
            }
            else {
              return $scope.model.uploadProgressText;
            }
          }
          else {
            return $scope.model.uploadText;
          }
        }

        $scope.getProgress = function(postFix) {
    	    if (progress) return Math.round(progress) + postFix;
    	    return "";
        }

        $scope.cancel = function() {
          if($scope.upload) {
            $scope.upload.abort();
          }
        }

        $scope.$watch('files', function (newV, oldV) {
          if(newV) {
            upload(newV);
          }
        });

      }
    };
}])