import astBuilder from '../astBuilder';
import plainRender from './plainRender';
import jsonRender from './jsonRender';
import treeRender from './treeRender';
import parse from '../filesParser';

export default (beforePath, afterPath, output) => {
  const { before, after } = parse(beforePath, afterPath);
  const ast = astBuilder(before, after);
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
