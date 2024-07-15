import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import auth from "./routes/auth.js";
import errorHandler from "./utils/errorHandler.js";
import authMiddleware from "./middleware/auth.js";
import draw from "./routes/draw.js";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use("/auth", auth);
app.use("/draw", authMiddleware, draw);

app.get("/protected-route", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.get("/ping", (req, res) => {
  res.json({ message: "This is a protected route" });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
