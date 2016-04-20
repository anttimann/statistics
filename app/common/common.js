'use strict';

const _ = require('lodash');

function createSeriesName(types) {
    types = _.filter(types, (t) => {
        return !t.time;
    });
    return _.map(types, (type) => {
        if (!type.options) {
            return type.text; 
        } 
        return _.find(type.options, {id: type.chosen}).text;
    }).join(' : ');
}


module.exports = {
    createSeriesName: createSeriesName
};