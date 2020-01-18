import _ from 'lodash';

const getPath = (path, name) => `${path}${name}.`;

const processValue = (value) => (_.isPlainObject(value) ? '[complex value]' : value);

const mapping = {
  nested: (node, render, path) => render(node.children, getPath(path, node.key)),
  edited: (node, _render, path) => {
    const oldValue = processValue(node.oldValue);
    const newValue = processValue(node.newValue);

    return `Property '${path}${node.key}' was updated. From ${oldValue} to ${newValue}`;
  },
  deleted: (node, _render, path) => `Property '${path}${node.key}' was removed`,
  added: (node, _render, path) => {
    const value = processValue(node.value);

    return `Property '${path}${node.key}' was added with value: ${value}`;
  },
  unchanged: () => null,
};

export default (ast) => {
  const render = (tree, path) => {
    const list = tree.map((node) => mapping[node.type](node, render, path));
    const result = _.flattenDeep(list)
      .filter((element) => element !== null)
      .join('\n');

    return result;
  };

  return render(ast, '');
};
