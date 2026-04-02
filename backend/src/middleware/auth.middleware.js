import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const authenticate = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return res
      .status(401)
      .json({ message: "Unauthorized: invalid or expired token" });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      address: true,
    },
  });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;

  next();
};
