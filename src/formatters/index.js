import astBuilder from '../astBuilder';
import plainRender from './plainRender';
import jsonRender from './jsonRender';
import treeRender from './treeRender';
import parse from '../filesParser';

export default (beforePath, afterPath, output) => {
  const { beforeData, afterData } = parse(beforePath, afterPath);
  const ast = astBuilder(beforeData, afterData);
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
