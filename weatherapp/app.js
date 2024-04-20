let express = require('express');
let request = require('request');

let app = express();

app.get('/weather',(req, res) => {
    let city = req.query.city ? req.query.city : 'Delhi';
    let uri = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&mode=json&units=metric&cnt=5&appid=fbf712a5a83d7305c3cda4ca8fe7ef29`;

    request(uri, (err, response) => {
        if (err) throw err;
        res.send(response.body);
    })
})

app.listen(9090, (err) => {
    if (err) throw err;
})
