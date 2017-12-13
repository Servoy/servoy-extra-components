angular.module('servoyextraDaynavigator', ['servoy']).directive('servoyextraDaynavigator', ['$log', '$timeout',
function($log, $timeout) {
    return {
        restrict: 'E',
        scope: {
            model: '=svyModel',
            handlers: '=svyHandlers',
            api: '=svyApi',
            svyServoyapi: '='
        },
        link: function($scope, $element, $attrs) {
            var datepaginatorElement = null;
            $timeout(function() {
                datepaginatorElement = $element.children().first();
                datepaginatorElement.datepaginator({
                    showCalendar: false,
                    onSelectedDateChanged: function(event, date) {
                        if($scope.handlers.onChange) {
                            $scope.handlers.onChange(date);
                        }
                    },
                    selectedDate: selectedDateToMomentDate(),
					// TODO expose this properties to the model ?
					text: "DD",
					textSelected: "DD",
					width: 0,
					selectedItemWidth: 40,
					itemWidth: 40
                });
            });

            $scope.$watch("model.selectedDate", function(newValue, oldValue) {
                if(datepaginatorElement) {
                    datepaginatorElement.datepaginator('setSelectedDate', selectedDateToMomentDate());
                }
            });

            function selectedDateToMomentDate() {
                return $scope.model.selectedDate ? moment($scope.model.selectedDate) : moment();
            }
        },
        templateUrl: 'servoyextra/daynavigator/daynavigator.html'
    }
}]);