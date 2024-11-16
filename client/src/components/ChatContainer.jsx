import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import { getAllMessagesRoute, sendMsgRoute } from './../utils/APIRoutes';
import { IoMdVideocam, IoMdCall } from "react-icons/io";
import axios from 'axios'

const ChatContainer = ({ selectedDet, socket }) => {
   
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('chat-app-user'));
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedDet) return;
      try {
        const { data } = await axios.post(getAllMessagesRoute, {
          from: user._id,
          to: selectedDet._id,
        });
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();
  }, [selectedDet, user._id]);

  const sendMessage = async (newMessage) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      await axios.post(sendMsgRoute, {
        from: user._id,
        to: selectedDet._id,
        message: newMessage,
        time,
      });

      socket.current.emit("send-msg", {
        from: user._id,
        to: selectedDet._id,
        message: newMessage,
        time,
      });

      setMessages(prevMessages => [...prevMessages, { fromSelf: true, message: newMessage, time }]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg.message, time: msg.time });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) setMessages(prev => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      setIsAutoScrollEnabled(scrollHeight - scrollTop <= clientHeight + 50);
    }
  };

  useEffect(() => {
    if (isAutoScrollEnabled) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAutoScrollEnabled]);

  return (
    <div className="w-full relative h-full bg-[#0A0A1E]">
      <header className="w-full h-16 border-l border-b border-gray-600 flex items-center justify-between px-4 bg-[#131130]">
        <div className="flex items-center gap-3">
          <img
            src={selectedDet?.avatarImage || 'https://via.placeholder.com/150'}
            className="w-12 h-12 rounded-full shadow-md"
            alt={selectedDet?.username}
          />
          <div>
            <h1 className="text-gray-100 font-semibold">{selectedDet?.username}</h1>
            {/* <p className={ `${selectedDet?.status == "offline" ? "text-red-600":"text-green-600"} text-sm`}>{selectedDet?.status}</p> */}
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-300">
          <IoMdVideocam className="w-6 h-6 cursor-pointer hover:text-gray-500" />
          <IoMdCall className="w-6 h-6 cursor-pointer hover:text-gray-500" />
        </div>
      </header>

      <main
        className="w-full h-[calc(100vh-140px)] border-l border-gray-700 overflow-y-auto p-4 pb-24 flex flex-col gap-3 scrollBar"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        {messages.length ? (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.fromSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 max-w-[80%] text-sm rounded-lg shadow-md ${message.fromSelf
                  ? 'bg-green-700 text-gray-300 rounded-bl-xl rounded-tl-xl'
                  : 'bg-white text-black rounded-tr-xl'
                }`}
              >
                {message.message}
                <span className="block text-xs text-gray-500 mt-1 text-right">{message.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-center p-4">
              <h1 className="text-2xl font-semibold text-gray-200 mb-2">
                Chat with <span className="text-blue-600">{selectedDet?.username}</span>
              </h1>
              <p className="text-sm text-gray-500">Start your conversation <span className='text-red-700'>now!</span></p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 w-full">
        <ChatInput sendMessage={sendMessage} />
      </footer>
    </div>
  );
};

export default ChatContainer;
