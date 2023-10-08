import { z } from "zod";

const userRequestBodySchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/* Cannot use zod Omit because there's already refine in the schema */

const userLoginRequestBodySchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

type UserRequestBody = z.infer<typeof userRequestBodySchema>;
type UserLoginRequestBody = Omit<UserRequestBody, "confirmPassword">;

export {
  UserLoginRequestBody,
  userLoginRequestBodySchema,
  UserRequestBody,
  userRequestBodySchema,
};
