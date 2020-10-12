#!/usr/bin/env ts-node

import {dirname} from 'path';
import fs from "fs-extra";
import uglify from "uglify-js";

const tsconfig = JSON.parse(fs.readFileSync(`${__dirname}/../tsconfig.json`).toString().replace(/\s+\/[\/*].*/g, ''));
const {outDir} = tsconfig.compilerOptions;
const basePath = `${__dirname}/../${outDir}`;

minify();

function minify(file = '') {
  const path = `${basePath}${file}`;
  if (fs.statSync(path).isFile()) {
    const fileContent = fs.readFileSync(path).toString();
    const result = uglify.minify({[path]: fileContent}, {sourceMap: {url: "inline"}});
    const targetFile = `${basePath}/${file}`;
    fs.removeSync(path);
    fs.mkdirpSync(dirname(targetFile));
    fs.writeFileSync(targetFile, result.code);
  } else fs.readdirSync(path).forEach((it) => minify(`${file}/${it}`));
}

// const minifyBaseDir = `${__dirname}/../${outDir.replace(/\/.*/, '')}/min`;

// minimize into separated folder and keep original dists
// function minify(file: string = '') {
//   const path = `${basePath}${file}`;
//   if (fs.statSync(path).isFile()) {
//     const fileContent = fs.readFileSync(path).toString();
//     const replacedFile = fileContent.replace(/(require\(['"]\.\.?[../]?\/[a-zA-Z./\-]+)(['"]\))/g, '$1-min$2');
//     const result = uglify.minify(replacedFile);
//     const targetFile = `${minifyBaseDir}/${file}`.replace(".js", "-min.js");
//     fs.mkdirpSync(dirname(targetFile));
//     fs.writeFileSync(targetFile, result.code);
//   } else fs.readdirSync(path).forEach(it => minify(`${file}/${it}`))
// }
