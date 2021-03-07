const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ludovic:1234@clustercf.ccda6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';

const adresse_paris = require('./adresse-paris.json');

const dedicatedbrand = require('./dedicatedbrand.json');
const mudjeans = require('./mudjeans.json');
//console.log(mudjeans)
const ajoutDB =async()=>{
    try{
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    const collection = db.collection('produit');

    const result = await collection.insertMany(mudjeans);
    console.log(result);
    } catch(error){
        console.error(error);
    }
}
const   request = async()=>{
    try{
        brand="adresseParis"
        const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
        const db =  client.db(MONGODB_DB_NAME);
        const collection = db.collection('produit');
        const products = await collection.find({brand}).toArray();;
        console.log(products);
    }catch(error){
        console.error(error);
    }
}
request()