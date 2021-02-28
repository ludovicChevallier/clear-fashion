const axios = require('axios');
const cheerio = require('cheerio');
/*'https://www.dedicatedbrand.com/en/men/news'*/
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  
  /*
  return $('.products')
    .map((i, element) => {
      const name = $(element)
        .find('.name')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price.price')
          .text()
      );

      return {name, price};
    })
    .get();
  */
   products = data.products.filter(product => product.length != 0);
   // pour chaque product il va retourner la valeur 
  return  products
    .map(element => { 
      const name = element.name;
      const price = element.price.priceAsNumber;
      return {name, price};
    })

    

};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};
