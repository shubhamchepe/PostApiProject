const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Data = sequelize.define('Data', {
  payload: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('payload');
      try {
        return JSON.parse(rawValue);
      } catch (err) {
        return rawValue;
      }
    },
    set(value) {
      this.setDataValue('payload', JSON.stringify(value));
    }
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
