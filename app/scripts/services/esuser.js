/**
*  Module
*
* Description
*/
angular.module('app.services.esuser', []).
factory('EsUser', ['es.Services.Globals', '$q', '$log', function (esGlobals, $q, $log) {
    'use strict';
    
    var User = function () {
        angular.extend(this, esGlobals.getClientSession());
        esGlobals.currentUser = this;
    };

    /**
     * inherit some methods from esGlobals
     * @type {[type]}
     */
    User.prototype.getSession = esGlobals.getClientSession;
    User.prototype.getWebApiToken = esGlobals.getWebApiToken;

    User.prototype.isGuest = function () {
        var guest = true;
        if (this.connectionModel !== null && typeof this.connectionModel !== 'undefined') {
            guest = false;
        }
        return guest;
    };

    User.prototype.isAdmin = function () {
        return (!this.isGuest() && this.model.Administrator);
    };

    User.prototype.isInactive = function () {
        return (!this.isGuest() && this.model.Inactive);
    };

    User.prototype.logout = function () {
        delete esGlobals.currentUser;
    };

    User.prototype.authorizeRoute = function () {
            $log.debug('checking route: ', this.isGuest())
            if (!this.isGuest()) {
                return true;
            } else {
                return $q.reject('auth:notauthorized');
            }
    };

    return User;
}]);

export default 'app.services.esuser';