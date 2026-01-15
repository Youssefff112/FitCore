// src/Modules/Workout/workout.model.js
import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance'],
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  weeklySchedule: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    isRestDay: {
      type: Boolean,
      default: false
    },
    focus: {
      type: String,
      enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'glutes', 'cardio', 'full_body', 'rest']
    },
    exercises: [{
      exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
      },
      name: String, // Fallback if exercise is deleted
      sets: Number,
      reps: {
        type: String, // Can be "10-12" or "30 seconds" etc.
        required: true
      },
      weight: Number, // Optional, in kg
      restTime: Number, // in seconds
      notes: String
    }],
    duration: Number, // Estimated duration in minutes
    calories: Number // Estimated calories burned
  }],
  weekStartDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
workoutPlanSchema.index({ user: 1, isActive: 1 });
workoutPlanSchema.index({ weekStartDate: -1 });

const workoutLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workoutPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan'
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    name: String,
    sets: [{
      reps: Number,
      weight: Number,
      completed: {
        type: Boolean,
        default: true
      }
    }],
    notes: String
  }],
  duration: Number, // Actual duration in minutes
  calories: Number, // Actual calories burned
  notes: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Indexes
workoutLogSchema.index({ user: 1, date: -1 });
workoutLogSchema.index({ workoutPlan: 1 });

export const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
export const WorkoutLog = mongoose.model('WorkoutLog', workoutLogSchema);

