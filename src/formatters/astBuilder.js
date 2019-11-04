import _ from 'lodash';

const getNode = (name, beforeValue = '', afterValue = '', children = '', status) => ({
  name,
  beforeValue,
  afterValue,
  children,
  status,
});

const getSoloAst = (data) => Object.keys(data).map((key) => getNode(key, data[key], '', '', 'unchanged'));

const buildAst = (before = {}, after = {}) => {
  const keys = Object.keys(before).concat(Object.keys(after));
  const filteredKeys = _.uniqWith(keys, _.isEqual).sort();

  return filteredKeys.map((key) => {
    if (_.has(before, key) && _.has(after, key)) {
      if (typeof before[key] === 'object' && typeof after[key] === 'object') {
        return getNode(key, '', '', buildAst(before[key], after[key]), 'unchanged');
      }

      if (typeof before[key] === 'object' && typeof after[key] !== 'object') {
        return getNode(key, getSoloAst(before[key]), after[key], '', 'value type changed');
      }

      if (typeof before[key] !== 'object' && typeof after[key] === 'object') {
        return getNode(key, before[key], getSoloAst(after[key]), '', 'value type changed');
      }

      if (before[key] === after[key]) {
        return getNode(key, before[key], after[key], '', 'unchanged');
      }

      return getNode(key, before[key], after[key], '', 'edited');
    }

    if (_.has(before, key) && !_.has(after, key)) {
      if (typeof before[key] === 'object') {
        return getNode(key, '', '', getSoloAst(before[key]), 'deleted');
      }
      return getNode(key, before[key], after[key], '', 'deleted');
    }

    if (!_.has(before, key) && _.has(after, key)) {
      if (typeof after[key] === 'object') {
        return getNode(key, '', '', getSoloAst(after[key]), 'added');
      }
      return getNode(key, before[key], after[key], '', 'added');
    }

    return null;
  });
};

export default buildAst;
