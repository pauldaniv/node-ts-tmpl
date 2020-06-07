'use strict';

const cron = require('cron');
const {sftpConf} = require('../../config/app-config');

const scheduledJobs = [];

function jobEnabled({enabled, time, job}) {
  return enabled === 'true' && typeof time === 'string' && typeof job === 'function';
}

function startScheduledJobs() {
  scheduledJobs.forEach(({time, job, enabled}) => {
    if (jobEnabled({enabled, time, job})) {
      cron.job(time, job, null, true);
    }
  });
  runOnBoot().then();
}

async function runOnBoot() {
  if (sftpConf.onBootEnabled !== 'true') return;
  const enabledJobs = scheduledJobs.filter(jobEnabled);
  for (const {job} of enabledJobs) {
    await job();
  }
}

module.exports = {
  startScheduledJobs: () => {
    if (sftpConf.enabled === 'true') {
      startScheduledJobs();
    }
  },
  registerJob: schedule => {
    scheduledJobs.push(schedule);
  }
};
