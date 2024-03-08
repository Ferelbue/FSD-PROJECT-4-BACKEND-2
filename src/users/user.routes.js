
import { Router } from "express";
import { getUserProfile, getUsers } from "./user.controller.js";
import { isSuperAdmin } from "../middlewares/isSuperAdmin.js";
import { auth } from "../middlewares/auth.js";

const router = Router()

router.get('/',auth, getUsers)
router.get('/profile',auth, getUserProfile)


export default router


