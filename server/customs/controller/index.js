'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const _ = require('lodash');
const iconv = require('iconv-lite');
const Boom = require('Boom');

const config = require('../config');
 
function getSubjects(req, reply) {
    return request({
        uri: createUrl(['atype=stats'])
    }).then((message) => {
        reply(message.body);
    });
}

function getOptions(req, reply) {
    return Promise.all([
        request({
            uri: createUrl(['atype=dims', 'ifile=' + req.query.id]),
            encoding: null
        }),
        request({
            uri: createUrl(['atype=class', 'ifile=' + req.query.id]),
            encoding: null
        })
    ])
        .then((values) => {
            let dimsData = iconv.decode(new Buffer(values[0].body), "UTF-8");
            let classData = iconv.decode(new Buffer(values[1].body), "UTF-8");
            reply(createOptionsReply(JSON.parse(dimsData), JSON.parse(classData)));
        });
}

function createOptionsReply(dimsData, classData) {
    let reply = _.map(
        _.filter(classData.classification, (e) => {return e.label !== 'Aika'}),
        (classEntry) => {
            let value = {
                code: classEntry.id,
                options: [],
                title: classEntry.label.split(' ')[0],
                time: false
            };

            value.options = _.map(classEntry.class, (option) => {
                return { id: classEntry.label + '=' + option.code, text: option.text };
            });
            return value;
        });

    return reply;
}

function getSeries(req, reply) {
    return request({
        uri: createUrl(['atype=data', 'ifile=' + req.query.id, 'Aika==FIRST*;' + req.query.latest].concat(req.query.values))
    }).then((message) => {
        let seriesData = iconv.decode(new Buffer(message.body), "UTF-8");
        try {
            reply(createSeriesReply(JSON.parse(seriesData), 0));
        } catch (e) {
            reply(Boom.badRequest('Parameters are missing: ' + e + ' ; ' + seriesData));
        }
        
    });
}

function createSeriesReply(values, timeIndex) {
    return {
        labels: _.map(values, (e) => {return convertDate(e.keys[timeIndex])}).reverse(),
        data: _.map(values, (e) => {return e.vals[0]}).reverse()
    };
}

function convertDate(date) {
    return date.replace(/([\d]{4})/i, '$1-');
}

function createUrl(values) {
    values = _.map(values, (e) => {
        return e.replace(/\+/g, '%2B');
    });
    return config.apiUrl + '?' + config.defaultParams.concat(values).join('&')
}

module.exports = {
    getSubjects: getSubjects,
    getOptions: getOptions,
    createOptionsReply: createOptionsReply,
    getSeries: getSeries,
    createSeriesReply: createSeriesReply
};