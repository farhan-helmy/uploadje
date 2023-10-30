import { eq } from "drizzle-orm";
import db from "../db/db";
import { NewSecret, Secret, secrets } from "../db/schema/secrets";

const selectSecret = (appId: string, secretKey: string) => {
  return db.query.secrets.findFirst({
    where: ((secret, { eq, and }) =>
      and(eq(secret.appId, appId), eq(secret.secretKey, secretKey))),
  });
};

const selectSecrets = (appId: string) => {
  return db.query.secrets.findMany({
    where: ((secret, { eq }) => eq(secret.appId, appId)),
    with: {
      app: {
        columns: {
          appKey: true,
        },
      }
    }
  });
};

const insertSecret = (secret: NewSecret): Promise<Secret[]> => {
  return db.insert(secrets).values(secret).returning();
};

const deleteSecret = (secretId: string) => {
  return db.delete(secrets).where(eq(secrets.id, secretId));
};

export { deleteSecret, insertSecret, selectSecrets, selectSecret };
