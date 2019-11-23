import _ from 'lodash';

export default (ast) => {
  const getPath = (path, name) => `${path}${name}.`;

  const render = (tree, path) => tree.reduce((acc, {
    name,
    beforeValue,
    afterValue,
    children,
    status,
  }) => {
    if (children.length > 1) {
      const newPath = getPath(path, name);

      return [...acc, render(children, newPath)];
    }

    switch (status) {
      case 'value type changed':
        if (typeof afterValue === 'object') {
          return [...acc, `Property '${path}${name}' was updated. From ${beforeValue} to [complex value]`];
        }

        return [...acc, `Property '${path}${name}' was updated. From [complex value] to ${afterValue}`];
      case 'edited':
        return [...acc, `Property '${path}${name}' was updated. From ${beforeValue} to ${afterValue}.`];
      case 'unchanged':
        return acc;
      case 'deleted':
        return [...acc, `Property '${path}${name}' was removed.`];
      case 'added':
        if (typeof afterValue === 'object' || children) {
          return [...acc, `Property '${path}${name}' was added with value: [complex value].`];
        }

        return [...acc, `Property '${path}${name}' was added with value: ${afterValue}.`];
      default:
        break;
    }

    return acc;
  }, []);

  return _.flattenDeep(render(ast, '')).join('\n');
};
