import { z } from "zod";

// Register validation
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    address: z.string().min(4, "Address is required"),
  }),
});

// Login validation
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Edit profile validation
export const editProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    address: z.string().optional(),
  }),
});
