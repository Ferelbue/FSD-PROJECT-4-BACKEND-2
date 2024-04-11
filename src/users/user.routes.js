
import { Router } from "express";
import { deleteUserById, followUserById, getFollowers, getPostByUserId, getUserProfile, getUserProfileById, getUsers, updateUserProfile, updateUserRole } from "./user.controller.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import { auth } from "../middlewares/auth.js";

const router = Router()

router.get('/', auth, getUsers)
router.get('/profile', auth, getUserProfile)
router.get('/profile/:userId', auth, getUserProfileById)
router.put('/profile', auth, updateUserProfile)
router.delete('/:id', auth, isSuperAdmin, deleteUserById)
router.put('/:id/role', auth, isSuperAdmin, updateUserRole)
router.get('/posts/:userId', auth, isSuperAdmin, getPostByUserId)
router.put('/follow/:userId', auth, followUserById)
router.get('/followers', auth, getFollowers)

export default router


