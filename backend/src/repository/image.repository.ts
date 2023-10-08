import { eq } from "drizzle-orm";
import db from "../db/db";
import { Image, images, NewImage } from "../db/schema/images";

const selectImage = (appId: string, imageId: string) => {
  return db.query.images.findFirst({
    where: ((image, { eq, and }) =>
      and(eq(image.appId, appId), eq(image.id, imageId))),
  });
};

const selectImages = (appId: string) => {
  return db.query.images.findMany({
    where: eq(images.appId, appId),
  });
};

const insertImage = (image: NewImage): Promise<Image[]> => {
  return db.insert(images).values(image).returning();
};

const deleteImage = (imageId: string) => {
  return db.delete(images).where(eq(images.id, imageId));
};

export { deleteImage, insertImage, selectImage, selectImages };
