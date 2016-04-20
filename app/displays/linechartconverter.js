'use strict';

const _ = require('lodash');
const moment = require('moment');

function convertToChartJSData(values) {
    let chart = { labels: [], series: [], data: [] };

    if (values.length) {
        chart.labels = createLabels(values);        
        _.map(values, (e) => {
            chart.series.push(e.title);
            chart.data.push(addMissingData(e.data, e.labels, chart.labels));
        });
    }
    return chart;       
}
  
function addMissingData(data, years, finalDateRange) {
    let newData = _(finalDateRange)
            .map((e) => {     
                let index = _.findIndex(years, (y) => { 
                    return new Date(Date.parse(y)).getTime() === e.getTime();
                }); 
                return index === -1 ? null : data[index];
            }).value();
    newData[0] = newData[0] === null ? 0 : newData[0];
    return newData;
}   

function createLabels(values) {
    let labels =  _.uniqWith(_.flatten(_.map(values, 'labels')).sort(), _.isEqual);
    return _.map(labels, (e) => {
        return new Date(Date.parse(e));
    });
}
function findOldestYear(values) { 
    return _.min(_.map(values, (e) => {
        return Date.parse(e.labels[0]);
    }));
} 

function findNewestYear(values) {
    return _.max(_.map(values, (e) => {
        return Date.parse(e.labels[e.labels.length - 1]);
    }));
}

function findSmallestStep(values) {
    let step =  _.max(_.map(values, (e) => {
        return e.labels[0].split('-').length;
    }));

    if (step === 1) {
        return 'years'
    }
    else if (step === 2) {
        return 'months';
    }
    return 'years'
}

module.exports = {
    convertToChartJSData: convertToChartJSData
};