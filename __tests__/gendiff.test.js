import fs from 'fs';
import compare from '../src/compare';

const result = `
{
   host: hexlet.io
 + timeout: 20
 - timeout: 50
 - proxy: 123.234.53.22
 - follow: false
 + verbose: true
}`;
test('compare 2 plain json', () => {
  // const path = '__fixtures__/compare.result.json';
  // const result = fs.readFileSync(path).toString();
  expect(compare('./json/before.json', './json/after.json')).toBe(result.trim());
});
