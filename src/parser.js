import yaml from 'js-yaml';
import ini from 'ini';

const parser = {
  json: JSON.parse,
  yaml: yaml.safeLoad,
  ini: ini.parse,
};

export default (fileContent, extname) => parser[extname](fileContent);
