import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";

import {upload} from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), registerUser) //http://localhost:8000/api/v1/users/register
// router.route("/login").post(loginUser) //http://localhost:8000/api/v1/users/login

export default router;