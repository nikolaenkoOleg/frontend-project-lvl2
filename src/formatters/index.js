import astBuilder from '../astBuilder';
import plainRender from './plainRender';
import jsonRender from './jsonRender';
import treeRender from './treeRender';
import parse from '..';

const render = {
  plain: plainRender,
  json: jsonRender,
  tree: treeRender,
};

export default (beforePath, afterPath, output) => {
  const { beforeData, afterData } = parse(beforePath, afterPath);
  const ast = astBuilder(beforeData, afterData);
  const diff = render[output](ast);

  return diff;
};
