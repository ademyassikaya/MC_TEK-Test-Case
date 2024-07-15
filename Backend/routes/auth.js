// routes/auth.js

import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import controller from "../controller/index.js";

const router = Router();

// Public routes
router.post("/login", controller.auth.login);
router.post("/register", controller.auth.register);

// Protected route example
router.get("/protected-route", authMiddleware, (req, res) => {
  // Route handler logic for authenticated users
  res.json({ message: "This is a protected route", userId: req.userId });
});

export default router;
