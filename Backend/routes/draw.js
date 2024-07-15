import { Router } from "express";
import controller from "../controller/index.js";

const router = Router();

router.get("/", controller.draw.getDraws);
router.get("/:id", controller.draw.getDraw);
router.post("/create", controller.draw.createDraw);
router.put("/:id", controller.draw.updateDraw);
router.delete("/:id", controller.draw.deleteDraw);

export default router;
