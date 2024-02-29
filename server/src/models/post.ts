import mongoose, { Schema, Document, Types } from 'mongoose';

interface IPost extends Document {
  title: string;
  summary: string;
  content: string;
  cover: string;
  author: Types.ObjectId | string;
  likes: Types.ObjectId[];
}

const postSchema: Schema<IPost> = new mongoose.Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // It contains _id of user.
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;