// src/Modules/Coach/coach.model.js
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../DB/connection.js';

export class CoachProfile extends Model {}

CoachProfile.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  bio: {
    type: DataTypes.TEXT
  },
  specialties: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  experienceYears: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  certifications: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  availability: {
    type: DataTypes.JSONB,
    defaultValue: {}
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  approvedBy: {
    type: DataTypes.INTEGER
  },
  approvedAt: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  modelName: 'CoachProfile',
  tableName: 'coach_profiles',
  timestamps: true
});
