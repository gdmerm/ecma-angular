angular.module('app.services.urlmanager', []).
service('UrlManager', ['$location', function($location){
        'use strict';

        /**
         * [addElasticFilter description]
         * @param {[type]} bucket [description]
         * todo: write logic that uses "result.key" or "result.key_as_string" appropriately. 
         * This also means that we do  not pass "vale" anymore, instead we pass the "result" item as a whole.
         */
        this.updateSearchUrl = function (field, value) {
            $location.search(field, value);
        };

        /**
         * deletes passed field from the querystring triggering a routeUpdate event
         * @param  {[string]} field
         */
        this.deleteUrlFilter = function(field) {
            $location.search(field, null);
        };

        this.getQueryString = function () {
            var params = $location.search();
            var qstring = '';
            for (var paramName in params) {
                qstring += paramName + '=' + params[paramName] + '&';
            }
            qstring = qstring.substr(0, qstring.length - 1);
            return qstring;
        };

        this.clearQueryString = function () {
            $location.url($location.path());
        };

        this.saveLastActiveSearch = function () {
                this.lastSearch.path = $location.path();
                this.lastSearch.query = $location.search();            
        };

        this.getLastActiveSearch = function () {
                this.clearQueryString();
                $location.path('/search');
                var query = this.lastSearch.query;
                for (var paramName in query) {
                    $location.search(paramName, query[paramName]);
                }
        };

        this.redirectQueryString = '';
        this.lastSearch = {
            path: null,
            query: null
        };
}]);

export default 'app.services.urlmanager';