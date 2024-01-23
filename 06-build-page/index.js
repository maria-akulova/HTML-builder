const { join, extname } = require('path');

const {
  mkdir,
  rm,
  readdir,
  writeFile,
  readFile,
  copyFile,
} = require('fs/promises');

const targetFolder = join(__dirname, 'project-dist');
const targetAssetFolder = join(targetFolder, 'assets');
const currentAssetsFolder = join(__dirname, 'assets');
const stylesFolder = join(__dirname, 'styles');
const targetStyleFile = join(targetFolder, 'style.css');
const templateFile = join(__dirname, 'template.html');
const indexFile = join(targetFolder, 'index.html');
const componentFolder = join(__dirname, 'components');
const typeFiles = 'css';

async function createDirectory(folder) {
  await mkdir(folder, {
    recursive: true,
  });
}

async function saveFileToArray(fileName, arr) {
  const content = await readFile(join(stylesFolder, fileName), {
    encoding: 'utf-8',
  });
  arr.push(content);
  arr.push('\n');
}

async function mergeFiles(resultFile, sourceFolder, fileType) {
  let result = [];

  await rm(resultFile, { force: true });
  const files = await readdir(sourceFolder, { withFileTypes: true });

  await Promise.all(
    files.sort().map(async (file) => {
      if (file.isFile() && extname(file.name).slice(1) === fileType) {
        await saveFileToArray(file.name, result);
      }
    }),
  );
  await writeFile(resultFile, result);
}

async function createHtmlFromComponents(
  resultFile,
  templateFile,
  sourceFolder,
) {
  const typeFiles = 'html';
  await copyFile(templateFile, resultFile);

  const htmlComponents = await readdir(sourceFolder, {
    withFileTypes: true,
  });
  let indexHtmlData = await readFile(resultFile, { encoding: 'utf-8' });

  await Promise.all(
    htmlComponents.map(async (component) => {
      if (
        component.isFile() &&
        extname(component.name).slice(1) === typeFiles
      ) {
        const componentData = await readFile(
          join(sourceFolder, component.name),
          {
            encoding: 'utf-8',
          },
        );
        indexHtmlData = indexHtmlData.replace(
          `{{${component.name.split('.')[0]}}}`,
          componentData,
        );
      }
    }),
  );

  await writeFile(resultFile, indexHtmlData);
}

async function copyDirectory(source, target) {
  await rm(target, { force: true, recursive: true }).then(
    await createDirectory(target),
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

createDirectory(targetFolder);
mergeFiles(targetStyleFile, stylesFolder, typeFiles);
copyDirectory(currentAssetsFolder, targetAssetFolder);
createHtmlFromComponents(indexFile, templateFile, componentFolder);
