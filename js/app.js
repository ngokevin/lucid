angular.module('LucidApp')


.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/',{
            templateUrl: 'partials/main.html',
            controller: 'MainCtrl'
        })
        .when('/edit', {
            templateUrl: 'partials/edit.html',
            controller: 'EditCtrl'
        })
        .otherwise({redirectTo: '/'});
}]);
