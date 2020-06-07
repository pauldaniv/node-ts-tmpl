'use strict';

const nodemailer = require('nodemailer');

const {email} = require('../../config/app-config');

async function sendEmail({
  from = `"Example App" <${email.auth.user}>`,
  recipients = [],
  subject = 'You got new a notification',
  text = '',
  html = ''
}) {
  if (!email.host || !email.auth) return;
  const transport = nodemailer.createTransport(email);
  return Promise.all(recipients.map(it => transport.sendMail({from, to: it, subject, text, html})));
}

module.exports = {
  sendEmail
};
