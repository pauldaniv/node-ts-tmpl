'use strict';

const Xlsx = require('xlsx');

function convertFile(file, map, apply = (key, value, obj) => (obj[key] = value, obj)) {
  const objectsArray = readFile(file);
  return objectsArray.map(it =>
    Object.keys(map).reduce((obj, key) =>
      apply(key, getMapValue(key, it, map), obj), {}));
}

function getMapValue(key, rawObject, map) {
  const rawKey = map[key].key ? map[key].key : map[key];
  return map[key].isMultiValueCell
    ? getCellArrayValues(rawObject, rawKey)
    : getCellValue(rawObject, rawKey);
}

function readFile(file) {
  const workbook = Xlsx.read(file.data);
  return Xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
}

function getCellValue(row, name) {
  const value = row[name];
  return looksLikeNull(value)
    ? null
    : typeof value === "string"
      ? value.trim()
      : value;
}

function getCellArrayValues(row, name) {
  const value = row[name];
  return looksLikeNull(value)
    ? []
    : value.split(',').map(el => el.trim());
}

function looksLikeNull(value) {
  return value === undefined
    || value === null
    || (typeof value === "string" && value.trim().toLowerCase() === 'null');
}

module.exports = {
  convertFile,
  readFile,
};
