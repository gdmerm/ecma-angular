let moduleName = 'app.controllers.home';

angular.module(moduleName, []).
controller('HomeController', ['$scope', 'TmdbApi', function ($scope, TmdbApi) {
    $scope.init = function () {
        TmdbApi.load().then(response => {
            console.log(response);
        });
    };
    $scope.init();
}]);

export default moduleName;