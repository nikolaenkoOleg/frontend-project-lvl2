import _ from 'lodash';

// name: 'common'
// type: key, obj
// beforeValue: '123'
// afterValue: '123'
// children: []
// status: 'unchanged, edited, added, deleted'

export default (beforeData, afterData) => {
  const parse = (data) => Object.entries(data).map(([key, value]) => {
    if (typeof value === 'object') {
      return {
        name: key,
        type: 'obj',
        beforeValue: value,
        afterValue: '',
        children: parse(value),
        status: '',
      };
    }
    return {
      name: key,
      type: 'key',
      beforeValue: value,
      afterValue: '',
      children: '',
      status: '',
    };
  });

  const getStatus = (before, after) => {
    Object.keys(before).map((key) => {
      if (_.has(after, key)) {
        if (before[key] === after[key]) {
          return 'unchanged';
        }
        return 'edited';
      }

      return 'deleted';
    });

    Object.keys(after).map((key) => {
      if (_.has(before, key)) {
        return 'added';
      }

      return null;
    });
  };

  const result = parse(beforeData).map(({
    name,
    beforeValue,
    afterValue,
    children,
  }) => {
    if (_.has(afterData, name)) {
      if (typeof beforeData[name] === 'object') {
        return {
          name,
          type: 'obj',
          beforeValue: '',
          afterValue: '',
          children: parse(beforeData[name]),
          status: getStatus(afterData),
        };
      }
      if (beforeValue === afterData[name]) {
        return {
          name,
          type: 'key',
          beforeValue,
          afterValue: afterData[name],
          children,
          status: 'unchanged',
        };
      }
    }
    return {
      name,
      type: 'key',
      beforeValue,
      afterValue,
      children,
      status: getStatus(beforeData, afterData),
    };
  });

  console.log(result);
};


// const processedBeforeData = Object.keys(beforeData).map((key) => {
//   if (_.has(afterData, key)) {
//     if (beforeData[key] === afterData[key]) {
//       return `   ${key}: ${beforeData[key]}\n`;
//     }
//     return ` + ${key}: ${afterData[key]}\n - ${key}: ${beforeData[key]}\n`;
//   }

//   return ` - ${key}: ${beforeData[key]}\n`;
// }).join('');

// const processedAfterData = Object.keys(afterData).map((key) => {
//   if (!_.has(beforeData, key)) {
//     return ` + ${key}: ${afterData[key]}\n`;
//   }

//   return null;
// }).join('');

// const processedData = `{\n${processedBeforeData}${processedAfterData}}`;

// return processedData;