import express from "express";
import {
  getCart,
  addItemToCart,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
} from "../controllers/cart.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  addCartItemSchema,
  cartProductIdSchema,
  updateCartItemSchema,
} from "../lib/validators/cart.validator.js";

const router = express.Router();

//Authentication required for all
router.use(authenticate);

//Get current user's cart
router.get("/", asyncHandler(getCart));

//Add item to user's cart
router.post("/items", validate(addCartItemSchema), asyncHandler(addItemToCart));

//Remove item from user's cart
router.delete(
  "/items/:productId",
  validate(cartProductIdSchema),
  asyncHandler(removeCartItem),
);

//Update item's quantity
router.patch(
  "/items/:productId",
  validate(updateCartItemSchema),
  asyncHandler(updateCartItemQuantity),
);

//Clear cart
router.delete("/clear", asyncHandler(clearCart));

export default router;
