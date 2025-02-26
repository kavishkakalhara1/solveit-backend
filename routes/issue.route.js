import express from "express"
import { createIssue, getIssues } from "../controllers/issue.controller.js"

const router = express.Router()

router.post("/add-issue", createIssue)
router.get('/get-issues', getIssues)

export default router 