import _ from 'lodash';

const getTabs = (spacesCount) => {
  let tabs = '';
  for (let i = 0; i < spacesCount; i += 1) {
    tabs = tabs.concat(' ');
  }

  return tabs;
};

const renderActions = [
  {
    check: (status) => status === 'unchanged',
    renderAction: (node, render, spaces) => {
      if (node.children) {
        const name = `${getTabs(spaces)}  ${node.name}: {`;
        const processedChildren = render(node.children, spaces + 4);
        const closingBracket = `${getTabs(spaces + 2)}}`;

        return [name, processedChildren, closingBracket];
      }
      return `${getTabs(spaces)}  ${node.name}: ${node.beforeValue}`;
    },
  },
  {
    check: (status) => status === 'added',
    renderAction: (node, render, spaces) => {
      if (node.children) {
        const name = `${getTabs(spaces)}+ ${node.name}: {`;
        const processedChildren = render(node.children, spaces + 4);
        const closingBracket = `${getTabs(spaces + 2)}}`;

        return [name, processedChildren, closingBracket];
      }
      return `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`;
    },
  },
  {
    check: (status) => status === 'deleted',
    renderAction: (node, render, spaces) => {
      if (node.children) {
        const name = `${getTabs(spaces)}- ${node.name}: {`;
        const processedChildren = render(node.children, spaces + 4);
        const closingBracket = `${getTabs(spaces + 2)}}`;

        return [name, processedChildren, closingBracket];
      }
      return `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`;
    },
  },
  {
    check: (status) => status === 'edited',
    renderAction: (node, render, spaces) => {
      const removedData = `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`;
      const addedData = `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`;

      return [removedData, addedData];
    },
  },
  {
    check: (status) => status === 'value type changed',
    renderAction: (node, render, spaces) => {
      const closingBracket = `${getTabs(spaces + 2)}}`;
      if (_.isObject(node.beforeValue)) {
        const removedName = `${getTabs(spaces)}- ${node.name}: {`;
        const processedChildren = render(node.beforeValue, spaces + 4);
        const addedData = `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`;

        return [removedName, processedChildren, closingBracket, addedData];
      }
      const removedData = `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`;
      const addedName = `${getTabs(spaces)}+ ${node.name}: {`;
      const processedChildren = render(node.afterValue, spaces + 4);

      return [removedData, addedName, processedChildren, closingBracket];
    },
  },
];

const getRenderAction = (status) => renderActions.find(({ check }) => check(status));

export default (ast) => {
  const render = (tree, spaces) => tree.reduce((acc, node) => {
    const { renderAction } = getRenderAction(node.status);
    const lines = renderAction(node, render, spaces);

    return [...acc, lines];
  }, []);

  const tree = [...'{', ...render(ast, 2), ...'}'];
  const result = _.flattenDeep(tree).join('\n');

  return result;
};
