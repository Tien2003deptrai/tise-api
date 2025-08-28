import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// chỉ index full-text cho title và content
PostSchema.index({ title: 'text', content: 'text' });

export default mongoose.model('Post', PostSchema);
