import React, { useState } from 'react';
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { FaRocketchat } from "react-icons/fa";
import { toast } from 'react-toastify';
import { loginRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { json, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const { data } = await axios.post(loginRoute, {
          email: formData.email,
          password: formData.password
        })
        if (data.status === false) {
          toast.error(data.msg || 'Something went wrong!', toastOptions);
        }
        if (data.status === true) {
          toast.success(data.msg || 'Login successfull!', toastOptions);
          localStorage.setItem('chat-app-user', JSON.stringify(data.user));
          navigate('/')
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.msg || 'Something went wrong, please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-gray-800 text-gray-100">

      <div className="flex items-center lg:rounded-r-[7rem] justify-center w-full md:w-1/2 h-1/2 md:h-full bg-gradient-to-br from-gray-900/50 via-gray-700/50 to-gray-900/50 rounded-b-lg md:rounded-r-lg">
        <div className='text-center'>
          <div className='flex items-center justify-center'>
            <FaRocketchat className='text-7xl mr-2 text-green-700' />
            <h2 className="text-5xl font-bold text-blue-500">SmartChat</h2>
          </div>
          <p className="mt-5 text-lg">Connect, Share, and Grow Together</p>
        </div>
      </div>

      <div className="flex justify-center items-center w-full md:w-1/2 h-1/2 md:h-full">
        <div className="w-full max-w-lg p-8 rounded-lg bg-gray-900 shadow-lg">
          <h1 className="text-3xl font-semibold mb-6 text-center">Login to SmartChat</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`}
              />
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showPassword ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
              </span>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-400 text-center">
            Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;