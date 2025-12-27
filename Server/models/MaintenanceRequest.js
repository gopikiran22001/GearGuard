const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  equipment: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    }]
  },
  maintenanceTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam',
    required: true
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requestType: {
    type: String,
    enum: ['CORRECTIVE', 'PREVENTIVE'],
    required: true
  },
  status: {
    type: String,
    enum: ['NEW', 'IN_PROGRESS', 'REPAIRED', 'SCRAP'],
    default: 'NEW'
  },
  scheduledDate: {
    type: Date,
    required: function () {
      return this.requestType === 'PREVENTIVE';
    }
  },
  completedDate: {
    type: Date
  },
  hoursSpent: {
    type: Number,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  }
}, {
  timestamps: true
});

maintenanceRequestSchema.pre('save', function (next) {
  if (this.status === 'REPAIRED' && !this.completedDate) {
    this.completedDate = new Date();
  }
  next();
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);