angular.module('LucidApp')


.controller('MainCtrl', ['$scope', 'EntryService',
                         function ($scope, EntryService) {
    $scope.entries = EntryService.get();
    $scope.rangeDays = 7;

    var chart = PeriodBarChart();
    chart.periodBarChart('.chart', $scope.entries, {
        xAxis: {
            days: $scope.rangeDays
        }
    });

    $scope.$watch('rangeDays', function(days, oldDays) {
        if (days === oldDays) {
            return;
        }
        chart.changeDays(days);
    });

    $scope.recording = null;
    $scope.toggleRecord = function() {
        if ($scope.recording === null) {
            // Start recording sleep.
            $scope.recording = new Date();
        } else {
            // Log sleep.
            $scope.entries = EntryService.add({
                sleep: $scope.recording,
                wake: new Date()
            });
            $scope.recording = null;
            chart.refresh();
        }
    };
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
        var sleepDate = new Date($scope.selectedDate.getTime());
        var hour = $scope.hour;
        if ($scope.meridiem == 'pm') {
            hour += 12;
        } else if ($scope.meridiem == 'am' && hour == 12) {
            hour = 0;
        }
        sleepDate.setHours(hour, $scope.minute);

        var wakeDate = new Date(sleepDate.getTime());
        wakeDate.setTime(wakeDate.getTime() +
                         ($scope.duration * 60 * 60 * 1000));

        $scope.entries = EntryService.add({
            sleep: sleepDate,
            wake: wakeDate
        });

        $('.datepicker').slideUp();
            setTimeout(function() {
                $('.entries').show();
            }, 400);
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

    $scope.changeDate = function(direction) {
        $scope.date.setDate($scope.date.getDate() + direction);
    };

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
            $('.datepicker').slideUp(400);
            setTimeout(function() {
                $('.entries').show();
            }, 400);
        }
    };

    $scope.incHour = function() {
        $scope.hour = $scope.hour == 12 ? 1 : $scope.hour + 1; };

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

    $scope.deleteEntry = function(i) {
        $scope.entries = EntryService.del(i);
    };

    $scope.toggleDatePicker = function() {
        if ($('.datepicker').is(':visible')) {
            $('.datepicker').slideToggle();
            setTimeout(function() {
                $('.entries').toggle();
            }, 400);
        } else {
            $('.entries').toggle();
            $('.datepicker').slideToggle();
        }
    };

    $scope.containsSleep = function(date) {
        // Check whether date contains data.
        var sleep;
        for (var i = 0; i < $scope.entries.length; i++) {
            sleep = $scope.entries[i].sleep;
            if (date.getFullYear() === sleep.getFullYear() &&
                date.getMonth() === sleep.getMonth() &&
                date.getDate() === sleep.getDate()) {
                return true;
            }
        }
    };
}]);
