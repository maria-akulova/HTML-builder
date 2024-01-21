const fs = require('fs');
const { join, resolve, extname } = require('path');
const { stdout } = require('process');

const folderName = 'secret-folder';
const folder = join(__dirname, folderName);

function printFileInfo(item, currentFolder) {
  const fileStat = resolve(currentFolder, item.name);

  if (item.isFile()) {
    fs.stat(fileStat, function (errStat, stats) {
      let fileName = item.name.split('.').slice(0, -1).join('.');
      if (!fileName) {
        fileName = item.name;
      }
      if (item.name.split('.')[0].length === 0) {
        fileName = '';
      }
      let fileExt = extname(item.name).slice(1);
      if (!fileExt && item.name.split('.')[0].length === 0) {
        fileExt = item.name.split('.')[1];
      }

      const fileSize = stats.size / 1024;
      stdout.write(`${fileName} - ${fileExt} - ${fileSize} Kb\n`);
      if (errStat)
        return stdout.write(
          `Error during reading the file properties: ${item}`,
        );
    });
  }
}

function analyzeFolder(currentFolder) {
  fs.readdir(currentFolder, { withFileTypes: true }, function (errDir, items) {
    items.forEach((item) => {
      printFileInfo(item, currentFolder);
    });
    if (errDir)
      return stdout.write(`Error during reading the folder: ${currentFolder}`);
  });
}

analyzeFolder(folder);
