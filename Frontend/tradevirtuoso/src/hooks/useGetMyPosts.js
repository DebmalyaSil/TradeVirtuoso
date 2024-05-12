import axios from "axios";
import { POST_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../redux/postSlice";

const useGetMyPosts = (id) => {
  const dispatch = useDispatch();
  const { refresh, isActive } = useSelector(store => store.post);
  
  const fetchMyPosts = async () => {
    try {
      const res = await axios.get(`${POST_API_END_POINT}/allposts/${id}`, {
        withCredentials: true
      });
      console.log(res);
      dispatch(getAllPosts(res.data.posts));
    } catch (error) {
      console.log(error);
    }
  };
  const followingPostHandler = async () => {
    try {
      axios.defaults.withCredentials=true;
      const res = await axios.get(`${POST_API_END_POINT}/followingposts/${id}`);
      console.log(res);
      dispatch(getAllPosts(res.data.posts));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isActive){
      fetchMyPosts();
    }
    else{
      followingPostHandler();
    }
  }, [isActive,refresh]);
};
export default useGetMyPosts;
