import _ from 'lodash';
import formatter from './painFormatter';

const getNode = (name, beforeValue = '', afterValue = '', children = '', status) => ({
  name,
  beforeValue,
  afterValue,
  children,
  status,
});

const getSoloAst = (data) => Object.keys(data).map((key) => getNode(key, data[key], '', '', 'unchanged'));

export default (beforeData, afterData, format) => {
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

  const getkey = (name, sign) => {
    switch (sign) {
      case 'added':
        return `+ ${name}`;
      case 'deleted':
        return `- ${name}`;
      case 'unchanged':
        return `  ${name}`;
      default:
        return null;
    }
  };

  const render = (ast) => ast.reduce((acc, {
    name,
    beforeValue,
    afterValue,
    children,
    status,
  }) => {
    if (children) {
      switch (status) {
        case 'added':
          acc[getkey(name, 'added')] = render(children);
          return acc;
        case 'deleted':
          acc[getkey(name, 'deleted')] = render(children);
          return acc;
        case 'unchanged':
          acc[getkey(name, 'unchanged')] = render(children);
          return acc;
        default:
          break;
      }
    }

    switch (status) {
      case 'value type changed':
        if (typeof beforeValue === 'object') {
          acc[getkey(name, 'deleted')] = render(beforeValue);
          acc[getkey(name, 'added')] = afterValue;

          return acc;
        }

        acc[getkey(name, 'deleted')] = beforeValue;
        acc[getkey(name, 'added')] = render(afterValue);

        return acc;
      case 'unchanged':
        acc[getkey(name, 'unchanged')] = beforeValue;

        return acc;
      case 'edited':
        acc[getkey(name, 'deleted')] = beforeValue;
        acc[getkey(name, 'added')] = afterValue;

        return acc;
      case 'deleted':
        acc[getkey(name, 'deleted')] = beforeValue;

        return acc;
      case 'added':
        acc[getkey(name, 'added')] = afterValue;

        return acc;
      default:
        break;
    }

    return acc;
  }, {});

  const ast = buildAst(beforeData, afterData);

  if (format) {
    return formatter(ast);
  }

  const rendered = render(ast);
  const quote = /"/g;
  const dot = /,/g;

  const result = JSON.stringify(rendered, null, 2).replace(quote, '').replace(dot, '');

  return result;
};
