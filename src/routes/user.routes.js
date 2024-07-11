import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

router.route("/register").post(registerUser);

//for secured routes
export default router;
