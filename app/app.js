require('./statistics');

angular.module('app.statistics', ['ngRoute', 'app.pxdata'])
 
.config(function($routeProvider) {
    $routeProvider 
        .when('/', { 
            controller: 'StatisticsController as stats',
            templateUrl: 'partials/list'  
        })   
});   