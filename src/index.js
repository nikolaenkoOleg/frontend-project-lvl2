import fs from 'fs';
import path from 'path';
import parseFile from './fileParser';

const readFile = (pathToFile) => {
  const fullPath = path.resolve(pathToFile);
  const fileContent = fs.readFileSync(fullPath, 'utf-8').toString();

  return fileContent;
};

export default (pathToBeforeFile, pathToAfterFile) => {
  const beforeContent = readFile(pathToBeforeFile);
  const afterContent = readFile(pathToAfterFile);
  const fileExtension = path.extname(pathToAfterFile).replace('.', '');

  const beforeData = parseFile(beforeContent, fileExtension);
  const afterData = parseFile(afterContent, fileExtension);

  return { beforeData, afterData };
};
