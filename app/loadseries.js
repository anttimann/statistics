require('./services/localstorage');

angular.module('app.loadseries', ['ngResource', 'app.localstorage'])

.factory('SeriesAPI', ['$resource', function($resource) {
    return $resource('/series/:seriesId');
}])

.controller('LoadSeriesController', ['$routeParams', '$window', 'localStorage', 'SeriesAPI',
    function($routeParams, $window, localStorage, SeriesAPI) {
    SeriesAPI.get({seriesId: $routeParams.seriesId}).$promise.then((response) => {
        localStorage.save(response.data);
        $window.location.href = '/'; 
    }); 
}]);
