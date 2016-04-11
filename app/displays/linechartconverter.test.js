const expect = require('chai').expect;

const lineChart = require('./linechartconverter');

describe('linechartconverter  test', function() {
    it('One series', function() {
        expect(lineChart.convertToChartJSData([
            {
            title: 'abc',
            labels: [1,2,3],
            data: [4,5,6]
            }
        ])).to.deep.equal({
            series: ['abc'],
            labels: [1,2,3],
            data: [[4,5,6]]
        });
    });

    it('One series, spptty data', function() {
        expect(lineChart.convertToChartJSData([
            {
                title: 'abc',
                labels: [1,5,7],
                data: [4,5,6]
            }
        ])).to.deep.equal({
            series: ['abc'],
            labels: [1,5,7],
            data: [[4,5,6]]
        });
    });

    it('Two series, one with newer data', function() {
        expect(lineChart.convertToChartJSData([
            {
                title: 'abc',
                labels: [1,2,3],
                data: [4,5,6]
            },
            {
                title: 'def',
                labels: [1,2,3,4],
                data: [7,8,9,10]
            }
        ])).to.deep.equal({
            series: ['abc', 'def'],
            labels: [1,2,3,4],
            data: [[4,5,6, null], [7,8,9,10]]
        });
    });

    it('Two series, one with newer and one with older data', function() {
        expect(lineChart.convertToChartJSData([
            {
                title: 'abc',
                labels: [1,2,3],
                data: [4,5,6]
            },
            {
                title: 'def',
                labels: [2,3,4],
                data: [7,8,9]
            }
        ])).to.deep.equal({
            series: ['abc', 'def'],
            labels: [1,2,3,4],
            data: [[4,5,6,null], [null,7,8,9]]
        });
    });

    it('Two series, one with spotty data', function() {
        expect(lineChart.convertToChartJSData([
            {
                title: 'abc',
                labels: [1,3],
                data: [4,6]
            },
            {
                title: 'def',
                labels: [2,3,4],
                data: [7,8,9]
            }
        ])).to.deep.equal({
            series: ['abc', 'def'],
            labels: [1,2,3,4],
            data: [[4,null,6,null], [null,7,8,9]]
        });
    });
});