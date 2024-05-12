import React from 'react';
import { AiOutlineStock } from "react-icons/ai";
import { BiHome } from "react-icons/bi";
import { IoSearchSharp } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";
import { PiBookmarkSimpleBold } from "react-icons/pi";
import { LuUser2 } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, getOtherUsers, getUser } from '../redux/userSlice';

const LeftSideBar = () => {
  const {user} = useSelector(store=>store.user);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const logoutHandler =  async() => {
    try {
      const res=await axios.get(`${USER_API_END_POINT}/logout`);
      dispatch(getUser(null));
      dispatch(getOtherUsers(null));
      dispatch(getMyProfile(null));
      navigate('/login');
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='w-[25%]'>
      <div>
        <div className='flex items-center'>
          {/* <img src="" alt="TradeVirtuoso-logo"/> */}
          <AiOutlineStock size="50px" className='ml-5 mb-1 text-[#023e8a]'/>
          <h1 className='font-bold text-4xl mr-5 text-[#023e8a]'>TV</h1>
        </div>
        <div>
          <Link to="/" className='flex items-center py-2 px-5 hover:bg-gray-100 hover:cursor-pointer w-fit rounded-full'>
            <BiHome size="30px" />
            <h1 className='font-bold text-xl ml-2'>Home</h1>
          </Link>
          <div className='flex items-center py-2 px-5 hover:bg-gray-100 hover:cursor-pointer w-fit rounded-full'>
            <IoSearchSharp size="30px"/>
            <h1 className='font-bold text-xl ml-2'>Explore</h1>
          </div>
          <div className='flex items-center py-2 px-5 hover:bg-gray-100 hover:cursor-pointer w-fit rounded-full'>
            <MdNotificationsNone size="30px"/>
            <h1 className='font-bold text-xl ml-2'>Notifications</h1>
          </div>
          <div className='flex items-center py-2 px-5 hover:bg-gray-100 hover:cursor-pointer w-fit rounded-full'>
            <PiBookmarkSimpleBold size="30px"/>
            <h1 className='font-bold text-xl ml-2'>Bookmarks</h1>
          </div>
          <Link to={`/profile/${user?._id}`} className='flex items-center py-2 px-5 hover:bg-gray-100 hover:cursor-pointer w-fit rounded-full'>
            <LuUser2 size="30px"/>
            <h1 className='font-bold text-xl ml-2'>Profile</h1>
          </Link>
          <div onClick={logoutHandler} className='flex items-center py-2 px-5 hover:bg-gray-100 hover:cursor-pointer w-fit rounded-full'>
            <MdLogout size="30px"/>
            <h1 className='font-bold text-xl ml-2'>Logout</h1>
          </div>
          <button className='py-2.5 my-3 border-none w-[75%] rounded-full bg-[#023e8a] hover:bg-[#323e8a] font-bold text-xl text-white'>Go to playground</button>
        </div>
      </div>
    </div>
  )
}

export default LeftSideBar