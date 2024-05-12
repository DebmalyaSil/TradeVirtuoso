import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    like: {
      type: Array,
      default: [],
    },
    bookmark: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // yahan bola hai check karne ke liye ----> ref:"User",

      extended:true
    },
    userDetails:{
      type: Array,
      default: []
    },
  },
  { timestamps: true }
);
export const Post = mongoose.model("Post", postSchema);
