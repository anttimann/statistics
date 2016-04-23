'use strict';

const expect = require('chai').expect;
const common = require('./common');

describe('common  test', function() {
    it('Create simple series name', function() {
        expect(common.createSeriesName([
            { text: 'abc', children: [], leaf: true },
            { selects: [
                {options: [{text: 'def', id: 12}], chosen: 12},
                {options: [{text: 'ghi', id: 13}], chosen: 13}
            ]}
        ])).to.equal('abc : def = ghi');
    });
});