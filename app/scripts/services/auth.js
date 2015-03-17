/**
*  Module
*
* Description
*/
angular.module('app.services.auth', []).
service('auth', ['EsUser', 'es.Services.Globals', '$log', '$q', function (EsUser, esGlobals, $log, $q) {
    'use strict';
    this.authorizeRoute = function () {
            var user = new EsUser();
            if (user && !user.isGuest()) {
                return true;
            } else {
                return $q.reject('auth:notauthorized');
            }
    }; 

    this.logout = function () {
        //WebApi.logout();
        esGlobals.currentUser.logout();
    };
}]);

export default 'app.services.auth';