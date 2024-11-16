import React from 'react';
import { FaEnvelope, FaUser, FaCheckCircle } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { IoIosClose } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

export const ProfileDets = ({ det, hide, setHide }) => {
  const navigation = useNavigate();

  return (
    <div className='p-6 flex flex-col z-50 bg-[rgb(20,18,50)] text-white rounded-r-lg shadow-xl w-96 relative'>

      {!det.isAvatarImageSet &&
        <IoIosClose onClick={() => setHide(!hide)} className='text-xl cursor-pointer text-gray-300' />
      }

      {det.isAvatarImageSet && (
        <div className='absolute top-4 right-4'>
          <MdVerified className='text-blue-400 text-xl' />
        </div>
      )}

      <div className='flex flex-col items-center'>
        <img
          src={det.avatarImage}
          alt={det.username}
          className='w-34 h-34 rounded-full border-2 border-blue-500 object-cover'
        />
        <button
          onClick={() => navigation('/setAvatar')}
          className='mt-2 px-4 text-xs py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
        >
          Choose Avatar
        </button>
      </div>

      <h2 className='mt-4 text-center text-2xl font-bold'>
        <FaUser className='inline-block text-blue-400 mr-2' /> {det.username}
      </h2>

      <p className='mt-2 text-center text-gray-400'>
        <FaEnvelope className='inline-block mr-2' /> {det.email}
      </p>

      {det.isAvatarImageSet && (
        <div className='mt-4 text-center'>
          <FaCheckCircle className='inline-block text-green-400 mr-1' /> Verified Profile
        </div>
      )}
    </div>
  );
};
