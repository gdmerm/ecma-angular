import angular from 'angular';
import angularRoute from 'angular-route';

console.log(angular.version);

angular.module('app.controllers', []);
angular.module('app.directives', []);
angular.module('app.services', []);

angular.module('app', [
    'ngRoute',
    'app.controllers',
    'app.directives',
    'app.services'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
        });
}]);
