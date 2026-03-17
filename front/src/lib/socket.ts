import { io, Socket } from 'socket.io-client';
import { runtimeConfig } from './runtimeConfig';

let socket: Socket | null = null;
let initialized = false;

export const initSocket = async () => {
  if (initialized) return socket;

  const API_URL = runtimeConfig.apiBaseUrl;

  try {
    // 1. Wake up the socket server
    await fetch(`${API_URL}/api/socket`);

    // 2. Connect
    socket = io(API_URL, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    socket.on('connect', () => {
      console.log('Connected to MedLink Socket Server');
    });

    initialized = true;
    return socket;
  } catch (err) {
    console.error('Socket initialization failed', err);
    return null;
  }
};

export const getSocket = () => socket;
