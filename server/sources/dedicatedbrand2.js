const axios = require('axios');
const cheerio = require('cheerio');

/*https://mudjeans.eu/collections/men*/

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.content-row .product-link ')
  .map((i, element) => {
    const name = $(element)
      .find(' .product-title')
      .text()
      .trim()
      .replace(/\s/g, ' ');
    let price = $(element)
      .find('.row .product-price:first')
      .text();
      /*prend seulement ce qu'il y'a entre le dollar et la fin*/
      price = price.substring(
        price.lastIndexOf('€') + 1,
        price.length - 1
  )
    console.log(name)
    return {name, price};
  })
  .get();
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
