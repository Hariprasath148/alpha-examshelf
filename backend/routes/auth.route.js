import express from "express";
import { getStaff, login, logout ,add_user , forgotPassword } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/login",login);
router.post("/add-user",add_user);
router.post("/logout",logout);
router.post("/forgot-password", forgotPassword);
router.get("/getStaff", protectRoute , getStaff);

export default router;