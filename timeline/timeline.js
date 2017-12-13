angular.module('servoyextraTimeline', ['servoy']).directive('servoyextraTimeline', ['$log',
function($log) {
    return {
        restrict: 'E',
        scope: {
            model: '=svyModel',
            handlers: '=svyHandlers',
            api: '=svyApi',
            svyServoyapi: '='
        },
        controller: function($scope, $element, $attrs) {
            if($scope.svyServoyapi.isInDesigner()) {
                $scope.model.data = [{time: ' today', subject: 'timeline subject', content: 'timeline content' }];
            }

            var entryStyleClassFunc = null;
            $scope.$watch("model.entryStyleClassFunc", function(newValue, oldValue) {
                if($scope.model.entryStyleClassFunc) {
                    entryStyleClassFunc = eval($scope.model.entryStyleClassFunc);
                }
            });

            $scope.getEntryStyleClass = function(entry) {
                if(entryStyleClassFunc) {
                    return entryStyleClassFunc(entry);
                }
                return '';
            }

            var entryRendererFunc = function(entry) {
                return '<div class="feed-icon"></div>' +
                '<div class="feed-subject">' + entry.subject + ' </div>' +
                '<div class="feed-content">' + entry.content + '</div>' +
                '<div class="feed-actions"><div class="pull-right"><i class="fa fa-clock-o"></i>' + entry.time + '</div></div>';
            }
            $scope.$watch("model.entryRendererFunc", function(newValue, oldValue) {
                if($scope.model.entryRendererFunc) {
                    entryRendererFunc = eval($scope.model.entryRendererFunc);
                }
            });

            $scope.getEntryRenderer = function(entry) {
                if(entryRendererFunc) {
                    return entryRendererFunc(entry);
                }
                return '';
            }
        },
        templateUrl: 'servoyextra/timeline/timeline.html'
    }
}]);