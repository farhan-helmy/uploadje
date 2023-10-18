import { Request, Response } from "express";
import { selectUser } from "../repository/user.repository";
import { z } from "zod";


const getUser = async (req: Request, res: Response) => {
  try {
    const user = await selectUser(res.locals.user.id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const userService = {
  getUser,
};
