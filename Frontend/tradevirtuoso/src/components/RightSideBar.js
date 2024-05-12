import React from "react";
import Avatar from "react-avatar";
import { IoSearchSharp } from "react-icons/io5";
import avatar from "../images/trader.avif";
import { Link } from "react-router-dom";

const RightSideBar = ({ otherUsers }) => {
  return (
    <div className="w-[25%]">
      <div className="flex items-center justify-center">
        <div className="flex my-1.5 p-2 rounded-full bg-gray-100 hover:cursor-pointer w-[90%]">
          <div className="ml-2">
            <IoSearchSharp size="25px" color="#023e8a" />
          </div>
          <input
            className="w-full mx-4 outline-none border-none bg-gray-100 font-normal text-lg leading-5"
            type="text"
            placeholder="Search"
          ></input>
        </div>
      </div>
      <div className="flex items-center justify-center mt-2">
        <div className="border border-gray-100 rounded-2xl w-[90%]">
          <div className="flex items-center justify-center">
            <h1 className="font-bold text-xl w-[90%] p-2">Discover people</h1>
          </div>
          {otherUsers?.map((user) => {
            return (
              <div
                key={user?._id}
                className="flex items-center justify-center hover:bg-gray-100 border-b-white rounded-xl"
              >
                <div className="flex items-center justify-between w-[90%] p-2">
                  <Link to={`/profile/${user?._id}`}>
                    <div className="hover:cursor-pointer">
                      <Avatar src={avatar} size="40" round={true} />
                    </div>
                  </Link>
                  <div className="flex-column w-full">
                    <Link to={`/profile/${user?._id}`}>
                      <h1 className="font-bold text-sm hover:underline hover:cursor-pointer">{user?.name}</h1>
                    </Link>  
                    <Link to={`/profile/${user?._id}`}>
                      <p className="font-normal text-gray-500 text-sm">
                        {`@${user?.username}`}
                      </p>
                    </Link>
                  </div>
                  <div>
                    <Link to={`/profile/${user?._id}`}>
                      <button className="py-2 px-5 rounded-full bg-[#023e8a] hover:bg-[#323e8a] font-bold text-m text-white">
                        Profile
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
