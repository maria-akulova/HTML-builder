const { createReadStream } = require('fs');
const { join } = require('path');
const { stdout } = require('process');
const readFile = createReadStream(join(__dirname, 'text.txt'));

let data = '';

readFile.on('data', (fileRow) => (data += fileRow));
readFile.on('end', () => stdout.write(data));
