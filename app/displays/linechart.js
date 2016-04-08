require('angular-chart.js');
require('../vendor/chart.js-2.0.0-beta2');

const _ = require('lodash');

angular.module('LineChart', ['chart.js'])
    
.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
        maintainAspectRatio: false,
        responsive: true 
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
            scope.chart = {
                labels: [],
                series: [],
                data: []
            };
            scope.$watchCollection('series', (newValue, oldValue) => {
                scope.chart = {
                    labels: [],
                    series: [],
                    data: []
                };
                
                if (newValue.length) {
                    let oldestYear = findOldestYear(newValue);
                    let newestYear = findNewestYear(newValue);

                    scope.chart.labels = _.range(oldestYear, newestYear + 1);
                    _.map(newValue, (e) => {
                        scope.chart.series.push(e.title);
                        scope.chart.data.push(addMissingYears(e.data, e.labels, oldestYear, newestYear));
                    });
                }
            });
        
            function addMissingYears(data, years, minYear, maxYear) {
                let missingEarlyYears = Math.max(years[0] - minYear, 0);
                if (missingEarlyYears) {
                    data = _.fill(new Array(missingEarlyYears), null).concat(data);
                }
 
                let missingLateYears = Math.max(maxYear - years[years.length - 1], 0);
                if (missingLateYears) {
                    data = data.concat(_.fill(new Array(missingEarlyYears), null));
                }
                return data;
            } 
             
            function findOldestYear(values) {
                return _.min(_.map(values, (e) => {
                    return parseInt(e.labels[0]);
                }));
            }
 
            function findNewestYear(values) {
                return _.max(_.map(values, (e) => {
                    return parseInt(e.labels[e.labels.length - 1]);
                }));
            }
        }
    }
});