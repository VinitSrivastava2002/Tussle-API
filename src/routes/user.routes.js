import { Router } from "express";
import {
  checkUserExistence,
  createUser,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Routes
router.route("/check-user-existence").post(checkUserExistence);

router.route("/create-user").post(upload.single("profilePic"), createUser);

//for secured routes
export default router;
