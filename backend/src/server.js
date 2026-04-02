import express from "express";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import cartRoutes from "./routes/cart.routes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const app = express();

app.use(helmet());

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 50,
  message: { message: "Too many requests, please try again later." },
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);

  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Internal server error" });
});

app.listen(env.PORT || 5000, () => {
  console.log(`Server running on port ${env.PORT}`);
});
