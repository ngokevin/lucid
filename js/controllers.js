angular.module('LucidApp')


.controller('MainCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();
    PeriodBarChart().periodBarChart('.chart', $scope.entries);
}])


.controller('EditCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();

    var today = new Date();
    $scope.month = today.getMonth();
    $scope.year = today.getFullYear();
    buildCalendar();

    function buildCalendar() {
        $scope.weeks = [[]];

        // Calendar head.
        var date = new Date($scope.year, $scope.month, 0);
        while (date.getDay() != 6) {
            date.setDate(date.getDate() - 1);
            $scope.weeks[0].push(date.getDate() + 1);
        }
        $scope.weeks[0].reverse();

        // Calendar body and tail.
        date = new Date($scope.year, $scope.month, 1);
        while (date.getMonth() === $scope.month ||
               $scope.weeks[$scope.weeks.length - 1].length < 7) {
            if (date.getDay() === 0) {
                $scope.weeks.push([]);
            }
            $scope.weeks[$scope.weeks.length - 1].push(date.getDate());
            date.setDate(date.getDate() + 1);
        }
    }
}]);
