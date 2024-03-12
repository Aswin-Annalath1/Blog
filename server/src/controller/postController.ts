import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import Post  from '../models/post';
import mongoose from 'mongoose';

interface DecodedToken {
  id: string;
  // Add other properties as needed based on your token structure
}

export const postblog = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
        res.status(400).json({ message: 'File not provided' });
        return;
    }
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path.replace(/\\/g, '/') + '.' + ext;
    await fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET as string, {}, async (err, info) => {
      if (err) throw err;

      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath.replace('build/', ''),
        author: (info as DecodedToken).id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const putblog = async (req: Request, res: Response): Promise<void> => {
  try {
    let newPath: string | null = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path.replace(/\\/g, '/') + '.' + ext;
      await fs.renameSync(path, newPath);
    }
    const { token } = req.cookies;
    jwt.verify(token, process.env.SECRET as string, {}, async (err, info) => {
      if (err) throw err;
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc?.author) === JSON.stringify((info as DecodedToken).id);
      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }
      await Post.updateOne({ _id: id }, {
        $set: {
          title,
          summary,
          content,
          cover: newPath ? newPath.replace('build/', '') : postDoc?.cover,
        },
      });
      const updatedPostDoc = await Post.findById(id);
      res.json(updatedPostDoc);
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getpost = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);

    const postsWithLikesCount = posts.map((post) => ({
      ...post.toObject(),
      likesCount: post.likes.length,
    }));

    res.json(postsWithLikesCount);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getsinglepost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);

    if (!postDoc) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(postDoc);
  } catch (error) {
    console.error('Error retrieving single post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const postlike = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const { token } = req.cookies;
    const decodedInfo = jwt.verify(token, process.env.SECRET as string, {}) as DecodedToken;

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    const userIdAsObjectId = new mongoose.Types.ObjectId(decodedInfo.id);

    if (!post.likes.includes(userIdAsObjectId)) {
      post.likes.push(userIdAsObjectId);
      await post.save();
      res.status(200).json({ message: 'Liked successfully' });
    } else {
      res.status(400).json({ message: 'Post already liked' });
    }
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
