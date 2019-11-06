export default (ast) => {
  const quote = /"/g;
  const comma = /,/g;
  const result = ast.replace(quote, '').replace(comma, '');

  return result;
};
