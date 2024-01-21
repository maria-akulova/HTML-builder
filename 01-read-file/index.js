const fs = require('fs');
const path = require('path');
const { stdout } = process;
const readFile = fs.createReadStream(path.join(__dirname, 'text.txt'));

let data = '';

readFile.on('data', (fileRow) => (data += fileRow));
readFile.on('end', () => stdout.write(data));
