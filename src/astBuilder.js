import _ from 'lodash';

const typeProcesses = [
  {
    type: 'nested',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] instanceof Object && afterData[key] instanceof Object),
    process: (beforeData, afterData, func) => ({ value: '', children: func(beforeData, afterData) }),
  },
  {
    type: 'unchanged',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] === afterData[key]),
    process: (beforeData) => ({ value: beforeData, children: '' }),
  },
  {
    type: 'edited',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && _.has(afterData, key)
      && beforeData[key] !== afterData[key]),
    process: (beforeData, afterData) => ({ value: { before: beforeData, after: afterData }, children: '' }),
  },
  {
    type: 'added',
    check: (beforeData, afterData, key) => (!_.has(beforeData, key) && _.has(afterData, key)),
    process: (_beforeData, afterData) => ({ value: afterData, children: '' }),
  },
  {
    type: 'deleted',
    check: (beforeData, afterData, key) => (_.has(beforeData, key) && !_.has(afterData, key)),
    process: (beforeData) => ({ value: beforeData, children: '' }),
  },
];

const getTypeAction = (first, second, key) => typeProcesses
  .find(({ check }) => check(first, second, key));

const buildAst = (beforeData, afterData) => {
  const keys = _.union(_.keys(beforeData), _.keys(afterData));
  return keys.map((key) => {
    const { type, process } = getTypeAction(beforeData, afterData, key);
    const { value, children } = process(beforeData[key], afterData[key], buildAst);

    return {
      key,
      value,
      type,
      children,
    };
  });
};

export default buildAst;
