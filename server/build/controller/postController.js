"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postlike = exports.getsinglepost = exports.getpost = exports.putblog = exports.postblog = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const promises_1 = __importDefault(require("fs/promises"));
const post_1 = __importDefault(require("../models/post"));
const mongoose_1 = __importDefault(require("mongoose"));
const postblog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'File not provided' });
            return;
        }
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        yield promises_1.default.rename(path, newPath);
        const { token } = req.cookies;
        jsonwebtoken_1.default.verify(token, process.env.SECRET, {}, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw err;
            const { title, summary, content } = req.body;
            const postDoc = yield post_1.default.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            });
            res.json(postDoc);
        }));
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.postblog = postblog;
const putblog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let newPath = null;
        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            yield promises_1.default.rename(path, newPath);
        }
        const { token } = req.cookies;
        jsonwebtoken_1.default.verify(token, process.env.SECRET, {}, (err, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw err;
            const { id, title, summary, content } = req.body;
            const postDoc = yield post_1.default.findById(id);
            const isAuthor = JSON.stringify(postDoc === null || postDoc === void 0 ? void 0 : postDoc.author) === JSON.stringify(info.id);
            if (!isAuthor) {
                return res.status(400).json('You are not the author');
            }
            yield post_1.default.updateOne({ _id: id }, {
                $set: {
                    title,
                    summary,
                    content,
                    cover: newPath ? newPath : postDoc === null || postDoc === void 0 ? void 0 : postDoc.cover,
                },
            });
            const updatedPostDoc = yield post_1.default.findById(id);
            res.json(updatedPostDoc);
        }));
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.putblog = putblog;
const getpost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find()
            .populate('author', ['username'])
            .sort({ createdAt: -1 })
            .limit(20);
        const postsWithLikesCount = posts.map((post) => (Object.assign(Object.assign({}, post.toObject()), { likesCount: post.likes.length })));
        res.json(postsWithLikesCount);
    }
    catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getpost = getpost;
const getsinglepost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const postDoc = yield post_1.default.findById(id).populate('author', ['username']);
        if (!postDoc) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }
        res.json(postDoc);
    }
    catch (error) {
        console.error('Error retrieving single post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getsinglepost = getsinglepost;
const postlike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const { token } = req.cookies;
        const decodedInfo = jsonwebtoken_1.default.verify(token, process.env.SECRET, {});
        const post = yield post_1.default.findById(id);
        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }
        const userIdAsObjectId = new mongoose_1.default.Types.ObjectId(decodedInfo.id);
        if (!post.likes.includes(userIdAsObjectId)) {
            post.likes.push(userIdAsObjectId);
            yield post.save();
            res.status(200).json({ message: 'Liked successfully' });
        }
        else {
            res.status(400).json({ message: 'Post already liked' });
        }
    }
    catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.postlike = postlike;
