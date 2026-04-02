import prisma from "../lib/prisma.js";
import { getUserCart } from "../service/cart.js";

export const getCart = async (req, res) => {
  const user = req.user;

  const cart = await getUserCart(user.id);

  res.json(cart || { items: [] });
};

export const addItemToCart = async (req, res) => {
  const user = req.user;
  const { productId, quantity } = req.validatedData.body;

  let cart = await getUserCart(user.id);

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: user.id },
    });
  }

  await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product || product.stock < quantity) throw new Error("Out of stock");

    await tx.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });

    await tx.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, productId, quantity },
    });
  });

  const updatedCart = await getUserCart(user.id);

  res.json(updatedCart);
};

export const removeCartItem = async (req, res) => {
  const user = req.user;
  const { productId } = req.validatedData.params;

  const cart = await getUserCart(user.id);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    await tx.product.update({
      where: { id: productId },
      data: { stock: { increment: cartItem.quantity } },
    });
    await tx.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });
  });

  const updatedCart = await getUserCart(user.id);

  res.json(updatedCart);
};

export const updateCartItemQuantity = async (req, res) => {
  const user = req.user;
  const { productId } = req.validatedData.params;
  const { newQuantity } = req.validatedData.body;

  const cart = await getUserCart(user.id);

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  await prisma.$transaction(async (tx) => {
    const cartItem = await tx.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    const oldQuantity = cartItem.quantity;

    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    if (product.stock < newQuantity - oldQuantity)
      throw new Error("Out of stock");

    await tx.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      data: {
        quantity: newQuantity,
      },
    });

    await tx.product.update({
      where: { id: productId },
      data: { stock: { increment: oldQuantity - newQuantity } },
    });
  });

  const updatedCart = await getUserCart(user.id);

  res.json(updatedCart);
};

export const clearCart = async (req, res) => {
  const user = req.user;
  const cart = await getUserCart(user.id);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
  return res.json({ message: "Cart cleared successfully" });
};
