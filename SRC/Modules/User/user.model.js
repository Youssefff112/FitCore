// src/Modules/User/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  userType: {
    type: String,
    enum: ['onsite', 'offline'],
    required: [true, 'User type is required']
  },
  profile: {
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age cannot exceed 120']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    height: {
      type: Number, // in cm
      min: [50, 'Height must be at least 50cm'],
      max: [300, 'Height cannot exceed 300cm']
    },
    currentWeight: {
      type: Number, // in kg
      min: [20, 'Weight must be at least 20kg'],
      max: [500, 'Weight cannot exceed 500kg']
    },
    goal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'maintenance', 'endurance']
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    dietaryPreferences: {
      type: String,
      enum: ['none', 'vegetarian', 'vegan', 'gluten_free', 'keto', 'paleo'],
      default: 'none'
    },
    allergies: [{
      type: String
    }],
    homeEquipment: [{
      type: String,
      enum: ['none', 'dumbbells', 'resistance_bands', 'yoga_mat', 'pull_up_bar', 'kettlebell', 'barbell']
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  refreshToken: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );
  
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

export const User = mongoose.model('User', userSchema);

