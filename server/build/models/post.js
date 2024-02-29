"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }, // It contains _id of user.
    likes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});
const Post = mongoose_1.default.model('Post', postSchema);
exports.default = Post;
