const fs = require('fs');
const http = require('http');
const url  = require('url');

//------------------Files----------------//

//Blocking synchronous code
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);

// console.log('File written!');

//Non-blocking async code
// fs.readFile('./txt/start.txt', 'utf-8', (err1, data1) => {
//     if (err1) throw err1;
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err2, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err3, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err4) => {
//                 if (err4) throw err4;
//                 console.log('Your file has been written :D');
//             })
//         });
//     });  
// });

// console.log('Will read file!')

//-------------------Server---------------//
const replaceTemplate = (template, obj) => {
    let output = template.replace(/{%PRODUCTNAME%}/g, obj.productName);
    output = output.replace(/{%IMAGE%}/g, obj.image);
    output = output.replace(/{%PRICE%}/g, obj.price);
    output = output.replace(/{%FROM%}/g, obj.from);
    output = output.replace(/{%NUTRIENTS%}/g, obj.nutrients);
    output = output.replace(/{%QUANTITY%}/g, obj.quantity);
    output = output.replace(/{%ID%}/g, obj.id);
    output = output.replace(/{%DESCRIPTION%}/g, obj.description);

    if (!obj.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    
    //Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%', cardsHtml);
        res.end(output);
    } 
    //product pate
    else if (pathname === '/product') {
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product)
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(output);
    } 
    //API
    else if (pathname === '/api') {
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err) => {
            if (err) return console.log(err.message);
             res.writeHead(200, {'Content-type': 'application/json'})
             res.end(data);
        });
    } 
    //Not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-header': 'hello world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Listening to port 3000...')
})