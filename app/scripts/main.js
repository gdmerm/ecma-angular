import angular from 'angular';
import angularRoute from 'angular-route';
import tmdbService from './services/tmdb-api';
import HomeController from './controllers/home';

import ngStorage from 'ngstorage';
import ngSanitize from 'angular-sanitize';
import log4javascript from 'log4javascript';
import stacktrace from 'stacktrace-js';
import webapi from 'eswebapiangularjs';

angular.module('app.controllers', [
    HomeController
]);
angular.module('app.directives', []);
angular.module('app.services', [
    'app.services.tmdb'
]);

angular.module('app', [
    'ngRoute',
    'es.Services.Web',
    'app.controllers',
    'app.directives',
    'app.services'
]).
config(['$routeProvider', ($routeProvider) => {
    $routeProvider
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            controllerAs: 'ctrl'
        });
}]);
