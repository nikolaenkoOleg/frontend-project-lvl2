import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import astBuilder from './formatters/astBuilder';
import jsonRender from './formatters/jsonRender';
import plainRender from './formatters/plainRender';
import treeRender from './formatters/treeRender';

export default (beforeConfig, afterConfig, format) => {
  const pathToFirstFile = path.isAbsolute(beforeConfig)
    ? beforeConfig : path.resolve(beforeConfig);

  const pathToSecondFile = path.isAbsolute(afterConfig)
    ? afterConfig : path.resolve(afterConfig);

  const fileExtension = path.extname(beforeConfig).replace('.', '');

  const extensionActions = [{
    name: (arg) => arg === 'json',
    action: (beforeDataPath, afterDataPath, outputFormat) => {
      const beforeData = JSON.parse(fs.readFileSync(beforeDataPath).toString());
      const afterData = JSON.parse(fs.readFileSync(afterDataPath).toString());

      switch (outputFormat) {
        case 'plain':
          return plainRender(astBuilder(beforeData, afterData));
        case 'json':
          return jsonRender(astBuilder(beforeData, afterData));
        default:
          return treeRender(astBuilder(beforeData, afterData));
      }
    },
  },
  {
    name: (arg) => arg === 'yaml',
    action: (beforeDataPath, afterDataPath, outputFormat) => {
      const beforeData = yaml.safeLoad(fs.readFileSync(beforeDataPath).toString());
      const afterData = yaml.safeLoad(fs.readFileSync(afterDataPath).toString());

      switch (outputFormat) {
        case 'plain':
          return plainRender(astBuilder(beforeData, afterData));
        case 'json':
          return jsonRender(astBuilder(beforeData, afterData));
        default:
          return treeRender(astBuilder(beforeData, afterData));
      }
    },
  },
  {
    name: (arg) => arg === 'ini',
    action: (beforeDataPath, afterDataPath, outputFormat) => {
      const beforeData = ini.parse(fs.readFileSync(beforeDataPath).toString());
      const afterData = ini.parse(fs.readFileSync(afterDataPath).toString());

      switch (outputFormat) {
        case 'plain':
          return plainRender(astBuilder(beforeData, afterData));
        case 'json':
          return jsonRender(astBuilder(beforeData, afterData));
        default:
          return treeRender(astBuilder(beforeData, afterData));
      }
    },
  },
  ];

  const getExtensionAction = (extension) => extensionActions.find(({ name }) => name(extension));
  const { action } = getExtensionAction(fileExtension);

  return action(pathToFirstFile, pathToSecondFile, format);
};
