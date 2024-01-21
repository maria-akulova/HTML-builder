const { createWriteStream } = require('fs');
const { join } = require('path');
const { stdin, stdout, exit } = require('process');

const newFileName = 'userData.txt';
const writeFile = createWriteStream(join(__dirname, newFileName));

function stopWritingFile() {
  stdout.write(
    `\nYour data was saving to the disk within the file ${newFileName}`,
  );
  exit();
}

stdout.write('\nPlease, type in the data you want to save on the disk:\n');
stdin.on('data', (data) => {
  const dataContent = data.toString().trim().toLowerCase();
  if (dataContent === 'exit') {
    stopWritingFile();
  }
  writeFile.write(data);
});
process.on('SIGINT', stopWritingFile);
