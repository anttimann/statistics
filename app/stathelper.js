'use strict';

const _ = require('lodash');

function createSeriesName(types) {
    types = _.filter(types, (t) => {
        return !t.time;
    });
    return _.map(types, (type) => {
        if (type.children) {
            return type.text;
        }
        return _.find(type.options, {id: type.chosen}).text;
    }).join(' : ');
}

function createSeries(values) {
    let entry = {};
    let years = createLabels(values);

    let reverse = years.length > 1 && parseInt(years[0]) > parseInt(years[1]);
    entry.labels = reverse ? years.reverse() : years;

    let data = createData(values, reverse);
    entry.data = reverse ? data.reverse() : data;

    return entry;
}


function createLabels(values) {
    let yearIndex = _.findIndex(values.columns, (e) => {
        return isYearData(e);
    });

    if (yearIndex === -1) {
        return [2002];
    }

    return _.map(values.data, (e) => {
        return e.key[yearIndex]
    });
}

function createData(values, reverse) {
    return _.map(values.data, (e) => {
        return e.values[0]
    });
}

function createDataQueryValues(variables) {
    return _.map(variables, (variable) => {
        if (variable.time) {
            return {
                code: variable.code,
                selection: {
                    filter: 'item',
                    values: _.filter(_.map(variable.options, 'id'), (e) => {
                        return !isNaN(e) || e === 'Arvo'
                    })
                }
            }
        }
        else {
            return {
                code: variable.code,
                selection: {
                    filter: 'item',
                    values: [
                        variable.chosen
                    ]
                }
            }
        }
    });
}

function isYearData(entry) {
    return ['vuosi', 'tilastovuosi', 'time', 'year'].indexOf(entry.code.toLowerCase()) >= 0;
}

module.exports = {
    createDataQueryValues: createDataQueryValues,
    createSeriesName: createSeriesName,
    createSeries: createSeries,
    isYearData: isYearData
};