angular.module('servoyextraFileupload',['servoy', 'sabloApp'])
.directive('servoyextraFileupload', ['$sabloApplication', 'Upload', "$timeout", function($sabloApplication, Upload, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'servoyextra/fileupload/fileupload.html',
      scope: {
      	model: "=svyModel",
      	handlers: "=svyHandlers",
        api: "=svyApi"
      },
      controller: function($scope, $element, $attrs) {

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
            }).progress(function(evt) {
              var current = 100.0 * evt.loaded / evt.total;
              if (current < progress) {
                $scope.upload.abort();
              }
              else progress  = current;
            }).success(function(data, status, headers, config) {
              $scope.upload = null;
              hideProgress();
            }).error(function(status,status2){
              $scope.upload = null;
              hideProgress();
              if (status) $scope.errorText = status;
              else $scope.errorText = $scope.model.uploadCancelText;
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