import _ from 'lodash';

const getTabs = (spacesCount) => {
  let tabs = '';
  for (let i = 0; i < spacesCount; i += 1) {
    tabs = tabs.concat(' ');
  }

  return tabs;
};


export default (ast) => {
  const render = (tree, spaces) => tree.reduce((acc, {
    name,
    beforeValue,
    afterValue,
    children,
    status,
  }) => {
    if (children) {
      switch (status) {
        case 'added':
          return [...acc, line]
          `${acc}${getTabs(spaces)}+ ${name}: {\n${render(children, spaces + 4)}${getTabs(spaces + 2)}}\n`;
        case 'deleted':
          return `${acc}${getTabs(spaces)}- ${name}: {\n${render(children, spaces + 4)}${getTabs(spaces + 2)}}\n`;
        case 'unchanged':
          return `${acc}${getTabs(spaces)}  ${name}: {\n${render(children, spaces + 4)}${getTabs(spaces + 2)}}\n`;
        default:
          break;
      }
    }

    switch (status) {
      case 'value type changed':
        if (_.isObject(beforeValue)) {
          return `${acc}${getTabs(spaces)}- ${name}: {\n${render(beforeValue, spaces + 2)}${getTabs(spaces + 2)}}\n${getTabs(spaces)}+ ${name}: ${afterValue}\n`;
        }

        return `${acc}${getTabs(spaces)}- ${name}: ${beforeValue}\n${getTabs(spaces)}+ ${name}: {\n${render(afterValue, spaces + 2)}${getTabs(spaces + 2)}}\n`;
      case 'unchanged':
        return `${acc}${getTabs(spaces)}  ${name}: ${beforeValue}\n`;
      case 'edited':
        return `${acc}${getTabs(spaces)}- ${name}: ${beforeValue}\n${getTabs(spaces)}+ ${name}: ${afterValue}\n`;
      case 'deleted':
        return `${acc}${getTabs(spaces)}- ${name}: ${beforeValue}\n`;
      case 'added':
        return `${acc}${getTabs(spaces)}+ ${name}: ${afterValue}\n`;
      default:
        break;
    }

    return acc;
  }, []);

  const renderActions = [
    {
      check: (status) => status === 'unchanged',
      action: (node, spaces) => `${getTabs(spaces)}  ${node.name}: ${node.afterValue}`,
    },
    {
      check: (status) => status === 'added',
      action: (node, spaces) => `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`,
    },
    {
      check: (status) => status === 'deleted',
      action: (node, spaces) => `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`,
    },
    {
      check: (status) => status === 'edited',
      action: (node, spaces) => {
        const removedData = `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`;
        const addedData = `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`;

        return [removedData, addedData];
      },
    },
    {
      check: (status) => status === 'value type changed',
      action: (node, spaces) => {
        const closingBracket = `${getTabs(spaces + 2)}}`;
        if (_.isObject(node.beforeValue)) {
          const removedName = `${getTabs(spaces)}- ${node.name}: {`;
          const processedChildren = `${render(node.beforeValue, spaces + 2)}`;
          const addedData = `${getTabs(spaces)}+ ${node.name}: ${node.afterValue}`;

          return [removedName, processedChildren, closingBracket, addedData];
        }
        const removedData = `${getTabs(spaces)}- ${node.name}: ${node.beforeValue}`;
        const addedName = `${getTabs(spaces)}+ ${node.name}: {`;
        const processedChildren = `${render(node.afterValue, spaces + 2)}`;

        return [removedData, addedName, processedChildren, closingBracket];
      },
    },
    {
      
    },
  ];


  return `{\n${render(ast, 2)}}`;
};
