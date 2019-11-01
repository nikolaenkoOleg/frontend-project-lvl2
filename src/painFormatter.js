// # Данный вывод просто пример, он не является отражением данных из других шагов
// $ gendiff --format plain before.json after.json

// # В коде этот вызов выглядит так: genDiff(path1, path2, format)

// Property 'timeout' was updated. From 50 to 20
// Property 'proxy' was removed
// Property 'common.setting4' was removed
// Property 'common.setting5' was removed
// Property 'common.setting2' was added with value: 200
// Property 'common.setting6.ops' was added with value: 'vops'
// Property 'common.sites' was added with value: 'hexlet.io'
// Property 'group1.baz' was updated. From 'bars' to 'bas'
// Property 'group3' was removed
// Property 'verbose' was added with value: true
// Property 'group2' was added with value: [complex value]

// const findFilesByName = (node, substr) => {
//   const iter = (currentNode, pathToFile, acc) => {
//     const newPathToFile = path.join(pathToFile, currentNode.name);

//     if (currentNode.type === 'file') {
//       return currentNode.name.includes(substr) ? [...acc, newPathToFile] : acc;
//     }

//     return currentNode.children.reduce((newAcc, child) => iter(child, newPathToFile, newAcc), acc);
//   };

//   return iter(node, '', []);
// };

// export default findFilesByName;

export default (ast) => {
  const render = (tree, path) => {
    console.log('приход', tree);
    return tree.reduce((acc, {
      name,
      beforeValue,
      afterValue,
      children,
      status,
    }) => {
      path.push(name);

      if (children) {
        console.log('то, что передаем', children);
        acc.push(render(children, path));
        return acc;
      }

      switch (status) {
        case 'edited':
          acc.push(`Property '${path.join('.')}' was updated. From ${beforeValue} to ${afterValue}.`);
          return acc;
        case 'unchanged':
          return acc;
        case 'deleted':
          acc.push(`Property '${path.join('.')}' was removed.`);
          return acc;
        case 'added':
          acc.push(`Property '${path.join('.')}' was added with value: ${typeof afterValue === 'object' ? '[complex value]' : afterValue}.`);
          return acc;
        default:
          break;
      }

      return acc;
    }, []);
  };

  console.log(render(ast, []));
};
