'use strict';

const expect = require('chai').expect;
const helper = require('./stathelper');

describe('stathelper  test', function() {
    it('Create query values', function() {
        expect(helper.createDataQueryValues([
            { code: 'abc', chosen: '123', options: ['123', '456']},
            { code: 'def', chosen: '1', time: true, options: [{id: '1'}, {id: '2'}, {id: '3'}]}
        ])).to.deep.equal([
            { code: 'abc',  selection: { filter: 'item', values: ['123'] } },
            { code: 'def', selection: { filter: 'item', values: ['1', '2', '3']} }
        ]);
    });

    it('Create series', function() {
        expect(helper.createSeries({ 
            columns: [{code: 'Vuosi', text: 'Vuosi'}, {code: 'type1', text: 'type1'}],
            data: [{key: ['1990', 'typeValue'], values: ['123']}, {key: ['1991', 'typeValue'], values: ['456']}]
        }, 'test')).to.deep.equal({
            data: ['123', '456'],
            labels: ['1990',  '1991'],
            title: 'test'
        });
    });

    it('Create series, missing year', function() {
        expect(helper.createSeries({
            columns: [{code: 'type1', text: 'type1'}],
            data: [{key: ['typeValue'], values: ['123']}]
        }, 'test')).to.deep.equal({
            data: ['123'],
            labels: ['2002'],
            title: 'test'
        });

        expect(helper.createSeries({
            columns: [{code: 'type1', text: 'type1'}],
            data: [{key: ['typeValue'], values: ['123']}]
        }, 'test 2001')).to.deep.equal({
            data: ['123'],
            labels: ['2001'], 
            title: 'test 2001' 
        });
    });
});