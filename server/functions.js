const fs = require('fs');

const readFile = (link) =>
    new Promise((res, rej) => fs.readFile(link, 'utf-8', (err, data) => err ? rej(false) : res(data)));

const writeFile = (link, data) =>
    new Promise((res, rej) => fs.writeFile(link, data, (err) => err ? rej(false) : res(data)));

module.exports = { readFile, writeFile };