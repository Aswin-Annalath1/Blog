"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const postController_1 = require("../controller/postController");
const uploadMiddleware = (0, multer_1.default)({ dest: 'uploads/' });
const router = (0, express_1.Router)();
router.post("/post", uploadMiddleware.single('file'), postController_1.postblog);
router.put("/post", uploadMiddleware.single('file'), postController_1.putblog);
router.get("/post", postController_1.getpost);
router.get("/post/:id", postController_1.getsinglepost);
router.post("/like/:id", postController_1.postlike);
exports.default = router;
