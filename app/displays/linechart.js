'use strict';

require('angular-chart.js');
require('../../vendor/chart.js-2.0.0-beta2');

const converter = require('./linechartconverter');
const common = require('./common');

angular.module('app.linechart', ['chart.js'])
    
.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: common.colors, 
        maintainAspectRatio: false, 
        responsive: true,
        legendTemplate: "<span></span>" 
    });
 
    ChartJsProvider.setOptions('line', {
        legendTemplate: "<span></span>"
    });
}])
    
.directive('svLineChart', function() { 
    return {
        restrict: 'E', 
        transclude: true,
        scope: {
            series: '=' 
        }, 
        templateUrl: 'app/displays/linechart', 
        link: (scope) => {
            scope.$watchCollection('series', (newValue, oldValue) => {
                scope.chart = converter.convertToChartJSData(newValue);
            }); 
        
            
        }
    }
});
