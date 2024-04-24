import express from "express";
import fileUpload from "express-fileupload";
import { MongoClient } from "mongodb";

// const fileUpload =require('express-fileupload');

const port = process.env.PORT || 9090;

const mongoURL = 'mongodb://localhost:27017';
const mCLient = new MongoClient(mongoURL);
async function mongoDBConnection() {
    await mCLient.connect();
    console.log("mongo connected");
}

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(fileUpload());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
})

app.post('/profile', async (req, res) => {
    const collection = mCLient.db('test').collection('imgsaver');
    const imageFile = req.files.file;
    if (!imageFile.name) {
        res.json({ msg: "plz provide valid file" });
    }
    const isNameSave = await collection.insertOne({ name: imageFile.name });
    // console.log("hi ", isNameSave);
    if (!isNameSave) { res.status(404).json({ msg: "NOt able to save img Name" }) }
    imageFile.mv(`${__dirname}/public/img/${imageFile.name}`, (err) => {
        if (err) throw err;
        res.status(201).render('display', {title:req.body.myImgName, image:imageFile.name });
    })
})


app.listen(port, (err) => {
    mongoDBConnection();
    if (err) console.log(err);
    console.log(`app started at :${port}`);
})
