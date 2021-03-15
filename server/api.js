const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db= require('./db/index.js')
const PORT = 8092;

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
  limit = request.query.limit;
  brand = request.query.brand;
  price = parseInt( request.query.price );
  console.log(brand,limit,price)

  products = await db.find({brand: brand, price:{$lte: price} })
  if(products.length>0){
    let prod_limit=[]
    for (var i=0;i<limit;i++ ){
      if(i<products.length){
        prod_limit.push(products[i])
      }

    }
    console.log(products)
    response.send( prod_limit);
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
