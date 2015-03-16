import toastr from 'toastr';

//import angular
import angular from 'angular';
import angularRoute from 'angular-route';
import angularAnimate from 'angular-animate';
import HomeController from './controllers/home';
import LoginController from './controllers/login';
import navigationDirective from './directives/site-navigation.inc';
import ngenterDirective from './directives/ngenter';
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

//import libraries

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
    SESSION_ERROR_REDIRECT_URL: '/login',
    SESSION_LOGOUT_REDIRECT: '/login',
    $HTTP_START_REQUEST: '$http:request:start',
    $HTTP_END_REQUEST: '$http:request:end',
}).
config(['$routeProvider', 'EnvironmentProvider', 'es.Services.WebApiProvider', '$httpProvider', 'EntersoftClientProvider', ($routeProvider, EnvironmentProvider, esWebApiProvider, $httpProvider, EntersoftClientProvider) => {

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
            controllerAs: 'ctrl'
        });
}]).
/**
 * runtime configuration
 */
run(['$rootScope', 'Environment', '$log', '$templateCache', 'es.Services.Globals', '$location', 'EsUser', 'UrlManager', function($rootScope, Environment, $log, $templateCache, esGlobals, $location, EsUser, UrlManager) {

    /**
     * a list of protected pages
     * @type {Array}
     */
    $templateCache.remove('templates/site-navigation.tpl.html');

    $rootScope.$on('$routeChangeError', function (e, current, previous, rejection) {
        if (rejection === 'auth:notauthorized') {
            console.log('not authorized');
            var redirect = $location.path();
            UrlManager.redirectQueryString = $location.search();
            $location.url($location.path());
            $location.path('/login');
            $location.search('onsuccessredirect', redirect);
        }
    });

    $rootScope.$on('$routeChangeSuccess', function (event, current, next) {
        var user = new EsUser();
        window.$location = $location;
        $rootScope.$broadcast('auth:session', esGlobals.currentUser);
    });

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        //disable template caching on dev stage
        if (next.$$route) {
            if (Environment.isDev() && typeof next !== 'undefined') {
                $log.info('purging cached template: ', next.$$route.templateUrl)
                $templateCache.remove(next.$$route.templateUrl);
                //todo:hardcoded entry. Should think how to tackle this problem
                $templateCache.remove('templates/site-navigation.tpl.html');
            }
        }
    });

}]);
