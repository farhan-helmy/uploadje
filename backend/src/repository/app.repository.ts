import { eq } from "drizzle-orm";
import db from "../db/db";
import { App, apps, NewApp } from "../db/schema/apps";

const selectApp = (userId: string, appId: string) => {
  return db.query.apps.findFirst({
    where: ((app, { eq, and }) =>
      and(eq(app.userId, userId), eq(app.id, appId))),
  });
};

const selectAppForAuth = (appId: string, appSecret: string) => {
  return db.query.apps.findFirst({
    where: ((app, { eq, and }) =>
      and(eq(app.appKey, appId), eq(app.appSecret, appSecret))),
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

const updateApp = (name: string): Promise<App[]> => {
  return db.update(apps).set({
    name: name,
  }).returning();
};

const deleteApp = (appId: string) => {
  return db.delete(apps).where(eq(apps.id, appId));
};

export { deleteApp, insertApp, selectApp, selectAppForAuth, selectApps, updateApp };