'use strict';

const router = require('express').Router();

const {handle} = require('./custom/request-common');

const path = '/api/csv-splitting';

router.post(path, handle(async (req) => ({chunks: getChunks(req.body.data, req.query.chunkSize)})));

function getChunks(csv, chunkSize) {
  const charArray = csv.split(/(?=[\s\S])/u);

  const charSizes = charArray.map(it => countBytes(it));

  const chunks = [];
  let startIndex = 0;
  let offset = 0;

  for (let i = 0; i < charSizes.length; i++) {
    let item = charSizes[i];
    if (offset + item > chunkSize) {
      chunks.push(makeChunk(charArray, startIndex, i));
      offset = 0;
      startIndex = i;
    }
    if (i + 1 === charSizes.length) {
      chunks.push(makeChunk(charArray, startIndex, charSizes.length));
    }
    offset += item;
  }
  console.log(chunks.length);
  return chunks;
}

function makeChunk(charArray, start, end) {
  return charArray.slice(start, end).reduce((a, b) => a.concat(b), "");
}

function countBytes(char) {
  let count = 0;
  for (let stringIndex = 0, endOfString = char.length; stringIndex < endOfString; stringIndex++) {
    const codePoint = char.charCodeAt(stringIndex);
    if (codePoint < 0x100) {
      count += 1;
    } else if (codePoint < 0x10000) {
      count += 2;
    } else if (codePoint < 0x1000000) {
      count += 3;
    } else {
      count += 4;
    }
  }
  return count;
}

module.exports = router;
