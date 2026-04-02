import prisma from "../lib/prisma.js";

export const getAllProducts = async (req, res) => {
  const search = req.query.search || "";
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
};

export const getProductsById = async (req, res) => {
  const { id } = req.validatedData.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

//Admin Only!
export const adminProduct = async (req, res) => {
  const user = req.user;

  const products = await prisma.product.findMany({
    where: { createdById: user.id },
  });

  res.json(products);
};

//Admin Only!
export const createProduct = async (req, res) => {
  const { name, description, price, stock, imageUrl } = req.validatedData.body;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
      createdById: req.user.id,
    },
  });

  res.status(201).json(product);
};

//Admin Only!
export const updateProduct = async (req, res) => {
  const { id } = req.validatedData.params;
  const { name, description, price, stock, imageUrl } = req.validatedData.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      price,
      stock,
      imageUrl,
    },
  });

  res.json(product);
};

//Admin Only!
export const deleteProduct = async (req, res) => {
  const { id } = req.validatedData.params;

  await prisma.product.delete({
    where: { id },
  });

  res.json({ message: "Product deleted" });
};
