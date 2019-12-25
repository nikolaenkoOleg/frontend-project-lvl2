export default (ast) => {
  const parse = (tree) => tree.reduce((acc, {
    key,
    value,
    type,
  }) => {
    acc[key] = { value: type === 'children' ? parse(value) : value, type };

    return acc;
  }, {});

  return JSON.stringify(parse(ast));
};
