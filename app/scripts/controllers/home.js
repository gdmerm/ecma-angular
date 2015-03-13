let moduleName = 'app.controllers.home';
import _ from 'underscore';

angular.module(moduleName, []).
controller('HomeController', ['$scope', 'TmdbApi', function ($scope, TmdbApi) {
    $scope.init = function () {
        TmdbApi.load().then(response => {
            var posters = response.data.results;
            $scope.posters = _.chain(posters).pluck('poster_path')
                .map((path) => { return 'http://image.tmdb.org/t/p/w185' + path; })
                .value();
        });
    };
    $scope.init();
}]);

export default moduleName;