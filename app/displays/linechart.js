'use strict';

require('angular-chart.js');
require('chart.js'); 

const converter = require('./linechartconverter');
const common = require('./common');

angular.module('app.linechart', ['chart.js'])
    
.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        chartColors: common.colors,  
        maintainAspectRatio: false, 
        responsive: true,
        legendTemplate: '<span></span>' 
    });
    
    ChartJsProvider.setOptions('line', {
        legendTemplate: '<span></span>'
    }); 
}]) 
 
.directive('svLineChart', function() { 
    return { 
        restrict: 'E', 
        transclude: true,
        scope: {
            series: '='   
        },       
        templateUrl: 'app/displays/linechart.html', 
        link: (scope) => { 
            scope.$watchCollection('series', (newValue, oldValue) => {
                scope.chart = converter.convertToChartJSData(newValue);
                scope.yAxes = _.map(_.range(scope.chart.data.length), (i) => 'y-axis-' + (i + 1));
                scope.options = {
                    scales: {
                        xAxes: [{type: 'time', id: 'x-axis-1'}], 
                        yAxes: _.map(_.range(scope.chart.data.length), (i) => {
                            return { type:'linear', id: 'y-axis-' + (i + 1)}
                        })
                    }
                };
            }); 
        
            
        }
    }
});
