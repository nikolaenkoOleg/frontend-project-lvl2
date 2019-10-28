import _ from 'lodash';

const getNode = (name, type, beforeValue = '', afterValue = '', children, status) => ({
  name,
  type,
  beforeValue,
  afterValue,
  children,
  status,
});

const getSoloAst = (data) => Object.keys(data).map((key) => getNode(key, 'key', data[key], '', '', 'unchanged'));

export default (beforeData, afterData) => {
  const buildAst = (before = {}, after = {}) => {
    const keys = Object.keys(before).concat(Object.keys(after));
    const filteredKeys = _.uniqWith(keys, _.isEqual);

    return filteredKeys.map((key) => {
      if (_.has(before, key) && _.has(after, key)) { // если ключ есть в обоих объектах
        if (typeof before[key] === 'object' && typeof after[key] === 'object') { // если тип значения ключа объект в обоих объектах
          return getNode(key, 'obj', '', '', buildAst(before[key], after[key]), 'unchanged');
        }
        /*
        если тип значения ключа отличается в разных объектах
        */
        if (typeof before[key] === 'object' && typeof after[key] !== 'object') {
          return getNode(key, 'key', getSoloAst(before[key]), after[key], '', 'value type changed');
        }

        if (typeof before[key] !== 'object' && typeof after[key] === 'object') {
          return getNode(key, 'key', before[key], getSoloAst(after[key]), '', 'value type changed');
        }

        // если значения ключа одинаковы
        if (before[key] === after[key]) {
          return getNode(key, 'key', before[key], after[key], '', 'unchanged');
        }

        // если разные значения
        return getNode(key, 'key', before[key], after[key], '', 'edited');
      }

      // если ключ есть в before но нет в after
      if (_.has(before, key) && !_.has(after, key)) {
        if (typeof before[key] === 'object') {
          return getNode(key, 'obj', '', '', getSoloAst(before[key]), 'deleted');
        }
        return getNode(key, 'key', before[key], after[key], '', 'deleted');
      }

      // если ключ есть в after но нет в before
      if (!_.has(before, key) && _.has(after, key)) {
        if (typeof after[key] === 'object') {
          return getNode(key, 'obj', '', '', getSoloAst(after[key]), 'added');
        }
        return getNode(key, 'key', before[key], after[key], '', 'added');
      }

      return null;
    });
  };

  const getSign = (status) => {
    switch (status) {
      case 'added':
        return '+';
      case 'deleted':
        return '-';
      default:
        return '';
    }
  };
  const render = (ast) => ast.reduce((acc, {
    name,
    type,
    beforeValue,
    afterValue,
    children,
    status,
  }) => {
    if (type === 'obj') {
      return `${acc}${getSign(status)} ${name}: {\n${render(children)}\n}`;
    }

    switch (status) {
      case 'value type changed':
        if (typeof beforeValue === 'object') {
          return `${acc}- ${name}: {\n ${render(beforeValue)}\n}+ ${name}: ${afterValue}\n\n`;
        }

        return `${acc}- ${name}: ${beforeValue}\n+ ${name}: {\n ${render(afterValue)}}\n`;
      case 'unchanged':
        return `${acc}  ${name}: ${beforeValue}\n`;
      case 'edited':
        return `${acc}+ ${name}: ${afterValue}\n- ${name}: ${beforeValue}\n`;
      case 'deleted':
        return `${acc}- ${name}: ${beforeValue}\n`;
      case 'added':
        return `${acc}+ ${name}: ${afterValue}\n`;
      default:
        return acc;
    }
  }, '');

  // const result = buildAst(beforeData, afterData);
  // const iter = render(result);

  // console.log(result[0]);
  // console.log(`${iter}`);

  // const obj = {
  //   '- key1': 'value1',
  //   '- key2': {
  //     '  downKey1': 'value1',
  //     '+ downKey2': 'value2',
  //   },
  //   '+ key3': 'value3',
  // };

  // const str = JSON.stringify(obj, null, '  ');
  // // console.log(str);
  // const quote = /"/g;
  // const str2 = str.replace(quote, '');
  // const dot = /,/g;
  // console.log(str2.replace(dot, ''));

  const arr = [
    {
      name: 'common',
      type: 'key',
      beforeValue: 12,
      afterValue: 10,
      status: 'edited',
    },
    {
      name: 'setting1',
      type: 'key',
      beforeValue: true,
      afterValue: '',
      status: 'deleted',
    }];

  const result = arr.reduce((acc, {
    name,
    type,
    beforeValue,
    afterValue,
    status,
  }) => {
    if (status === 'edited') {
      return { ...acc, '- name': beforeValue, '+ name': afterValue };
    }
    if (status === 'deleted') return { ...acc, '- name': beforeValue };
    return acc;
  }, {});

  console.log(result);
};

// const obj = {
//   '- common': '12',
//   '+ common': '10',
//   '- setting1': true,
// };

// console.log(obj['- common']);
