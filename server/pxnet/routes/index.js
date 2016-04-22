'use strict';

const Joi = require('joi');
const controller = require('../controller');

module.exports = [
    {
        method: 'GET',
        path: '/data/pxnet/sources',
        handler: controller.getSources,
        config: {
            tags: ['api'],
            description: 'Get sources types'
        }
    }, {
        method: 'GET',
        path: '/data/pxnet/subjects',
        handler: controller.getSubjects,
        config: {
            tags: ['api'],
            description: 'Get data types',
            validate: {
                query: {
                    id: Joi.string().required()
                }
            }
        }
    }, {
        method: 'GET',
        path: '/data/pxnet/options',
        handler: controller.getOptions,
        config: {
            tags: ['api'],
            description: 'Get options of a data type',
            validate: {
                query: {
                    id: Joi.string().required()
                }
            }
        }
    }, {
        method: 'GET',
        path: '/data/pxnet/series',
        handler: controller.getSeries,
        config: {
            tags: ['api'],
            description: 'Get options of a data type',
            validate: {
                query: {
                    id: Joi.string().required(),
                    values: Joi.array().items(Joi.string()).single().required()
                }
            }
        }
    }
];