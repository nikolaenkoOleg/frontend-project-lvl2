export default (ast) => {
  const parse = (tree) => tree.reduce((acc, {
    key,
    value,
    type,
    children,
  }) => {
    acc[key] = { value: type === 'children' ? parse(children) : value, type };

    return acc;
  }, {});

  return JSON.stringify(parse(ast));
};
