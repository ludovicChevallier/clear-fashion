const axios = require('axios');
const cheerio = require('cheerio');

/*https://adresse.paris/602-nouveautes*/
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product_list.grid.row .product-container')
    .map((i, element) => {
      const name = $(element)
        .find(' .product-name').attr('title');
      const price = parseInt(
        $(element)
          .find(' .price.product-price')
          .text()
      );

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
