import angular from 'angular';
import angularRoute from 'angular-route';
import tmdbService from './services/tmdb-api';
import HomeController from './controllers/home';

angular.module('app.controllers', [
    HomeController
]);
angular.module('app.directives', []);
angular.module('app.services', [
    'app.services.tmdb'
]);

angular.module('app', [
    'ngRoute',
    'app.controllers',
    'app.directives',
    'app.services'
]).
config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        });
}]);
