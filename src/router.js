import { Router } from 'express';
import authRoutes from "../src/auth/auth.routes.js";
import usersRoutes from "../src/users/user.routes.js";
import postsRoutes from "../src/posts/posts.routes.js";

const router = Router();

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/posts', postsRoutes)


export default router;