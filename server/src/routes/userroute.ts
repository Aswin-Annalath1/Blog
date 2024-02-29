import { Router } from 'express';
import { register, login, logout, getprofile } from '../controller/userController';

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", getprofile);

export default router;
