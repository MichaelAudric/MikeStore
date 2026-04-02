import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderIdParamSchema,
} from "../lib/validators/order.validator.js";

const router = express.Router();

//All routes requires authentication
router.use(authenticate);

router.post("/", validate(createOrderSchema), asyncHandler(createOrder));

router.get("/my", asyncHandler(getMyOrders));

router.get("/", adminMiddleware, asyncHandler(getAllOrders));

router.get("/:id", validate(orderIdParamSchema), asyncHandler(getOrderById));

router.patch(
  "/:id",
  adminMiddleware,
  validate(updateOrderStatusSchema),
  asyncHandler(updateOrderStatus),
);

export default router;
