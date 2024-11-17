import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const port = 3000;

import authRouter from "./routers/authRouter.js";

app.use("/api", authRouter);

// All Routes
app.get("/", (req, res) => {
  res.json({ msg: "Welcome to my website" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
