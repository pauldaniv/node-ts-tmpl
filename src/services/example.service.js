'use strict';

const models = require('../sequelize/models');

const Example = models.example;

const {roles} = require('../config/app-config');

async function getAll() {
  return result;
}

async function getOne(userDetails, exampleId) {
  return Example.findOne({
    where: {id: exampleId}
  });
}

async function update(userDetails, id, data) {
  return Example.update(data, {where: {id}});
}

module.exports = {
  getAll,
  getOne,
  update
};
