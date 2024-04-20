let http = require('http');

let server = http.createServer((req , res) =>{
    res.write("Hello THis is from simple server side or by NOde server Side ");
    res.end();;
})

server.listen(9091);