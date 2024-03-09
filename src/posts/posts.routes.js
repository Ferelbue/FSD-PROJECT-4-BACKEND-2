
import { Router } from "express";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import { auth } from "../middlewares/auth.js";
import { createPost, deletePostById } from "./posts.controller.js";

const router = Router()

router.post('/',auth, createPost)
router.delete('/:id',auth, deletePostById)



export default router


