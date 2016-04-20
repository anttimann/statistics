'use strict';

const expect = require('chai').expect;
const common = require('./common');

describe('common  test', function() {
    it('Create simple series name', function() {
        expect(common.createSeriesName([
            { text: 'abc', children: [], leaf: true },
            { options: [{text: 'def', id: 12}], chosen: 12}
        ])).to.equal('abc : def');
    });
});