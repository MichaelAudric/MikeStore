import { z } from "zod";

// Validate order creation
export const createOrderSchema = z.object({
  body: z.object({
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address is too long"),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    orderStatus: z.enum(["PENDING", "SHIPPED", "COMPLETED", "CANCELLED"]),
  }),
});

export const orderIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
