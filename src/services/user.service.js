'use strict';

const models = require('../sequelize/models');
const jwtDecode = require('jwt-decode');

const {sequelize} = models;
const Users = models.user;

const {BadRequestError} = require('../handler/exceptions/domain-exception');

async function getAll() {
  return Users.findAll();
}

async function getOne(userId) {
  return Users.findOne({where: {id: userId}, attributes: ['id', 'fullName', 'email']});
}

function readAccessToken(accessToken) {
  return jwtDecode(accessToken.replace(/Bearer /ig, ''));
}

async function getUserEmails(userIds) {
  const usersWithEmail = await Users.findAll({where: {id: userIds}, attributes: ['email']});
  return usersWithEmail.map(it => it.email);
}

function userExists(user) {
  if (!user) throw new BadRequestError('User not found', 404);
}

module.exports = {
  getAll,
  getOne,
  getUserEmails,
  userExists
};
