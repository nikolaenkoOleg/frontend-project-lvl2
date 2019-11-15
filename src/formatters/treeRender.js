import _ from 'lodash';

export default (ast) => {
  const getTabs = (spacesCount) => {
    let tabs = '';
    for (let i = 0; i < spacesCount; i += 1) {
      tabs = tabs.concat(' ');
    }

    return tabs;
  };

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
          return `${acc}${getTabs(spaces)}+ ${name}: {\n${render(children, spaces + 4)}${getTabs(spaces + 2)}}\n`;
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
  }, '');

  return `{\n${render(ast, 2)}}`;
};
