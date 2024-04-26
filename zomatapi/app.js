import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT;
const MongoURL = process.env.MongoURL;
const authPass = process.env.AUTH_PASSWORD;


function checkAuthKey(key) {
    if (key == authPass) {
        return true;
    }
    else { return false; }
}


const mClient = new MongoClient(MongoURL);
async function mongoCon() {
    await mClient.connect();
    console.log('mongo connection success');
}
const mongoDb = mClient.db('restaurant');

let app = express();

//get heart 
app.get('/', (req, res) => {
    res.send("app checking ,working Fine  ");
})

//get List of cities
app.get('/location', async (req, res) => {
    const key = req.header('x-basic-auth');
    const isValidKey = checkAuthKey(key);
    if (isValidKey) {
        try {
            const data = await mongoDb.collection('location').find().toArray();
            if (data) {
                res.status(302).send(data);
            }
            else {
                res.status(204).json({ msg: "No Data Found" });
            }
        }
        catch (error) {
            console.log('Error retrieving location data:', error);
            res.status(500).send('Interval server error');
        }
    }
    else {
        res.status(401).json({ msg: "Unauthorized" });
    }

})

app.listen(port, (err) => {
    mongoCon();
    if (err) console.log(err);
    console.log(`APP STARTED AT PORT NO : ${port}`);
})