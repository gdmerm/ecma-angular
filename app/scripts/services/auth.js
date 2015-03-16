/**
*  Module
*
* Description
*/
let moduleName = 'app.services.auth';
angular.module(moduleName, []).
service('auth', ['EsUser', '$log', '$q', function (EsUser, $log, $q) {
    'use strict';
    this.authorizeRoute = function () {
            var user = new EsUser();
            if (user && !user.isGuest()) {
                return true;
            } else {
                return $q.reject('auth:notauthorized');
            }
    }; 
}]);

export default moduleName;