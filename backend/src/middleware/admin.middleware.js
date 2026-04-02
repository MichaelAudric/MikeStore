export default (req, res, next) => {
  //req.user should already exist from auth.middleware.js
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Unauthorized: user not authenticated" });
  }

  if (req.user.role != "ADMIN") {
    return res.status(403).json({ message: "Access denied. Admin only!" });
  }

  next();
};
