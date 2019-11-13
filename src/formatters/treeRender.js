export default (ast) => {
  const quote = /"/g;
  const comma = /,/g;

  return ast.replace(quote, '').replace(comma, '');
};
