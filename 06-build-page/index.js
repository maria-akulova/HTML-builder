const { join, extname } = require('path');
const { constants, access } = require('fs');

const {
  mkdir,
  rmdir,
  rm,
  readdir,
  writeFile,
  readFile,
  copyFile,
} = require('fs/promises');

const targetFolder = join(__dirname, 'project-dist');
const targetAssetFolder = join(targetFolder, 'assets');
const currentAssetsFolder = join(__dirname, 'assets');
const targetStyleFile = join(targetFolder, 'style.css');
const indexFile = join(targetFolder, 'index.html');
const readFileFromFolder = join(__dirname, 'styles');

let result = [];

function createTargetDirectory(folder) {
  mkdir(folder, {
    recursive: true,
  });
}

async function saveFileToArray(fileName) {
  const content = await readFile(join(readFileFromFolder, fileName), {
    encoding: 'utf-8',
  });
  result.push(content);
  result.push('\n');
}

async function joinFilesToFile() {
  const files = await readdir(readFileFromFolder, { withFileTypes: true });

  await Promise.all(
    files.sort().map(async (file) => {
      if (file.isFile() && extname(file.name).slice(1) === 'css') {
        await saveFileToArray(file.name);
      }
    }),
  );
  await writeFile(targetStyleFile, result);
}

createTargetDirectory(targetFolder);
copyFile(join(__dirname, 'template.html'), indexFile);

rm(targetStyleFile, { force: true }).then(joinFilesToFile);

async function copyDirectory(source, target) {
  await rm(target, { force: true, recursive: true }).then(
    await mkdir(target, { recursive: true }),
  );

  const files = await readdir(source, { withFileTypes: true });

  await Promise.all(
    files.map(async (file) => {
      const sourcePath = join(source, file.name);
      const targetPath = join(target, file.name);

      if (file.isDirectory()) {
        await copyDirectory(sourcePath, targetPath);
      } else {
        await copyFile(sourcePath, targetPath);
      }
    }),
  );
}

copyDirectory(currentAssetsFolder, targetAssetFolder);
