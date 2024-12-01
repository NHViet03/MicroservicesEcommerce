import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

// // Config CORS
const corsOptions = {
  origin: [process.env.CLIENT_APP_URL, "https://brave-grass-0fb8e9100.5.azurestaticapps.net/"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

const port = 5000;

import authRouter from "./routers/authRouter.js";
import customerRouter from "./routers/customerRouter.js";

app.use("/api", authRouter);
app.use("/api", customerRouter);

// All Routes
app.get("/", (req, res) => {
  res.json({ msg: "Welcome to my website" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
