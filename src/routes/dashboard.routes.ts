import { Router } from "express";
import {
  summary,
  category,
  monthly,
} from "../controllers/dashboard.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/summary",
  authMiddleware,
  roleMiddleware(["viewer", "analyst", "admin"]),
  summary,
);
router.get(
  "/category",
  authMiddleware,
  roleMiddleware(["viewer", "analyst", "admin"]),
  category,
);
router.get(
  "/monthly",
  authMiddleware,
  roleMiddleware(["viewer", "analyst", "admin"]),
  monthly,
);

export default router;
