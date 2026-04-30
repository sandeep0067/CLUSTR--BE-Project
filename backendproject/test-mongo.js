import mongoose from 'mongoose';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Post = require('./backend/models/Post');
import dotenv from 'dotenv';
dotenv.config();

console.log("URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected.');
    try {
      const p = new Post({
        authorId: "test_author",
        content: "test content"
      });
      await p.save();
      console.log("Saved post with ID:", p._id);
    } catch(e) {
      console.error("Save error:", e);
    }
    process.exit(0);
  })
  .catch(e => {
    console.error("Conn err", e);
    process.exit(1);
  });
