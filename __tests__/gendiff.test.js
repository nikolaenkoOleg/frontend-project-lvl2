import fs from 'fs';
import path from 'path';
import compareFiles from '../src/index';

const getFilePath = (fileName) => path.join(__dirname, `../__fixtures__/${fileName}`);

const getDiff = (fileType, format, output = 'default') => {
  const beforeValuePath = getFilePath(`${fileType}/before.${format}`);
  const afterValuePath = getFilePath(`${fileType}/after.${format}`);

  const diffFile = compareFiles(beforeValuePath, afterValuePath, output).replace(/\s/g, '');

  return diffFile;
};

const getResult = (fileType) => {
  const resultValuePath = getFilePath(`${fileType}-result.txt`);
  const result = fs.readFileSync(resultValuePath, 'utf-8').toString().replace(/\s/g, '');

  return result;
};

test.each([
  ['linear', 'json', 'default', getResult('linear')],
  ['tree', 'json', 'default', getResult('tree')],
  ['tree', 'json', 'plain', getResult('plain')],
  ['tree', 'json', 'json', getResult('json')],
])('json (input: %s, format: %s, output: %s)', (type, format, output, expected) => {
  expect(getDiff(type, format, output)).toBe(expected);
});

test.each([
  ['linear', 'yaml', 'default', getResult('linear')],
  ['tree', 'yaml', 'default', getResult('tree')],
  ['tree', 'yaml', 'plain', getResult('plain')],
  ['tree', 'yaml', 'json', getResult('json')],
])('yaml (input: %s, format: %s, output: %s)', (type, format, output, expected) => {
  expect(getDiff(type, format, output)).toBe(expected);
});

test.each([
  ['linear', 'ini', 'default', getResult('linear')],
  ['tree', 'ini', 'default', getResult('tree')],
  ['tree', 'ini', 'plain', getResult('plain')],
  ['tree', 'ini', 'json', getResult('json')],
])('ini (input: %s, format: %s, output: %s)', (type, format, output, expected) => {
  expect(getDiff(type, format, output)).toBe(expected);
});
