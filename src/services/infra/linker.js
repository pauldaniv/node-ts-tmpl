'use strict';

require('./notification-cleaner.service');

//should be the last one
require('./schedule.service').startScheduledJobs();

module.exports = () => {
};
