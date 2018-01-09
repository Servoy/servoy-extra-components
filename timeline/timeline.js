angular.module('servoyextraTimeline', ['servoy']).directive('servoyextraTimeline', ['$log', '$sce',
function($log, $sce) {
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
                    return $sce.trustAsHtml(entryRendererFunc(entry));
                }
                return '';
            }

            $scope.onEntryClick = function(entry, e) {
                if($scope.handlers.onClick) {
                    $scope.handlers.onClick(entry, e.target.id);
                }
            }

            $scope.$watch('model.foundset', function(oldValue, newValue) {
                if(!$scope.svyServoyapi || $scope.svyServoyapi.isInDesigner()) return;
                loadDataFromFoundset();
            });

            function loadDataFromFoundset() {
                if($scope.model.foundset && $scope.model.foundset.viewPort.size) {
                    $scope.model.data = []
                    for(var i = 0; i < $scope.model.foundset.viewPort.size; i++) {
                        var entry = {};
                        entry['time'] = $scope.model.foundsetEntry['time'] != undefined ? $scope.model.foundsetEntry['time'][i] : '';
                        entry['subject'] = $scope.model.foundsetEntry['subject'] != undefined ? $scope.model.foundsetEntry['subject'][i] : '';
                        entry['content'] = $scope.model.foundsetEntry['content'] != undefined ? $scope.model.foundsetEntry['content'][i] : '';
                        entry['tooltip'] = $scope.model.foundsetEntry['tooltip'] != undefined ? $scope.model.foundsetEntry['tooltip'][i] : '';
                        entry['data'] = $scope.model.foundsetEntry['data'] != undefined ? $scope.model.foundsetEntry['data'][i] : '';
                        $scope.model.data.push(entry);
                    }
                }

            }
        },
        templateUrl: 'servoyextra/timeline/timeline.html'
    }
}]);