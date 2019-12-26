import _ from 'lodash';

const typeProcesses = [
  {
    type: 'nested',
    content: 'children',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] instanceof Object && afterData[key] instanceof Object),
    process: (beforeData, afterData, func) => func(beforeData, afterData),
  },
  {
    type: 'unchanged',
    content: 'value',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] === afterData[key]),
    process: (beforeData) => beforeData,
  },
  {
    type: 'edited',
    content: 'value',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] !== afterData[key]),
    process: (beforeData, afterData) => ({ before: beforeData, after: afterData }),
  },
  {
    type: 'added',
    content: 'value',
    check: (beforeData, afterData, key) => (!_.has(beforeData, key) && _.has(afterData, key)),
    process: (_beforeData, afterData) => afterData,
  },
  {
    type: 'deleted',
    content: 'value',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && !_.has(afterData, key)),
    process: (beforeData) => beforeData,
  },
];

const getTypeAction = (first, second, key) => typeProcesses
  .find(({ check }) => check(first, second, key));

const buildAst = (beforeData, afterData) => {
  const keys = _.union(_.keys(beforeData), _.keys(afterData));
  return keys.map((key) => {
    const { type, content, process } = getTypeAction(beforeData, afterData, key);

    return {
      key,
      type,
      [content]: process(beforeData[key], afterData[key], buildAst),
    };
  });
};

export default buildAst;
