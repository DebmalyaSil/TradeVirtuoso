import React from "react";
import banner from "../images/banner.jpeg";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import avatar from "../images/trader.avif";
import useGetProfile from "../hooks/useGetProfile";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { followingUpdate } from "../redux/userSlice";

const Profile = () => {
  const { user, profile } = useSelector((store) => store.user);
  const { id } = useParams();
  useGetProfile(id);
  const dispatch = useDispatch();

  const followAndUnfollowHandler =async () => {
    if (user.following.includes(id)){
      // unfollow kar denge
      try {
        axios.defaults.withCredentials=true;
        const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, {id:user?._id});
        console.log(res);
        dispatch(followingUpdate(id));
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }else{
      // follow kar denge
      try {
        axios.defaults.withCredentials=true;
        const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, {id:user?._id});
        console.log(res);
        dispatch(followingUpdate(id));
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    }
  }
  return (
    <div className="w-[50%] min-h-screen border-x border-gray-100">
      <div className="flex items-center justify-start py-1">
        <Link
          to="/"
          className="rounded-full p-2 ml-2 mr-6 hover:cursor-pointer hover:bg-gray-100"
        >
          <IoArrowBackSharp size="20px" />
        </Link>
        <div>
          <h1 className="font-bold text-xl">{profile?.name}</h1>
          {/* <p className="font-normal text-gray-500 text-sm">427 posts</p> */}
        </div>
      </div>
      <div>
        <img src={banner} alt="banner" className="h-56 w-full object-cover" />
      </div>
      <div className="absolute ml-4 top-52 left-100 w-fit rounded-full border-4 border-[white]">
        <Avatar src={avatar} size="150" round={true} />
      </div>
      <div className="flex items-center justify-end pt-4 pb-8 pr-5">
        {/* <button className="py-2 px-5 rounded-full border-2 border-gray-300 font-bold text-m text-[#023e8a]">
          {profile?._id === user?._id
            ? "Edit Profile"
            : user.following.includes(id)
            ? "Following"
            : "Follow"}
        </button> */}

        {
          profile?._id === user?._id ? (
            <button className="py-2 px-5 rounded-full border-2 border-gray-300 font-bold text-m text-[#023e8a]">Edit Profile</button>
          ):(
            <button onClick={followAndUnfollowHandler} className="py-2 px-5 rounded-full font-bold text-m text-[white] bg-[#023e8a]">
              {user.following.includes(id) ? "Following" : "Follow"}
            </button>
          )
        }
      </div>
      <div className="flex-column px-4 pt-2">
        <h1 className="font-extrabold text-2xl">{profile?.name}</h1>
        <p className="font-normal text-gray-500 text-m">{`@${profile?.username}`}</p>
      </div>
      <div className="p-4 border-b border-gray-100">
        <p>
          Hi! I'm {profile?.name}, a stock trader with humour & losses. Follow my advice
          cautiously, profits not guaranteed! 💸📉
        </p>
      </div>
    </div>
  );
};

export default Profile;
