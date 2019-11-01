import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import parse from './parses';

export default (firstConfig, secondConfig, format) => {
  const pathToFirstFile = path.isAbsolute(firstConfig)
    ? firstConfig : path.resolve(firstConfig);

  const pathToSecondFile = path.isAbsolute(secondConfig)
    ? secondConfig : path.resolve(secondConfig);

  const fileType = path.extname(firstConfig).replace('.', '');

  const extensionActions = [
    {
      name: (arg) => arg === 'json',
      action: (firstPath, secondPath, outputFormat) => {
        const beforeData = JSON.parse(fs.readFileSync(firstPath).toString());
        const afterData = JSON.parse(fs.readFileSync(secondPath).toString());

        return parse(beforeData, afterData, outputFormat);
      },
    },
    {
      name: (arg) => arg === 'yaml',
      action: (firstPath, secondPath, outputFormat) => {
        const beforeData = yaml.safeLoad(fs.readFileSync(firstPath).toString());
        const afterData = yaml.safeLoad(fs.readFileSync(secondPath).toString());

        return parse(beforeData, afterData, outputFormat);
      },
    },
    {
      name: (arg) => arg === 'ini',
      action: (firstPath, secondPath, outputFormat) => {
        const beforeData = ini.parse(fs.readFileSync(firstPath).toString());
        const afterData = ini.parse(fs.readFileSync(secondPath).toString());

        return parse(beforeData, afterData, outputFormat);
      },
    },
  ];

  const getExtensionAction = (arg) => extensionActions.find(({ name }) => name(arg));
  const { action } = getExtensionAction(fileType);
  return action(pathToFirstFile, pathToSecondFile, format);
};
