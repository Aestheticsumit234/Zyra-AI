import { genToken } from "../config/Token.js";
import User from "../model/user.model.js";

// get the data from frontend
export const googleAuth = async (req, res) => {
  try {
    const { name, email, photoURL } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        success: true,
        message: "user already exist",
      });
    }

    const newUser = await User.create({
      name,
      email,
      photoURL,
    });

    const token = await genToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "user created successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error! and Google auth Error in googleAuth",
      error,
    });
    console.log(error);
  }
};

export const logout = async (res, req) => {
  try {
    await res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error! and Google auth Error in logout",
      error,
    });
    console.log(error);
  }
};
