'use strict';
const Joi = require('joi');
const controller = require('../controller');

module.exports = [
    {
        method: 'GET',
        path: '/series/{seriesId}',
        handler: controller.get,
        config: {
            tags: ['api'],
            description: 'Get stored chart',
            validate: {
                params: {
                    seriesId: Joi.string().required()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/series',
        handler: controller.store,
        config: {
            tags: ['api'],
            description: 'Store new chart',
            validate: {
                payload: {
                    data: Joi.array().items({
                        title: Joi.string().required(),
                        query: Joi.array().items({
                            code: Joi.string().required(),
                            selection: {
                                filter: Joi.string().required(),
                                values: Joi.array().items(Joi.string()).single().required()
                            }
                        }).required(),
                        path: Joi.string().required()
                    }).single().required()
                }
            }
        }
    }
];