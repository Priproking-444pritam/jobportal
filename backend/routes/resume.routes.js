import express from "express";
import { analyseResume } from "../controllers/resume.controller.js";
import { singleUpload } from "../middleware/multer.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/analyse", isAuthenticated, singleUpload, analyseResume);

export default router;