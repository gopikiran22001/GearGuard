const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['MACHINERY', 'VEHICLE', 'COMPUTER', 'TOOL', 'OTHER'],
    trim: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  warrantyExpiry: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maintenanceTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaintenanceTeam',
    required: true
  },
  defaultTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'SCRAPPED'],
    default: 'ACTIVE'
  },
  scrapReason: {
    type: String,
    trim: true
  },
  scrapDate: {
    type: Date
  },
  specifications: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});


equipmentSchema.methods.markAsScrap = function(reason) {
  this.status = 'SCRAPPED';
  this.scrapReason = reason;
  this.scrapDate = new Date();
  return this.save();
};

module.exports = mongoose.model('Equipment', equipmentSchema);