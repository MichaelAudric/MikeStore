import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//REGISTER
export const register = async (req, res) => {
  const { email, password, name, address } = req.validatedData.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 13);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "USER",
      name,
      address,
    },
  });

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "Register successful",
  });
};

//LOGIN
export const login = async (req, res) => {
  const { email, password } = req.validatedData.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful" });
};

//Get user info
export const getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};

//LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({ message: "Logged out successfully" });
};

//EDIT PROFILE
export const editProfile = async (req, res) => {
  const { name, address } = req.validatedData.body;

  const profile = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, address },
    select: {
      id: true,
      email: true,
      name: true,
      address: true,
      role: true,
    },
  });

  res.json(profile);
};
