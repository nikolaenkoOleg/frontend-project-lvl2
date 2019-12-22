import fs from 'fs';
import path from 'path';
import parse from './parser';
import getDiff from './formatters';

const readFile = (pathToFile) => {
  const fullPath = path.resolve(pathToFile);
  const fileContent = fs.readFileSync(fullPath, 'utf-8').toString();

  return fileContent;
};

export default (pathToBeforeFile, pathToAfterFile, output = 'tree') => {
  const beforeContent = readFile(pathToBeforeFile);
  const afterContent = readFile(pathToAfterFile);
  const fileExtension = path.extname(pathToAfterFile).replace('.', '');

  const beforeData = parse(beforeContent, fileExtension);
  const afterData = parse(afterContent, fileExtension);

  const diff = getDiff(beforeData, afterData, output);

  return diff;
};
