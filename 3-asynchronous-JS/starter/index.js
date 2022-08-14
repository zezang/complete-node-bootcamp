const fs = require('fs');
const superagent = require('superagent');

const readFilePro = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject('I could not find the file');
            resolve(data);
        });
    });
}

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(file, data, (err => {
            if (err) reject('I could not write the file');
            resolve('Success');
        }))
    })
}

// readFilePro(`${__dirname}/dog.txt`)
//     .then(data => {
//         console.log(data.toString());
//         return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)})
//     .then(res => {
//         console.log(res.body.message);
//         return writeFilePro('dog-img.txt', res.body.message)})
//     .then(() => {
//         console.log('Random dog image saved to file!')
//     })
//     .catch(err => {
//         console.log(err);
//     })


// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//     console.log(`Breed: ${data}`);

//     superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then(res => {
//         console.log(res.body.message);

//         fs.writeFile('dog-img.txt', res.body.message, (err) => {
//             if (err) return console.log(err.message);
//             console.log('Random dog image saved to file!')
//         });
//     })
//     .catch(err => {
//         console.log(err.message);
//     })
// })


const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(data.toString());

        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        const imgs = all.map(promise => promise.body.message);
        console.log(imgs)

        for (const img of imgs) {
            await writeFilePro('dog-img.txt', `${img}\n`);
        }
        // await writeFilePro('dog-img.txt', imgs);
        console.log('Random dog image saved to file!');
        } catch (err) {
            console.log(err);
        }
    return '2: READY'
}

(async() => {
    try {
        console.log('1: Will get dog pics!');
        const x = await getDogPic();
        console.log(x);
        console.log('3: Will get dog pics!')
    } catch (err) {
        console.log(err);
    }
})();

// console.log('1: Will get dog pics!')
// getDogPic().then(x => {
//     console.log(x);
//     console.log('3: Will get dog pics!')
// }
// );

