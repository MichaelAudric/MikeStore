import express from "express";
import {
  getAllProducts,
  getProductsById,
  createProduct,
  updateProduct,
  deleteProduct,
  adminProduct,
} from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "../lib/validators/product.validator.js";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";

const router = express.Router();

router.get("/", asyncHandler(getAllProducts));

//Admin Only
router.get("/my", authenticate, adminMiddleware, asyncHandler(adminProduct));

router.get("/:id", validate(productIdSchema), asyncHandler(getProductsById));

//Admin Only
router.post(
  "/",
  authenticate,
  adminMiddleware,
  validate(createProductSchema),
  asyncHandler(createProduct),
);

//Admin Only
router.put(
  "/:id",
  authenticate,
  adminMiddleware,
  validate(updateProductSchema),
  asyncHandler(updateProduct),
);

//Admin Only
router.delete(
  "/:id",
  authenticate,
  adminMiddleware,
  validate(productIdSchema),
  asyncHandler(deleteProduct),
);

export default router;
