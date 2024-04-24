import express from "express";
import { createClient } from "redis";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 9091;

const app = express();

const mongodbURL = 'mongodb://localhost:27017';
const mClient = new MongoClient(mongodbURL);
async function dbConnect() {
    await mClient.connect();
    console.log('mongo db connected ');
}

const rClient = createClient({
    host: 'localhost',
    port: 6379
})

rClient.on('error', (err) => { console.log(err) });

app.get('/data', async (req, res) => {
    await rClient.connect();
    const uInput = req.query.color.trim();
    // console.log(uInput);
    const result = await rClient.get(uInput);
    if (result) {
        const output = JSON.parse(result);
        res.send(result);
    }
    else {
        const output = [];
        const collection = mClient.db('test').collection('products');
        // const results = await collection.find({ Color: { $regex: new RegExp(uInput, 'i')}}).toArray();
        const results = await collection.find({ Color: { $regex: uInput, $options: 'i' } }).toArray();
        await rClient.set(uInput, JSON.stringify({ source: "Redis Cache", results }), { EX: 10, NX: true });
        results.closed;
        res.send({ source: "DB Data ", results });
    }
    await rClient.disconnect();
})

app.listen(port, (err) => {
    dbConnect();
    if (err) console.error(err);
    console.log(`app started at port no ${port}`);
})
