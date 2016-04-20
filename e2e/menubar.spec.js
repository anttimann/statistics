const chai = require('chai');
chai.use(require("chai-as-promised"));
const expect = chai.expect;

const config = require('./config');

describe('Menubar', function() {
    beforeEach(() => {
        browser.driver.manage().window().setSize(600, 600);
        browser.get(config.url);
    });
    
    it('should be able to open and close menu', () => {
        openMenuButton().click();
        expect(menuArea().isDisplayed()).to.eventually.equal(true);
        closeMenuButton().click();
        expect(menuArea().isDisplayed()).to.eventually.equal(false);
    });

    it('should be able to open tree menu and choose options', () => {
        openMenuButton().click();
        expect(firstDataTreeLevel().count()).to.eventually.equal(9);
        firstDataTreeLevelChild(1).click();
        expect(secondDataTreeLevel().count()).to.eventually.equal(16);
    });
    
    function openMenuButton() {
        return element(by.css('.menu > .menu_open'));
    }

    function closeMenuButton() {
        return element(by.css('.menu > .menu_open'));
    }

    function menuArea() {
        return element(by.css('.bottom_area'));
    }
    
    function firstDataTreeLevel() {
        return element.all(by.css('.datatree > ul > li'));
    }

    function firstDataTreeLevelChild(childIndex) {
        return element(by.css('.datatree > ul > li:nth-child(' + childIndex + ')'));
    }

    function secondDataTreeLevel() {
        return element.all(by.css('.datatree > ul > li:first-child > ul > li'));
    }
});