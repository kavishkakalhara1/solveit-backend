import express from "express"
import { createIssue } from "../controllers/issue.controller.js"

const router = express.Router()

router.post("/add-issue", createIssue)

export default router