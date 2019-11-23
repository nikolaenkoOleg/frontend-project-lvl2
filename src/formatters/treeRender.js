import _ from 'lodash';

export default (ast) => {
  const getTabs = (spacesCount) => {
    let tabs = '';
    for (let i = 0; i < spacesCount; i += 1) {
      tabs = tabs.concat(' ');
    }

    return tabs;
  };

  const render = (tree, spaces) => {
    console.log('пришло', tree);
    return tree.reduce((acc, {
      name,
      beforeValue,
      afterValue,
      children,
      status,
    }) => {
      // console.log('пришло', children);
      if (children) {
        switch (status) {
          case 'added':
            acc.push(`${getTabs(spaces)}+ ${name}: {`);
            acc.push(`${render(children, spaces + 4).join('')}`);
            acc.push(`${getTabs(spaces + 2)}}`);
            break;
            // return `${getTabs(spaces)}+ ${name}: {${render(children, spaces + 4).join('')}${getTabs(spaces + 2)}}\n`;
          case 'deleted':
            acc.push(`${getTabs(spaces)}- ${name}: {`);
            acc.push(`${render(children, spaces + 4).join('')}`);
            acc.push(`${getTabs(spaces + 2)}}`);
            break;
            // return `${getTabs(spaces)}- ${name}: {\n${render(children, spaces + 4).join('')}${getTabs(spaces + 2)}}\n`;
          case 'unchanged':
            acc.push(`${getTabs(spaces)}  ${name}: {`);
            acc.push(`${render(children, spaces + 4).join('')}`);
            acc.push(`${getTabs(spaces + 2)}}`);
            break;
            // return `${getTabs(spaces)}  ${name}: {\n${render(children, spaces + 4).join('')}${getTabs(spaces + 2)}}\n`;
          default:
            break;
        }
      }

      switch (status) {
        case 'value type changed':
          if (_.isObject(beforeValue)) {
            acc.push(`${getTabs(spaces)}- ${name}: {`);
            acc.push(`${render(beforeValue, spaces + 2)}`);
            acc.push(`${getTabs(spaces + 2)}}`);
            acc.push(`${getTabs(spaces)}+ ${name}: ${afterValue}`);
            // return `${getTabs(spaces)}- ${name}: {\n${render(beforeValue, spaces + 2)}${getTabs(spaces + 2)}}\n${getTabs(spaces)}+ ${name}: ${afterValue}\n`;
          }

          acc.push(`${getTabs(spaces)}- ${name}: ${beforeValue}`);
          acc.push(`${getTabs(spaces)}+ ${name}: {`);
          acc.push(`${render(afterValue, spaces + 2)}`);
          acc.push(`${getTabs(spaces + 2)}}`);
          break;
          // return `${getTabs(spaces)}- ${name}: ${beforeValue}\n${getTabs(spaces)}+ ${name}: {\n${render(afterValue, spaces + 2)}${getTabs(spaces + 2)}}\n`;
        case 'unchanged':
          acc.push(`${getTabs(spaces)}  ${name}: ${beforeValue}`);
          break;
          // return `${getTabs(spaces)}  ${name}: ${beforeValue}\n`;
        case 'edited':
          acc.push(`${getTabs(spaces)}- ${name}: ${beforeValue}`);
          acc.push(`${getTabs(spaces)}+ ${name}: ${afterValue}`);
          break;
          // return `${getTabs(spaces)}- ${name}: ${beforeValue}\n${getTabs(spaces)}+ ${name}: ${afterValue}\n`;
        case 'deleted':
          acc.push(`${getTabs(spaces)}- ${name}: ${beforeValue}`);
          break;
          // return `${getTabs(spaces)}- ${name}: ${beforeValue}\n`;
        case 'added':
          acc.push(`${getTabs(spaces)}+ ${name}: ${afterValue}`);
          break;
          // return `${getTabs(spaces)}+ ${name}: ${afterValue}\n`;
        default:
          break;
      }
      acc.push('}');

      return acc;
    }, ['{']);

  };
  const result = render(ast, 2).join('\n');
  console.log(result);
  // return (`{\n${result}}`);
};