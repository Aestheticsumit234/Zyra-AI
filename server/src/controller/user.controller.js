import User from "../model/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error in getCurrentUser!",
    });
  }
};
