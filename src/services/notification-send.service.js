'use strict';

const webSocketService = require('./infra/websocket.service');
const emailService = require('./infra/email.service');

const {save} = require('./notification.service');
const {getUserEmails} = require('./user.service');

async function emailAndPushNotification(userDetails, exampleId, payload, ...recipients) {
  const send = async (userIds, notification) => {
    const userEmails = await getUserEmails(userIds);
    await emailService.sendEmail({recipients: userEmails, text: notification.message});
    webSocketService.pushMessage(userIds, notification);
  };
  const notification = makeMessage(userDetails, exampleId, payload);
  return saveAndSend(userDetails, notification, send, ...recipients);
}

async function emailNotification(userDetails, exampleId, payload, ...recipients) {
  const send = async (userIds, notification) => {
    const userEmails = await getUserEmails(userIds);
    return emailService.sendEmail({recipients: userEmails, text: notification.message});
  };
  const notification = makeMessage(userDetails, exampleId, payload);
  return saveAndSend(userDetails, notification, send, ...recipients);
}

async function pushNotification(userDetails, exampleId, payload, ...recipients) {
  const send = async (userIds, notification) => {
    return webSocketService.pushMessage(userIds, notification);
  };
  const notification = makeMessage(userDetails, exampleId, payload);
  return saveAndSend(userDetails, notification, send, ...recipients);
}

async function saveAndSend(userDetails, notification, sendAction, ...recipients) {
  const userIds = recipients.filter(it => it);
  const newNotification = await save(userDetails, notification, userIds);
  await sendAction(userIds, {...newNotification.dataValues, unseen: true});
}

function makeMessage(userDetails, exampleId, message) {
  return {message, exampleId, createdBy: userDetails.id, createdAt: new Date()};
}

module.exports = {
  pushNotification,
  emailNotification,
  emailAndPushNotification,
};
