import { eq } from "drizzle-orm";
import db from "../db/db";
import { NewSecret, Secret, secrets } from "../db/schema/secrets";

const selectSecret = (appId: string, secretId: string) => {
  return db.query.secrets.findFirst({
    where: ((secret, { eq, and }) =>
      and(eq(secret.appId, appId), eq(secret.id, secretId))),
  });
};

const selectSecrets = (appId: string) => {
  return db.query.secrets.findMany({
    where: ((secret, { eq }) => eq(secret.appId, appId)),
  });
};

const insertSecret = (secret: NewSecret): Promise<Secret[]> => {
  return db.insert(secrets).values(secret).returning();
};

const deleteSecret = (secretId: string) => {
  return db.delete(secrets).where(eq(secrets.id, secretId));
};

export { deleteSecret, insertSecret, selectSecrets, selectSecret };
