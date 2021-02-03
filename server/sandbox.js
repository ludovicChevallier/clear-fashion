/* eslint-disable no-console, no-process-exit */
/*dedicatedbrandDedi.js*/
/*dedicatedbrandMJ.js*/
'use strict';

const fs = require('fs');
const dedicatedbrand = require('./sources/dedicatedbrand.js');


async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    /*mettre un if avec à la place des dedicates brands les desdicated brands 1 2 et 3*/
    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    const jsonContent = JSON.stringify(products);
    fs.writeFile("./sources/data.json", jsonContent, 'utf8', function (err) {
      if (err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      process.exit(0);
  });
    
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);
