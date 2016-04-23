'use strict';

const _ = require('lodash');

function createSeriesName(types) {
    types = _.filter(types, (t) => {
        return !t.time;
    });
    return _.map(types, (type) => {
        if (!type.selects) { 
            return type.text;  
        } 

        return _.map(type.selects, (s) => _.find(s.options, {id: s.chosen}).text).join(' = ');  
    }).join(' : ');
}


module.exports = {
    createSeriesName: createSeriesName
};