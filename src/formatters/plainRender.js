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
      acc.push(render(children, newPath));

      return acc;
    }

    switch (status) {
      case 'value type changed':
        if (typeof afterValue === 'object') {
          acc.push(`Property '${path}${name}' was updated. From ${beforeValue} to [complex value]`);

          return acc;
        }

        acc.push(`Property '${path}${name}' was updated. From [complex value] to ${afterValue}`);

        return acc;
      case 'edited':
        acc.push(`Property '${path}${name}' was updated. From ${beforeValue} to ${afterValue}.`);

        return acc;
      case 'unchanged':
        return acc;
      case 'deleted':
        acc.push(`Property '${path}${name}' was removed.`);

        return acc;
      case 'added':
        if (typeof afterValue === 'object' || children) {
          acc.push(`Property '${path}${name}' was added with value: [complex value].`);

          return acc;
        }
        acc.push(`Property '${path}${name}' was added with value: ${afterValue}.`);

        return acc;
      default:
        break;
    }

    return acc;
  }, []);

  return _.flattenDeep(render(ast, '')).join('\n');
};
