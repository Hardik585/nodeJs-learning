import express from 'express';
import axios from 'axios';
import { createClient } from 'redis';

let port = 9093;

let app = express();

let client = createClient({
    host: 'localhost',
    port: 6379
})
client.on('error', err => console.log("not able to connect ", err));

app.get('/data', async (req, res) => {
    await client.connect();
    let userInput = req.query.country.trim();
    userInput = userInput?req.query.country:'India';
    const uri = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${userInput}`;
    let result = await client.get(userInput);
    if (result) {
        const output = JSON.parse(result);
        res.send({ source: "Redis Response By Hardik ", output });
    }
    else {
        let response = await axios.get(uri);
        // console.log(response);
        const data = response.data;
        await client.set(userInput, JSON.stringify({ source: 'Redis Cache', data }), { Ex: 10, NX: true });
        res.send({ source: "API RESPONSE BY HARDIK ", data })
    }
    await client.disconnect();
})

app.listen(3000, (err) => {
    if (err) console.error(err);
    console.log('server started at 3000');
})
