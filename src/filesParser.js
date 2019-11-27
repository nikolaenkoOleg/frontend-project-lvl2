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
      parse: (beforeData, afterData) => {
        const beforeJson = JSON.parse(beforeData);
        const afterJson = JSON.parse(afterData);

        return {
          beforeData: beforeJson,
          afterJson,
        };
      },
    },
    {
      check: (arg) => arg === 'yaml',
      parse: (beforeData, afterData) => {
        const beforeYaml = yaml.safeLoad(beforeData);
        const afterYaml = yaml.safeLoad(afterData);

        return {
          before: beforeYaml,
          after: afterYaml,
        };
      },
    },
    {
      check: (arg) => arg === 'ini',
      parse: (beforeData, afterData) => {
        const beforeIni = ini.parse(beforeData);
        const afterIni = ini.parse(afterData);

        return {
          before: beforeIni,
          after: afterIni,
        };
      },
    },
  ];

  const getParser = (extension) => parsers.find(({ check }) => check(extension));
  const { parse } = getParser(fileExtension);

  return parse(beforeContent, afterContent);
};
