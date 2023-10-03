import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import healthRoute from "./api/health";
import authRoute from "./api/auth";
import userRoute from "./api/user";
import appRoute from "./api/app";
import imageRoute from "./api/image";
import { logger } from "./config/logger";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use((req: Request, _: Response, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use("", healthRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/app", appRoute);
app.use("/v1/image", imageRoute);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
