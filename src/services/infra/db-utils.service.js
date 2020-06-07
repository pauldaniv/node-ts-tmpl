'use strict';

const {sequelize, Sequelize} = require('../../sequelize/models');

async function runTransaction(apply, onError) {
  const t = await sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE});
  try {
    const result = await apply(t);
    await t.commit();
    return result;
  } catch (e) {
    await t.rollback();
    if (onError) throw onError(e);
    else throw e;
  }
}

async function upsert(relation, value, transaction, keyColumn) {
  const result = await relation.update(value, {where: {[keyColumn]: value[keyColumn]}, transaction});
  if (result[0] === 0) await relation.create(value, {transaction});
}

async function upsertSelect(relation, value, transaction, ...keyColumns) {
  const where = keyColumns.reduce((obj, it) => (obj[it] = value[it], obj), {});
  const result = await relation.findOne({where, transaction});
  return result
    ? relation.update(value, {where, transaction})
    : relation.create(value, {transaction});
}

module.exports = {
  runTransaction,
  upsert,
  upsertSelect,
};
