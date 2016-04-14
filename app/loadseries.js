require('./services/localstorage');
require('./services/storeseries');

angular.module('app.loadseries', ['ngResource', 'app.localstorage', 'app.storeseries'])

.controller('LoadSeriesController', ['$routeParams', '$window', 'localStorage', 'storeSeries',
    function($routeParams, $window, localStorage, storeSeries) {
        storeSeries.get($routeParams.seriesId).then((data) => {
            localStorage.save(data);
            $window.location.href = '/';  
        }); 
}]);
