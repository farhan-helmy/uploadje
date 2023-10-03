import { eq } from "drizzle-orm";
import db from "../db/db";
import { NewUser, User, users } from "../db/schema/users";
import { UserLoginRequestBody } from "../types/user.type";

const selectUserForLogin = (user: UserLoginRequestBody) => {
  return db.query.users.findFirst({
    where: eq(users.email, user.email),
  });
};

const selectUser = (email: string) => {
  return db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      email: true,
    },
    with: {
      apps: true,
    },
  });
};

const selectUsers = () => {
  return db.query.users.findMany();
};

const insertUser = (user: NewUser): Promise<User[]> => {
  return db.insert(users).values(user).returning();
};

const updateUser = (user: User): Promise<User[]> => {
  return db.update(users).set(user);
};

const deleteUser = (id: string) => {
  return db.delete(users).where(eq(users.id, id));
};

export {
  deleteUser,
  insertUser,
  selectUser,
  selectUserForLogin,
  selectUsers,
  updateUser,
};
