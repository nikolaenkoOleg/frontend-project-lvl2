import astBuilder from '../astBuilder';
import plainRender from './plainRender';
import jsonRender from './jsonRender';
import treeRender from './treeRender';

const render = {
  plain: plainRender,
  json: jsonRender,
  tree: treeRender,
};

export default (beforeData, afterData, output) => {
  const ast = astBuilder(beforeData, afterData);
  const diff = render[output](ast);

  return diff;
};
