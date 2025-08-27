import { Router } from 'express';
import Post from '../models/Post.js';

const router = Router();

// Create
router.post('/', async (req, res, next) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post);
  } catch (e) { next(e); }
});

// Read list (pagination + search + filters)
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q, published } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (published !== undefined) filter.published = published === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Post.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { next(e); }
});

// Read single
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Post.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// Update (partial)
router.patch('/:id', async (req, res, next) => {
  try {
    const item = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// Replace
router.put('/:id', async (req, res, next) => {
  try {
    const item = await Post.findOneAndReplace({ _id: req.params.id }, req.body, { new: true, upsert: false });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const r = await Post.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;

