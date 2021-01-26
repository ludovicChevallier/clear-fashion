// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrands=[];

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const sectionbrand = document.querySelector('#brand-select');
const sectiondate=document.querySelector('#recentrelease');
const reasonableprice=document.querySelector('#reasonableprice');




/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
 /*meta est le contenu que retourne l'api du genre le numéro de la page et le nombre de product*/
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
 /*charge les produits depuis une api*/
 /*si tous se passe bien retourne les donnés plus les données de l'api*/
const fetchProducts = async (page = 1, size = 12) => {

  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );

    const body = await response.json();

    if (body.success !== true) {

      console.error(body);
      return {currentProducts, currentPagination};
    }
    console.log(body.data);
    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/* affiche la liste des produits*/
/**
 * Render list of products
 * @param  {Array} products
 */





const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <span>${product.released}</span>
      </div>
    `;
  })
    .join('');
    /*ajoute les brands*/

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};
/*on affiche ici les brands*/
const renderbrands=products =>{
  let brands=[""]
  for (var i=0;i<products.length;i++){
    if(brands.includes(products[i].brand)==false){
      brands.push(products[i].brand);
    };
  }
  const options2 = Array.from(
    {'length': brands.length},
    (value, index) => `<option value="${brands[index]}">${brands[index]}</option>`
  ).join('');
/*indique le contenu et à qu'elle valeur on veut commencer*/
  sectionbrand.innerHTML=options2;
  sectionbrand.selectedIndex = 0;
};


/**
 * Render page selector
 * @param  {Object} pagination
 */
 /*indique dans le selecteur combien de value on veur*/
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');



  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;


};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};
/*permet l'affichage des prduits des indicateur */
const render = (products, pagination) => {
  renderbrands(products);
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};
/*on retourne les produits qui vont être affiché */
const filterbrand=(products,brand) =>{
  if(brand==""){
    return products;
  }
  return products.filter(product => product.brand==brand)

}

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
 /*affiche les produits en fonctions du nombre de produits sont choisi*/
 /*si il ya un chagement de nombre rappelle la fonction qui va cherhcher les products et les affiches */
 /*1: il charge les données avec la page actuelle et avec comme nombre de produit celui choisi dans le selecteur*/
 /*2: ensuite retourne les meta et result */
 /*3:puis on affiche le tout avec render*/
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination))
);


/*features 1*/
/*currentPaginantion contient le nombre de produit voulant être affiché*/
/*affiche les produits en fonctions du nombre de page choisie*/
selectPage.addEventListener('change', event => {
  fetchProducts( parseInt(event.target.value),currentPagination.pageSize)
  .then(setCurrentProducts)
  .then(() => render(currentProducts, currentPagination));
  console.log(currentPagination);
});

/*features 2*/

sectionbrand.addEventListener('change', event => {
  renderProducts(filterbrand(currentProducts,event.target.value));
});
/*features 3*/


const filterdate=(products) => {
  return products.filter(product =>Date.parse(product.released) > Date.now() - 1000*3600*24*30);
};

sectiondate.addEventListener('click',event => {
  if(sectiondate.checked==true){
    renderProducts(filterdate(currentProducts));
  }
  else{
    renderProducts(currentProducts);
  }

});
/*features 4*/

const filterprice=(products) => {
  return products.filter(product =>product.price<50);
};

reasonableprice.addEventListener('click',event => {
  if(reasonableprice.checked==true){
    renderProducts(filterprice(currentProducts));
  }
  else{
    renderProducts(currentProducts);
  }

});
