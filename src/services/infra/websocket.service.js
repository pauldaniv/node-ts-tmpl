'use strict';

const Users = require('../../sequelize/models').user;

const connections = {};

function notifications(app) {
  app.ws('/notifications', async (ws, req) => {
    const {userId} = req.query;

    if (!userId) return permissionDenied(req);
    const user = await findUserById(userId);
    if (!user) return permissionDenied(req);

    console.log('Connection established:', userId);

    if (!connections[userId]) {
      connections[userId] = [ws];
    } else {
      connections[userId].push(ws);
    }

    ws.on('message', msg => {
      const auth = JSON.parse(msg);
      pushMessage(Object.keys(connections), {message: msg});
    });

    ws.on('close', (code, message) => {
      let userConnections = connections[userId];
      userConnections.filter(it => it.readyState === ws.CLOSED).forEach(it => {
        let index = userConnections.indexOf(it);
        if (index > -1) {
          userConnections.splice(index, 1);
        }
      });
      if (!userConnections.length) delete connections[userId];
      console.log(`Connection closed for user: ${userId} with code: ${code} and message: ${message}`);
    });
  });
}

function appWss(app) {
  require('express-ws')(app);
  notifications(app);
}

async function findUserById(userId) {
  return Users.findOne({where: {id: userId}});
}

function permissionDenied(req) {
  req.res.status(403).send('Permission denied');
}

function pushMessage(users, content) {
  users.forEach(user => {
    const connection = connections[user];
    if (connection) connections[user].forEach(it => it.send(JSON.stringify(content)));
  });
}

module.exports = {
  pushMessage,
  appWss,
  connections
};
