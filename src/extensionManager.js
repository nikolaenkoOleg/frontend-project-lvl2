import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import astBuilder from './formatters/astBuilder';
import jsonRender from './formatters/jsonRender';
import plainRender from './formatters/plainRender';
import defaultRender from './formatters/defaultRender';

export default (firstConfig, secondConfig, format) => {
  const pathToFirstFile = path.isAbsolute(firstConfig)
    ? firstConfig : path.resolve(firstConfig);

  const pathToSecondFile = path.isAbsolute(secondConfig)
    ? secondConfig : path.resolve(secondConfig);

  const fileExtension = path.extname(firstConfig).replace('.', '');

  const extensionActions = [{
    name: (arg) => arg === 'json',
    action: (firstPath, secondPath, outputFormat) => {
      const beforeData = JSON.parse(fs.readFileSync(firstPath).toString());
      const afterData = JSON.parse(fs.readFileSync(secondPath).toString());

      switch (outputFormat) {
        case 'plain':
          return plainRender(astBuilder(beforeData, afterData));
        case 'json':
          return jsonRender(astBuilder(beforeData, afterData));
        default:
          return defaultRender(jsonRender(astBuilder(beforeData, afterData)));
      }
    },
  },
  {
    name: (arg) => arg === 'yaml',
    action: (firstPath, secondPath, outputFormat) => {
      const beforeData = yaml.safeLoad(fs.readFileSync(firstPath).toString());
      const afterData = yaml.safeLoad(fs.readFileSync(secondPath).toString());

      switch (outputFormat) {
        case 'plain':
          return plainRender(astBuilder(beforeData, afterData));
        case 'json':
          return jsonRender(astBuilder(beforeData, afterData));
        default:
          return defaultRender(jsonRender(astBuilder(beforeData, afterData)));
      }
    },
  },
  {
    name: (arg) => arg === 'ini',
    action: (firstPath, secondPath, outputFormat) => {
      const beforeData = ini.parse(fs.readFileSync(firstPath).toString());
      const afterData = ini.parse(fs.readFileSync(secondPath).toString());

      switch (outputFormat) {
        case 'plain':
          return plainRender(astBuilder(beforeData, afterData));
        case 'json':
          return jsonRender(astBuilder(beforeData, afterData));
        default:
          return defaultRender(jsonRender(astBuilder(beforeData, afterData)));
      }
    },
  },
  ];

  const getExtensionAction = (extension) => extensionActions.find(({ name }) => name(extension));
  const { action } = getExtensionAction(fileExtension);

  return action(pathToFirstFile, pathToSecondFile, format);
};
