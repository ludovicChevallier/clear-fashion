/* eslint-disable no-console, no-process-exit */
/*dedicatedbrandDedi.js*/
/*dedicatedbrandMJ.js*/
'use strict';

const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});
const dedicatedbrand = require('./sources/dedicatedbrand.js');
const dedicatedbrand2= require('./sources/dedicatedbrand2.js');
const dedicatedbrand3=require('./sources/dedicatedbrand3.js');



async function sandbox (n=1) {
  try {
    console.log(`🕵️‍♀️  browsing ${n} source`);
    /*mettre un if avec à la place des dedicates brands les desdicated brands 1 2 et 3*/
    
    var name="";

    if(n==1){
      console.log("1")
      var eshop = 'https://www.dedicatedbrand.com/en/loadfilter'
      var  products = await dedicatedbrand.scrape(eshop);
      name="dedicatedbrand";
      
    }
    else if(n==2){
      console.log("2")
      var eshop = 'https://mudjeans.eu/collections/men'
      var products = await dedicatedbrand2.scrape(eshop);
      eshop = 'https://mudjeans.eu/collections/women-jeans'
      var product=await dedicatedbrand2.scrape(eshop);
      for( var i in product){
        products.push(i)
      }
      name="mudjeans";
    }
    else{
     
      var eshop = 'https://adresse.paris/630-toute-la-collection?id_category=630&n=109'
      var products = await dedicatedbrand3.scrape(eshop);
       name="adresse-paris";
    }
    console.log(n)
    console.log(products);
    console.log('done');
    const jsonContent = JSON.stringify(products);
    fs.writeFile(`./sources/${name}.json`, jsonContent, 'utf8', function (err) {
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
//console.log("que voulez comme site web 1: dedicated brands 2:mujean 3: adresse paris: ")
// récupére la valeur données en entrée node sandbox.js 1 => n=1
const [,, n] = process.argv;

sandbox(n);
