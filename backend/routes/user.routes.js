import express from "express"

import { getCurrent, updateAssistant, askToAssistant, getHistory, clearHistory, searchSocialMedia } from "../controllers/user.controllers.js"
import { isAuth } from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"

const router = express.Router()

router.get("/current", isAuth, getCurrent)
router.post("/update-assistant", isAuth, upload.single("assistantImage"), updateAssistant)
router.post("/askToAssistant", isAuth, askToAssistant)
router.get("/history", isAuth, getHistory)
router.post("/clear-history", isAuth, clearHistory)
router.post("/search-social", isAuth, searchSocialMedia)

export default router
