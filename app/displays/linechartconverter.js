'use strict';

const _ = require('lodash');

function convertToChartJSData(values) {
    let chart = { labels: [], series: [], data: [] };

    if (values.length) {
        let oldestYear = findOldestYear(values);
        let newestYear = findNewestYear(values);
        
        if (values.length > 1) {
            chart.labels = _.range(oldestYear, newestYear + 1);
        }
        else { 
            chart.labels = values[0].labels; 
        }
        _.map(values, (e) => {
            chart.series.push(e.title);
            chart.data.push(addMissingYears(e.data, e.labels, chart.labels));
        });
    }
    return chart;
}
  
function addMissingYears(data, years, finalYears) {
    return _(finalYears)
            .map((e) => {
                let index = _.findIndex(years, (y) => { 
                    return y == e; 
                }); 
                return index === -1 ? null : data[index];
            }).value();
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

module.exports = {
    convertToChartJSData: convertToChartJSData
};