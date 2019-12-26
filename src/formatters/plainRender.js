import _ from 'lodash';

const getPath = (path, name) => `${path}${name}.`;

export default (ast) => {
  const render = (tree, path) => tree.reduce((acc, {
    key,
    value,
    type,
    children,
  }) => {
    if (type === 'nested') {
      return [...acc, render(children, getPath(path, key))];
    }

    switch (type) {
      case 'edited':
        if (_.isObject(value.before)) {
          return [...acc, `Property '${path}${key}' was updated. From [complex value] to ${value.after}`];
        }

        if (_.isObject(value.after)) {
          return [...acc, `Property '${path}${key}' was updated. From ${value.before} to [complex value]`];
        }

        return [...acc, `Property '${path}${key}' was updated. From ${value.before} to ${value.after}.`];
      case 'unchanged':
        return acc;
      case 'deleted':
        return [...acc, `Property '${path}${key}' was removed.`];
      case 'added':
        if (_.isPlainObject(value)) {
          return [...acc, `Property '${path}${key}' was added with value: [complex value].`];
        }

        return [...acc, `Property '${path}${key}' was added with value: ${value}.`];
      default:
        return acc;
    }
  }, []);

  return _.flattenDeep(render(ast, '')).join('\n');
};
