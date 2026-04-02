import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    price: z.number().positive("Price must be positive"),
    stock: z.number().int().min(0, "Stock cannot be negative"),
    description: z.string().min(5),
    imageUrl: z.string().url("Image must be a valid URL"),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().min(0).optional(),
    description: z.string().min(5).optional(),
    imageUrl: z.string().url().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
