const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Session = sequelize.define('Session', {
  sid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  expires: DataTypes.DATE,
  data: DataTypes.TEXT,
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

module.exports = Session;
