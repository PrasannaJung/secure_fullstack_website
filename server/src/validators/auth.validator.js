const { z } = require("zod");

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(30, { message: "Username must be at most 30 characters long" }),
  phone: z
    .string()
    .trim()
    .regex(/^(\+977\s?)?9[78]\d{8}$/, {
      message:
        "Phone number must be 10 digits or in the format +977 9XXXXXXXXX",
    }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" }),
});

const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^(\+977\s?)?9[78]\d{8}$/, {
      message:
        "Phone number must be 10 digits or in the format +977 9XXXXXXXXX",
    }),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

module.exports = {
  signupSchema,
  loginSchema,
};
