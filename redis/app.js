let express = require('express');
let axios = require('axios');
let redis = require('redis');


let app = express();

let client = redis.createClient({
    // host: 'localhost',
    // port: 6379
})

app.get('/data', (req, res) => {
    let userInput = req.query.country.trim();
    console.log(userInput);
    userInput = userInput ? req.query.country : 'India';
    let uri = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${userInput}`;
    return client.get(userInput, (err, result) => {
        if (result) {
            let output = JSON.parse(result);
            res.send(output);
        }
        else {
            axios.get(uri)
                .then((response) => {
                    let output = response.data;
                    client.setex(userInput, 300, JSON.stringify({ source: "Redis Cache", output }));
                    res.send({ source: 'Api Response', output });
                })
        }
        // client.disconnect();
    })
})

app.listen(9091, (err) => {
    if (err) console.error(err);
    console.log(`server started at port 9091`);
})

