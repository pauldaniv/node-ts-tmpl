#!/usr/bin/env ts-node

import fs from 'fs';
import chalk from 'chalk';

const defaultProfile = 'dev';
const profile = process.argv[2] || defaultProfile;

const confDir = `${__dirname}/../config`;
const conf = `${confDir}/env.json`;
// const template = `${confDir}/template`;

const availableProfiles = fs.readdirSync(confDir)
  .map(it => it.match(/(?<=env-).*?(?=\.json)/)?.[0])
  .filter(it => !!it);

const  isKnownProfile = availableProfiles.includes(profile);

if (profile !== defaultProfile && !isKnownProfile)
  throw Error(`Unknown profile: ${profile}`);

console.log(chalk.cyan('[profile]'), chalk.green(`${profile}`));

const configs = new Map<string, string>();

function readConfig(file: string) {
  const conf = JSON.parse(fs.readFileSync(file).toString());
  Object.keys(conf).forEach(it => configs.set(it, conf[it]));
}

//
// function copyAndReplace(from: string, to: string) {
//   fs.copyFile(from, to, (err) => {
//     if (err) throw err;
//     replaceConfig(to);
//   });
// }
//
// function replaceConfig(target: string) {
//   const data = fs.readFileSync(target, 'utf8');
//   const result = Object.keys(configs).reduce((obj, key) => obj.replace(`$${key}`, configs.get(key) as string), data);
//   fs.writeFileSync(target, result, 'utf8');
// }

readConfig(conf);
if (isKnownProfile) {
  if (!fs.readdirSync(confDir).some(it => it === `env-${profile}.json`)) {
    throw new Error(`Profile: '${profile}' not found`);
  }
  readConfig(`${confDir}/env-${profile}.json`);
}

//copy and replace here
