//  models/Training.js
import mongoose from 'mongoose';

const TrainingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  provider: { type: String, required: true },
  location: { type: String, default: 'Online' },
  type: { type: String, enum: ['Workshop', 'Certification', 'Technical', 'Soft Skills'], default: 'Workshop' },
  description: String,
  skillsCovered: { type: [String], default: [] },
  prerequisites: { type: [String], default: [] },
  duration: { type: Number, default: 1, min: 1 },
  durationUnit: { type: String, enum: ['hours', 'days', 'weeks', 'months'], default: 'days' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationLink: { type: String, required: true },
  status: { type: String, enum: ['Pending Approval', 'Approved', 'Rejected'], default: 'Pending Approval' },
  approvedAt: Date,
  rejectedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Training || mongoose.model('Training', TrainingSchema);