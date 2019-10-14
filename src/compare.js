import fs from 'fs';
import path from 'path';
import _ from 'lodash';

export default (firstConfig, secondConfig) => {
  const pathToFirstFile = path.isAbsolute(firstConfig)
    ? firstConfig : path.resolve(firstConfig);

  const pathToSecondFile = path.isAbsolute(secondConfig)
    ? secondConfig : path.resolve(secondConfig);

  const beforeData = JSON.parse(fs.readFileSync(pathToFirstFile).toString());
  const afterData = JSON.parse(fs.readFileSync(pathToSecondFile).toString());

  const processedBeforeData = Object.keys(beforeData).map((key) => {
    if (_.has(afterData, key)) {
      if (beforeData[key] === afterData[key]) {
        return `   ${key}: ${beforeData[key]}\n`;
      }
      return ` + ${key}: ${afterData[key]}\n - ${key}: ${beforeData[key]}\n`;
    }

    return ` - ${key}: ${beforeData[key]}\n`;
  }).join('');

  const processedAfterData = Object.keys(afterData).map((key) => {
    if (!_.has(beforeData, key)) {
      return ` + ${key}: ${afterData[key]}\n`;
    }

    return null;
  }).join('');

  const processedData = `{\n${processedBeforeData}${processedAfterData}}`;

  return processedData;
};
