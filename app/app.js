require('./statistics');

angular.module('statistics', ['ngRoute', 'StatisticsVisualization'])
 
.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'StatisticsController as statistics',
            templateUrl: 'partials/list' 
        })
}); 