import fs from 'fs';
import path from 'path';
import compareFiles from '../src/extensionManager';

const pathToLinearResult = path.resolve('__tests__/__fixtures__/linear-result.txt');
const pathToPlainResult = path.resolve('__tests__/__fixtures__/plain-result.txt');
const pathToTreeResult = path.resolve('__tests__/__fixtures__/tree-result.txt');
const pathToJsonResult = path.resolve('__tests__/__fixtures__/json-result.json');

const linearResult = fs.readFileSync(pathToLinearResult).toString().replace(/\s/g, '');
const plainResult = fs.readFileSync(pathToPlainResult).toString().replace(/\s/g, '');
const treeResult = fs.readFileSync(pathToTreeResult).toString().replace(/\s/g, '');
const jsonResult = fs.readFileSync(pathToJsonResult).toString().replace(/\s/g, '');

const plainBefore = path.resolve('__tests__/__fixtures__/linear/before');
const plainAfter = path.resolve('__tests__/__fixtures__/linear/after');

const treeBefore = path.resolve('__tests__/__fixtures__/tree/before');
const treeAfter = path.resolve('__tests__/__fixtures__/tree/after');

test('compare 2 json with plain, tree, linear and json output', () => {
  expect(compareFiles(`${plainBefore}.json`, `${plainAfter}.json`).replace(/\s/g, '')).toBe(linearResult);
  expect(compareFiles(`${treeBefore}.json`, `${treeAfter}.json`).replace(/\s/g, '')).toBe(treeResult);
  expect(compareFiles(`${treeBefore}.json`, `${treeAfter}.json`, 'plain').replace(/\s/g, '')).toBe(plainResult);
  expect(compareFiles(`${treeBefore}.json`, `${treeAfter}.json`, 'json').replace(/\s/g, '')).toBe(jsonResult);
});

test('compare 2 yaml with plain, tree and linear output', () => {
  expect(compareFiles(`${plainBefore}.yaml`, `${plainAfter}.yaml`).replace(/\s/g, '')).toBe(linearResult);
  expect(compareFiles(`${treeBefore}.yaml`, `${treeAfter}.yaml`).replace(/\s/g, '')).toBe(treeResult);
  expect(compareFiles(`${treeBefore}.yaml`, `${treeAfter}.yaml`, 'plain').replace(/\s/g, '')).toBe(plainResult);
  expect(compareFiles(`${treeBefore}.yaml`, `${treeAfter}.yaml`, 'json').replace(/\s/g, '')).toBe(jsonResult);
});

test('compare 2 ini with plain, tree and linear output', () => {
  expect(compareFiles(`${plainBefore}.ini`, `${plainAfter}.ini`).replace(/\s/g, '')).toBe(linearResult);
  expect(compareFiles(`${treeBefore}.ini`, `${treeAfter}.ini`).replace(/\s/g, '')).toBe(treeResult);
  expect(compareFiles(`${treeBefore}.ini`, `${treeAfter}.ini`, 'plain').replace(/\s/g, '')).toBe(plainResult);
  expect(compareFiles(`${treeBefore}.ini`, `${treeAfter}.ini`, 'json').replace(/\s/g, '')).toBe(jsonResult);
});