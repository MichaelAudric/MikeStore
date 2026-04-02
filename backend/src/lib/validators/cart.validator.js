import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive("Quantity must be at least 1"),
  }),
});

export const cartProductIdSchema = z.object({
  params: z.object({
    productId: z.string().uuid(),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    productId: z.string().uuid(),
  }),
  body: z.object({
    newQuantity: z.number().int().positive(),
  }),
});
