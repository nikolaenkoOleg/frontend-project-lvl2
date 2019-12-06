import _ from 'lodash';

const getkey = (name, sign) => {
  switch (sign) {
    case 'added':
      return `+ ${name}`;
    case 'deleted':
      return `- ${name}`;
    case 'unchanged':
      return `${name}`;
    default:
      return null;
  }
};

const getJsonFromAst = (ast) => {
  const render = (tree) => tree.reduce((acc, {
    name,
    beforeValue,
    afterValue,
    children,
    status,
  }) => {
    if (_.isObject(children)) {
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
      case 'unchanged':
        acc[getkey(name, 'unchanged')] = beforeValue;
        return acc;
      case 'edited':
        if (_.isObject(beforeValue)) {
          acc[getkey(name, 'deleted')] = render(beforeValue);
          acc[getkey(name, 'added')] = afterValue;
          return acc;
        }

        if (_.isObject(afterValue)) {
          acc[getkey(name, 'deleted')] = beforeValue;
          acc[getkey(name, 'added')] = render(afterValue);
          return acc;
        }
        acc[getkey(name, 'deleted')] = beforeValue;
        acc[getkey(name, 'added')] = afterValue;
        return acc;
      case 'deleted':
        if (_.isObject(beforeValue)) {
          acc[getkey(name, 'deleted')] = render(beforeValue);
          return acc;
        }
        acc[getkey(name, 'deleted')] = beforeValue;
        return acc;
      case 'added':
        if (_.isObject(afterValue)) {
          acc[getkey(name, 'added')] = render(afterValue);
          return acc;
        }
        acc[getkey(name, 'added')] = afterValue;
        return acc;
      default:
        break;
    }

    return acc;
  }, {});


  return JSON.stringify(render(ast));
};

export default getJsonFromAst;
