import { Request, Response } from "express";
import { selectUserWithId } from "../repository/user.repository";

const getUser = async (req: Request, res: Response) => {
  const { id } = res.locals.user;
  try {
    const user = await selectUserWithId(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const meService = {
  getUser,
};
