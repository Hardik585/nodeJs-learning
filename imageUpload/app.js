import express from "express";
// import fileUpload from "express-fileupload";
const fileUpload = require('express-fileupload');

const port = process.env.PORT || 9091;

const app = express();

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

app.use(fileUpload());

app.get('/', (req, res) => {
    res.render('form');
})

app.post('/profile', (req, res) => {
    // console.log("hi", req.files);
    // console.log("helo", req.body);
    // console.log("what up ", req.files.file);
    const imageFile = req.files.file;
    imageFile.mv(`${__dirname}/public/images/${imageFile.name}`, (err, data) => {
        if (err) throw err;
      res.render('display', {title:req.body.myNameImg, image:imageFile.name});
    })
})

app.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`app started at port no : ${port}`);
})