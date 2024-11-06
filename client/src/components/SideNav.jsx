import React, { useState } from 'react'
import { IoIosMenu } from 'react-icons/io';
import { HiChatAlt2 } from 'react-icons/hi';
import { IoIosSettings } from 'react-icons/io';
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { ProfileDets } from '../pages/ProfileDets';
import { VscClose } from "react-icons/vsc";
import { FaFolderOpen } from "react-icons/fa";
import { FaFolderClosed } from "react-icons/fa6";

const SideNav = ({ isGroup, setIsGroup, setHideContacts, hideContacts }) => {
  const [isProfile, setIsProfile] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('chat-app-user'));

  const showProfileDets = () => {
    setIsProfile(!isProfile);
  };
  const handleLogout = () => {
    localStorage.removeItem('chat-app-user');
    navigate('/login');
  };
  return (
    <div className='w-[16vw] md:w-[5vw]  h-full bg-[rgb(10,10,30)] flex flex-col justify-between'>
      <ul className='pt-5 h-[72vh] pb-5 flex flex-col items-center space-y-8'>
        <li onClick={() => setHideContacts(!hideContacts)} className='text-3xl cursor-pointer text-gray-400 hover:text-white'>
          {!hideContacts ? <FaFolderOpen /> : <FaFolderClosed />}
        </li>
        <li onClick={() => setIsGroup(!isGroup)} className='text-4xl cursor-pointer text-gray-400 hover:text-white'>
          {!isGroup ? <HiChatAlt2 /> : <VscClose />}
        </li>
      </ul>
      <ul className='pt-5 h-[28vh] pb-5 flex flex-col items-center space-y-8'>
        <li className='text-2xl relative rounded-full cursor-pointer text-gray-400 hover:text-white'>
          <button onClick={showProfileDets} className='border border-gray-700 rounded-full'>
            <img
              src={user?.avatarImage || 'https://via.placeholder.com/150'}
              alt="User Avatar"
              className='w-8 h-8 rounded-full object-cover'
            />
          </button>
          {isProfile && (
            <div className='absolute z-50 p-2 rounded-r bg-[rgb(10,10,30)] text-white left-12 -top-44'>
              <ProfileDets det={user} />
            </div>
          )}
        </li>
        <li className='text-3xl cursor-pointer text-gray-400 hover:text-white'>
          <IoIosSettings />
        </li>
        <li className='text-3xl cursor-pointer text-gray-400 hover:text-white'>
          <RiLogoutCircleLine onClick={handleLogout} />
        </li>
      </ul>
    </div>
  )
}

export default SideNav