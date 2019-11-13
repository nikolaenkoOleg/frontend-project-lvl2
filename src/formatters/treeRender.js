import _ from 'lodash';

export default (ast) => {
  // const quote = /"/g;
  // const comma = /,/g;

  // return ast.replace(quote, '').replace(comma, '');

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
          acc.concat(acc + '+ ' + name + ':' + '{\n' + render(children) + '\n}');
          return acc;
        case 'deleted':
          acc.concat(acc +  '- ' + name + ':' + '{\n' + render(children) + '\n}');
          return acc;
        case 'unchanged':
          acc.concat(acc +  '  ' + name + ':' + '{\n' + render(children) + '\n}');
          return acc;
        default:
          break;
      }
    }

    switch (status) {
      case 'value type changed':
        if (_.isObject(beforeValue)) {
          acc.concat(acc +  '- ' + name + ':' + '{\n' + render(beforeValue) + '\n}');
          acc.concat(acc +  '+ ' + name + ':' + afterValue);
          console.log(acc);

          return acc;
        }

        acc.concat(acc + '- ' + name + ':' + beforeValue);
        acc.concat(acc + '+ ' + name + ':' + '{\n' + render(afterValue) + '\n}');
        console.log(acc);

        return acc;
      case 'unchanged':
        acc.concat(acc +  '  ' + name + ':' + beforeValue);
        console.log(acc);

        return acc;
      case 'edited':
        acc.concat(acc + '- ' + name + ':' + beforeValue);
        acc.concat(acc + '+ ' + name + ':' + afterValue);
        console.log(acc);

        return acc;
      case 'deleted':
        acc.concat(acc + '- ' + name + ':' + beforeValue);
        console.log(acc);

        return acc;
      case 'added':
        acc.concat(acc + '+ ' + name + ':' + afterValue);
        console.log(acc);

        return acc;
      default:
        break;
    }

    return acc;
  }, '');

  console.log(render(ast));
};

// const hello = 'Привет, ';
// const five = '5';
// console.log(hello.concat('Кевин, удачного дня ' + five + ' раз'));