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
        let lastSelect = type.selects[type.selects.length - 1];
        return _.find(lastSelect.options, {id: lastSelect.chosen}).text;
    }).join(' : ');
}


module.exports = {
    createSeriesName: createSeriesName
};