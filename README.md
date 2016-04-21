Statistics
==========

Web page to show Finnish statistics collected from open APIs.

Currently uses pxWeb API (http://pxnet2.stat.fi/api1.html) and Customs Uljas API (http://www.tulli.fi/fi/suomen_tulli/ulkomaankauppatilastot/uljas/uljas_api/index.jsp).

Demo page can be found here: http://statistics-anttimann.rhcloud.com/.

E2E tests
---------

npm install protractor -g
webdriver-manager update
webdriver-manager start

protractor protractor.conf.js
