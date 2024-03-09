
import { Router } from "express";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import { auth } from "../middlewares/auth.js";
import { createPost, deletePostById, getUserPosts, updatePostById } from "./posts.controller.js";

const router = Router()

router.post('/',auth, createPost)
router.delete('/:id',auth, deletePostById)
router.put('/:id',auth, updatePostById)
router.get('/own',auth, getUserPosts)
router.get('/',auth, getPosts)



export default router


