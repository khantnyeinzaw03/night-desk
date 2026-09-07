import mongoose from 'mongoose';
const { Schema } = mongoose;

const jobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  workType: { type: String, enum: ['remote', 'onsite', 'hybrid'], required: true },
  salary: {
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    currency: { type: String, required: false },
  },
  skills: { type: [String], required: true },
  url: { type: String, required: true },
  description: { type: String, required: false }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

export default Job;