import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid'; 

const GroupChat = ({ isGroup, setIsGroup }) => {
  const [groupData, setGroupData] = useState({
    roomId: '',
    groupName: ''
  });
  const [newGroup, setNewGroup] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setError('');
  };

  const handleJoin = () => {
    if (!groupData.roomId || !groupData.groupName) {
      setError('Please enter both Room ID and Group Name.');
      return;
    }
    const newGroupEntry = {
      ...groupData,
      id: uuidv4()
    };
    setNewGroup((prevGroups) => [...prevGroups, newGroupEntry]);
    setGroupData({ roomId: '', groupName: '' });
  };

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    alert(`Selected Group: ${group.groupName}`);
    setIsGroup(true);
  };

  const handleDeleteGroup = (id) => {
    const updatedGroups = newGroup.filter(group => group.id !== id);
    setNewGroup(updatedGroups);
  };

  return (
    <div className="w-[16rem] border-l lg:w-96 flex flex-col p-4 bg-gray-800 py-2 gap-4 scrollBar overflow-y-auto shadow-lg border-gray-700 transition duration-300 hover:shadow-xl">
      <div className="w-full sticky pb-4 -top-2 z-50 bg-gray-800 max-w-md mx-auto">
        <h2 className="text-2xl font-bold uppercase text-center text-gray-200 mb-6">
          Join a Group Chat
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="groupName"
            required
            placeholder="Group Name"
            value={groupData.groupName}
            onChange={handleChange}
            className="p-2 w-full border border-gray-500 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            aria-label="Group Name"
          />
          <input
            type="text"
            name="roomId"
            placeholder="Group Password"
            value={groupData.roomId}
            required
            onChange={handleChange}
            className="p-2 w-full border border-gray-500 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            aria-label="Room ID"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleJoin}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md shadow hover:bg-blue-500 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Group Cards */}
      <div className="mt-4 space-y-4">
        <div className="mt-4">
          {newGroup.length > 0 ? (
            newGroup.map((group) => (
              <div
                key={group.id} // Using unique id as key
                onClick={() => handleGroupClick(group)}
                className="flex items-center border border-gray-600 gap-4 bg-gray-900 hover:bg-gray-800 p-5 rounded-lg shadow-lg transition-transform transform mb-4 cursor-pointer"
              >
                {/* Avatar Logo */}
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xl shadow-md">
                  {group.groupName
                    .split(' ')
                    .map(word => word[0])
                    .join('')
                    .toUpperCase()}
                </div>

                {/* Group Details */}
                <div className="flex flex-1 flex-col">
                  <h1 className="text-gray-100 font-bold text-lg">{group.groupName}</h1>
                  <p className="text-gray-400 text-sm">Password :-  {group.roomId}</p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the onClick of the parent div
                    handleDeleteGroup(group.id);
                  }}
                  className="ml-4 text-red-500 p-2 rounded-full border border-gray-600 hover:bg-red-600 hover:text-white transition-colors duration-300"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center mt-8">No groups created yet.</p>
          )}
        </div>
      </div>

      {/* Delete All Groups */}
      {newGroup.length > 4 && (
        <button
          onClick={() => setNewGroup([])}
          className="bg-red-700 text-white font-semibold py-2 rounded-md shadow hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Delete All Groups
        </button>
      )}
    </div>
  );
};

export default GroupChat;
