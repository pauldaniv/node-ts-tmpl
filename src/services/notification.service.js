'use strict';

const models = require('../sequelize/models');

const Notifications = models.notification;
const UserNotifications = models.userNotification;

const {runTransaction} = require('./infra/db-utils.service');

async function save(userDetails, notification, userIds) {
  return runTransaction(async transaction => {
    const newNotification = await Notifications.create(notification, {transaction});
    const userNotifications = userIds.map(it => ({
      user: it,
      notification: newNotification.id
    }));
    await UserNotifications.bulkCreate(userNotifications, {transaction});
    return newNotification;
  });
}

async function getAll(userDetails) {
  const allNotifications = await models.sequelize.query(`
    select n.id, n.message, n.created_at, n.example_id 
    from notifications n
    join user_notifications un on n.id = un.notification_id
    where un.user_id = '${userDetails.id}'
    order by created_at`, {model: Notifications, mapToModel: true});
  const unseenIds = await getUnseen(userDetails);
  allNotifications.forEach(({dataValues}) => {
    if (unseenIds.includes(dataValues.id)) {
      dataValues.unseen = true;
    }
  });
  return allNotifications;
}

async function deleteOne(userDetails, notificationId) {
  await UserNotifications.destroy({where: {user: userDetails.id, notification: notificationId}});
  const userNotificationsCount = await UserNotifications.count({where: {notification: notificationId}});
  if (!userNotificationsCount) Notifications.destroy({where: {id: notificationId}});
}

async function deleteAll(userDetails) {
  const userNotifications = await getAll(userDetails);
  await UserNotifications.destroy({where: {user: userDetails.id}});
  const notificationsToRemove = await Promise.all(userNotifications
    .map(async it => ({id: it.id, count: await UserNotifications.count({where: {notification: it.id}})})));

  notificationsToRemove
    .filter(it => !it.count)
    .forEach(it => Notifications.destroy({where: {id: it.id}}));
}

async function setSeen(userDetails, notificationsIds) {
  return UserNotifications.update({seen: true}, {where: {user: userDetails.id, notification: notificationsIds}});
}

async function getUnseen(userDetails) {
  const unseenNotificationIds = await UserNotifications.findAll({
    where: {user: userDetails.id, seen: false},
    attributes: ['notification']
  });
  if (unseenNotificationIds) {
    return unseenNotificationIds.map(it => it.notification);
  }
}

module.exports = {
  getAll,
  deleteOne,
  deleteAll,
  save,
  setSeen,
};
