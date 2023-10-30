import { eq } from "drizzle-orm";
import db from "../db/db";
import { App, apps, NewApp } from "../db/schema/apps";

const selectApp = (userId: string, appId: string) => {
  return db.query.apps.findFirst({
    where: ((app, { eq, and }) =>
      and(eq(app.userId, userId), eq(app.id, appId))),
    with: {
      secrets: {
        columns: {
          id: true,
          secretKey: true,
          createdAt: true,
        }
      }
    }
  });
};

const selectAppForAuth = (appKey: string) => {
  return db.query.apps.findFirst({
    where: ((app, { eq }) => eq(app.appKey, appKey)),
  });
};

const selectApps = (userId: string) => {
  return db.query.apps.findMany({
    where: eq(apps.userId, userId),
  });
};

const insertApp = (app: NewApp): Promise<App[]> => {
  return db.insert(apps).values(app).returning();
};

const updateApp = (appId: string, name: string): Promise<App[]> => {
  return db.update(apps).set({
    name: name,
  }).where(eq(apps.id, appId)).returning();
};

const deleteApp = (appId: string) => {
  return db.delete(apps).where(eq(apps.id, appId));
};

export {
  deleteApp,
  insertApp,
  selectApp,
  selectAppForAuth,
  selectApps,
  updateApp,
};
