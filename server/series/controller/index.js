'use strict';

const Boom = require('boom');
const mongo = require('mongodb');

function get(request, reply) {
    let db = request.server.app.database;

    if (!db) {
        return reply(Boom.notFound('Retry later'));
    }

    console.log(request.params);
    db.collection('series').findOneAsync({_id: new mongo.ObjectID(request.params.seriesId)}, {'_id': false})
        .then((d) => {
            reply(JSON.stringify(d));
        })
        .catch((e) => {
            return reply(Boom.notFound('Retry later'));
        });
}

function store(request, reply) {
    let db = request.server.app.database;
    
    if (!db) {
        return reply(Boom.notFound('Retry later'));
    }
    
    let newSeries = request.payload;
    newSeries.insertionDate = new Date();
    
    db.collection('series').insertOneAsync(newSeries)
        .then((d) => {
            reply().created(d.insertedId);
        });
}

module.exports = {
    store: store,
    get: get
};