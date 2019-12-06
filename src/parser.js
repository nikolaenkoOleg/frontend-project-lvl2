import yaml from 'js-yaml';
import ini from 'ini';

export default (file, extname) => {
  switch (extname) {
    case 'json':
      return JSON.parse(file);
    case 'yaml':
      return yaml.safeLoad(file);
    case 'ini':
      return ini.parse(file);
    default:
      return null;
  }
};
