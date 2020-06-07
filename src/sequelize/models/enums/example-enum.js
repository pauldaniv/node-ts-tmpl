'use strict';

const values = {
  TYPE_ONE: undefined,
  TYPE_TWO: undefined
};

function getValues() {
  Object.keys(values).forEach(it => values[it] = it);
  return values;
}

module.exports = {
  values: Object.keys(values),
  ...getValues()
};
