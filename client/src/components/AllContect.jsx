import React from 'react';
import { FaUser, FaCircle } from 'react-icons/fa';

const AllContacts = ({ selectedId, setSelectedId, allUsers = [] }) => {
  return (
    <div className="w-[16rem] lg:w-96 border-gray-700 border-l flex flex-col p-1 py-2 gap-2 bg-[rgb(20,18,50)] scrollBar overflow-y-auto">
      {allUsers
        .sort((a, b) => a.username.localeCompare(b.username))
        .map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedId(user._id)}
            className={`w-full border text-start border-gray-700 
              ${selectedId === user._id ? "bg-black" : "bg-gray-950/5"} 
              h-16 gap-3 flex items-center px-1 rounded-lg`}
          >
            <img
              src={user.avatarImage || 'https://via.placeholder.com/150'}
              className="w-14 h-14 m-1 rounded-full p-1 bg-gray-800 border-2 border-gray-900"
              alt={user.username}
            />
            <div>
              <h1 className="text-gray-300 font-bold flex items-center">
                <FaUser className="mr-2" />
                {user?.username ?? "Unknown User"}
              </h1>
              <p className="text-sm font-semibold flex items-center space-x-1">
                <FaCircle className={user?.status === "offline" ? "text-red-600" : "text-green-600"} />
                <span>{user?.status ?? "Status unknown"}</span>
              </p>
            </div>
          </button>
        ))}
    </div>
  );
};

export default AllContacts;
