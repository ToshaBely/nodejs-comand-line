const utils = require('./utils');

const program = require('commander');

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

const action = program.action;
const fileName = program.file;

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

        utils.streams.inputOutput(fileName);
        break;
    case 'transform-file':
        if (!fileName) {
            console.log('[Warning]: file name is not defined');
            return;
        }

        utils.streams.transformFile(fileName);
        break;
    case 'transform':
        utils.streams.transform();
        break;
    case 'convert-csv':
        if (!fileName) {
            console.log('[Warning]: file name is not defined');
            return;
        }
        
        utils.streams.convertCSV(fileName);
        break;
    case 'convert-csv-to-json':
        if (!fileName) {
            console.log('[Warning]: file name is not defined');
            return;
        }
        
        utils.streams.convertCSVToJSON(fileName);
        break;
    case 'bundle-css':
        const pathName = program.path;
        if (!pathName) {
            console.log('[Warning]: path name is not defined');
            return;
        }
    
    // + get assets path 
    // -    -> concat all css files
    // -        -> add epam-css at the end
    // -            -> put them into the bundle.css

        utils.streams.getCss(pathName);
        break;
    default:
        console.log(`[Warning]: action "${action}" is not defined`);
}
