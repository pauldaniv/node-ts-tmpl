'use strict';

const Client = require('ssh2-sftp-client');

async function downloadFile(credentials, pathToFile) {
  const connection = await getConnection(credentials);
  const fileBuffer = await connection.get(pathToFile);
  await connection.end();
  return {data: fileBuffer};
}

async function list(credentials, path) {
  const connection = await getConnection(credentials);
  const fileList = await connection.list(path);
  await connection.end();
  return fileList;
}

async function getConnection(credentials) {
  const sftp = new Client();
  await sftp.connect(credentials);
  return sftp;
}

module.exports = {
  downloadFile,
  list,
};
