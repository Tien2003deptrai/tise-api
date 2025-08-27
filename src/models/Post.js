
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: false }
  },
  { timestamps: true }
);

PostSchema.index({ title: 'text', content: 'text', tags: 1 });

export default mongoose.model('Post', PostSchema);
