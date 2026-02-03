// src/Modules/Gym/gym.model.js
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../DB/connection.js';

export class Gym extends Model {
  isOpenNow() {
    const hours = this.operatingHours || {};
    if (hours.is24_7) return true;

    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayHours = hours[dayName];
    if (!dayHours || !dayHours.open || !dayHours.close) return false;

    const currentTime = now.toTimeString().slice(0, 5);
    return currentTime >= dayHours.open && currentTime <= dayHours.close;
  }
}

Gym.init({
  name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT
  },
  longitude: {
    type: DataTypes.FLOAT
  },
  equipment: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  facilities: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  operatingHours: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  rating: {
    type: DataTypes.JSONB,
    defaultValue: { average: 0, count: 0 }
  },
  contact: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  images: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  addedBy: {
    type: DataTypes.INTEGER
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Gym',
  tableName: 'gyms',
  timestamps: true,
  indexes: [
    { fields: ['name'] },
    { fields: ['isActive'] }
  ]
});

