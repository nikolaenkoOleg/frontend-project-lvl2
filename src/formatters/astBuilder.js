import _ from 'lodash';

const getNode = (name, beforeValue = '', afterValue = '', children = '', status) => ({
  name,
  beforeValue,
  afterValue,
  children,
  status,
});

const getSoloNodeAst = (data) => Object.keys(data).map((key) => getNode(key, data[key], '', '', 'unchanged'));


const buildAst = (beforeData, afterData) => {
  const keys = Object.keys(beforeData).concat(Object.keys(afterData));
  const filteredKeys = _.uniqWith(keys, _.isEqual).sort();

  return filteredKeys.map((key) => {
    if (_.has(beforeData, key) && _.has(afterData, key)) {
      if (_.isObject(beforeData[key]) && _.isObject(afterData[key])) {
        return getNode(key, '', '', buildAst(beforeData[key], afterData[key]), 'unchanged');
      }

      if (_.isObject(beforeData[key]) && !_.isObject(afterData[key])) {
        return getNode(key, getSoloNodeAst(beforeData[key]), afterData[key], '', 'value type changed');
      }

      if (!_.isObject(beforeData[key]) && _.isObject(afterData[key])) {
        return getNode(key, beforeData[key], getSoloNodeAst(afterData[key]), '', 'value type changed');
      }

      if (beforeData[key] === afterData[key]) {
        return getNode(key, beforeData[key], afterData[key], '', 'unchanged');
      }

      return getNode(key, beforeData[key], afterData[key], '', 'edited');
    }

    if (_.has(beforeData, key) && !_.has(afterData, key)) {
      if (_.isObject(beforeData[key])) {
        return getNode(key, '', '', getSoloNodeAst(beforeData[key]), 'deleted');
      }
      return getNode(key, beforeData[key], afterData[key], '', 'deleted');
    }

    if (!_.has(beforeData, key) && _.has(afterData, key)) {
      if (_.isObject(afterData[key])) {
        return getNode(key, '', '', getSoloNodeAst(afterData[key]), 'added');
      }
      return getNode(key, beforeData[key], afterData[key], '', 'added');
    }

    return null;
  });
};

export default buildAst;
