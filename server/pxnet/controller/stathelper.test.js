'use strict';

const expect = require('chai').expect;
const helper = require('./stathelper');

describe('stathelper  test', function() {
    it('Create query values', function() {
        expect(helper.createDataQueryValues([
            'abc=123',
            'def=1,2,3'
        ])).to.deep.equal([
            { code: 'abc',  selection: { filter: 'item', values: ['123'] } },
            { code: 'def', selection: { filter: 'item', values: ['1', '2', '3']} }
        ]);
    });

    it('Create series values', function() {
        expect(helper.createSeries({
            columns: [
                { code: 'Alue', text: 'Alue', type: 'd' },
                { code: 'Asuntokunnan koko', text: 'Asuntokunnan koko', type: 'd' },
                { code: 'Talotyyppi', text: 'Talotyyppi', type: 'd' },
                { code: 'Vuosi', text: 'Vuosi', type: 'd' },
                { code: 'Asuntokunnat', text: 'Asuntokunnat', type: 'c' }
            ],
            'comments': [],
            'data': [
                { key: [ 'SSS', 'S', 'S', '1985' ], values: [ '1887710' ] },
                { key: [ 'SSS', 'S', 'S', '1986' ], values: [ '1916606' ] }
            ]
        })).to.deep.equal({
            labels: ['1985', '1986'],
            data: ['1887710', '1916606']
        });
    });

    it('Create series, missing year', function() {
        expect(helper.createSeries({
            columns: [{code: 'type1', text: 'type1'}],
            data: [{key: ['typeValue'], values: ['123']}]
        })).to.deep.equal({
            data: ['123'],
            labels: [null]
        });
    });
});