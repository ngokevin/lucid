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
}])


.filter('pad', function() {
     return function(n, width, z) {
         z = z || '0';
         n = n + '';
         return n.length >= width ? n :
                new Array(width - n.length + 1).join(z) + n;
    };
})


.filter('isEmpty', function() {
     return function(c) {
        return c.length === 0;
     };
});
