const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    //Solution 1
    // fs.readFile('test-file.txt', (err, data) => {
    //     if (err) console.log(err);

    //     res.end(data);
    // })

    //Streams
    // const readable = fs.createReadStream('test-file.txt');
    // readable.on('data', (chunk) => {
    //     res.write(chunk);
    // })
    // readable.on('end', () => {
    //     res.end();
    // })

    // readable.on('err', (err)=> {
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('File not found');
    // })

    //Solution 3: pip
    //readableSource.pipe(writeableDest)
    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res);
})

server.listen(3000, '127.0.0.1', () => {
    console.log('Waiting for request...');
})
