const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const { join } = require('path');

const targetFolder = join(__dirname, 'files-copy');
const currentFolder = join(__dirname, 'files');

function createTargetDirectory() {
  mkdir(targetFolder, {
    recursive: true,
  });
}

function copy(fileName) {
  copyFile(join(currentFolder, fileName), join(targetFolder, fileName));
}

function copyFilesToTargetFolder() {
  readdir(currentFolder, {
    withFileTypes: true,
  }).then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        copy(file.name);
      }
    });
  });
}

rm(targetFolder, {
  recursive: true,
  force: true,
})
  .then(createTargetDirectory)
  .finally(copyFilesToTargetFolder);
