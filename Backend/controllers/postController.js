import { Post } from "../models/postSchema.js";
import { User } from "../models/userSchema.js";

export const createPost = async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!description || !id) {
      return res.status(401).json({
        message: "Fields are required.",
        success: false,
      });
    }
    const user = await User.findById(id).select("-password");
    await Post.create({
      description,
      userId: id,
      userDetails: user,
    });
    return res.status(201).json({
      message: "Post created successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Post deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const likeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (post.like.includes(loggedInUserId)) {
      // dislike post
      await Post.findByIdAndUpdate(postId, { $pull: { like: loggedInUserId } });
      return res.status(200).json({
        message: "You disliked this post.",
      });
    } else {
      // like post
      await Post.findByIdAndUpdate(postId, { $push: { like: loggedInUserId } });
      return res.status(200).json({
        message: "You liked this post.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkOrUnbookmark = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (post.bookmark.includes(loggedInUserId)) {
      // remove post from bookmarks
      await Post.findByIdAndUpdate(postId, { $pull: { bookmark: loggedInUserId } });
      return res.status(200).json({
        message: "Bookmark removed.",
      });
    } else {
      //  add post to bookmarks
      await Post.findByIdAndUpdate(postId, { $push: { bookmark: loggedInUserId } });
      return res.status(200).json({
        message: "Bookmark added.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (req, res) => {
  // posts of logged-in user + posts of following-users.
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const loggedInUserPosts = await Post.find({ userId: id }); //logged in user work done
    const followingUserPosts = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Post.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      posts: loggedInUserPosts.concat(...followingUserPosts),
    });
  } catch (error) {
    console.log(error);
  }
};
export const getFollowingPosts = async (req, res) => {
  // posts of following-users only.
  try {
    const id = req.params.id;
    const loggedInUser = await User.findById(id);
    const followingUserPosts = await Promise.all(
      loggedInUser.following.map((otherUsersId) => {
        return Post.find({ userId: otherUsersId });
      })
    );
    return res.status(200).json({
      posts: [].concat(...followingUserPosts),
    });
  } catch (error) {
    console.log(error);
  }
};
