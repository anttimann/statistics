'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const _ = require('lodash');
const iconv = require('iconv-lite');
const Boom = require('boom');

const config = require('../config');
 
function getSubjects(req, reply) {
    return queryData(['atype=stats'])
        .then((values) => {
            reply(
                _.map(values, (v) => {
                    return { id: v.ifile, text: _.capitalize(v.title) };
                })
            );
        });
}

function getOptions(req, reply) {
    if (req.query.optionClass) {
        return queryData(['atype=class', 'ifile=' + req.query.id, 'class=' + req.query.optionClass])
            .then((values) => {
                reply(createOptionsReply(
                    [{options: []}],
                    createOptionsClassReply(values)
                ));
            });
    }
    else {
        return Promise.all([
            queryData(['atype=dims', 'ifile=' + req.query.id]),
            queryData(['atype=class', 'ifile=' + req.query.id])
        ]).then((values) => {
            reply(createOptionsReply(
                createOptionsDimsReply(values[0]),
                createOptionsClassReply(values[1]))
            );
        });
    }
}

function createOptionsReply(dimsData, classData) {
    return _.map(classData, (c, index) => {
        let d = _.find(dimsData, {code: c.code});
        
        if (d) {
            moveChosenOptionToFirst(d, c.title);
        }
        let options = d && d.options.length > 1 ? [d.options, c.options] : [c.options];
        return {
            code: c.code,
            time: false,
            options: options
        }
    });
}

function moveChosenOptionToFirst(d, id) {
    let chosenOptionIndex = _.findIndex(d.options, {id: id});
    if (chosenOptionIndex >= 0) {
        d.options.splice(0, 0, d.options.splice(chosenOptionIndex, 1)[0]);
    }
}

function createOptionsDimsReply(classData) {
    return _(classData.dimension)
        .filter((e) => e.classification[0].label !== 'Aika')
        .filter((e) => e.classification[0].size < 1000)
        .map((e) => {
            return {
                code: e.id,
                time: false,
                options: _.map(e.classification, (option) => {
                    return { id: option.label, text: option.label };
                })
            };
        }).value();
}

function createOptionsClassReply(classData) {
    return _(classData.classification)
        .filter((e) => e.label !== 'Aika')
        .map((e) => {
                return {
                    code: e.id,
                    title: e.label,
                    time: false,
                    options: _.map(e.class, (option) => {
                        return { id: e.label + '=' + option.code, text: option.text };
                    })
                };
            }).value();
}

function getSeries(req, reply) {
    return queryData(['atype=data', 'ifile=' + req.query.id, 'Aika==FIRST*;' + req.query.latest].concat(req.query.values))
        .then((values) => {
            reply(createSeriesReply(values, 0));
        })
        .catch((e) => {
            reply(Boom.badRequest('Parameters are missing: ' + e));
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

function queryData(values) {
    return request({
        uri: createUrl(values)
    }).then((message) => {
        try {
            return _.flow(
                (e) => new Buffer(e),
                (e) => iconv.decode(e, 'UTF-8', {}),
                JSON.parse,
                Promise.resolve
            )(message.body);
        } catch (e) {
            return Promise.reject(message.body);
        }
    });
}

function createUrl(values) {
    values = _.map(values, (e) => {
        return e.replace(/\+/g, '%2B').replace(/ä/g, '*228;').replace(/ö/g, '*246;').replace(/Ä/g, '*196;').replace(/Ö/g, '*214;');
    });
    return config.apiUrl + '?' + config.defaultParams.concat(values).join('&')
}

module.exports = {
    getSubjects: getSubjects,
    getOptions: getOptions,
    createOptionsReply: createOptionsReply,
    createOptionsClassReply: createOptionsClassReply,
    createOptionsDimsReply: createOptionsDimsReply,
    getSeries: getSeries,
    createSeriesReply: createSeriesReply
};