import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }

    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid Admin",
      });
    }

    next();
  } catch (error) {
    console.log("error:", error);
    res.status(403).json({ success: false, message: "Token Invalid or Expired" });
  }
};

export default authAdmin;
