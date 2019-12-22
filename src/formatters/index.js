import astBuilder from '../astBuilder';
import plainRender from './plainRender';
import jsonRender from './jsonRender';
import treeRender from './treeRender';
import parse from '..';

export default (beforePath, afterPath, output) => {
  const { beforeData, afterData } = parse(beforePath, afterPath);
  const ast = astBuilder(beforeData, afterData);
  console.log(ast[ast.length - 1]);
  switch (output) {
    case 'plain':
      return plainRender(ast);
    case 'json':
      return jsonRender(ast);
    case 'tree':
      return treeRender(ast);
    default:
      return null;
  }
};
