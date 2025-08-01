const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Data = sequelize.define('Data', {
  payload: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'data_entries',
  timestamps: false,
});

module.exports = Data;
