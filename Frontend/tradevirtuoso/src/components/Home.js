import React, { useEffect } from 'react';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';
import { Outlet, useNavigate } from 'react-router-dom';
import useOtherUsers from '../hooks/useOtherUsers';
import { useSelector } from 'react-redux';
import useGetMyPosts from '../hooks/useGetMyPosts';

const Home = () => {
  const {user, otherUsers} = useSelector(store=>store.user);
  const navigate=useNavigate();
  useEffect(()=>{
    if (!user){
      navigate("/login");
    }
  },[]);
  // custom Hook
  useOtherUsers(user?._id);
  useGetMyPosts(user?._id);
  return (
    <div className='flex justify-between w-[90%] mx-auto'>
        <LeftSideBar/>
        <Outlet/>
        <RightSideBar otherUsers={otherUsers}/>
    </div>
  )
}

export default Home