const getkey = (name, sign) => {
  switch (sign) {
    case 'added':
      return `+ ${name}`;
    case 'deleted':
      return `- ${name}`;
    case 'unchanged':
      return `  ${name}`;
    default:
      return null;
  }
};

const getRenderedAst = (ast) => {
  const render = (tree) => tree.reduce((acc, {
    name,
    beforeValue,
    afterValue,
    children,
    status,
  }) => {
    if (children) {
      switch (status) {
        case 'added':
          acc[getkey(name, 'added')] = render(children);
          return acc;
        case 'deleted':
          acc[getkey(name, 'deleted')] = render(children);
          return acc;
        case 'unchanged':
          acc[getkey(name, 'unchanged')] = render(children);
          return acc;
        default:
          break;
      }
    }

    switch (status) {
      case 'value type changed':
        if (typeof beforeValue === 'object') {
          acc[getkey(name, 'deleted')] = render(beforeValue);
          acc[getkey(name, 'added')] = afterValue;

          return acc;
        }

        acc[getkey(name, 'deleted')] = beforeValue;
        acc[getkey(name, 'added')] = render(afterValue);

        return acc;
      case 'unchanged':
        acc[getkey(name, 'unchanged')] = beforeValue;

        return acc;
      case 'edited':
        acc[getkey(name, 'deleted')] = beforeValue;
        acc[getkey(name, 'added')] = afterValue;

        return acc;
      case 'deleted':
        acc[getkey(name, 'deleted')] = beforeValue;

        return acc;
      case 'added':
        acc[getkey(name, 'added')] = afterValue;

        return acc;
      default:
        break;
    }

    return acc;
  }, {});

  const quote = /"/g;
  const comma = /,/g;
  const renderedAst = render(ast);
  const result = JSON.stringify(renderedAst, null, 2).replace(quote, '').replace(comma, '');

  return result;
};

export default getRenderedAst;
