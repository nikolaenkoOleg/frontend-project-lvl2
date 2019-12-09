import _ from 'lodash';

const getNode = (name, beforeValue = '', afterValue = '', children, status) => ({
  name,
  beforeValue,
  afterValue,
  children,
  status,
});

const getSoloNodeAst = (data) => Object.keys(data).map((key) => getNode(key, data[key], '', '', 'unchanged'));

const buildAst = (beforeData, afterData) => {
  const keys = _.union(_.keys(beforeData), _.keys(afterData));

  return keys.map((key) => {
    const beforeValue = beforeData[key];
    const afterValue = afterData[key];

    if (_.has(beforeData, key) && _.has(afterData, key)) {
      if (_.isObject(beforeValue) && _.isObject(afterValue)) {
        return getNode(key, '', '', buildAst(beforeValue, afterValue), 'unchanged');
      }

      if (_.isObject(beforeValue) && !_.isObject(afterValue)) {
        return getNode(key, getSoloNodeAst(beforeValue), afterValue, '', 'edited');
      }

      if (!_.isObject(beforeData[key]) && _.isObject(afterData[key])) {
        return getNode(key, beforeValue, getSoloNodeAst(afterValue), '', 'edited');
      }

      if (beforeValue === afterValue) {
        return getNode(key, beforeData[key], afterData[key], '', 'unchanged');
      }

      return getNode(key, beforeValue, afterValue, '', 'edited');
    }

    if (_.has(beforeData, key) && !_.has(afterData, key)) {
      if (_.isObject(beforeValue)) {
        return getNode(key, getSoloNodeAst(beforeValue), '', '', 'deleted');
      }
      return getNode(key, beforeValue, afterValue, '', 'deleted');
    }

    if (!_.has(beforeData, key) && _.has(afterData, key)) {
      if (_.isObject(afterValue)) {
        return getNode(key, '', getSoloNodeAst(afterValue), '', 'added');
      }
      return getNode(key, beforeValue, afterValue, '', 'added');
    }

    return null;
  });
};

export default buildAst;
