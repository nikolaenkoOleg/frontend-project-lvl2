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
        if (_.isObject(value[0])) {
          return [...acc, `Property '${path}${key}' was updated. From [complex value] to ${value[1]}`];
        }

        if (_.isObject(value[1])) {
          return [...acc, `Property '${path}${key}' was updated. From ${value[0]} to [complex value]`];
        }

        return [...acc, `Property '${path}${key}' was updated. From ${value[0]} to ${value[1]}.`];
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
