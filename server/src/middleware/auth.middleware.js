import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    req.userId = user._id;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error in isAuth" });
    console.log(error);
  }
};

export default isAuth;
