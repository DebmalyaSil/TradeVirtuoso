import React from "react";
import { useState } from "react";
import heroimage from "../images/heroimage2.svg";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/userSlice";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // login
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/login`,
          { email, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        dispatch(getUser(res?.data?.user));
        if (res.data.success){
            navigate("/");
            toast.success(res.data.message);
        }
      } catch (error) {
        toast.success(error.response.data.message);
        console.log(error);
      }
    } else {
      // sign up
      try {
        const res = await axios.post(
          `${USER_API_END_POINT}/register`,
          { name, username, email, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (res.data.success){
            setIsLogin(true);
            toast.success(res.data.message);
        }
      } catch (error) {
        toast.success(error.response.data.message);
        console.log(error);
      }
    }
  };

  const loginSignupSwitch = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[60%] bg-[#323e8a] h-[100vh]">
        <div className="mt-28">
          <div className="w-full flex-column items-center justify-center pl-10">
            <h1 className="font-extrabold text-8xl text-white">Hello</h1>
            <h1 className="font-extrabold text-8xl text-white">
              TradeVirtuoso!👋🏼
            </h1>
            <p className="mt-4 font-extrabold text-3xl text-white">
              "Empower Your Trading Journey, Virtually Risk-Free"
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 w-[60%]">
          <div className="flex items-center justify-center">
            <img
              src={heroimage}
              alt="hero-image"
              className="h-80 object-cover"
            />
          </div>
        </div>
      </div>
      <div className="w-[40%] flex items-center justify-center">
        <div className="w-[75%] flex-column items-center justify-center">
          <div>
            <h1 className="font-extrabold text-4xl mb-16 text-[#323e8a]">
              TradeVirtuoso
            </h1>
          </div>
          <div>
            <h1 className="font-extrabold text-3xl mb-2 text-[#323e8a]">
              {isLogin ? "Welcome Back!" : "Hey there!"}
            </h1>
            <p className="font-normal text-gray-500 text-sm">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span
                className="text-black underline hover:cursor-pointer hover:text-[#323e8a]"
                onClick={loginSignupSwitch}
              >
                {isLogin ? "Sign up now." : "Login here."}
              </span>
            </p>
          </div>
          <form onSubmit={submitHandler}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full p-4 my-4 outline-none border-b-2 border-[#323e8a] rounded-m hover:bg-gray-100 font-normal text-lg leading-5"
                ></input>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-4 my-4 outline-none border-b-2 border-[#323e8a] rounded-m hover:bg-gray-100 font-normal text-lg leading-5"
                ></input>
              </>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-4 my-4 outline-none border-b-2 border-[#323e8a] rounded-m hover:bg-gray-100 font-normal text-lg leading-5"
            ></input>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-4 my-4 outline-none border-b-2 border-[#323e8a] rounded-m hover:bg-gray-100 font-normal text-lg leading-5"
            ></input>
            <div>
              <button className="py-2.5 mt-8 border-none w-full rounded-lg bg-[#323e8a] font-bold text-xl text-white">
                {isLogin ? "Login" : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
