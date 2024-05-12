import React from "react";
import Avatar from "react-avatar";
import { FaImage } from "react-icons/fa";
import { PiGifBold } from "react-icons/pi";
import { MdOutlinePoll } from "react-icons/md";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import avatar from "../images/trader.avif";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { POST_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useState } from "react";
import { getAllPosts, getIsActive, getRefresh } from "../redux/postSlice";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const { user } = useSelector((store) => store.user);
  const { isActive } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const submitHandler = async () => {
    try {
      const res = await axios.post(
        `${POST_API_END_POINT}/create`,
        { description, id: user?._id },
        { withCredentials: true }
      );
      dispatch(getRefresh());
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
    setDescription("");
  };

  const forYouHandler = () => {
    dispatch(getIsActive(true))
  };
  const followingHandler = () => {
    dispatch(getIsActive(false));
  };

  // const followingPostHandler = async() => {
  //   const id = user?._id;
  //   try {
  //     const res= await axios.get(`${POST_API_END_POINT}/followingposts/${id}`);
  //     console.log(res);
  //     dispatch(getAllPosts(res.data.posts));
      
  //   } catch(error){
  //     console.log(error);
  //   }
  //   // dispatch(getIsActive(false));
  // };
  return (
    <div>
      <div className="flex items-center justify-between mx-auto">
        <div
          onClick={forYouHandler}
          className={`${
            isActive
              ? "border-b-4 border-[#023e8a]"
              : "border-b-4 border-transparent"
          } w-[50%] text-center p-3 hover:bg-gray-100 hover:cursor-pointer border-b border-gray-100-1`}
        >
          <h1 className="font-semibold text-gray-500 text-lg">For You</h1>
        </div>
        <div
          onClick={followingHandler}
          className={`${
            !isActive
              ? "border-b-4 border-[#023e8a]"
              : "border-b-4 border-transparent"
          } w-[50%] text-center p-3 hover:bg-gray-100 hover:cursor-pointer border-b border-gray-100-1`}
        >
          <h1 className="font-semibold text-gray-500 text-lg">Following</h1>
        </div>
      </div>
      <div>
        <div className="flex items-center">
          <Link to={`/profile/${user?._id}`}>
            <div className="m-4 mr-2 hover:cursor-pointer">
              <Avatar src={avatar} size="40" round={true} />
            </div>
          </Link>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mr-4 outline-none border-none font-normal text-lg leading-5"
            type="text"
            placeholder="Let them know..."
          ></input>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-gray-100-1">
          <div className="flex items-center justify-start ml-16">
            <div className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
              <FaImage size="20px" color="#023e8a" />
            </div>
            <div className="ml-4 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
              <PiGifBold size="20px" color="#023e8a" />
            </div>
            <div className="ml-4 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
              <MdOutlinePoll size="20px" color="#023e8a" />
            </div>
            <div className="ml-4 p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer">
              <MdOutlineEmojiEmotions size="20px" color="#023e8a" />
            </div>
          </div>
          <button
            onClick={submitHandler}
            className="py-2 px-5 mr-4 rounded-full bg-[#023e8a] hover:bg-[#323e8a] font-bold text-m text-white"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
