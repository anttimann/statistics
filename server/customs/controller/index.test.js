'use strict';

const request = require('request');
const q = require('q');

const expect = require('chai').expect;
const sinon = require('sinon');


const ctrl = require('./index');

describe('customs API', function() {
    it.skip('returns correct reply', function(done) {
        let callback = (values) => {
            expect(values.length).to.equal(5);
            expect(values[0].code).to.equal('D1');
            done();
        };
        ctrl.getOptions({query: {id: '/DATABASE/01 ULKOMAANKAUPPATILASTOT/01 CN/ULJAS_CN'}}, callback);
    });

    it('created correct options reply', function() {
        expect(ctrl.createOptionsReply({
            classification:[
                {id: "D1", label: "Tavaraluokitus CN2",
                    class: [
                        {code: "00 - 99", text: "(2002--.) KAIKKI RYHMÄT"},
                        {code: "01", text: "(2002--.) ELÄVÄT ELÄIMET"},
                        {code: "99", text: "(2002--.) Erittelemättömät"},
                        {code: "XX", text: "(2002--.) 87 JA 93 RYHMÄ YHDESSÄ"}
                    ]},
                {id: "D2", label: "Aika",
                    class: [
                        {code: "201601", text: "201601"},
                        {code: "201512", text: "201512"},
                        {code: "201511", text: "201511"}
                ]}
            ]}
        )).to.deep.equal([
            {title: 'Tavaraluokitus', code: 'D1', time: false, options: [
                {id: 'Tavaraluokitus CN2=00 - 99', text: '(2002--.) KAIKKI RYHMÄT'}, {id: 'Tavaraluokitus CN2=01', text: '(2002--.) ELÄVÄT ELÄIMET'}, {id: 'Tavaraluokitus CN2=99', text: '(2002--.) Erittelemättömät'}, {id: 'Tavaraluokitus CN2=XX', text: '(2002--.) 87 JA 93 RYHMÄ YHDESSÄ'}
            ]}
        ]);
    });

    it('created correct series reply', function() {
        expect(ctrl.createSeriesReply([
            {"keys":["0-9 (2002--.) KAIKKI RYHMÄT","DE (2002--.) Saksa","201601","Vienti määrämaittain"],"vals":[492629802]},
            {"keys":["0-9 (2002--.) KAIKKI RYHMÄT","DE (2002--.) Saksa","201512","Vienti määrämaittain"],"vals":[570909470]},
            {"keys":["0-9 (2002--.) KAIKKI RYHMÄT","DE (2002--.) Saksa","201511","Vienti määrämaittain"],"vals":[597503984]},
            {"keys":["0-9 (2002--.) KAIKKI RYHMÄT","DE (2002--.) Saksa","201510","Vienti määrämaittain"],"vals":[656687791]}
        ], 2)).to.deep.equal({
            labels: ['2015-10', '2015-11', '2015-12', '2016-01'],
            data: [656687791, 597503984, 570909470, 492629802]
        });
    });
});
