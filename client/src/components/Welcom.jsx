import React from 'react'
import { FaRocketchat } from 'react-icons/fa';

const Welcom = () => {
  return (
    <div className="flex border-l border-gray-700 flex-col justify-center items-center w-full h-full text-center">
      <div className="flex flex-col items-center justify-center animate-fadeIn">
        <FaRocketchat className="text-9xl text-purple-500 transition-transform duration-500 transform hover:scale-110 hover:text-purple-400" />
        <h2 className="mt-4 text-5xl font-extrabold text-blue-400 transition-colors duration-300 hover:text-blue-300">
          Welcome to SmartChat
        </h2>
      </div>
      <p className="mt-6 text-lg text-gray-300 tracking-wide transition-opacity duration-500 opacity-90 hover:opacity-100">
        Please select a user to start chatting.
      </p>
    </div>
  )
}

export default Welcom