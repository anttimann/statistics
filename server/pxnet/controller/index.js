'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));

const _ = require('lodash');
const iconv = require('iconv-lite');
const Boom = require('boom');

const config = require('../config');
const helper = require('./stathelper');

function getSources(req, reply) {
    return queryData('')
        .then((values) => {
            reply(
                _.map(values, (v) => {
                    return { id: v.dbid, text: v.text.replace(/_/g, ' ').replace('StatFin', 'Tilastokeskus') };
                })
            );
        });
}

function getSubjects(req, reply) {
    let id = req.query.id;
    return queryData(id)
        .then((values) => {
            reply(
                _.map(values, (e) => {
                    return { id: e.id, text: e.text };
                })
            );
        });
}

function getOptions(req, reply) {
    let id = req.query.id;
    return queryData(id)
        .then((values) => {
            reply(
                _.map(values.variables, (e) => {
                    return {
                        title: e.text,
                        code: e.code,
                        options: _.zipWith(e.values, e.valueTexts, (id, text) => {
                            return {
                                id: id,
                                text: text
                            };
                        }),
                        time: isYearData(e)
                    };
                })
            );
        });
}

function isYearData(entry) {
    return entry.time || ['vuosi', 'tilastovuosi', 'time', 'year'].indexOf(entry.code.toLowerCase()) >= 0;
}

function getSeries(req, reply) {
    let id = req.query.id;
    let query = helper.createDataQueryValues(req.query.values);
    return querySeries(id, query)
        .then((values) => {
            _.flow(
                helper.createSeries,
                reply
            )(values);
        });
}

function queryData(path) {
    return request({
        uri: config.apiUrl + path
    }).then(convertMessage);
}

function querySeries(path, queryOptions) {
    return request({
        method: 'POST',
        uri: config.apiUrl + path, 
        json: true,
        headers: {'content-type': 'application/json'},
        body: {
            query: queryOptions,
            response: {format: 'json'}
        }
    }).then(convertMessage);
}

function convertMessage(message) {
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
}

module.exports = {
    getSources: getSources,
    getSubjects: getSubjects,
    getOptions: getOptions,
    getSeries: getSeries
};