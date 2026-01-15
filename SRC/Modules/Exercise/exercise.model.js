// src/Modules/Exercise/exercise.model.js
import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['cardio', 'strength', 'flexibility', 'balance', 'sports', 'other'],
    required: true
  },
  muscleGroups: [{
    type: String,
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'glutes', 'cardio', 'full_body']
  }],
  equipment: [{
    type: String,
    enum: ['bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance_bands', 'cable', 'machine', 'cardio_machine', 'yoga_mat', 'pull_up_bar', 'other']
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  instructions: [{
    type: String
  }],
  tips: [{
    type: String
  }],
  images: [{
    type: String
  }],
  videos: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
exerciseSchema.index({ name: 1 });
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ muscleGroups: 1 });
exerciseSchema.index({ equipment: 1 });
exerciseSchema.index({ isActive: 1 });

export const Exercise = mongoose.model('Exercise', exerciseSchema);

