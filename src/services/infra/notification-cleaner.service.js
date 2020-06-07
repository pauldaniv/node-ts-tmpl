'use strict';

const models = require('../../sequelize/models');

const {notificationCleaning} = require('../../config/app-config');
const {runTransaction} = require('./db-utils.service');
const scheduleService = require('./schedule.service');

async function clearNotification() {
  return runTransaction(async transaction => {
    await models.sequelize.query(`
        delete
        from notifications
        where created_at < NOW() - INTERVAL '${notificationCleaning.timeThreshold}'`, {transaction});

    await models.sequelize.query(`
      with notifications_count as (
        select user_id, count(*) count
        from user_notifications
        group by user_id
        ), notifications_ids as (
      select un.id
        from user_notifications un
        join notifications_count on notifications_count.user_id = un.user_id
        where notifications_count.count > ${notificationCleaning.countThreshold}
        order by notification_id offset ${notificationCleaning.countThreshold}
      )

      delete
      from user_notifications
      using notifications_ids
      where user_notifications.id = notifications_ids.id`, {transaction});

    await models.sequelize.query(`
      with n as (
        select n.id
        from notifications n
        left join user_notifications un on n.id = un.notification_id
        where un.id is null
      )
      delete
      from notifications
      using n
      where notifications.id = n.id`, {transaction});
  });
}

scheduleService.registerJob({
  ...notificationCleaning.schedule,
  job: clearNotification
});

module.exports = clearNotification;
