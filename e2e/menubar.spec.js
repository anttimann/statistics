const chai = require('chai');
chai.use(require("chai-as-promised"));
const expect = chai.expect;

const config = require('./config');
const page = require('./page');
const menubar = page.menubar;
const chartArea = page.chartArea;
const shareSeries = page.shareSeries;

describe('Menubar', function() {
    beforeEach(() => {
        browser.driver.manage().window().setSize(600, 600);
        browser.get(config.url);
    });
    
    it('should be able to open and close menu', () => {
        menubar.openMenuButton().click();
        expect(menubar.menuArea().isDisplayed()).to.eventually.equal(true);
        menubar.closeMenuButton().click();
        expect(menubar.menuArea().isDisplayed()).to.eventually.equal(false);
    });

    it('should be able to open tree menu and choose series and remove them', () => {
        menubar.openMenuButton().click();
        expect(menubar.dataTreeLevelAll(1).count()).to.eventually.equal(9);
        
        menubar.dataTreeEntry(1, 'Tulli').click();
        expect(menubar.dataTreeLevelAll(2).count()).to.eventually.equal(16);
        
        menubar.dataTreeEntry(2, 'Kauppatase').click();
        expect(menubar.inputArea().isDisplayed()).to.eventually.equal(true);
        expect(menubar.inputsAll().count()).to.eventually.equal(2);
        
        menubar.addSeriesButton().click();
        expect(menubar.menuArea().isDisplayed()).to.eventually.equal(false);
        expect(chartArea.addedSeriesAll().count()).to.eventually.equal(1);

        chartArea.shareSeriesButton().click();
        expect(shareSeries.shareLinkInput().getAttribute('value')).to.eventually.contain('/#/kayrat/');
        shareSeries.closeButton().click();
        
        chartArea.removeSeriesButton(1).click();
        expect(chartArea.addedSeriesAll().count()).to.eventually.equal(0);
    });
});