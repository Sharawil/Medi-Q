import { io, Socket } from 'socket.io-client';
import { AppDispatch } from '../store';
import { setTokens, setCurrentToken } from '../store/queueSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const initializeSocket = (dispatch: AppDispatch) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
    // Join queue updates room
    socket?.emit('join-queue-room');
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('queue-update', (data) => {
    console.log('Queue update received:', data);

    switch (data.type) {
      case 'QUEUE_TOKEN_CREATED':
        // Add new token to queue
        dispatch(setCurrentToken(data.payload));
        break;
      case 'QUEUE_TOKEN_UPDATED':
        // Update existing token
        // We'll need to fetch the updated list or update the specific token
        // For now, just log - in a real app we'd update the store
        console.log('Token updated:', data.payload);
        break;
      default:
        console.log('Unknown queue update type:', data.type);
    }
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.emit('leave-queue-room');
    socket.disconnect();
    socket = null;
  }
};

export const joinQueueRoom = () => {
  socket?.emit('join-queue-room');
};

export const leaveQueueRoom = () => {
  socket?.emit('leave-queue-room');
};