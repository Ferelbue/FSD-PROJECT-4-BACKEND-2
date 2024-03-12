
import { Router } from "express";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import { auth } from "../middlewares/auth.js";
import { createPost, deletePostById, getPostById, getPosts, getUserPosts, postComment, postLike, updatePostById } from "./posts.controller.js";

const router = Router()

router.post('/',auth, createPost)
router.delete('/:id',auth, deletePostById)
router.put('/:id',auth, updatePostById)
router.get('/own',auth, getUserPosts)
router.get('/',auth, getPosts)
router.get('/:id',auth, getPostById)
router.put('/like/:id',auth, postLike)
router.put('/comment/:id',auth, postComment)


export default router


