import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRocketchat } from 'react-icons/fa';
import { ProfileDets } from './ProfileDets';
import { getAllUsers, host } from '../utils/APIRoutes';
import ChatContainer from '../components/ChatContainer';
import SideNav from '../components/SideNav';
import Welcom from '../components/Welcom';
import AllContect from '../components/AllContect';
import GroupChat from '../components/GroupChat';
import { FiAlertCircle, FiWifiOff } from 'react-icons/fi';
import { io } from 'socket.io-client';

const Chat = () => {
  const navigate = useNavigate();
  const socket = useRef();
  const [isGroup, setIsGroup] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDet, setSelectedDet] = useState(null);
  const [hide, setHide] = useState(false);
  const [hideContacts, setHideContacts] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [unsentMessages, setUnsentMessages] = useState([]);
  const [showOnlineMsg, setShowOnlineMsg] = useState(false);
  const user = JSON.parse(localStorage.getItem('chat-app-user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      socket.current = io(host, { reconnectionAttempts: 5, reconnectionDelay: 7000 });
      socket.current.emit("add-user", user._id);

      socket.current.on("disconnect", () => {
        console.warn("Socket disconnected");
        setIsReconnecting(true);
      });

      socket.current.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });

      socket.current.on("reconnect", (attemptNumber) => {
        setIsReconnecting(false);
        sendQueuedMessages();
      });

      socket.current.on("reconnect_failed", () => {
        console.error("Reconnection failed");
        setIsReconnecting(false);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${getAllUsers}/${user._id}`);
        setAllUsers(data.users);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    const filteredDet = allUsers.find((u) => u._id === selectedId);
    setSelectedDet(filteredDet);
  }, [selectedId, allUsers]);

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      setShowOnlineMsg(true);
      setTimeout(() => {
        setShowOnlineMsg(false);h
      }, 1000);
      sendQueuedMessages();
      if (isReconnecting) {
        setIsReconnecting(false);
      }
    };

    const handleOffline = () => {
      setOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isReconnecting, unsentMessages]);

  const sendMessage = (message) => {
    if (offline || socket.current.disconnected) {
      console.log("User is offline, queuing message");
      setUnsentMessages((prevMessages) => [...prevMessages, message]);
    } else {
      socket.current.emit('send-message', message);
    }
  };

  const sendQueuedMessages = () => {
    if (unsentMessages.length > 0) {
      console.log("Sending queued messages");
      unsentMessages.forEach((msg) => {
        socket.current.emit('send-message', msg);
      });
      setUnsentMessages([]);
    }
  };

  return (
    <div className='w-full h-screen flex text-gray-100 bg-[rgb(15,12,40)]'>
      <SideNav isGroup={isGroup} hideContacts={hideContacts} setHideContacts={setHideContacts} setIsGroup={setIsGroup} />
      <div className='w-full h-[calc(100vh-6rem)] mb-[7vh]'>
        <div className='h-[8vh] px-2 text-gray-300 border-b border-gray-700 flex items-center'>
          <div className="flex items-center justify-center">
            <FaRocketchat className="text-4xl mr-2 text-purple-600 transform transition-transform duration-300 hover:text-purple-500 hover:scale-110" />
            <h2 className="text-3xl font-bold text-blue-500">SmartChat</h2>
          </div>
        </div>

        {offline && !isReconnecting && (
          <div className="flex absolute z-50 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 items-center justify-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 shadow-md rounded-md">
            <FiWifiOff className="text-red-500 mr-2" size={24} />
            <span>You are offline. Messages will be sent when you're back online.</span>
          </div>
        )}

        {showOnlineMsg && (
          <div className="absolute text-center bg-black top-20 left-1/2 transform -translate-x-1/2 border border-green-500 text-green-400 px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 z-50">
            <FiAlertCircle className="text-green-500" size={20} />
            <span>User is online now</span>
          </div>
        )}

        <div className='flex w-full h-[calc(100vh-10vh)] border-b border-gray-700 overflow-y-auto'>
          {!hideContacts && (
            !isGroup ? (
              <AllContect
                user={user}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                allUsers={allUsers}
              />
            ) : (
              <GroupChat isGroup={isGroup} setIsGroup={setIsGroup} />
            )
          )}
          <div className='flex-1 relative bg-[rgb(30,29,55)] h-full'>
            {selectedDet && !hide && (
              <div className='absolute'>
                <ProfileDets det={selectedDet} hide={hide} setHide={setHide} />
              </div>
            )}
            {selectedDet ? (
              <ChatContainer selectedDet={selectedDet} socket={socket} sendMessage={sendMessage} />
            ) : (
              <Welcom />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 