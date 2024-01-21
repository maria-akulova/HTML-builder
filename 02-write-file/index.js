const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const newFileName = 'userData.txt';
const writeFile = fs.createWriteStream(path.join(__dirname, newFileName));

function stopWritingFile() {
    stdout.write(`\nYour data was saving to the disk within file ${newFileName}`);
    exit();
}

stdout.write('\nPlease, type in the data you want to save on the disk:\n');
stdin.on('data', (data) => {
    if (data.toString().trim().toLowerCase() === 'exit') {
        stopWritingFile();
    }
    writeFile.write(data);
});
process.on('SIGINT', stopWritingFile);
