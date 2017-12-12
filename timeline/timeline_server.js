$scope.api.newEntry = function(time) {
    if(!$scope.model.data) {
        $scope.model.data = [];
    }

    var entry = {};
    entry['time'] = time;
    $scope.model.data.push(entry);
    return $scope.model.data[$scope.model.data.length - 1];
}

$scope.api.clear = function() {
    $scope.model.data = [];
}