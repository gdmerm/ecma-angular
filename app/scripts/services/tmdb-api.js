class TmdbApi {
    constructor($http) {
        this.url = 'http://api.themoviedb.org/3/movie/popular?api_key=a84fe81b8c483c12bdf15d9c55c0d29d';
        this.$http = $http;
    }
    
    load() {
        return this.$http.get(this.url);
    }

    static tmdbApiFactory($http) {
        return new TmdbApi($http);
    }
}

TmdbApi.tmdbApiFactory.$inject = ['$http'];

angular.module('app.services.tmdb', [])
.factory('TmdbApi', TmdbApi.tmdbApiFactory);

export default 'app.services.tmdb';