import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token" });
  }

  const token = authHeader.split(" ")[1]; // FIX 1 remove bearer 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // FIX 2
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" }); // FIX 3
  }
};

export default authMiddleware;
