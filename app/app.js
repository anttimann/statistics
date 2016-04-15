require('./stats');
require('./loadseries');

angular.module('app.statistics', ['ngRoute', 'app.stats', 'app.loadseries'])
    

.config(['$routeProvider', function($routeProvider) {
    $routeProvider  
        .when('/:seriesId?', { 
            controller: 'StatsCtrl as stats',
            templateUrl: 'partials/page' 
        })
        .when('/kayrat/:seriesId', {
            controller: 'LoadSeriesCtrl',  
            template: '<span></span>' 
        });
}]);