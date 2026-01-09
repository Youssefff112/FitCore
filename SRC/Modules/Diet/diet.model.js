    // src/Modules/Diet/diet.model.js
import mongoose from 'mongoose';

const dietPlanSchema = new mongoose.Schema({
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
  
  dietaryPreference: {
    type: String,
    enum: ['none', 'vegetarian', 'vegan', 'gluten_free', 'keto', 'paleo'],
    default: 'none'
  },
  
  dailyCalorieTarget: {
    type: Number,
    required: true,
    min: 1000,
    max: 6000
  },
  
  macronutrients: {
    protein: { type: Number, required: true }, // grams
    carbs: { type: Number, required: true }, // grams
    fats: { type: Number, required: true } // grams
  },
  
  weeklyMealPlan: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    meals: [{
      type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
      },
      name: { type: String, required: true },
      description: String,
      ingredients: [{ type: String }],
      nutrition: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number
      },
      preparationTime: Number, // minutes
      recipe: String
    }]
  }],
  
  hydrationGoal: {
    type: Number,
    default: 2500 // ml per day
  },
  
  supplements: [{
    name: String,
    dosage: String,
    timing: String
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
dietPlanSchema.index({ user: 1, isActive: 1 });
dietPlanSchema.index({ weekStartDate: -1 });

export const DietPlan = mongoose.model('DietPlan', dietPlanSchema);