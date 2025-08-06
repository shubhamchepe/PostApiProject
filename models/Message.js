const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direction: {
    type: DataTypes.ENUM('sent', 'received'),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  twilio_sid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content_sid: {
    type: DataTypes.STRING,
    allowNull: true, // Only needed for sent messages using templates
  },
  content_variables: {
    type: DataTypes.JSON,
    allowNull: true, // Store key-value JSON if using templates
  }
}, {
  tableName: 'messages',
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = Message;
