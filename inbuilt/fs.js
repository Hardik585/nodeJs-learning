let fs = require('fs');

// fs.writeFile('demo.txt',
//     'hello world I am learning NodeJS and Node and Node',
//     (err) => {
//         if (err) console.error(err);
//         console.log('file written');
//     });

// fs.appendFile('demo.txt',
//     'hello world again  I am learning NodeJS and Node',
//     (err) => {
//         if (err) console.error(err);
//         console.log('file appended');
//     })

// fs.readFile('demo.txt', { encoding: 'utf-8', flags: 'r' }, (err, data) => {
//     if (err) console.error(err);
//     console.log(data);
// });
let data = fs.readFileSync('demo.txt', { encoding: 'utf-8', flags: 'r' });
console.log(data);
// fs.unlink('demo.txt', (err) => {
//     if (err) console.log(err);
//     console.log('file deleted');
// })