import _ from 'lodash';

const getTabs = (spacesCount) => {
  let tabs = '';
  for (let i = 0; i < spacesCount; i += 1) {
    tabs = tabs.concat(' ');
  }

  return tabs;
};

const getProcessedValue = (data, spaces, acc) => {
  const keys = Object.keys(data);

  return keys.map((key) => {
    const value = data[key];
    if (_.isPlainObject(value)) {
      return getProcessedValue(data[key], spaces + 2, acc);
    }

    return [...acc, `${getTabs(spaces)}  ${key}: ${value}`];
  });
};


const stringify = (data, key, spaces, sign) => {
  if (_.isPlainObject(data)) {
    const name = `${getTabs(spaces)}${sign}${key}: {`;
    const value = getProcessedValue(data, spaces + 4, '');
    const bracket = `${getTabs(spaces + 2)}}`;

    return [name, value, bracket];
  }

  return `${getTabs(spaces)}${sign}${key}: ${data}`;
};

const rendering = {
  unchanged: (node, _render, spaces) => stringify(node.value, node.key, spaces, '  '),
  added: (node, _render, spaces) => stringify(node.value, node.key, spaces, '+ '),
  deleted: (node, _render, spaces) => stringify(node.value, node.key, spaces, '- '),
  nested: (node, render, spaces) => {
    const key = `${getTabs(spaces)}  ${node.key}: {`;
    const data = render(node.children, spaces + 4);
    const closingBracket = `${getTabs(spaces + 2)}}`;

    return [key, data, closingBracket];
  },
  edited: (node, _render, spaces) => {
    const { key, value } = node;
    const deletedData = stringify(value.before, key, spaces, '- ');
    const addedData = stringify(value.after, key, spaces, '+ ');

    return [deletedData, addedData];
  },
};

export default (ast) => {
  const render = (tree, spaces) => tree.reduce((acc, node) => {
    const value = rendering[node.type](node, render, spaces);

    return [...acc, value];
  }, []);

  const tree = ['{', ...render(ast, 2), '}'];
  const result = _.flattenDeep(tree).join('\n');

  return result;
};
