const mongoose = require('mongoose');

const maintenanceTeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    enum: ['MECHANICAL', 'ELECTRICAL', 'IT', 'HVAC', 'GENERAL']
  },
  technicians: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MaintenanceTeam', maintenanceTeamSchema);