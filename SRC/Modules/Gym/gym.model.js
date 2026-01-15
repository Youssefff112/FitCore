// src/Modules/Gym/gym.model.js
import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Gym name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    city: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    }
  },
  equipment: [{
    type: String
  }],
  facilities: [{
    type: String
  }],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
    is24_7: {
      type: Boolean,
      default: false
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  images: [{
    type: String
  }],
  addedBy: {
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

// Geospatial index for location queries
gymSchema.index({ 'location.coordinates': '2dsphere' });
gymSchema.index({ name: 1 });
gymSchema.index({ 'location.city': 1 });
gymSchema.index({ isActive: 1 });

// Method to check if gym is open now
gymSchema.methods.isOpenNow = function() {
  if (this.operatingHours.is24_7) {
    return true;
  }

  const now = new Date();
  const dayName = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
  const dayHours = this.operatingHours[dayName];

  if (!dayHours || !dayHours.open || !dayHours.close) {
    return false;
  }

  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  return currentTime >= dayHours.open && currentTime <= dayHours.close;
};

export const Gym = mongoose.model('Gym', gymSchema);

