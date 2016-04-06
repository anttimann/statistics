require('./inputs/datalist');

var _ = require('lodash');

angular.module('StatisticsVisualization', ['ngResource', 'DatalistInput'])
    
.factory('StatisticsAPI', function($resource) {
    return $resource('/github/:userId');
})

.controller('StatisticsController', function($routeParams, StatisticsAPI) {
    var ctrl = this;

    ctrl.sources = {
        options: ['Tilastokeskus'],
        chosen: ctrl.sources.options[0]
    };
});
