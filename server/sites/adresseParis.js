const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
let today = new Date().toISOString().slice(0, 10)

/*https://adresse.paris/602-nouveautes*/
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const brands="adresseParis"
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product_list.grid.row .product-container')
    .map((i, element) => {
      const link=`${$(element).find('.product-name')
      .attr('href')}`;
      const name = $(element)
        .find(' .product-name').attr('title');
      const price = parseInt(
        $(element)
          .find(' .price.product-price')
          .text()
      );
        const photo= $(element)
          .find('.product-image-container .product_img_link img')
          .attr('data-original');
        id= uuidv5(link, uuidv5.URL)
      if(link!="undefined"){
      return {link,brand:'adresseParis','price': price,'name':name,'released':today,'photo':photo,'_id':id};
      }
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
