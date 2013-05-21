angular.module('LucidApp')


.controller('MainCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();
    PeriodBarChart().periodBarChart('.chart', $scope.entries);
}])


.controller('EditCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();
}]);
