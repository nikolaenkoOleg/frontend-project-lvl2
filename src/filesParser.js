import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

export default (pathToBeforeFile, pathToAfterFile) => {
  const beforeContent = fs.readFileSync(path.resolve(pathToBeforeFile), 'utf-8').toString();
  const afterContent = fs.readFileSync(path.resolve(pathToAfterFile), 'utf-8').toString();
  const fileExtension = path.extname(pathToAfterFile).replace('.', '');

  const parsers = [
    {
      check: (arg) => arg === 'json',
      parse: (oldData, newData) => {
        const beforeJson = JSON.parse(oldData);
        const afterJson = JSON.parse(newData);

        return {
          beforeData: beforeJson,
          afterData: afterJson,
        };
      },
    },
    {
      check: (arg) => arg === 'yaml',
      parse: (oldData, newData) => {
        const beforeYaml = yaml.safeLoad(oldData);
        const afterYaml = yaml.safeLoad(newData);

        return {
          beforeData: beforeYaml,
          afterData: afterYaml,
        };
      },
    },
    {
      check: (arg) => arg === 'ini',
      parse: (oldData, newData) => {
        const beforeIni = ini.parse(oldData);
        const afterIni = ini.parse(newData);

        return {
          beforeData: beforeIni,
          afterData: afterIni,
        };
      },
    },
  ];

  const getParser = (extension) => parsers.find(({ check }) => check(extension));
  const { parse } = getParser(fileExtension);

  return parse(beforeContent, afterContent);
};
