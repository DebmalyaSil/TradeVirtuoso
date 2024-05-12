import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { SiJsonwebtokens } from "react-icons/si";

export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // basic validation
    if (!name || !username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }
    // change User se users
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exists.",
        success: false,
      });
    }
    const hashedPassword = await bcryptjs.hash(password, 16);
    // change User se users
    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account created successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required.",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(201)
      .cookie("token", token, { expiresIn: "1d", httpOnly: true })
      .json({
        message: `Welcome Back ${user.name}!`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};
export const Logout = (req, res) => {
  return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
    message: "You logged out successfully.",
    success: true,
  });
};
export const Bookmark = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const postId = req.params.id;
    const user = await User.findById(loggedInUserId);
    if (user.bookmarks.includes(postId)) {
      // remove bookmark
      await User.findByIdAndUpdate(loggedInUserId, {
        $pull: { bookmarks: postId },
      });
      return res.status(200).json({
        message: "Removed from bookmarks.",
      });
    } else {
      // bookmark
      await User.findByIdAndUpdate(loggedInUserId, {
        $push: { bookmarks: postId },
      });
      return res.status(200).json({
        message: "Added to bookmarks.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getOtherUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const otherUsers = await User.find({ _id: { $ne: id } }).select(
      "-password"
    );
    if (!otherUsers) {
      return res.status(401).json({
        message: "No current users.",
      });
    }
    return res.status(200).json({
      otherUsers,
    });
  } catch (error) {
    console.log(error);
  }
};
export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id; //follower
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId); //follower
    const user = await User.findById(userId);
    if (!user.followers.includes(loggedInUserId)) {
      // already following check
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({
        message: `You are already following ${user.name}.`,
      });
    }
    return res.status(200).json({
      message: `You are now following ${user.name}.`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id; //follower
    const userId = req.params.id;
    const loggedInUser = await User.findById(loggedInUserId); //follower
    const user = await User.findById(userId);
    if (loggedInUser.following.includes(userId)) {
      // already following check
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({
        message: `You are not yet following ${user.name}.`,
      });
    }
    return res.status(200).json({
      message: `You just unfollowed ${user.name}.`,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
////// pahle isme likha tha getAllPosts
