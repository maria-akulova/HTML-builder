/* import { readdir } from 'fs/promises';

import { readFile, writeFile } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const targetFile = join(__dirname, 'project-dist', 'bundle.css');
const readFileFromFolder = join(__dirname, 'test-files', 'styles');
let result = [];

async function readFileToArray(file) {
  return await readFile(join(readFileFromFolder, file.name), {
    encoding: 'utf-8',
  });
}

async function readAllFilesInDirectory() {
  const files = await readdir(readFileFromFolder, { withFileTypes: true });
  files.forEach((file) => {
    if (file.isFile() && extname(file.name).slice(1) === 'css') {
      result.push(readFileToArray(file));
    }
  });
}

readAllFilesInDirectory();
writeFile(targetFile, result); */

const { rm, readdir, writeFile, readFile } = require('fs/promises');
const { join, extname } = require('path');

const targetFolder = join(__dirname, 'project-dist');
const targetFile = join(targetFolder, 'bundle.css');
const readFileFromFolder = join(__dirname, 'test-files', 'styles');
let result = [];

async function writeToTargetFile() {
  await writeFile(targetFile, result);
}

async function saveFileToArray(fileName) {
  const content = await readFile(join(readFileFromFolder, fileName), {
    encoding: 'utf-8',
  });
  result.push(content);
}

async function copyFilesToTargetFolder() {
  const files = await readdir(readFileFromFolder, { withFileTypes: true });

  await Promise.all(
    files.map(async (file) => {
      if (file.isFile() && extname(file.name).slice(1) === 'css') {
        await saveFileToArray(file.name);
      }
    }),
  );
}

rm(targetFile, { force: true })
  .then(copyFilesToTargetFolder)
  .finally(writeToTargetFile);
