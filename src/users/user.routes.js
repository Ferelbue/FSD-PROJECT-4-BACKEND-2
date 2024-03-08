
import { Router } from "express";
import { getUserProfile, getUsers, updateUserProfile } from "./user.controller.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import { auth } from "../middlewares/auth.js";

const router = Router()

router.get('/',auth, getUsers)
router.get('/profile',auth, getUserProfile)
router.put('/profile',auth, updateUserProfile)


export default router


