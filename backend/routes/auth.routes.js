import express from "express"
import { Login, signUp } from "../controllers/auth.controllers.js"

const router = express.Router()

router.post("/signin", Login)
router.post("/signup", signUp)

export default router
