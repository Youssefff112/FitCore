// src/Modules/Notification/notification.model.js
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../DB/connection.js';

export class Notification extends Model {}

Notification.init({
  userId: {
    type: DataTypes.INTEGER
  },
  email: {
    type: DataTypes.STRING
  },
  channel: {
    type: DataTypes.ENUM('email'),
    defaultValue: 'email'
  },
  subject: {
    type: DataTypes.STRING,
    defaultValue: 'FitCore Notification'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  scheduledAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed'),
    defaultValue: 'pending'
  },
  sentAt: {
    type: DataTypes.DATE
  },
  error: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: true,
  indexes: [
    { fields: ['status', 'scheduledAt'] },
    { fields: ['userId'] }
  ]
});
