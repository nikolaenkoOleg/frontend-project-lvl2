import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import astBuilder from './formatters/astBuilder';
import jsonRender from './formatters/jsonRender';
import plainRender from './formatters/plainRender';
import treeRender from './formatters/treeRender';


export default (beforeConfig, afterConfig, format) => {
  const beforeContent = fs.readFileSync(path.resolve(beforeConfig), 'utf-8').toString();
  const afterContent = fs.readFileSync(path.resolve(afterConfig), 'utf-8').toString();

  const fileExtension = path.extname(beforeConfig).replace('.', '');

  const getDiffWithFormat = (beforeData, afterData, out) => {
    const ast = astBuilder(beforeData, afterData);
    switch (out) {
      case 'plain':
        return plainRender(ast);
      case 'json':
        return jsonRender(ast);
      case 'tree':
        return treeRender(ast);
      default:
        break;
    }

    return null;
  };

  const extensionActions = [
    {
      check: (arg) => arg === 'json',
      action: (beforeData, afterData, outputFormat) => {
        const beforeJson = JSON.parse(beforeData);
        const afterJson = JSON.parse(afterData);

        return getDiffWithFormat(beforeJson, afterJson, outputFormat);
      },
    },
    {
      check: (arg) => arg === 'yaml',
      action: (beforeData, afterData, outputFormat) => {
        const beforeYaml = yaml.safeLoad(beforeData);
        const afterYaml = yaml.safeLoad(afterData);

        return getDiffWithFormat(beforeYaml, afterYaml, outputFormat);
      },
    },
    {
      check: (arg) => arg === 'ini',
      action: (beforeData, afterData, outputFormat) => {
        const beforeIni = ini.parse(beforeData);
        const afterIni = ini.parse(afterData);

        return getDiffWithFormat(beforeIni, afterIni, outputFormat);
      },
    },
  ];

  const getExtensionAction = (extension) => extensionActions.find(({ check }) => check(extension));
  const { action } = getExtensionAction(fileExtension);
  const diff = action(beforeContent, afterContent, format);

  return diff;
};
