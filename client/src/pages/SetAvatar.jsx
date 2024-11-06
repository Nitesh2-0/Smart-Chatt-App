import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from '../utils/APIRoutes'
import axios from "axios";
import { PropagateLoader } from 'react-spinners';

export default function SetAvatar() {
  const api = "https://randomuser.me/api/?results=4";
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login')
    }
  }, [])

  const toastOptions = {
    position: "top-right",
    autoClose: 6000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem('chat-app-user'))
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar].picture.large
      })

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-app-user', JSON.stringify(user));
        toast.success(data.msg, toastOptions);
      }
      navigate('/')
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch(api);
        const data = await response.json();
        setAvatars(data.results);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen bg-gray-900">
          <PropagateLoader
            color="#0ff6ca"
            loading
            size={30}
            speedMultiplier={1}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-12 bg-gray-800 h-screen p-5">
          <h1 className="text-white text-3xl font-semibold text-center">
            Pick an Avatar as Your Profile Picture
          </h1>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`p-2 rounded-full transition-all duration-300 border-4 cursor-pointer transform hover:scale-105 ${selectedAvatar === index ? "border-indigo-500" : "border-transparent"}`}
                onClick={() => setSelectedAvatar(index)}
                aria-label={`Select Avatar ${index + 1}`}
                role="button"
              >
                <img
                  src={avatar.picture.large}
                  alt={`Avatar ${index + 1}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-5 w-full md:flex-row md:justify-center">
            <button
              onClick={setProfilePicture}
              className="bg-indigo-600 text-white py-3 px-8 rounded-lg font-bold uppercase tracking-wide transition duration-300 hover:bg-indigo-700 w-full md:w-auto"
            >
              Set as Profile Picture
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white py-3 px-8 rounded-lg font-bold uppercase tracking-wide transition duration-300 hover:bg-green-700 w-full md:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                Refresh For New <FaLongArrowAltRight />
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
