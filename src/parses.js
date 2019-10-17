import _ from 'lodash';

export default (beforeData, afterData) => {
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
