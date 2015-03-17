/**
*  Module
*
* Description
*/
import $ from 'jquery';
import templateServiceModule from '../services/template';

angular.module('app.directives.navigation', [templateServiceModule]).
directive('siteNavigation', ['es.Services.WebApi', '$rootScope', '$location', 'TemplateService', '$compile', 'Environment', 'es.Services.Globals', function (WebApi, $rootScope, $location, $templateService, $compile, Environment, esGlobals) {
    // Runs during compile
    'user strict';
    
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {}, // {} = isolate, true = child, false/undefined = no change
        bindToController: true,
        controllerAs: 'ctrl',
        controller: ['$scope', '$element', '$attrs', '$transclude', function($scope, $element, $attrs, $transclude) {
            var self = this;

            this.logout = function() {
                WebApi.logout();
                self.session = false;
                $location.path('/');
                toastr.success('Goodbye!');
                esGlobals.currentUser.logout();
                $location.url($location.path());
            };

            this.rootPath = Environment.getServerRootWithHash();

            this.fbLogout = function() {
                return esFB.logout(function(response) {
                    $scope.loginStatus = response.status;
                });
            };

            this.userOptions = [{
                text: "Action",
                href: "#"
            }, {
                text: "Another Action",
                href: "#"
            }, {
                divider: true
            }, {
                text: "Logout",
                click: "ctrl.logout()"
            }];

            $rootScope.$on('auth:session', function ($event, session) {
                self.session = session;
                console.log('navigation: ', self.session)
            });

        }],
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        //templateUrl: 'templates/site-navigation.tpl.html',
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        compile: function (element, attrs) {
            return {
                pre: function ($scope, iElm, iAttrs, controller) {
                    $templateService.getTemplate('templates/site-navigation.tpl.html').
                    then(function (tpl) {
                        iElm.append($compile(tpl)($scope));
                    });
                },
                post: function ($scope, iElm, iAttrs, controller) {
                    $('.wrapper').removeClass('hide');
                }
            };
        }
    };
}]);

export default 'app.directives.navigation';