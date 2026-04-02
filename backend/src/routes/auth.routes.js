import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  editProfile,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  registerSchema,
  loginSchema,
  editProfileSchema,
} from "../lib/validators/auth.validator.js";

const router = express.Router();

//public routes (does not require authentication)
router.post("/register", validate(registerSchema), asyncHandler(register));

router.post("/login", validate(loginSchema), asyncHandler(login));

router.post("/logout", asyncHandler(logout));

//protected test route (requires authentication)
router.get("/me", authenticate, asyncHandler(getMe));

router.patch(
  "/me",
  authenticate,
  validate(editProfileSchema),
  asyncHandler(editProfile),
);

export default router;
