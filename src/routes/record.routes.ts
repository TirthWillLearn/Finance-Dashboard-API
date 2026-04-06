import { Router } from "express";
import {
  create,
  getAll,
  update,
  remove,
} from "../controllers/record.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["viewer", "analyst", "admin"]),
  getAll,
);
router.post("/", authMiddleware, roleMiddleware(["admin"]), create);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), update);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), remove);

export default router;
