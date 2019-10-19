import fs from 'fs';
import path from 'path';
import ini from 'ini';
import parseIni from './parses';

export default (firstConfig, secondConfig) => {
  const pathToFirstFile = path.isAbsolute(firstConfig)
    ? firstConfig : path.resolve(firstConfig);

  const pathToSecondFile = path.isAbsolute(secondConfig)
    ? secondConfig : path.resolve(secondConfig);

  const beforeData = ini.parse(fs.readFileSync(pathToFirstFile, 'utf-8'));
  const afterData = ini.parse(fs.readFileSync(pathToSecondFile, 'utf-8'));

  return parseIni(beforeData, afterData);
};
