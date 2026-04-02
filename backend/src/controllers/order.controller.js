import prisma from "../lib/prisma.js";
import { getUserCart } from "../service/cart.js";

export const createOrder = async (req, res) => {
  const userId = req.user.id;

  // Fetch the user's cart from the database
  const cart = await getUserCart(userId);

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const result = await prisma.$transaction(async (tx) => {
    // Fetch products from DB to validate stock and prices
    const productIds = cart.items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new Error("Some products in the cart were not found");
    }

    const productMap = new Map();
    products.forEach((product) => productMap.set(product.id, product));

    // Calculate total and check stock
    let totalPaid = 0;
    for (const cartItem of cart.items) {
      const product = productMap.get(cartItem.productId);

      if (product.stock < cartItem.quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }

      totalPaid += product.price * cartItem.quantity;
    }

    // Create the order
    const order = await tx.order.create({
      data: {
        userId,
        address: req.validatedData.body.address, // user can still provide a shipping address
        totalPaid,
      },
    });

    // Create orderItems & decrement stock
    for (const cartItem of cart.items) {
      const product = productMap.get(cartItem.productId);

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: cartItem.quantity,
          price: product.price,
        },
      });

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: cartItem.quantity } },
      });
    }

    // Clear the cart after successful order
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });

  res.status(201).json(result);
};

export const getMyOrders = async (req, res) => {
  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(orders);
};

export const getOrderById = async (req, res) => {
  const { id } = req.validatedData.params;
  const user = req.user;

  const order = await prisma.order.findFirst({
    where:
      user.role === "ADMIN"
        ? { id } // admin can access any order
        : { userId: user.id, id }, // normal user only their own order
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(order);
};

//Admin only!
export const getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          product: {
            createdById: req.user.id,
          },
        },
      },
    },
    include: {
      user: true,
      orderItems: {
        where: {
          product: {
            createdById: req.user.id,
          },
        },
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
};

//Admin only!
export const updateOrderStatus = async (req, res) => {
  const { id } = req.validatedData.params;
  const { orderStatus } = req.validatedData.body;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: true },
  });
  console.log(order);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const allowedTransitions = {
    PENDING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.orderStatus].includes(orderStatus)) {
    return res.status(400).json({
      message: `Cannot change status from ${order.orderStatus} to ${orderStatus}`,
    });
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (orderStatus === "CANCELLED") {
      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }

    return await tx.order.update({
      where: { id },
      data: { orderStatus },
    });
  });

  res.json(updated);
};
