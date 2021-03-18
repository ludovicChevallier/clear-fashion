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
  limit = request.query.limit;
  brand = request.query.brand;
  price = parseInt( request.query.price );
  console.log(brand,limit,price)
  if(request.query.brand && request.query.price){
    products = await db.find({brand: brand, price:{$lte: price} });
  }
  else if(request.query.brand){
    products = await db.find({brand: brand});
  }
  else if(request.query.price){
    products = await db.find({price:{$lte: price} });
  }
  else{
    products= await db.find();
  }
    if(!request.query.limit){
      limit=12
    }
    if(products.length>0){
      
      for (var i=0;i<limit;i++ ){
        if(i<products.length){
          prod_limit.push(products[i])
        }

      }
    }else{
      response.send({'ack': "product not found"});
    }
  response.send( prod_limit);
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
