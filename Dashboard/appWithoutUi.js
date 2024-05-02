import express from "express";
import { MongoClient } from "mongodb";
import Mongo from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import { ObjectId } from "mongodb";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";



dotenv.config();
const url = process.env.MONGOURL;
const port = process.env.PORT || 9090;

const mClient = new MongoClient(url);
async function dbMain() {
    await mClient.connect();
    console.log("mongo Db Connected ");
}
const collection = mClient.db('dashboard').collection('test');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//This is the hearth of the app 
app.get('/health', (req, res) => {
    res.send("Health good ");
})


//add new user 
app.post('/addUser', async (req, res) => {
    await collection.insertOne(req.body);
    res.send("User added ");
})

//get allUser by filter 
app.get('/users', async (req, res) => {
    // console.log(req.query);
    let query = {};
    if (req.query.city && req.query.role) {
        query = {
            city: req.query.city,
            role: req.query.role,
            isActive: true
        }
    }
    else if (req.query.city) {
        query = {
            city: req.query.city,
            isActive: true
        }
    }
    else if (req.query.role) {
        query = {
            role: req.query.role,
            isActive: true
        }
    }
    else if (req.query.isActive) {
        let isActive = req.query.isActive;
        if (isActive == "false") {
            isActive = false;
        }
        else {
            isActive = true;
        }
        query = { isActive }
    }
    else {
        query = { isActive: true }
    }
    // console.log(JSON.stringify(query));
    const output = [];
    const cursor = collection.find(query);
    for await (const data of cursor) {
        output.push(data);
    }
    cursor.closed;
    res.send(output);
})


//get One user by Id 
app.get('/user/:_id', async (req, res) => {
    let query = { _id: new ObjectId(req.params._id) };
    const user = await collection.findOne(query);
    res.send(user);
})

//update User by UserID
app.get('/updateUser/:id', async (req, res) => {
    console.log(req.params.id);
    let query = { _id: new ObjectId(req.params.id) };
    console.log(JSON.stringify(query));
    await collection.updateOne(query,
        {
            $set: {
                name: req.body.name,
                city: req.body.city,
                phone: req.body.phone,
                role: req.body.role,
                isActive: req.body.isActive
            }
        })
    res.send("get Id");
})


//soft Delete 
app.get('/deactivateUser', async (req, res) => {
    let query = { _id: new ObjectId(req.body._id) };
    await collection.updateOne(query,
        {
            $set: {
                isActive: false
            }
        })
    res.send("User deactivate");
})

app.get('/activateUser', async (req, res) => {
    let query = { _id: new ObjectId(req.body._id) };
    await collection.updateOne(query,
        {
            $set: {
                isActive: true
            }
        })
    res.send("user active ");
})


app.listen(port, (err) => {
    dbMain();
    if (err) console.log(err);
    console.log(`app started at port no : ${port}`);
})
