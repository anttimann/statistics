'use strict';

const _ = require('lodash');

function createDataQueryValues(variables) {
    return _.map(variables, (v) => {
        let keyValues = v.split('=');
        if (keyValues.length === 1) return {};
        
        let values = keyValues[1].split(',');
        return {
            code: keyValues[0],
            selection: {
                filter: 'item',
                values: values
            }
        };
    });
}

function createSeries(values) {
    let entry = {};
    let years = createLabels(values);

    let reverse = years.length > 1 && parseInt(years[0]) > parseInt(years[1]);
    entry.labels = reverse ? years.reverse() : years;

    let data = createData(values, reverse);
    entry.data = reverse ? data.reverse() : data;

    //entry.title = title;

    return entry;
}


function createLabels(values) {
    let yearIndex = _.findIndex(values.columns, (e) => {
        return isYearData(e);
    });

    if (yearIndex === -1 || (values.data.length === 1 && isNaN(values.data[0].key[yearIndex]))) {
        return [null];
    }

    return _.map(values.data, (e) => {
        return e.key[yearIndex]
    });
}

function createData(values) {
    return _.map(values.data, (e) => {
        return e.values[0]
    });
}

function isYearData(entry) {
    return ['vuosi', 'tilastovuosi', 'time', 'year'].indexOf(entry.code.toLowerCase()) >= 0;
}



module.exports = {
    createDataQueryValues: createDataQueryValues,
    createSeries: createSeries
};