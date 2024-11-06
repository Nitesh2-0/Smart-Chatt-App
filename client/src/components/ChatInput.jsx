import React, { useState } from 'react';
import { BsSendFill } from "react-icons/bs";
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({ sendMessage }) => {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setMsg((prevMsg) => prevMsg + emojiData.emoji);
  };

  const handleSendMessage = () => {
    if (msg.trim() !== "") {
      sendMessage(msg); 
      setMsg(""); 
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className='w-full absolute border-t border-gray-600 z-40 bottom-0 bg-[rgb(20,18,50)] p-2 flex gap-3 items-center justify-between'>
      {/* Emoji Picker */}
      <div className='relative w-[10%] md:w-[5vw] flex justify-center items-center text-3xl cursor-pointer'>
        <div onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😊
        </div>
        {showEmojiPicker && (
          <div className='absolute bottom-[60px] bg-black left-0 z-50'>
            <EmojiPicker onEmojiClick={onEmojiClick} className='bg-black' />
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className='flex-grow h-12 flex gap-2 items-center bg-gray-900 rounded-md'>
        <input
          type="text"
          className='flex-grow h-full px-4 bg-black/10 text-white rounded-md border border-gray-700 focus:outline-none placeholder-gray-400'
          placeholder='Write a message here...'
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={handleKeyDown}  // Capture Enter key press
        />
      </div>

      {/* Send Button */}
      <button
        className='w-12 h-12 md:w-32 flex justify-center items-center bg-purple-900 border border-purple-700 text-white hover:bg-purple-800 rounded-md'
        onClick={handleSendMessage}
      >
        <BsSendFill className='text-xl' />
      </button>
    </div>
  );
};

export default ChatInput;
