export default (ast) => {
  const parse = (tree) => tree.reduce((acc, {
    key,
    value,
    type,
    children,
  }) => {
    acc[key] = { type, value };

    if (type === 'edited') {
      const [beforeData, afterData] = value;
      acc[key] = { type, value: { before: beforeData, after: afterData } };
    }

    if (type === 'nested') {
      acc[key] = { type, children: parse(children) };
    }

    return acc;
  }, {});

  return JSON.stringify(parse(ast));
};
