import _ from 'lodash';

const getTabs = (spacesCount) => {
  let tabs = '';
  for (let i = 0; i < spacesCount; i += 1) {
    tabs = tabs.concat(' ');
  }

  return tabs;
};

const rendering = {
  unchanged: (node, render, spaces) => {
    if (_.isObject(node.children)) {
      const name = `${getTabs(spaces)}  ${node.name}: {`;
      const processedChildren = render(node.children, spaces + 4);
      const closingBracket = `${getTabs(spaces + 2)}}`;

      return [name, processedChildren, closingBracket];
    }
    return `${getTabs(spaces)}  ${node.name}: ${node.beforeValue}`;
  },
  added: (node, render, spaces) => {
    if (_.isObject(node.afterValue)) {
      const addedKey = `${getTabs(spaces)}+ ${node.name}: {`;
      const addedData = render(node.afterValue, spaces + 4);
      const closingBracket = `${getTabs(spaces + 2)}}`;

      return [addedKey, addedData, closingBracket];
    }
    return `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`;
  },
  deleted: (node, render, spaces) => {
    if (_.isObject(node.beforeValue)) {
      const deletedKey = `${getTabs(spaces)}- ${node.name}: {`;
      const deletedData = render(node.beforeValue, spaces + 4);
      const closingBracket = `${getTabs(spaces + 2)}}`;

      return [deletedKey, deletedData, closingBracket];
    }
    return `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`;
  },
  edited: (node, render, spaces) => {
    const closingBracket = `${getTabs(spaces + 2)}}`;

    if (_.isObject(node.beforeValue)) {
      const deletedKey = `${getTabs(spaces)}- ${node.name}: {`;
      const deletedData = render(node.beforeValue, spaces + 4);
      const addedData = `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`;

      return [deletedKey, deletedData, addedData, closingBracket];
    }

    if (_.isObject(node.afterValue)) {
      const beforeData = `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`;
      const addedKey = `${getTabs(spaces)}+ ${node.name}: {`;
      const addedData = render(node.afterValue, spaces + 4);

      return [beforeData, addedKey, addedData, closingBracket];
    }

    const deletedData = `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`;
    const addedData = `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`;

    return [deletedData, addedData];
  },
};

export default (ast) => {
  const render = (tree, spaces) => tree.reduce((acc, node) => {
    const lines = rendering[node.status](node, render, spaces);

    return [...acc, lines];
  }, []);

  const tree = ['{', ...render(ast, 2), '}'];
  const result = _.flattenDeep(tree).join('\n');

  return result;
};
