angular.module('app.services.esclient', [])
.provider('EntersoftClient', [() => {
    return {
        configureClientDefaults: (EnvironmentProvider, esWebApiProvider, $httpProvider) => {
            /**
             * ================================
             * configure environment
             * ================================
             */
            EnvironmentProvider
                .addDevelopmentDomains([
                    'gdm.dev.entersoft.gr',
                    'gdm.linux.entersoft.gr',
                    'localhost'
                ])
                .addProductionDomains([
                    'kbase.azurewebsites.net'
                ]);

            //try to detect stage from domain
            EnvironmentProvider.setStageFromDomain();
            console.debug('auto detected environment:', EnvironmentProvider.getStage());

            //path configuration
            if (EnvironmentProvider.getStage() === 'dev') {
                EnvironmentProvider.setAssetsPath('/ecma-angular/app/images');
                EnvironmentProvider.setTemplatesPath('/ecma-angular/app/templates');
                EnvironmentProvider.setServerRoot('/ecma-angular');
            } else if (EnvironmentProvider.getStage() === 'prod') {
                EnvironmentProvider.setAssetsPath('/images');
                EnvironmentProvider.setTemplatesPath('/templates');
                EnvironmentProvider.setServerRoot('/');
            }

            /**
             * Configure the entersoft web api provider
             */
            esWebApiProvider.setSettings({
                //host: "https://eswebapialp.azurewebsites.net",
                host: "http://eswebapi.entersoft.gr",
                subscriptionId: "",
                subscriptionPassword: "passx",
                allowUnsecureConnection: true
            });

            var interceptor = ['$q', '$sessionStorage', '$timeout', '$rootScope', '$location', 'SETTINGS', function ($q, $sessionStorage, $timeout, $rootScope, $location, SETTINGS) {
                var httpHandlers = {
                    401: function () {
                        console.log('401 says: ', this);
                        delete $sessionStorage.__testapp_sesssion;
                        if (this.config.url.indexOf('Login') < 0) {
                            $location.path(SETTINGS.SESSION_ERROR_REDIRECT_URL);
                            return noty.error('You seem to have been disconnected. Try to login again');
                        }
                    },

                    500: function () {
                        console.log('500 says: ', this);
                        var text = this.data.Messages[0];
                        if (text !== '') {
                            noty.error(text);
                        }
                        $location.path('/500');
                    },

                    400: function () {
                        console.log('400 says: ', this);
                        var text = this.data.Messages[0];
                        if (text !== '' && typeof text !== 'undefined') {
                            noty.error(text);
                        }
                        $location.path('/500');
                    },

                    403: function () {
                        console.log('403 says', this);
                        var text = this.data;
                        text = 'Your access is forbidden! Try to login <a href="#login">login</a> again.'
                        //delete $sessionStorage.__esrequest_sesssion;
                        $location.path('/login');
                        return noty.error(text);
                    },

                    0: function () {
                        text = 'Cannot properly communicate with application server. Check if the server is live or if this application is allowed on the server';
                        return noty.error(text); 
                    }
                };

                return {
                    request: function (config) {
                        var session = false;

                        //if (_.indexOf(loaderEnabledUrls, config.url) >= 0) {
                            $rootScope.$broadcast(SETTINGS.$HTTP_START_REQUEST);
                        //}

                        //pass token for protected pages
                        if (typeof $sessionStorage.__testapp_sesssion !== 'undefined' && $sessionStorage.__testapp_sesssion !== null) {
                            session = $sessionStorage.__testapp_sesssion;
                        }

                        if (session) {
                            config.headers.Authorization = 'Bearer ' + session.WebApiToken;
                        }

                        return config;
                    },

                    response: function (response) {
                        $rootScope.$broadcast(SETTINGS.$HTTP_END_REQUEST);

                        return response;
                    },

                    responseError: function (rejection) {
                        $rootScope.$broadcast(SETTINGS.$HTTP_END_REQUEST);
                        if (httpHandlers.hasOwnProperty(rejection.status)) {
                            httpHandlers[rejection.status].call(rejection);
                        }

                        return $q.reject(rejection);
                    }
                };
            }];
            $httpProvider.interceptors.push(interceptor);
        },
        $get: function () {
            return {
                getRunnerConfiguration: function ($rootScope, Environment, $log, $templateCache, esGlobals, $location, EsUser, UrlManager) {
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
                }
            };
        }
    };
}]);

export default 'app.services.esclient';