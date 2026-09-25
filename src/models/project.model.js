const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [200, 'Summary cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    techStack: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ['web', 'mobile', 'desktop', 'library', 'extension', 'other'],
      default: 'web',
    },
    status: {
      type: String,
      enum: ['planned', 'in-progress', 'completed', 'archived'],
      default: 'completed',
    },
    images: {
      type: [String],
      default: [],
    },
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text', techStack: 'text' });
projectSchema.index({ featured: -1, order: 1 });

module.exports = mongoose.model('Project', projectSchema);
