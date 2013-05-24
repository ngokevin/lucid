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
    $scope.selectedDate = $scope.date;

    // Default time-picker values.
    $scope.hour = 12;
    $scope.minute = 0;
    $scope.meridiem = 'am';
    $scope.duration = 8;

    $scope.addSleep = function() {
        var sleepDate = new Date($scope.date.getTime());
        var hour = $scope.hour;
        if ($scope.meridiem == 'pm') {
            hour += 12;
        }
        sleepDate.setHours(hour, $scope.minute);

        var wakeDate = new Date(sleepDate.getTime());
        wakeDate.setTime(wakeDate.getTime() +
                         ($scope.duration * 60 * 60 * 1000));

        $scope.entries = EntryService.add({
            sleep: sleepDate,
            wake: wakeDate
        });
    };

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
        while (date.getMonth() === scopeMonth || $scope.weeks.length < 6 ||
               $scope.weeks[$scope.weeks.length - 1].length < 7) {
            if (date.getDay() === 0) {
                $scope.weeks.push([]);
            }
            $scope.weeks[$scope.weeks.length - 1].push(
                new Date(date.getTime()));
            date.setDate(date.getDate() + 1);
        }
    }

    $scope.changeMonth = function(direction) {
        var month = $scope.date.getMonth();
        if (direction === -1) {
            $scope.date.setMonth(month === 0 ? 11 : month - 1);
        } else {
            $scope.date.setMonth(month === 11 ? 0 : month + 1);
        }
        buildCalendar();
    };

    $scope.changeYear = function(direction) {
        var year = $scope.date.getFullYear();
        $scope.date.setFullYear(year + direction);
        buildCalendar();
    };

    $scope.selectDate = function(date) {
        if (date.toDateString() != $scope.selectedDate.toDateString()) {
            $('td').removeClass('selected');
            $scope.selectedDate = date;
        } else {
            $('.datepicker').slideUp();
            $('.entries').show();
        }
    };

    $scope.incHour = function() {
        $scope.hour = $scope.hour == 12 ? 1 : $scope.hour + 1;
    };

    $scope.incMinute = function() {
        $scope.minute = $scope.minute == 45 ? 0 : $scope.minute + 15;
    };

    $scope.togMeridiem = function() {
        $scope.meridiem = $scope.meridiem == 'am' ? 'pm' : 'am';
    };

    $scope.changeDuration = function(duration) {
        $scope.duration += duration;
    };

    $scope.inSelectedDate = function(date) {
        var sleep = date.sleep;
        var selected = $scope.selectedDate;
        return (
            sleep.getFullYear() === selected.getFullYear() &&
            sleep.getMonth() === selected.getMonth() &&
            sleep.getDate() === selected.getDate());
    };
}]);
