const expect = require('chai').expect;
const _ = require('lodash');

const lineChart = require('./linechartconverter');

describe('linechartconverter  test', function() {
    it('One series', function() {
        expect(lineChart.convertToChartJSData([
            {
            title: 'abc',
            labels: ['2001','2002','2003'],
            data: [4,5,6]
            }
        ])).to.deep.equal({
            series: ['abc'],
            labels: _.map(['2001','2002','2003'], (e) => {return new Date(e);}),
            data: [[4,5,6]]
        });
    });

    it('One series, spotty data', function() {
        expect(lineChart.convertToChartJSData([
            {
                title: 'abc',
                labels: ['2001','2005','2007'],
                data: [4,5,6]
            }
        ])).to.deep.equal({
            series: ['abc'],
            labels: _.map(['2001','2005','2007'], (e) => {return new Date(e);}),
            data: [[4,5,6]]
        });
    });

    it('Two series, one with newer data', function() {
        expect(lineChart.convertToChartJSData([
            {
                title: 'abc',
                labels: ['2001','2002','2003'],
                data: [4,5,6]
            },
            {
                title: 'def',
                labels: ['2001','2002','2003','2004'],
                data: [7,8,9,10]
            }
        ])).to.deep.equal({
            series: ['abc', 'def'],
            labels: _.map(['2001','2002','2003','2004'], (e) => {return new Date(e);}),
            data: [[4,5,6, null], [7,8,9,10]]
        });
    });

    it('Two series, one with newer and one with older data', function() {
        expect(lineChart.convertToChartJSData([
            {
                title: 'abc',
                labels: ['2001','2002','2003'],
                data: [4,5,6]
            },
            {
                title: 'def',
                labels: ['2002','2003','2004'],
                data: [7,8,9]
            }
        ])).to.deep.equal({
            series: ['abc', 'def'],
            labels: _.map(['2001','2002','2003','2004'], (e) => {return new Date(e);}),
            data: [[4,5,6,null], [0,7,8,9]]
        });
    });

    it('Two series, one with spotty data', function() {
        expect(lineChart.convertToChartJSData([
            {
                title: 'abc',
                labels: ['2001','2003'],
                data: [4,6]
            },
            {
                title: 'def',
                labels: ['2002','2003','2004'],
                data: [7,8,9]
            } 
        ])).to.deep.equal({
            series: ['abc', 'def'],
            labels: _.map(['2001','2002','2003','2004'], (e) => {return new Date(e);}),
            data: [[4,null,6,null], [0,7,8,9]]
        });
    }); 

    it('Two series, one with month data', function() {
        expect(lineChart.convertToChartJSData([
            { 
                title: 'abc',
                labels: ['2001-1','2001-2', '2001-3'],
                data: [4,6,8]
            },
            {
                title: 'def',
                labels: ['2001','2002'], 
                data: [7,8]
            }
        ])).to.deep.equal({
            series: ['abc', 'def'],
            labels: _.map(['2001', '2001-1','2001-2', '2001-3', '2002'], (e) => {return new Date(e);}),
            data: [[0,4,6,8,null], [7,null,null,null,8]]
        });
    });
});