const fs = require('fs');
const through2 = require('through2');
const csv2json = require('csv2json');
const request = require('request');

module.exports.inputOutput = function (filePath) {
    fs.createReadStream(filePath).pipe(process.stdout);
}

module.exports.transformFile = function (filePath) {
    fs.createReadStream(filePath)
        .pipe(through2(function (chunk, enc, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }))
        .pipe(process.stdout);
}

module.exports.transform = function () {
    process.stdin
        .pipe(through2(function (chunk, enc, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }))
        .pipe(process.stdout);
}

module.exports.convertCSV = function (filePath) {
    fs.createReadStream(filePath)
        .pipe(csv2json())
        .pipe(process.stdout);
}

module.exports.convertCSVToJSON = function (filePath) {
    fs.createReadStream(filePath)
        .pipe(csv2json())
        .pipe(fs.createWriteStream(filePath.replace(/\.csv$/, '.json')));
}

module.exports.getCss = function (pathName) {
    request('https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css')
        .pipe(fs.createWriteStream('bundle.css'));
}

// TODO: create handler for NOERR