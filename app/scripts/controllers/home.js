let moduleName = 'app.controllers.home';
import _ from 'lodash';
import tmdbModule from '../services/tmdb-api';

class HomeController {
    constructor(TmdbApi) {
        this.TmdbApi = TmdbApi;
        this.fetchPosters();
    }

    fetchPosters() {
        this.TmdbApi.load().then(response => {
            var posters = response.data.results;
            this.posters = _.chain(posters).pluck('poster_path')
                .map((path) => { return 'http://image.tmdb.org/t/p/w185' + path; })
                .value();
        });
    }
}

HomeController.$inject = ['TmdbApi'];
angular.module(moduleName, [tmdbModule]).controller('HomeController', HomeController);

export default moduleName;
