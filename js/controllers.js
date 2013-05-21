angular.module('LucidApp')


.controller('MainCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();
    PeriodBarChart().periodBarChart('.chart', $scope.entries);
}])


.controller('EditCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();

    $scope.date = new Date();
    buildCalendar();

    function buildCalendar() {
        var scopeYear = $scope.date.getFullYear();
        var scopeMonth = $scope.date.getMonth();
        $scope.weeks = [[]];

        // Calendar head.
        var date = new Date(scopeYear, scopeMonth, 0);
        while (date.getDay() != 6) {
            $scope.weeks[0].push(new Date(date.getTime()));
            date.setDate(date.getDate() - 1);
        }
        $scope.weeks[0].reverse();

        // Calendar body and tail.
        date = new Date(scopeYear, scopeMonth, 1);
        while (date.getMonth() === scopeMonth ||
               $scope.weeks[$scope.weeks.length - 1].length < 7) {
            if (date.getDay() === 0) {
                $scope.weeks.push([]);
            }
            $scope.weeks[$scope.weeks.length - 1].push(
                new Date(date.getTime()));
            date.setDate(date.getDate() + 1);
        }
    }
}]);
