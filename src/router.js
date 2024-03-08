import { Router } from 'express';
import authRoutes from "../src/auth/auth.routes.js";
import usersRoutes from "../src/users/user.routes.js";

const router = Router();

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)


export default router;