import { z } from "zod";

const createAppRequestBodySchema = z.object({
  name: z.string().min(1),
});

const updateAppRequestBodySchema = z.object({
  name: z.string().min(1).optional(),
});

type CreateAppRequestBody = z.infer<typeof createAppRequestBodySchema>;

type App = CreateAppRequestBody & {
  userId: string;
  appKey: string;
  appSecret: string;
};

export { App, createAppRequestBodySchema, updateAppRequestBodySchema };
