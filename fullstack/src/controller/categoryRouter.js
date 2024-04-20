let express = require('express');
let router = express.Router();
let mongodb = require('mongodb').MongoClient;

let url = process.env.MONGO_URL;

function getProduct(){
    router.route('/product')
    .get((req ,res) =>{
        mongodb.connect(url , (err , database) =>{
            if(err){
                console.error(err.message);
            }else{
               let dbObj = database.db('Hardik');
               console.log(dbObj.collection('product').find());
               dbObj.collection('category').find().toArray((err , data) =>{
                if(err){
                    console.log(err.message);
                    res.status(203).json({msg:"Not able to fetch data"});
                }
                else{
                     res.status(201).send(data);
                }
               })

            }

        })  

    })
}