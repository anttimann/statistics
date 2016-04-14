require('./statistics');
require('./loadseries');

angular.module('app.statistics', ['ngRoute', 'app.pxdata', 'app.loadseries'])

.config(function($routeProvider) {
    $routeProvider 
        .when('/:seriesId?', { 
            controller: 'StatisticsController as stats',
            templateUrl: 'partials/page'
        })
        .when('/kayrat/:seriesId', {
            controller: 'LoadSeriesController',
            template: '<span></span>'
        });
});    