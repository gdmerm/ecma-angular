import toastr from 'toastr';

//import angular
import angular from 'angular';
import angularRoute from 'angular-route';
import angularAnimate from 'angular-animate';

//import application controllers
import HomeController from './controllers/home';
import LoginController from './controllers/login';

//import application directives
import navigationDirective from './directives/site-navigation.inc';
import ngenterDirective from './directives/ngenter';

//import application services
import authService from './services/auth';
import Environment from './services/environment';
import EsUser from './services/esuser';
import urlManager from './services/urlmanager';
import EntersoftClientProvider from './services/entersoft-client';

//import plugins
import loadingBar from 'angular-loading-bar';

//import webapi and dependencies
import ngStorage from 'ngstorage';
import ngSanitize from 'angular-sanitize';
import webapi from 'eswebapiangularjs';

/**
 * declare application dependencies
 */
angular.module('app.controllers', [
    HomeController,
    LoginController
]);
angular.module('app.directives', [
    navigationDirective,
    ngenterDirective
]);
angular.module('app.services', [
    authService,
    EsUser,
    urlManager,
    Environment,
    EntersoftClientProvider
]);

angular.module('app', [
    'ngRoute',
    'ngStorage',
    'ngAnimate',
    'angular-loading-bar',
    'es.Services.Web',
    'app.controllers',
    'app.directives',
    'app.services'
]).
constant('SETTINGS', {
    SESSION_ERROR_REDIRECT_URL: '/',
    SESSION_LOGOUT_REDIRECT: '/',
    $HTTP_START_REQUEST: '$http:request:start',
    $HTTP_END_REQUEST: '$http:request:end',
}).
config(['$routeProvider', 'EnvironmentProvider', 'es.Services.WebApiProvider', '$httpProvider', 'EntersoftClientProvider', ($routeProvider, EnvironmentProvider, esWebApiProvider, $httpProvider, EntersoftClientProvider) => {

    //automatic provider configuration
    EntersoftClientProvider.configureClientDefaults(
        EnvironmentProvider, 
        esWebApiProvider,
        $httpProvider
    );

    /**
     * Configure Routes
     */
     var routeAuthorizationsChecks = {
        loggedIn: {
            auth: ['auth', '$log', function(auth, $log) {
                return auth.authorizeRoute();
            }]
        }
     };
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController',
            controllerAs: 'ctrl'
        })
        .when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeController',
            controllerAs: 'ctrl',
            resolve: routeAuthorizationsChecks.loggedIn
        });
}]).
/**
 * runtime configuration
 */
run([
    '$rootScope', 
    'Environment', 
    '$log', 
    '$templateCache', 
    'es.Services.Globals', 
    '$location', 
    'EsUser', 
    'UrlManager', 
    'SETTINGS',
    'EntersoftClient', 
    function($rootScope, Environment, $log, $templateCache, esGlobals, $location, EsUser, UrlManager, SETTINGS, EntersoftClient) {
        EntersoftClient.getRunnerConfiguration.apply(this, arguments);
    }
]);
