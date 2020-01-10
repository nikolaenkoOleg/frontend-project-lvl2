export default (ast) => {
  const parse = (tree) => tree.reduce((acc, {
    key,
    value,
    type,
    children,
    oldValue,
    newValue,
  }) => {
    switch (type) {
      case 'edited':
        acc[key] = { type, oldValue, newValue };
        return acc;
      case 'nested':
        acc[key] = { type, children: parse(children) };
        return acc;
      default:
        acc[key] = { type, value };
        return acc;
    }
  }, {});

  return JSON.stringify(parse(ast));
};
