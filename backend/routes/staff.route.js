import express from "express"
import { changeTheme, removeStaff, staffAllDetails } from "../controllers/staff.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/get-all-staff",protectRoute,staffAllDetails);
router.post("/remove-staff",removeStaff);
router.post("/change-theme",changeTheme);

export default router;