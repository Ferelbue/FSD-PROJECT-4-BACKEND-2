
import { Router } from "express";
import { deleteUserById, followUserById, getPostByUserId, getUserProfile, getUsers, updateUserProfile, updateUserRole } from "./user.controller.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import { auth } from "../middlewares/auth.js";

const router = Router()

router.get('/', auth, getUsers)
router.get('/profile', auth, getUserProfile)
router.put('/profile', auth, updateUserProfile)
router.delete('/:id', auth, deleteUserById)
router.put('/:id/role', auth, updateUserRole)
router.get('/posts/:userId', auth, getPostByUserId)
router.put('/follow/:userId', auth, followUserById)

export default router


