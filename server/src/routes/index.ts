import { Router } from 'express';
import userRoutes from './userroute';
import blogRoutes from './postroute';

const router = Router();

router.use("/users", userRoutes);
router.use("/blog", blogRoutes);

export default router;
