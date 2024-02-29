import { Router } from 'express';
import multer from 'multer';
import {
  postblog,
  putblog,
  getpost,
  getsinglepost,
  postlike
} from '../controller/postController';

const uploadMiddleware = multer({ dest: 'uploads/' });
const router = Router();

router.post("/post", uploadMiddleware.single('file'), postblog);
router.put("/post", uploadMiddleware.single('file'), putblog);
router.get("/post", getpost);
router.get("/post/:id", getsinglepost);
router.post("/like/:id", postlike);

export default router;
