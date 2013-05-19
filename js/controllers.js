angular.module('LucidApp')


.controller('MainCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();
}])


.controller('EditCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();
    $scope.entries = [
        {sleep: 1, wake: 2},
        {sleep: 2, wake: 3}
    ];
}]);
