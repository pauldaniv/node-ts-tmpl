'use strict';

const moment = require('moment');

const {sftpServer: sftpConf} = require('../../config/app-config');
const sftpService = require('../infra/sftp.service');

async function findLatestFile(filesFolder) {
  const workingFolder = `${sftpConf.baseFolder}/${filesFolder}`;
  const files = await sftpService.list(sftpConf, workingFolder);

  let importFile = findTargetFile(files, '.xlsx');
  if (!importFile) {
    importFile = findTargetFile(files, '.csv');
  }
  if (importFile) {
    return sftpService.downloadFile(sftpConf, `${workingFolder}/test_file.txt`);
  }
}

function findTargetFile(files, extension) {
  if (!files || files.length === 0) return;
  const fileWithTimestamp = files.filter(it => it.type === '-')
    .map(it => it.name)
    .filter(it => it.indexOf('_') > 0 && it.indexOf('_') < it.lastIndexOf('.'))
    .map(it => ({it, date: it.substring(it.lastIndexOf('_'), it.lastIndexOf('.'))}))

    .filter(({date}) => moment(date, 'DDMMYYYY').isValid())
    .map(({it, date}) => ({
      it,
      date: moment(date, 'DDMMYYYY').toDate()
    }))
    .sort((a, b) => b.date - a.date)
    .map(({it}) => it)
    .find(it => it.endsWith(extension));
  return fileWithTimestamp ? fileWithTimestamp : files[files.length - 1].name;
}

module.exports = {
  findLatestFile
};
