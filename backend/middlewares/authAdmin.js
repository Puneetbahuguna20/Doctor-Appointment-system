import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    // Check for token in different header formats
    const token = req.headers.atoken || req.headers.authorization?.split(' ')[1] || req.headers['x-access-token'];
    
    console.log("Headers received:", req.headers);
    console.log("Token extracted:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid Admin",
      });
    }

    next();
  } catch (error) {
    console.log("Auth error:", error);
    res.status(403).json({ success: false, message: "Token Invalid or Expired" });
  }
};

export default authAdmin;
