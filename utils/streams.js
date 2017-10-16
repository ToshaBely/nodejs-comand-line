const fs = require('fs');
const through2 = require('through2');
const csv2json = require('csv2json');
const request = require('request');
const program = require('commander');

if (!module.parent) {
    mainHandler();
}

function mainHandler() {
    program
    .version('1.0.0')
    .option('-a, --action <action_name>', 'run selected action', '')
    .option('-f, --file <file_name>', 'set file to processing', '')
    .option('-p, --path <path_name>', 'set file path to processing', '');

    program.on('--help', function() {
        console.log('');
        console.log('  Examples: ');
        console.log('');
        console.log('   $ ./streams --action=io --file=users.csv');
        console.log('   $ ./streams --action=transform-file --file=users.csv');
        console.log('   $ ./streams -a io -f users.csv');
        console.log('   $ ./streams --help');
        console.log('   $ ./streams -h');
        console.log('');
    });

    program.parse(process.argv);

    const action = program.action.trim();
    const fileName = program.file.trim();

    if (!action) {
        console.log('[Warning]: property action is not defined');
    }

    switch(action) {
        case 'input-output':
        case 'io':
            if (!fileName) {
                console.log('[Warning]: file name is not defined');
                return;
            }

            inputOutput(fileName);
            break;
        case 'transform-file':
            if (!fileName) {
                console.log('[Warning]: file name is not defined');
                return;
            }

            transformFile(fileName);
            break;
        case 'transform':
            transform();
            break;
        case 'convert-csv':
            if (!fileName) {
                console.log('[Warning]: file name is not defined');
                return;
            }
            
            convertCSV(fileName);
            break;
        case 'convert-csv-to-json':
            if (!fileName) {
                console.log('[Warning]: file name is not defined');
                return;
            }
            
            convertCSVToJSON(fileName);
            break;
        case 'bundle-css':
            const pathName = program.path.trim();
            if (!pathName) {
                console.log('[Warning]: path name is not defined');
                return;
            }

            getCss(pathName);
            break;
        default:
            console.log(`[Warning]: action "${action}" is not defined`);
    }
}

function inputOutput (filePath) {
    fs.createReadStream(filePath).pipe(process.stdout);
}

function transformFile (filePath) {
    fs.createReadStream(filePath)
        .pipe(through2(function (chunk, enc, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }))
        .pipe(process.stdout);
}

function transform () {
    process.stdin
        .pipe(through2(function (chunk, enc, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }))
        .pipe(process.stdout);
}

function convertCSV (filePath) {
    fs.createReadStream(filePath)
        .pipe(csv2json())
        .pipe(process.stdout);
}

function convertCSVToJSON (filePath) {
    fs.createReadStream(filePath)
        .pipe(csv2json())
        .pipe(fs.createWriteStream(filePath.replace(/\.csv$/, '.json')));
}

function getCss (pathName) {
    const outStream = fs.createWriteStream(pathName + '/bundle.css');

    fs.readdirSync(pathName)
        .filter(file => /\.css$/.test(file))
        .map(file => fs.createReadStream(pathName + '/' + file))
        .reduce((prev, current) => {
            if (prev != null) {
                prev.on('end', () => current.pipe(outStream, {end: false}));
            } else {
                current.pipe(outStream, {end: false});
            }
            return current;
        }, null)
        .on('end', () => request('https://www.epam.com/etc/clientlibs/foundation/main.min.fc69c13add6eae57cd247a91c7e26a15.css')
            .pipe(outStream));
}

module.exports = {
    inputOutput,
    transformFile,
    transform,
    convertCSV,
    convertCSVToJSON,
    getCss
}

// TODO: create handler for NOERR
