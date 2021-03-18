const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db= require('./db/index.js')
const PORT = 8091;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});
app.get('/products/search', async(request, response) => { 
  
  let prod_limit=[] ;
  limit =parseInt( request.query.limit);
  if(!request.query.limit){
    limit=12
  }
  pages =parseInt(request.query.pages);
  if(!request.query.pages){
    pages=1
  }
  brand = request.query.brand;
  price = parseInt( request.query.price );
  console.log(pages,limit)
  if(request.query.brand && request.query.price){
    products = await db.find({brand: brand, price:{$lte: price} },pages,limit);
  }
  else if(request.query.brand){
    products = await db.find({brand: brand},pages,limit);
  }
  else if(request.query.price){
    products = await db.find({price:{$lte: price},pages,limit });
  }
  else{
    products= await db.find({},pages,limit);
  }
    console.log(products);
  if(products.length>0){
    response.send( products);
  }else{
    response.send({'ack': "product not found"});
  }
  
});
app.get('/products/:id',async (request,response)=>{
  _id=request.params.id;
  res=await db.find({_id});
  if(res.length>0){
  console.log(res);
  response.send(res);
  }
  else{
    console.log("id not found")
    response.send({"res":"id not found"});
  }
})

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);
