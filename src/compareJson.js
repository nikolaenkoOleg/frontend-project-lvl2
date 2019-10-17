import fs from 'fs';
import path from 'path';
import parseJson from './parses';

export default (firstConfig, secondConfig) => {
  const pathToFirstFile = path.isAbsolute(firstConfig)
    ? firstConfig : path.resolve(firstConfig);

  const pathToSecondFile = path.isAbsolute(secondConfig)
    ? secondConfig : path.resolve(secondConfig);

  const beforeData = JSON.parse(fs.readFileSync(pathToFirstFile).toString());
  const afterData = JSON.parse(fs.readFileSync(pathToSecondFile).toString());

  return parseJson(beforeData, afterData);
};
