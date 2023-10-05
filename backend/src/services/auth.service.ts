import type { Request, Response } from "express";
import { selectUserForLogin, insertUser } from "../repository/user.repository";
import { logger } from "../config/logger";
import { UserLoginRequestBody, UserRequestBody } from "../types/user.type";
import { generateToken } from "../utils/token";
import bcrypt from "bcrypt";
import { PostgresError } from "postgres";

const register = async (req: Request, res: Response): Promise<void> => {
  const user: UserRequestBody = req.body;

  try {
    user.password = await bcrypt.hash(user.password, 10);

    const savedUser = await insertUser(user);

    logger.info(`User ${savedUser[0].email} created`);

    const token = generateToken(savedUser[0].id);

    res.status(201).json({ token });
  } catch (err) {
    if (err instanceof PostgresError) {
      logger.error(err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    logger.error("Something went wrong while creating user");
    res.status(400).json({ error: "Something went wrong" });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const user: UserLoginRequestBody = req.body;
  try {
    const userFromDB = await selectUserForLogin(user);
    if(!userFromDB){
      logger.error("User not found");
      res.status(400).json({ error: "User not found" });
      return;
    }
    const checkPassword = await bcrypt.compare(
      user.password,
      userFromDB?.password!,
    );

    if (!checkPassword) {
      logger.error("Incorrect password");
      res.status(400).json({ error: "Incorrect password" });
      return;
    }

    const token = generateToken(userFromDB?.id!);

    res.status(200).json({ token });
  } catch (err) {
    if (err instanceof PostgresError) {
      logger.error(err.message);
      res.status(400).json({ error: err.message });
      return;
    }
    logger.error("Something went wrong while logging in");
    res.status(400).json({ error: "Something went wrong" });
  }
};

export const authService = {
  register,
  login,
};
