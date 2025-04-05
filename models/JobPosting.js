import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Internship", "Full-Time", "Part-Time", "Contract"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    salary: {
      type: Number,
      default: null,
    },
    salary_type: {
      type: String,
      enum: ["Annual", "Monthly", "Stipend/month", "Hourly"],
      default: null,
    },
    duration: {
      type: Number,
      default: null,
    },
    duration_unit: {
      type: String,
      enum: ["weeks", "months", "years"],
      default: null,
    },
    application_deadline: {
      type: Date,
      required: true,
    },
    apply_link: {
      type: String,
      required: true,
      trim: true,
    },
    students: {
      type: [String],
      default: [],
    }
  },
  { versionKey: false }
);

const Card = mongoose.models.JobPostings || mongoose.model("JobPostings", jobPostingSchema, "JobPostings");
export default Card;