import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import healthRoute from "./api/health";
import authRoute from "./api/auth";
import userRoute from "./api/user";
import appRoute from "./api/app";
import imageRoute from "./api/image";
import secretRoute from "./api/secret";
import { logger } from "./config/logger";
import cors from 'cors';
import "./config/config";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use((req: Request, _: Response, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use("", healthRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/app", appRoute);
app.use("/v1/secret", secretRoute)
app.use("/v1/image", imageRoute);

app.listen(port, () => {
  console.log(`⚡️[UPLOADJE]: Server is running at http://localhost:${port}`);
});
