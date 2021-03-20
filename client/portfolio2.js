// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';


// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrands=[];
let pagination=0
let value=1
// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const sectionbrand = document.querySelector('#brand-select');
const sectiondate=document.querySelector('#recentrelease');
const reasonableprice=document.querySelector('#reasonableprice');
const sortselect=document.querySelector('#sort-select');
const spanNbRecentProducts=document.querySelector('#nbNewProducts');




/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
 /*meta est le contenu que retourne l'api du genre le numéro de la page et le nombre de product*/
const setCurrentProducts = ({result,meta}) => {
    console.log(result)
    currentProducts = result;
    currentPagination=meta
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

  let text=`https://server-sand-nu.vercel.app/products/search?limit=${size}&pages=${page}`;
  // let text=`http://localhost:8091/products/search?limit=${size}&pages=${page}`
  try {
    const response = await fetch(
      text
    );

    const body = await response.json();

    if (body=={'ack': "product not found"}) {

      console.error(body);
      return {currentProducts,currentPagination};
    }
    console.log(body);
    return {"result":body.products,"meta":body.meta};
  } catch (error) {
    console.error(error);
    return {currentProducts,currentPagination};
  }
};


/* affiche la liste des produits*/
/**
 * Render list of products
 * @param  {Array} products
 */





const renderProducts = products => {
  console.log(products)
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const nb=products.length;
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product._id}>
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
const filterAll = ()=> {
  console.log(currentProducts)
  let productsFound = currentProducts;
  if(reasonableprice.checked==true){
   productsFound = filterprice(productsFound);
  }
  if(sectiondate.checked==true){
    productsFound = filterdate(productsFound)
  }
  if(sectionbrand.value!=""){
    productsFound = filterbrand(productsFound,sectionbrand.value)
  }
  productsFound=sorted(productsFound,sortselect.value)
  document.querySelector('#nbProductDisplayed').innerHTML=productsFound.length
  return productsFound

}


/**
 * Render page selector
 * @param  {Object} pagination
 */
 /*indique dans le selecteur combien de value on veur*/
 
const renderPagination = pagination => {
  const pageCount=Math.ceil(pagination.length/parseInt(selectShow.value))
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');


  
  selectPage.innerHTML = options;
  selectPage.selectedIndex =value-1 ;



};


/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  spanNbProducts.innerHTML = pagination;
};

/*permet l'affichage des prduits des indicateur */
const render = async(products,currentPagination) => {
  console.log(products)
  renderbrands(products);
  renderProducts(products);
  if(pagination==0){
   pagination=await fetchProducts(1,currentPagination)
  }
  console.log(pagination)
  renderPagination(pagination.result);
  renderIndicators(pagination.meta);
  renderNbNeWproducts(pagination.result);
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
  fetchProducts(1,parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts,currentPagination)).then(document.querySelector('#reasonableprice').checked=false,document.querySelector('#recentrelease').checked=false,document.querySelector('#sort-select').value="",value=1);
});

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts,currentPagination))
);


/*features 1*/
/*currentPaginantion contient le nombre de produit voulant être affiché*/
/*affiche les produits en fonctions du nombre de page choisie*/
selectPage.addEventListener('change', event => {
  value=event.target.value
  fetchProducts( parseInt(event.target.value),parseInt(selectShow.value))
  .then(setCurrentProducts)
  .then(() => render(currentProducts,currentPagination)).then(document.querySelector('#reasonableprice').checked=false,document.querySelector('#recentrelease').checked=false,document.querySelector('#sort-select').value="");
});

/*features 2*/

sectionbrand.addEventListener('change', event => {
  renderProducts(filterAll());
});
/*features 3*/


const filterdate=(products) => {
  return products.filter(product =>Date.parse(product.released) > Date.now() - 1000*3600*24*30);
};

sectiondate.addEventListener('click',event => {
  if(sectiondate.checked==true){
    renderProducts(filterAll())
  }
  else{
    renderProducts(filterAll())
  }

});

/*features 4*/

const filterprice=(products) => {
  return products.filter(product =>product.price<50);
};

reasonableprice.addEventListener('click',event => {
  if(reasonableprice.checked==true){
    renderProducts(filterAll())
  }
  else{
    renderProducts(filterAll())
  }

});
/*features 5 et 6*/
function compare_price( a, b ) {
  if ( a.price < b.price ){
    return -1;
  }
  if ( a.price > b.price ){
    return 1;
  }
  return 0;
}

const sorted=(products,value)=>{
  switch(value){
  case 'price-asc':
    return products.sort(function(a, b){return a.price-b.price});
  break;
  case 'price-desc':
  return products.sort(function(a, b){return b.price-a.price});
  break;
  case'date-asc':
  return products.sort(function(a, b){return Date.parse(a.released)-Date.parse(b.released)});
  break;
  case 'date-desc':
  return products.sort(function(a, b){return Date.parse(b.released)-Date.parse(a.released)});
  break;
  default:
  return products;

}


}

sortselect.addEventListener('change', event => {
  console.log(currentProducts)
  renderProducts(filterAll());
});

/*features 9*/


const renderNbNeWproducts =(products)=>{
  let recentcount = 0;
  for (let i = 0; i<products.length; i++){
      if (Date.parse(products[i].released) > Date.now() - 1000*3600*24*30){
          recentcount+=1;
      }
  }
    spanNbRecentProducts.innerHTML = recentcount;
    const YoungestProduct=sorted(products,'date-desc')[0]
    console.log(YoungestProduct.released)
    document.querySelector('#NewProduct').innerHTML=YoungestProduct.released
    document.querySelector('#nbProductDisplayed').innerHTML=currentProducts.length
}


    

