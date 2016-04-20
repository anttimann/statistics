'use strict';

const _ = require('lodash');

function createSeries(values, title) { 
    let entry = {}; 
    let years = createLabels(values, title);

    let reverse = years.length > 1 && parseInt(years[0]) > parseInt(years[1]);
    entry.labels = reverse ? years.reverse() : years;

    let data = createData(values, reverse);
    entry.data = reverse ? data.reverse() : data;

    entry.title = title;

    return entry;
}


function createLabels(values, title) {
    let yearIndex = _.findIndex(values.columns, (e) => {
        return isYearData(e);
    });

    if (yearIndex === -1 || (values.data.length === 1 && isNaN(values.data[0].key[yearIndex]))) {
        let regex = /[\d]{4}(?![\d])/;
        let value = title.match(regex);
        return value ? [value[0]] : ['2002'];
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
    createSeries: createSeries,
    isYearData: isYearData
};