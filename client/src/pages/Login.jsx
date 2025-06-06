import React from "react";
import { useState } from "react";
import loginImage from "../assets/Group_790.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken, setSelectedValue }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const verification = () => {
    if (!password || !email) {
      toast.warning("Please enter both email and password!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      console.log(email);
      console.log(password);
      if (verification()) {
        const response = await axios.post(
          "http://localhost:3000/employee-login",
          {
            email,
            password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { token, employee } = response?.data || {};

        if (token && employee) {
          toast.success("Login successful!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });

          localStorage.setItem("Token", response?.data?.token);
          localStorage.setItem(
            "Employee",
            JSON.stringify(response?.data?.employee)
          );

          setToken(response?.data?.token);
          setSelectedValue("Dashboard");
          navigate("/");
        } else {
          toast.error("Invalid token!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
          });
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Login failed! Please try again.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex flex-row justify-center items-center space-x-1 w-full h-screen max-w-full">
      <div
        className="flex-1 bg-gradient-to-br from-pink-100 via-rose-200 to-rose-100

 h-full px-28 "
      >
        <div className=" flex flex-col justify-center items-center p-2 w-full  h-full space-y-10">
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1041/1041883.png"
              alt="Waving Hand"
              className="w-20 mb-4"
            />
            <h2 className="text-2xl text-[#424242] font-semibold">
              Welcome to <span className="text-[#853169]">Leave Manager </span>{" "}
              👋
            </h2>
            <p className="text-gray-600 text-center">
              Please sign in to manage your leaves efficiently.
            </p>
          </div>
          <div className="flex flex-col justify-center items-start space-y-1 w-full px-10">
            <p className="text-[#616161] text-lg ">Email</p>
            <input
              className="px-4 py-2 h-12  bg-[#F5F5F5] border border-[#dfdfdf] rounded-lg w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#dfdfdf]"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-center items-start space-y-1 w-full px-10">
            <p className="text-[#616161] text-lg">Password</p>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                className="px-4 py-2 h-12  bg-[#F5F5F5] border border-[#dfdfdf] rounded-lg w-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[#dfdfdf]"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {!showPassword ? (
                  <AiFillEye size={24} className="text-[#2F3538]" />
                ) : (
                  <AiFillEyeInvisible size={24} className=" text-[#2F3538] " />
                )}
              </span>
            </div>
          </div>
          <div className="w-full px-10">
            <button
              onClick={handleSubmit}
              className="w-full border text-white bg-[#853169]  rounded-lg px-4 py-2 h-13 cursor-pointer hover:scale-105 hover:text-xl"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 h-screen">
        <img src={loginImage} className=" object-cover h-screen w-full" />
      </div>
    </div>
  );
};

export default Login;
