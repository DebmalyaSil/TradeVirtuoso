import React from 'react';
import Avatar from 'react-avatar';
import { FaRegComments } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import avatar from '../images/trader.avif';
import axios from 'axios';
import { POST_API_END_POINT } from '../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getRefresh } from '../redux/postSlice';
import { timeSince } from '../utils/constant';
import { Link } from "react-router-dom";

const Post = ({post}) => {
    const {user} = useSelector(store=>store.user);
    const dispatch = useDispatch();
 const likeOrDislikeHandler = async(id) =>{
    try{
        const res = await axios.put(`${POST_API_END_POINT}/like/${id}`,{id:user?._id},{
            withCredentials:true
        })
        dispatch(getRefresh());
        
            toast.success(res.data.message);
        
    }
    catch(error){
        toast.success(error.response.data.message);
        console.log(error);
    }
 }
 const bookmarkOrUnbookmarkHandler = async(id) =>{
    try{
        const res = await axios.put(`${POST_API_END_POINT}/bookmark/${id}`,{id:user?._id},{
            withCredentials:true
        })
        dispatch(getRefresh());
        
            toast.success(res.data.message);
        
    }
    catch(error){
        toast.success(error.response.data.message);
        console.log(error);
    }
 }
 const deletePostHandler= async (id)=>{
    try {
        axios.defaults.withCredentials=true;
        const res = await axios.delete(`${POST_API_END_POINT}/delete/${id}`);
        console.log(res);
        dispatch(getRefresh());
        toast.success(res.data.message);
    } catch (error) {
        toast.success(error.response.data.message);
        console.log(error);
    }
 }

  return (
    <div>
        <div className="hover:bg-gray-100">
            <Link to={`/profile/${post?.userDetails[0]?._id}`} className='flex m-4 my-0 pt-4 hover:cursor-pointer'>
                <Avatar src={avatar} size="40" round={true} />
                <div className='w-full'>
                    <div className='flex items-center'>
                        <h1 className='font-bold text-m m-2 mr-0 hover:underline'>{post?.userDetails[0]?.name}</h1>
                        <p className='font-normal text-gray-500 text-m m-2'>{`@${post?.userDetails[0]?.username} • ${timeSince(post?.createdAt)}`}</p>
                    </div>
                    <div>
                        <p className='ml-2'>
                            {post?.description}
                        </p>
                    </div>
                </div>
            </Link>
            <div className='flex items-center justify-start py-2 border-b border-gray-100-1'>
                <div className='flex items-center justify-between ml-16 mr-4 w-full'>
                    <div className='flex p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                        <FaRegComments size="20px" color='#023e8a'/>
                        <p className='ml-1 text-sm'>0</p>
                    </div>
                    <div onClick = {()=>likeOrDislikeHandler(post?._id)} className='flex p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer'>
                        <FaRegHeart size="18px" color='#023e8a'/>
                        <p className='ml-1 text-sm'>{post?.like?.length}</p>
                    </div>
                    <div onClick = {()=>bookmarkOrUnbookmarkHandler(post?._id)} className='p-2 rounded-full hover:bg-gray-200 hover:cursor-pointer flex'>
                        <FaRegBookmark size="18px" color='#023e8a'/>
                        <p className='ml-1 text-sm'>{post?.bookmark?.length}</p>
                    </div>
                    {
                        user?._id===post?.userId && (
                            <div onClick={()=>deletePostHandler(post?._id)} className='p-2 rounded-full hover:bg-red-200 hover:cursor-pointer'>
                                <AiOutlineDelete size="24px" color='#023e8a'/>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Post