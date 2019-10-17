import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import parseYaml from './parses';

export default (firstConfig, secondConfig) => {
  const pathToFirstFile = path.isAbsolute(firstConfig)
    ? firstConfig : path.resolve(firstConfig);

  const pathToSecondFile = path.isAbsolute(secondConfig)
    ? secondConfig : path.resolve(secondConfig);

  const beforeData = yaml.safeLoad(fs.readFileSync(pathToFirstFile, 'utf-8'));
  const afterData = yaml.safeLoad(fs.readFileSync(pathToSecondFile, 'utf-8'));

  return parseYaml(beforeData, afterData);
};
