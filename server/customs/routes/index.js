'use strict';
const Joi = require('joi');
const controller = require('../controller');

module.exports = [
    {
        method: 'GET',
        path: '/data/customs/subjects',
        handler: controller.getSubjects,
        config: {
            tags: ['api'],
            description: 'Get customs data types'
        }
    }, {
        method: 'GET',
        path: '/data/customs/options',
        handler: controller.getOptions,
        config: {
            tags: ['api'],
            description: 'Get options of a data type',
            validate: {
                query: {
                    optionClass: Joi.string().optional(),
                    id: Joi.string().required()
                }
            }
        }
    }, {
        method: 'GET',
        path: '/data/customs/series',
        handler: controller.getSeries,
        config: {
            tags: ['api'],
            description: 'Get options of a data type',
            validate: {
                query: {
                    id: Joi.string().required(),
                    values: Joi.array().items(Joi.string()).required(),
                    latest: Joi.number().max(1000).default(10)
                }
            }
        }
    }
];