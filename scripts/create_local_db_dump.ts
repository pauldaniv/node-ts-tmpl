#!/usr/bin/env ts-node

import fs from 'fs';
import {exec} from 'child_process';

const envFile = `${__dirname}/../.env`;
const configFile = fs.readFileSync(envFile).toString().split("\n");

const {dbname, password, username} = configFile.filter(it =>
  it.includes('DB_NAME=')
  || it.includes('DB_PASSWORD=')
  || it.includes('DB_USERNAME='))
  .filter(it => !it.includes('#')).reduce((obj, line) => {
    if (line.includes('DB_NAME')) {
      obj.dbname = line.replace(/DB_NAME=/, '');
    }
    if (line.includes('DB_PASSWORD')) {
      obj.password = line.replace(/DB_PASSWORD=/, '');
    }
    if (line.includes('DB_USERNAME')) {
      obj.username = line.replace(/DB_USERNAME=/, '');
    }
    return obj;
  }, {
    dbname: 'postgres',
    password: '',
    username: 'postgres'
  });

const dumpPath = `${__dirname}/../src/sequelize/dmp/init.sql`;

const params =
  ` -h localhost` +
  ` -U ${username}` +
  ` --file="${dumpPath}"` +
  ` --dbname="${dbname}"` +
  ` --schema-only` +
  ` --schema='public'` +
  ` --clean` +
  ` --if-exists`;

const command = `PGPASSWORD="${password}" pg_dump ${params}`;
const removePublicSchemaChanges = `sed -i -E '/OWNER TO|--/d' ${dumpPath}`;
const removeRedundantNewLines = `sed -i -E 'N;/^\\n$/D;P;D;' ${dumpPath}`;

exec(command, () => {
  exec(removePublicSchemaChanges, () => {
    exec(removeRedundantNewLines, (err, stdout) => console.log(stdout));
  });
});

const migrationsFileList = `${__dirname}/../src/sequelize/dmp/init.json`;
const migrations = JSON.parse(fs.readFileSync(migrationsFileList).toString());
const migrationsNames = fs.readdirSync(`${__dirname}/../src/sequelize/migrations`);

migrations.push(...migrationsNames.filter(it => !migrations.includes(it)));

fs.writeFileSync(migrationsFileList, JSON.stringify(migrations, null, 2));
