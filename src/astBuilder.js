import _ from 'lodash';

const typeProcesses = [
  {
    type: 'children',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] instanceof Object && afterData[key] instanceof Object),
    process: (beforeData, afterData, func) => func(beforeData, afterData),
  },
  {
    type: 'unchanged',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] === afterData[key]),
    process: (beforeData) => beforeData,
  },
  {
    type: 'edited',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] !== afterData[key]),
    process: (beforeData, afterData) => ({ before: beforeData, after: afterData }),
  },
  {
    type: 'added',
    check: (beforeData, afterData, key) => (!_.has(beforeData, key) && _.has(afterData, key)),
    process: (_beforeData, afterData) => afterData,
  },
  {
    type: 'deleted',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && !_.has(afterData, key)),
    process: (beforeData) => beforeData,
  },
];

const getTypeAction = (first, second, key) => typeProcesses
  .find(({ check }) => check(first, second, key));

const buildAst = (beforeData, afterData) => {
  const keys = _.union(_.keys(beforeData), _.keys(afterData));

  return keys.map((key) => {
    const { type, process } = getTypeAction(beforeData, afterData, key);
    const value = process(beforeData[key], afterData[key], buildAst);

    return value instanceof Array ? { key, children: value, type } : { key, value, type };
  });
};

export default buildAst;
