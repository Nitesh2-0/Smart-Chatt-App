// useSocket.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { host } from '../utils/APIRoutes';

const useSocket = (user, sendQueuedMessages) => {
  const socket = useRef();
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    if (user) {
      socket.current = io(host, { reconnectionAttempts: 5, reconnectionDelay: 7000 });
      socket.current.emit("add-user", user._id);

      socket.current.on("disconnect", () => {
        setIsReconnecting(true);
      });

      socket.current.on("reconnect", () => {
        setIsReconnecting(false);
        sendQueuedMessages();
      });

      socket.current.on("reconnect_failed", () => {
        setIsReconnecting(false);
      });

      return () => {
        socket.current.disconnect();
      };
    }
  }, [user, sendQueuedMessages]);

  return { socket, isReconnecting };
};

export default useSocket;
